import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./gen/core.mjs";
import { reportMemory } from "./lib/memory.mjs";
import { watchAndRun } from "./lib/watch.mjs";

// The registry's turbo inputs, plus usage snippets and the Pro sources when checked out.
const ROOTS = [
	"packages/registry-build/src",
	"packages/registry-schema/src",
	"packages/tokens/src",
	"components",
	"packages/demos/src/usage",
	"apps/site/src/docs",
	"pro/packages/schema/src",
	"pro/packages/react/src",
	"pro/packages/svelte/src",
	"pro/packages/demos/src/usage",
]
	.map((path) => join(ROOT, path))
	.filter((path) => existsSync(path));

// Gen's manifests and atomic-write temp files never change what the registry builds.
const BOOKKEEPING = /(\.generated\.json|\.gitignore|\.tmp)$/;

/**
 * One build in a fresh process, so edited specs and build code are re-imported every time. Bun runs
 * the package script directly; a pnpm wrapper would add a ~100 MB Node process per build.
 */
function build() {
	return new Promise((done, fail) => {
		const child = spawn("bun run registry:dev", {
			cwd: join(ROOT, "packages/registry-build"),
			shell: true,
			stdio: "inherit",
		});
		child.on("error", fail);
		child.on("exit", (code) =>
			code === 0 ? done() : fail(new Error(`build exited with ${code}`)),
		);
	});
}

watchAndRun({
	roots: ROOTS,
	run: build,
	ignore: (path) => BOOKKEEPING.test(path),
	// Long enough for gen to rewrite indexes after the same edit, so most edits build once.
	debounceMs: 800,
	onError: (error) => console.error(`registry: ${error.message}`),
});
console.log("registry: watching sources");
reportMemory((line) => console.log(`registry watcher: ${line}`));
