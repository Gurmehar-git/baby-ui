import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, posix, relative, resolve, sep } from "node:path";
import type { Framework } from "@baby-ui/registry-schema";
import { REPO_ROOT } from "./config";

/** Per-component folders: `components/<slug>/` with `react/`, `svelte/` and shared files. */
export const COMPONENTS_DIR = resolve(REPO_ROOT, "components");

const PORT = /^(?:react|svelte)$/;
const SPECIFIER = /((?:from|import)\s*\(?\s*["'])(\.{1,2}\/[^"']*)(["'])/g;

/**
 * A spec path (`button/button.tsx`, `button/variants.ts`, `lib/cn.ts`, or a folder) on disk: the
 * port's own file when it has one, else the file both ports share at the folder root.
 */
export function sourcePath(framework: Framework, rel: string): string {
	const [folder = "", ...rest] = rel.split("/");
	const port = resolve(COMPONENTS_DIR, folder, framework, ...rest);
	if (!rest.length || existsSync(port)) return port;
	const shared = resolve(COMPONENTS_DIR, folder, ...rest);
	return existsSync(shared) ? shared : port;
}

/** Where a source file lands once installed: port and shared files both ship as `<slug>/<file>`. */
function installedPath(abs: string): string {
	const parts = relative(COMPONENTS_DIR, abs).split(sep);
	if (PORT.test(parts[1] ?? "")) parts.splice(1, 1);
	return parts.join("/");
}

/** Relative imports of the file at `path`, re-pointed at their targets' installed places. */
export function toLegacy(code: string, path: string): string {
	const from = posix.dirname(installedPath(path));
	return code.replace(SPECIFIER, (_m, head: string, spec: string, tail: string) => {
		const target = installedPath(resolve(dirname(path), spec));
		const out = posix.relative(from, target);
		return `${head}${out.startsWith(".") ? out : `./${out}`}${tail}`;
	});
}

export async function readSource(framework: Framework, rel: string): Promise<string> {
	const path = sourcePath(framework, rel);
	return toLegacy(await readFile(path, "utf8"), path);
}
