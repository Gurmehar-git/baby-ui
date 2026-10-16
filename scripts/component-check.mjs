import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { ROOT } from "./gen/core.mjs";

const posix = (path) => relative(ROOT, path).replaceAll("\\", "/");

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

/** One component's gates in seconds: spec, lint, comments, generated files and port parity.
 * `--types` adds the package's type checks, which take minutes. */
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
	const missing = [`${slug}.ts`, "index.md"].filter((f) => !existsSync(join(folder, f)));
	const ports = ["react", "svelte"].filter((p) => existsSync(join(folder, p)));
	console.log(`${posix(folder)}: ${ports.join(" + ") || "no port"}`);
	const results = [];
	results.push(missing.length === 0);
	console.log(
		`${missing.length ? "FAIL" : "ok  "} files${missing.length ? `: missing ${missing.join(", ")}` : ""}`,
	);
	if (!missing.includes(`${slug}.ts`))
		results.push(
			run("spec validates", "bun", [
				"-e",
				`await import(${JSON.stringify(`./${posix(join(folder, `${slug}.ts`))}`)})`,
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
