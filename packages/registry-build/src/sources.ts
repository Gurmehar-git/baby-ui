import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Framework } from "@baby-ui/registry-schema";
import { REPO_ROOT } from "./config";

/** Per-component folders (`components/<slug>/<framework>/`). */
export const COMPONENTS_DIR = resolve(REPO_ROOT, "components");

const FOLDER_IMPORT =
	/((?:from|import)\s*\(?\s*["'])\.\.\/\.\.\/([a-z0-9-]+)\/(?:react|svelte)\//g;
// A bare folder import (`"../../tabs/react"`) names that folder's barrel.
const BARE_FOLDER_IMPORT =
	/((?:from|import)\s*\(?\s*(["']))\.\.\/\.\.\/([a-z0-9-]+)\/(?:react|svelte)\2/g;

/** A spec path (`button/button.tsx`, `lib/cn.ts`, or a folder) in its component folder. */
export function sourcePath(framework: Framework, rel: string): string {
	const [folder = "", ...rest] = rel.split("/");
	return resolve(COMPONENTS_DIR, folder, framework, ...rest);
}

/** Folder imports (`../../x/react/`) back to the one-deep shape the rewriter expects (`../x/`). */
export function toLegacy(code: string): string {
	return code
		.replace(FOLDER_IMPORT, (_m, head: string, folder: string) => `${head}../${folder}/`)
		.replace(
			BARE_FOLDER_IMPORT,
			(_m, head: string, q: string, folder: string) => `${head}../${folder}${q}`,
		);
}

export async function readSource(framework: Framework, rel: string): Promise<string> {
	return toLegacy(await readFile(sourcePath(framework, rel), "utf8"));
}
