import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, join, relative } from "node:path";
import { diffStat, formatDiff } from "../diff.ts";
import { c } from "../logger.ts";
import type { Project } from "../project/detect.ts";
import { type InstallConfig, installConfig } from "../project/paths.ts";
import { lockfilesFor } from "../project/pm.ts";
import { discoverTargets, findWorkspace, type Target } from "../project/targets.ts";
import { type ResolvedItem, resolveTree } from "../registry/graph.ts";
import { canonicalUrl } from "../registry/resolve.ts";
import {
	intro,
	isInteractive,
	message,
	note,
	outro,
	select,
	spinner,
} from "../ui/index.ts";
import { install, installCommand, missingPackages } from "../write/deps.ts";
import {
	type LockFile,
	type LockItem,
	lockPath,
	readLock,
	relativeTo,
	serializeLock,
	sha256,
} from "../write/lock.ts";
import { type Plan, type PlannedFile, planInstall } from "../write/plan.ts";
import { unresolvedImports } from "../write/state.ts";
import { amend, commit, type FileOp } from "../write/tx.ts";
import { type CommonOptions, configuredTargets } from "./shared.ts";

export interface AddOptions extends CommonOptions {
	readonly items: readonly string[];
	readonly overwrite?: boolean;
	readonly dryRun?: boolean;
	readonly install?: boolean;
	/** Recorded in the journal so `history` shows what ran. */
	readonly command?: string;
	/**
	 * `add`/`update` write new and changed files; `repair` only restores missing ones;
	 * `adopt` writes nothing and records files stock shadcn installed in the lock.
	 */
	readonly mode?: "add" | "repair" | "adopt";
}

type Action = "create" | "update" | "identical" | "conflict" | "skip";

interface Decision {
	readonly file: PlannedFile;
	readonly action: Action;
	readonly current: string | undefined;
	write: boolean;
}

function decide(
	plan: Plan,
	locks: Map<string, LockFile>,
	overwrite: boolean,
	mode: AddOptions["mode"] = "add",
	projects: Map<string, Project> = new Map(),
): Decision[] {
	return plan.files.map((file) => {
		const current = existsSync(file.path) ? readFileSync(file.path, "utf8") : undefined;
		if (mode === "adopt") {
			return {
				file,
				action: current === undefined ? "skip" : "identical",
				current,
				write: false,
			};
		}
		if (current === undefined) return { file, action: "create", current, write: true };
		if (current === file.content)
			return { file, action: "identical", current, write: false };
		const rel = relativeTo(file.root, file.path);
		const items = Object.values(locks.get(file.root)?.items ?? {});
		const ours = items.some((item) => item.files[rel] === sha256(current));
		if (mode === "repair") {
			// Repair rewrites only untouched files whose imports broke (a moved alias).
			const project = projects.get(file.root);
			const broken = project && unresolvedImports(file.path, current, project)?.length;
			return broken && ours
				? { file, action: "update", current, write: true }
				: { file, action: "skip", current, write: false };
		}
		if (ours) return { file, action: "update", current, write: true };
		return { file, action: "conflict", current, write: overwrite };
	});
}

// A file we did not write (or one edited since) is never replaced without an explicit yes.
async function resolveConflicts(decisions: Decision[], root: string): Promise<void> {
	const pending = decisions.filter((d) => d.action === "conflict" && !d.write);
	if (!pending.length || !isInteractive()) return;
	let all: boolean | undefined;
	for (const d of pending) {
		if (all !== undefined) {
			d.write = all;
			continue;
		}
		const rel = relativeTo(root, d.file.path);
		const { added, removed } = diffStat(d.current ?? "", d.file.content);
		while (true) {
			const choice = await select({
				message: `${rel} differs from the registry ${c.dim(`(+${added} -${removed})`)}`,
				options: [
					{ value: "skip", label: "Keep mine" },
					{
						value: "overwrite",
						label: "Overwrite",
						hint: "snapshot kept, `baby-ui undo` restores",
					},
					{ value: "diff", label: "Show diff" },
					{ value: "skip-all", label: "Keep all remaining" },
					{ value: "overwrite-all", label: "Overwrite all remaining" },
				],
			});
			if (choice === "diff") {
				note(formatDiff(d.current ?? "", d.file.content), rel);
				continue;
			}
			d.write = choice === "overwrite" || choice === "overwrite-all";
			if (choice.endsWith("-all")) all = d.write;
			break;
		}
	}
}

