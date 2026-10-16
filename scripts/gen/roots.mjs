import { existsSync } from "node:fs";
import { join, sep } from "node:path";
import { ROOT } from "./core.mjs";

// The private Pro submodule joins in whenever it is checked out.
export const HAS_PRO = existsSync(join(ROOT, "pro/packages/react/src"));

/** Folders whose edits can change generated output. */
export function sourceRoots() {
	return [
		"components",
		"packages/registry-schema/src/components",
		"packages/demos/src",
		// tokens.css feeds the generated email theme.
		"packages/tokens/src",
		...(HAS_PRO ? ["pro/packages/react/src"] : []),
	].map((path) => join(ROOT, path));
}

/** Per-root manifests and atomic-write temp files, rewritten by every run. */
export const BOOKKEEPING = /(\.generated\.json|\.gitignore|\.tmp)$/;

const GENERATOR_DIR = join(ROOT, "scripts/gen") + sep;
const GENERATOR_FILES = new Set(
	["scripts/generate.mjs", "scripts/shared-exceptions.json"].map((path) =>
		join(ROOT, path),
	),
);

/** The generator's own code and config: a change there needs fresh modules, not just a rerun. */
export const isGeneratorCode = (path) =>
	path.startsWith(GENERATOR_DIR) || GENERATOR_FILES.has(path);
