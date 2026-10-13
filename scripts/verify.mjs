import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { defaultJobs, runPool } from "./lib/pool.mjs";

const HELP = `Usage: pnpm verify [--quick | --full] [--keep-going] [--jobs=N] [--verbose]

Runs the gates CI runs. Stages run in order; the steps inside a stage run in parallel.

  --quick        generated files, Biome, comments, import extensions (the pre-commit set)
  (default)      quick + tests + every package's type check + Pro check (the pre-push set)
  --full         default + build, then worker size, Pro-hidden check and a browser sweep of
                 every component page (what Deploy runs, plus the sweep)
  --keep-going   don't stop at the first failure; report every failing step at the end
  --verbose      print the output of every step, not only failures
  --jobs=N       parallel steps (default: free cores, capped by free memory; now ${defaultJobs()})
`;

const ROOT = resolve(import.meta.dirname, "..");
const argv = process.argv.slice(2);
if (argv.includes("--help")) {
	console.log(HELP);
	process.exit(0);
}
const level = argv.includes("--full") ? 2 : argv.includes("--quick") ? 0 : 1;
const failFast = !argv.includes("--keep-going");
const verbose = argv.includes("--verbose");
const jobsArg = Number(argv.find((a) => a.startsWith("--jobs="))?.split("=")[1]);
const jobs = jobsArg > 0 ? jobsArg : defaultJobs();

/** Workspace packages with a `check` script. */
function checkTargets() {
	const dirs = ["packages", "apps", "apps/playground"].flatMap((parent) =>
		existsSync(join(ROOT, parent))
			? readdirSync(join(ROOT, parent), { withFileTypes: true })
					.filter((d) => d.isDirectory())
					.map((d) => join(ROOT, parent, d.name))
			: [],
	);
	return dirs.flatMap((dir) => {
		const file = join(dir, "package.json");
		if (!existsSync(file)) return [];
		const pkg = JSON.parse(readFileSync(file, "utf8"));
		return pkg.scripts?.check ? [pkg.name] : [];
	});
}

const hasPro = existsSync(join(ROOT, "pro/package.json"));
const STAGES = [
	{
		level: 0,
		name: "Gates",
		steps: [
			{ name: "Generated files up to date", cmd: "node scripts/generate.mjs --check" },
			{ name: "Lint and format", cmd: "pnpm exec biome ci ." },
			{ name: "Comment gate", cmd: "node scripts/check-comments.mjs --all" },
			{ name: "Import extensions", cmd: "node scripts/check-import-extensions.mjs" },
		],
	},
	{
		level: 1,
		name: "Tests and type checks",
		steps: [
			{ name: "Tests", cmd: "pnpm test" },
			...checkTargets().map((name) => ({
				name: `Type-check ${name}`,
				cmd: `pnpm --filter ${name} check`,
			})),
			// Pro's own `check` regenerates first; the Gates stage already proved that is a no-op.
			...(hasPro ? [{ name: "Pro type checks", cmd: "pnpm --dir pro -r check" }] : []),
		],
	},
	{ level: 2, name: "Build", steps: [{ name: "Build", cmd: "pnpm build" }] },
	{
		level: 2,
		name: "Build checks",
		steps: [
			{ name: "Worker bundle budget", cmd: "pnpm size" },
			{
				name: "Pro stays hidden",
				cmd: "node scripts/check-pro-bundle.mjs --expect=hidden",
			},
			{ name: "Browser sweep", cmd: `node scripts/probe/index.mjs --all --jobs=${jobs}` },
		],
	},
].filter((stage) => stage.level <= level);

const results = [];
const began = Date.now();
console.log(`verify: ${STAGES.length} stages, up to ${jobs} parallel steps`);
for (const stage of STAGES) {
	console.log(`\n▸ ${stage.name}`);
	const done = await runPool(stage.steps, {
		cwd: ROOT,
		jobs,
		failFast,
		onDone: (r) => {
			const mark = r.cancelled ? "stop" : r.ok ? "pass" : "FAIL";
			console.log(`  ${mark}  ${r.name} (${r.seconds}s)`);
			if ((verbose || !r.ok) && !r.cancelled) console.log(indent(r.output.trimEnd()));
		},
	});
	results.push(...done);
	if (failFast && done.some((r) => !r.ok)) break;
}

const failed = results.filter((r) => !r.ok && !r.cancelled);
const total = Math.round((Date.now() - began) / 1000);
console.log(
	`\n${results.length - failed.length}/${results.length} steps passed in ${total}s`,
);
if (failed.length) {
	console.log(
		`Re-run a failed step on its own:\n${failed.map((r) => `  ${r.cmd}`).join("\n")}`,
	);
	process.exit(1);
}

function indent(text) {
	return text
		.split("\n")
		.map((line) => `      ${line}`)
		.join("\n");
}