// Each project's lock lists the items with files there; file-less styles go where the CSS went.
function nextLock(
	plan: Plan,
	root: string,
	lock: LockFile,
	decisions: Decision[],
	ownsStyles: boolean,
	adopt: boolean,
): LockFile {
	const owned = new Set(
		decisions.filter((d) => d.write || d.action === "identical").map((d) => d.file.path),
	);
	const items: Record<string, LockItem> = { ...lock.items };
	for (const { url, item } of plan.items) {
		const here = plan.files.filter((f) => f.itemUrl === url && f.root === root);
		const anywhere = plan.files.some((f) => f.itemUrl === url);
		if (!here.length && (anywhere || !ownsStyles)) continue;
		const files: Record<string, string> = {};
		for (const file of here) {
			if (owned.has(file.path)) files[relativeTo(root, file.path)] = sha256(file.content);
		}
		// A same-named stock component (shadcn's flat `card.tsx`) is not ours to adopt.
		if (adopt && here.length && !Object.keys(files).length) continue;
		const key = canonicalUrl(url);
		const previous = lock.items[key];
		const entry: LockItem = {
			name: item.name,
			type: item.type,
			framework: plan.config.framework,
			installedAt: new Date().toISOString(),
			itemHash: sha256(JSON.stringify(item)),
			files: { ...(previous?.files ?? {}), ...files },
			dependencies: [...(item.dependencies ?? []), ...(item.devDependencies ?? [])],
			registryDependencies: item.registryDependencies ?? [],
		};
		// An unchanged re-add keeps its timestamp, so the lock (and history) stay quiet.
		const same =
			previous &&
			JSON.stringify({ ...previous, installedAt: "" }) ===
				JSON.stringify({ ...entry, installedAt: "" });
		items[key] = same ? previous : entry;
	}
	return { version: 1, items };
}

const unchanged = (op: FileOp) =>
	op.content !== null &&
	existsSync(op.path) &&
	readFileSync(op.path).equals(
		typeof op.content === "string" ? Buffer.from(op.content) : op.content,
	);

const LABEL: Record<Action, [string, (s: string) => string]> = {
	create: ["created", c.green],
	update: ["updated", c.brand],
	identical: ["identical", c.dim],
	conflict: ["kept yours", c.yellow],
	skip: ["skipped", c.dim],
};

function report(decisions: Decision[], root: string, preOps: readonly FileOp[]): string {
	const pre = preOps.map((op) => {
		const [label, paint] = existsSync(op.path) ? LABEL.update : LABEL.create;
		return `${paint(label.padEnd(10))} ${relativeTo(root, op.path)}`;
	});
	const items = decisions.map((d) => {
		const [label, paint] =
			d.action === "conflict" && d.write ? ["overwrote", c.yellow] : LABEL[d.action];
		return `${paint(label.padEnd(10))} ${relativeTo(root, d.file.path)}`;
	});
	return [...pre, ...items].join("\n");
}

export interface Extra {
	/** Written in the same transaction, before the items (init's components.json, utils). */
	readonly preOps?: readonly FileOp[];
	readonly dependencies?: readonly string[];
	/** Starting stylesheet when the configured CSS file does not exist yet. */
	readonly cssSource?: string;
}

