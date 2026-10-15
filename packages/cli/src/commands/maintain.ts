import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { formatDiff } from "../diff.ts";
import { CliError } from "../errors.ts";
import { c, symbols } from "../logger.ts";
import { type InstallConfig, installConfig } from "../project/paths.ts";
import type { Target } from "../project/targets.ts";
import { fetchJson } from "../registry/fetch.ts";
import { load, type ResolvedItem } from "../registry/graph.ts";
import {
	babyUiUrl,
	canonicalUrl,
	type RegistryContext,
	requestFor,
} from "../registry/resolve.ts";
import { RegistryIndexSchema } from "../registry/schema.ts";
import { intro, message, note, outro } from "../ui/index.ts";
import { readLock, relativeTo, sha256 } from "../write/lock.ts";
import { planInstall } from "../write/plan.ts";
import { inspect, matchItems } from "../write/state.ts";
import { type AddOptions, installInto } from "./add.ts";
import { type CommonOptions, configuredTargets } from "./shared.ts";

export interface ItemsOptions extends CommonOptions {
	readonly items: readonly string[];
}

const context = (cfg: InstallConfig): RegistryContext => ({
	framework: cfg.framework,
	typescript: cfg.typescript,
	config: cfg.project.config?.raw ?? {},
	cwd: cfg.project.root,
});

async function lockedUrls(target: Target, names: readonly string[]): Promise<string[]> {
	const lock = await readLock(target.root);
	const matched = matchItems(lock, names);
	const missing = names.filter(
		(n) => !matched.some(([url, i]) => i.name === n || url === n),
	);
	if (missing.length) {
		throw new CliError(`Not installed in ${target.path}: ${missing.join(", ")}.`, {
			hint: "Add it first, or adopt files from the stock CLI with `baby-ui repair --adopt <item>`.",
		});
	}
	return matched.map(([url]) => url);
}

// --- diff ---

export interface DiffOptions extends ItemsOptions {
	readonly stat?: boolean;
	/** Exit 1 when anything differs, for CI. */
	readonly exitCode?: boolean;
}

type Drift = "upstream" | "local" | "both" | "missing" | "new";

const DRIFT: Record<Drift, string> = {
	upstream: c.brand("update available"),
	local: c.yellow("local edits"),
	both: c.red("both changed"),
	missing: c.red("missing"),
	new: c.green("new upstream file"),
};

export async function diff(options: DiffOptions): Promise<void> {
	const targets = await configuredTargets(options);
	intro("baby-ui diff");
	let drifted = 0;
	for (const target of targets) {
		const cfg = installConfig(target);
		const lock = await readLock(target.root);
		const urls = await lockedUrls(target, options.items);
		const items: ResolvedItem[] = await Promise.all(
			urls.map(async (url) => ({
				url,
				item: await load(requestFor(url, context(cfg))),
				requested: true,
			})),
		);
		const plan = planInstall(cfg, items);
		for (const { url, item } of items) {
			const locked = lock.items[canonicalUrl(url)];
			const lines: string[] = [];
			if (locked && locked.itemHash !== sha256(JSON.stringify(item))) {
				lines.push(c.dim("registry item changed since install"));
			}
			for (const file of plan.files.filter(
				(f) => f.itemUrl === url && f.root === target.root,
			)) {
				const rel = relativeTo(target.root, file.path);
				const hash = locked?.files[rel];
				const local = existsSync(file.path) ? readFileSync(file.path, "utf8") : undefined;
				if (local === file.content) continue;
				const drift: Drift =
					local === undefined
						? hash
							? "missing"
							: "new"
						: sha256(local) === hash
							? "upstream"
							: sha256(file.content) === hash
								? "local"
								: "both";
				lines.push(`${DRIFT[drift]}  ${rel}`);
				if (!options.stat && local !== undefined)
					lines.push(formatDiff(local, file.content));
			}
			if (lines.length) {
				drifted++;
				note(lines.join("\n"), `${item.name} ${c.dim(target.path)}`);
			}
		}
	}
	outro(
		drifted
			? `${drifted} item(s) differ. ${c.dim("Apply with `baby-ui update`.")}`
			: "Up to date",
	);
	if (drifted && options.exitCode) process.exitCode = 1;
}

// --- update ---

export async function update(
	options: ItemsOptions & Omit<AddOptions, "items">,
): Promise<void> {
	const targets = await configuredTargets(options);
	intro(`baby-ui update ${options.items.join(" ")}`);
	for (const target of targets) {
		const urls = await lockedUrls(target, options.items);
		if (!urls.length) {
			message(c.dim(`${target.path}: nothing installed`));
			continue;
		}
		await installInto(target, {
			...options,
			items: urls,
			command: `update ${options.items.join(" ") || "(all)"}`,
		});
	}
	outro("Done");
}

// --- repair ---

export interface RepairOptions extends ItemsOptions {
	readonly adopt?: boolean;
	readonly force?: boolean;
	readonly install?: boolean;
	readonly dryRun?: boolean;
}

