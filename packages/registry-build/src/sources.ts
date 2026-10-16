import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Framework } from "@baby-ui/registry-schema";
import { FRAMEWORK, REPO_ROOT } from "./config";

/** Per-component folders (`components/<slug>/<framework>/`); migrated items read from here. */
export const COMPONENTS_DIR = resolve(REPO_ROOT, "components");

const FOLDER_IMPORT =
	/((?:from|import)\s*\(?\s*["'])\.\.\/\.\.\/([a-z0-9-]+)\/(?:react|svelte)\//g;

/**
 * A spec path (`button/button.tsx`, `lib/cn.ts`, or a folder) on disk: the component's own
 * folder once migrated, else the old package. Lets migration move items in batches.
 */
export function sourcePath(framework: Framework, rel: string): string {
	const [folder = "", ...rest] = rel.split("/");
	const moved = resolve(COMPONENTS_DIR, folder, framework, ...rest);
	return existsSync(moved) ? moved : resolve(FRAMEWORK[framework].srcDir, rel);
}

/** Folder imports (`../../x/react/`) back to the one-deep shape the rewriter expects (`../x/`). */
export function toLegacy(code: string): string {
	return code.replace(
		FOLDER_IMPORT,
		(_m, head: string, folder: string) => `${head}../${folder}/`,
	);
}

export async function readSource(framework: Framework, rel: string): Promise<string> {
	const path = sourcePath(framework, rel);
	const code = await readFile(path, "utf8");
	return path.startsWith(COMPONENTS_DIR) ? toLegacy(code) : code;
}
