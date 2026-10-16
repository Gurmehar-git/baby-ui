import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isMainThread } from "node:worker_threads";
import { flush, Output, rel } from "./gen/core.mjs";
import { autoDemos } from "./gen/demos.mjs";
import { emailTheme } from "./gen/email-theme.mjs";
import { indexes, proIndexes } from "./gen/indexes.mjs";
import { HAS_PRO } from "./gen/roots.mjs";
import { componentSharedFiles } from "./gen/shared.mjs";
import { usageFiles } from "./gen/usage.mjs";

// Every generated file sits under one of these, and each keeps a .gitignore listing its own.
const PUBLIC_ROOTS = [
	"components",
	"packages/ui-react/src",
	"packages/ui-svelte/src/lib",
	"packages/demos/src/react",
	"packages/demos/src/svelte",
	"packages/demos/src/usage",
];
const PRO_ROOTS = HAS_PRO
	? ["pro/components", "pro/packages/react/src", "pro/packages/svelte/src/lib"]
	: [];

/**
 * Brings generated files up to date. Writes only files whose content changed, so a dev server
 * watching them reloads once. With `check`, writes nothing and reports what is stale.
 */
export function generate({ check = false, quiet = false } = {}) {
	const output = new Output([...PUBLIC_ROOTS, ...PRO_ROOTS]);
	const report = { collisions: [], unmatched: [], demoless: [] };
	// Written before the shared step so its Svelte copy is generated in the same run.
	emailTheme(output);
	// React is the source for every shared .ts; each Svelte port gets generated copies.
	componentSharedFiles(output);
	if (HAS_PRO) componentSharedFiles(output, "pro/components");
	autoDemos(output, report);
	usageFiles(output, report);
	indexes(output, report);
	if (HAS_PRO) proIndexes(output, report);
	const result = { ...flush(output, { check }), report };
	if (!quiet) {
		const verb = check ? "stale" : "updated";
		console.log(
			`gen: ${result.generated.length} generated files, ${result.stale.length} ${verb}`,
		);
		for (const path of result.stale) console.log(`  ${rel(path)}`);
		for (const line of report.unmatched) console.log(`  unmatched demo export ${line}`);
		for (const line of report.usageMissing ?? [])
			console.log(`  usage needs a default for ${line}`);
		for (const line of result.conflicts) console.log(`  conflict: ${line}`);
		for (const line of result.overwritten)
			console.warn(`  ${check ? "will overwrite" : "overwrote"}: ${line}`);
	}
	return result;
}

// A watch worker imports this module under the watcher's argv; only the real CLI runs below.
const isMain =
	isMainThread &&
	process.argv[1] &&
	resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
	const args = new Set(process.argv.slice(2));
	if (args.has("--list")) {
		for (const path of generate({ check: true, quiet: true }).generated)
			console.log(rel(path));
	} else if (args.has("--check")) {
		const result = generate({ check: true });
		if (result.stale.length > 0 || result.conflicts.length > 0) process.exit(1);
	} else {
		// Conflicts are reported, never fatal here: `prepare` must not fail an install. --check fails.
		generate();
	}
}