// Stock-CLI installs: match registry names against folders and files in the ui dir.
async function guessInstalled(cfg: InstallConfig): Promise<string[]> {
	const ctx = context(cfg);
	const index = RegistryIndexSchema.safeParse(
		await fetchJson({ url: babyUiUrl("index", ctx), headers: {} }),
	);
	if (!index.success || !existsSync(cfg.paths.ui)) return [];
	const present = new Set(
		readdirSync(cfg.paths.ui).map((n) => n.replace(/\.(tsx?|jsx?|svelte)$/, "")),
	);
	return index.data.map((i) => i.name).filter((name) => present.has(name));
}

export async function repair(options: RepairOptions): Promise<void> {
	const targets = await configuredTargets(options);
	intro(options.adopt ? "baby-ui repair --adopt" : "baby-ui repair");
	for (const target of targets) {
		const cfg = installConfig(target);
		if (options.adopt) {
			const names = options.items.length ? options.items : await guessInstalled(cfg);
			if (!names.length) {
				message(c.dim(`${target.path}: no Baby UI components found to adopt`));
				continue;
			}
			await installInto(target, {
				...options,
				items: names,
				mode: "adopt",
				command: `repair --adopt ${names.join(" ")}`,
			});
			continue;
		}
		const urls = await lockedUrls(target, options.items);
		if (!urls.length) {
			message(c.dim(`${target.path}: nothing installed`));
			continue;
		}
		const before = await inspect(cfg);
		await installInto(target, {
			...options,
			items: urls,
			mode: options.force ? "add" : "repair",
			overwrite: options.force,
			command:
				`repair${options.force ? " --force" : ""} ${options.items.join(" ")}`.trim(),
		});
		if (options.force) continue;
		const edited = before.flatMap((s) =>
			s.files
				.filter((f) => f.health === "modified" || f.health === "broken")
				.map((f) => f.path),
		);
		if (edited.length) {
			note(
				edited.join("\n"),
				`${c.yellow("Left alone")} ${c.dim("(edited locally; --force restores them, undo reverts)")}`,
			);
		}
	}
	outro("Done");
}

// --- doctor ---

type Level = "ok" | "warn" | "fail";
const MARK: Record<Level, string> = {
	ok: c.green(symbols.tick),
	warn: c.yellow("!"),
	fail: c.red(symbols.cross),
};

async function checkTarget(target: Target): Promise<Array<[Level, string]>> {
	const out: Array<[Level, string]> = [];
	let cfg: InstallConfig;
	try {
		cfg = installConfig(target);
		out.push(["ok", `components.json (${cfg.framework}), aliases resolve`]);
	} catch (error) {
		out.push(["fail", error instanceof Error ? error.message : String(error)]);
		return out;
	}
	const css = cfg.paths.css;
	if (!css || !existsSync(css))
		out.push(["fail", `stylesheet ${css ?? "(unset)"} not found`]);
	else if (!/@import\s+["']tailwindcss["']/.test(readFileSync(css, "utf8"))) {
		out.push(["warn", `${relativeTo(target.root, css)} does not import tailwindcss`]);
	} else out.push(["ok", `stylesheet ${relativeTo(target.root, css)}`]);
	out.push(
		target.dependencies.has("tailwindcss")
			? ["ok", "tailwindcss installed"]
			: ["warn", "tailwindcss is not a dependency"],
	);

	const states = await inspect(cfg);
	const files = states.flatMap((s) => s.files);
	const count = (h: string) => files.filter((f) => f.health === h).length;
	if (!states.length) out.push(["ok", "no Baby UI items installed yet"]);
	else
		out.push([
			"ok",
			`${states.length} item(s), ${count("clean")}/${files.length} files untouched`,
		]);
	if (count("modified")) out.push(["ok", `${count("modified")} file(s) edited locally`]);
	for (const s of states) {
		for (const f of s.files) {
			if (f.health === "missing")
				out.push(["fail", `${s.item.name}: ${f.path} is missing`]);
			if (f.health === "broken")
				out.push(["fail", `${s.item.name}: ${f.path} does not parse`]);
			for (const spec of f.unresolved) {
				out.push([
					"fail",
					`${s.item.name}: ${f.path} imports ${spec}, which does not resolve`,
				]);
			}
		}
		if (s.missingDeps.length) {
			out.push(["fail", `${s.item.name}: missing packages ${s.missingDeps.join(", ")}`]);
		}
	}
	if (
		existsSync(join(target.root, ".baby-ui", "history")) &&
		!existsSync(join(target.root, ".baby-ui", ".gitignore"))
	) {
		out.push([
			"warn",
			".baby-ui/.gitignore is missing; undo snapshots could get committed",
		]);
	}
	return out;
}

export async function doctor(options: CommonOptions): Promise<void> {
	const targets = await configuredTargets(options);
	intro("baby-ui doctor");
	let failed = false;
	for (const target of targets) {
		const results = await checkTarget(target);
		failed ||= results.some(([level]) => level === "fail");
		note(
			results.map(([level, text]) => `${MARK[level]} ${text}`).join("\n"),
			target.path,
		);
	}
	outro(
		failed ? c.red("Problems found. `baby-ui repair` fixes most of them.") : "All good",
	);
	if (failed) process.exitCode = 1;
}