/** Installs `options.items` into one target as a single undoable transaction. */
export async function installInto(
	target: Target,
	options: AddOptions,
	extra: Extra = {},
): Promise<void> {
	const cfg = installConfig(target);
	const root = target.root;
	let items: ResolvedItem[] = [];
	if (options.items.length) {
		const fetching = spinner();
		fetching.start(`Resolving ${options.items.join(", ")} for ${target.path}`);
		items = await resolveTree(options.items, {
			framework: cfg.framework,
			typescript: cfg.typescript,
			config: target.config?.raw ?? {},
			cwd: root,
		});
		fetching.stop(`${items.length} item(s): ${items.map((i) => i.item.name).join(", ")}`);
	}

	const workspace = await workspaceUi(target, cfg);
	if (workspace) {
		message(
			c.dim(
				`ui files go to ${relativeTo(root, workspace.project.root)} (workspace ui package)`,
			),
		);
	}
	const planned = planInstall(cfg, items, extra.cssSource, workspace);
	// Adopting only records what is already there: no stylesheet edits, no installs.
	const plan =
		options.mode === "adopt" ? { ...planned, css: undefined, installs: [] } : planned;
	for (const warning of plan.warnings) message(c.yellow(warning));
	const roots = [
		...new Set([root, workspace?.project.root ?? root, ...plan.files.map((f) => f.root)]),
	];
	const locks = new Map(
		await Promise.all(roots.map(async (r) => [r, await readLock(r)] as const)),
	);
	const projects = new Map<string, Project>([[root, target]]);
	if (workspace) projects.set(workspace.project.root, workspace.project);
	const decisions = decide(
		plan,
		locks,
		options.overwrite === true,
		options.mode,
		projects,
	);
	const installs = plan.installs.map((i) => ({
		project: i.config.project,
		deps: missingPackages(i.config.project, [
			...(i.config === cfg ? (extra.dependencies ?? []) : []),
			...i.dependencies,
		]),
		devDeps: missingPackages(i.config.project, i.devDependencies),
	}));
	if (!installs.some((i) => i.project === target) && extra.dependencies?.length) {
		installs.push({
			project: target,
			deps: missingPackages(target, extra.dependencies),
			devDeps: [],
		});
	}
	const pending = installs.filter((i) => i.deps.length + i.devDeps.length);
	const preOps = extra.preOps ?? [];

	if (options.dryRun) {
		note(
			report(decisions, root, preOps) || c.dim("no files"),
			`${target.path} (dry run)`,
		);
		if (plan.css) message(`would update ${relativeTo(root, plan.css.path)}`);
		for (const i of pending) {
			const where = relativeTo(root, i.project.root) || ".";
			if (i.deps.length)
				message(`would run ${installCommand(i.project.pm, i.deps, false)} in ${where}`);
			if (i.devDeps.length) {
				message(`would run ${installCommand(i.project.pm, i.devDeps, true)} in ${where}`);
			}
		}
		return;
	}

	await resolveConflicts(decisions, root);
	const ops: FileOp[] = [
		...preOps,
		...decisions
			.filter((d) => d.write)
			.map((d) => ({ path: d.file.path, content: d.file.content })),
	];
	if (plan.css) ops.push({ path: plan.css.path, content: plan.css.content });
	const willInstall = options.install !== false && pending.length > 0;
	const snapshots = new Set<string>();
	if (willInstall) {
		for (const { project } of pending) {
			snapshots.add(join(project.root, "package.json"));
			const workspace = await findWorkspace(project.root);
			for (const file of lockfilesFor(project.pm))
				snapshots.add(join(workspace.root, file));
		}
	}
	// Missing lockfiles are recorded too, so undo removes files the install creates.
	for (const path of snapshots)
		ops.push({ path, content: existsSync(path) ? readFileSync(path) : null });
	const styleRoot = plan.css?.root ?? workspace?.project.root ?? root;
	for (const [lockRoot, lock] of locks) {
		const next = nextLock(
			plan,
			lockRoot,
			lock,
			decisions,
			lockRoot === styleRoot,
			options.mode === "adopt",
		);
		ops.push({ path: lockPath(lockRoot), content: serializeLock(next) });
	}

	const summary = report(decisions, root, preOps);
	if (summary) note(summary, target.path);
	const changes = ops.filter((op) => snapshots.has(op.path) || !unchanged(op));
	if (!changes.length) {
		message(c.dim("Nothing to change."));
		return;
	}
	const journal = await commit(
		root,
		options.command ?? `add ${options.items.join(" ")}`,
		changes,
	);
	if (plan.css) message(`${c.brand("updated")} ${relativeTo(root, plan.css.path)}`);

	if (willInstall) {
		try {
			for (const i of pending) {
				await install(i.project, i.deps, false);
				await install(i.project, i.devDeps, true);
			}
		} finally {
			await amend(
				root,
				journal,
				[...snapshots].map((p) => relativeTo(root, p)),
			);
		}
	} else {
		for (const i of pending) {
			const all = [...i.deps, ...i.devDeps];
			message(
				`Install skipped. Run in ${relativeTo(root, i.project.root) || "."}: ${installCommand(i.project.pm, all, false)}`,
			);
		}
	}
	message(c.dim(`Undo with \`baby-ui undo\` (${journal.id})`));
}

// shadcn's monorepo shape: the app's `ui` alias points into another package with its own config.
async function workspaceUi(
	target: Target,
	cfg: InstallConfig,
): Promise<InstallConfig | undefined> {
	const outside = relative(target.root, cfg.paths.ui);
	if (!outside.startsWith("..") && !isAbsolute(outside)) return undefined;
	const all = await discoverTargets(await findWorkspace(target.root));
	const owner = all
		.filter((t) => t.config && t.root !== target.root)
		.filter((t) => {
			const rest = relative(t.root, cfg.paths.ui);
			return !rest.startsWith("..") && !isAbsolute(rest);
		})
		.sort((a, b) => b.root.length - a.root.length)[0];
	return owner ? installConfig(owner) : undefined;
}

export async function add(options: AddOptions): Promise<void> {
	const targets = await configuredTargets(options);
	intro(`baby-ui add ${options.items.join(" ")}`);
	for (const target of targets) await installInto(target, options);
	outro(options.dryRun ? "Dry run, nothing written" : "Done");
}
