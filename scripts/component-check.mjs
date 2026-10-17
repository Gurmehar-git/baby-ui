import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { ROOT } from "./gen/core.mjs";
import { routeUrl } from "./lib/portless.mjs";

const posix = (path) => relative(ROOT, path).replaceAll("\\", "/");
// The docs site `pnpm dev` serves; the design audit and premium score read its component pages.
const SITE = routeUrl("site.baby-ui.localhost") ?? "http://localhost:5173";
const option = (args, name) =>
	args.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const reachable = (url) =>
	fetch(url, { signal: AbortSignal.timeout(3000) }).then(
		(r) => r.ok,
		() => false,
	);

function files(dir) {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? files(path) : [path];
	});
}

function run(label, command, args, { stream = false, cwd = ROOT } = {}) {
	const start = Date.now();
	if (stream) console.log(`\n${label}`);
	const result = spawnSync(command, args, {
		cwd,
		encoding: "utf8",
		// Only the npx/pnpm shims need a shell on Windows; it would mangle bun's -e source.
		shell: process.platform === "win32" && ["npx", "pnpm"].includes(command),
		stdio: stream ? "inherit" : "pipe",
	});
	const ok = result.status === 0;
	const time = `${((Date.now() - start) / 1000).toFixed(1)}s`;
	console.log(`${ok ? "ok  " : "FAIL"} ${label} (${time})`);
	if (!ok && !stream) console.log(`${result.stdout ?? ""}${result.stderr ?? ""}`.trim());
	return ok;
}

/** One component's gates: spec, lint, comments, gen, design rules, parity. `--design` adds the
 * page audit and premium score (needs the site), `--types` the package type checks. */
export async function checkComponent(slug, args) {
	const pro =
		!existsSync(join(ROOT, "components", slug)) &&
		existsSync(join(ROOT, "pro/components", slug));
	const root = join(ROOT, pro ? "pro/components" : "components");
	const folder = join(root, slug);
	if (!existsSync(folder)) {
		console.error(`No component folder components/${slug} (or pro/components/${slug}).`);
		return 1;
	}
	const missing = ["component.ts", "index.md"].filter(
		(f) => !existsSync(join(folder, f)),
	);
	const ports = ["react", "svelte"].filter((p) => existsSync(join(folder, p)));
	console.log(`${posix(folder)}: ${ports.join(" + ") || "no port"}`);
	const results = [];
	results.push(missing.length === 0);
	console.log(
		`${missing.length ? "FAIL" : "ok  "} files${missing.length ? `: missing ${missing.join(", ")}` : ""}`,
	);
	if (!missing.includes("component.ts"))
		results.push(
			run("spec validates", "bun", [
				"-e",
				`await import(${JSON.stringify(`./${posix(join(folder, "component.ts"))}`)})`,
			]),
		);
	// gen lists what it writes in the root's .gitignore; only hand-written files are checked.
	const ignore = join(root, ".gitignore");
	const generated = new Set(
		existsSync(ignore)
			? readFileSync(ignore, "utf8")
					.split(/\r?\n/)
					.filter((l) => l.startsWith("/"))
					.map((l) => join(root, l.slice(1)))
			: [],
	);
	const sources = files(folder).filter(
		(f) => /\.(ts|tsx|svelte|mjs)$/.test(f) && !generated.has(f),
	);
	results.push(
		run("lint", "npx", [
			"biome",
			"check",
			// pro/ is ignored by the public repo's git, so Biome must not consult it.
			...(pro ? ["--vcs-enabled=false"] : []),
			"--colors=off",
			...sources.map(posix),
		]),
	);
	results.push(
		run("comments", "node", ["scripts/check-comments.mjs", ...sources.map(posix)]),
	);
	results.push(run("generated files", "node", ["scripts/generate.mjs", "--check"]));
	// The design system's source rules (composition, tokens, sizing); blockers fail it.
	results.push(
		run(
			"design rules",
			"node",
			["skills/baby-ui-design/scripts/scan-source.mjs", posix(folder)],
			{ stream: true },
		),
	);
	if (args.includes("--design")) {
		const url = option(args, "url") ?? SITE;
		if (await reachable(url)) {
			const page = ["scripts/design.mjs"];
			results.push(
				run("design audit", "node", [...page, "audit", slug, `--url=${url}`], {
					stream: true,
				}),
			);
			// The premium bar gates Pro; on a free component it is advice, not a failure.
			const premium = run(
				"premium score",
				"node",
				[...page, "premium", slug, `--url=${url}`],
				{
					stream: true,
				},
			);
			if (pro) results.push(premium);
			else if (!premium)
				console.log("     (premium bar is advisory for free components)");
		} else
			console.log(`skip design audit (no site at ${url}; run pnpm dev or pass --url=)`);
	}
	if (pro) console.log("skip parity (Pro demos are not in the runners)");
	else if (ports.length === 2)
		results.push(
			run("parity", "node", ["scripts/parity/index.mjs", slug], { stream: true }),
		);
	else console.log("skip parity (one port)");
	if (args.includes("--types")) {
		const pkg = pro ? "pro/components" : "components";
		results.push(run("types", "pnpm", ["check"], { cwd: join(ROOT, pkg), stream: true }));
	}
	const failed = results.filter((ok) => !ok).length;
	console.log(`\ncomponent check ${slug}: ${failed ? `${failed} failed` : "all passed"}`);
	return failed ? 1 : 0;
}
