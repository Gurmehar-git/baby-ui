import { existsSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { parseSync } from "oxc-parser";
import type { Project } from "../project/detect.ts";
import { type InstallConfig, resolveAlias } from "../project/paths.ts";
import { packageName } from "./deps.ts";
import { type LockFile, type LockItem, readLock, sha256 } from "./lock.ts";

export type FileHealth = "clean" | "modified" | "missing" | "broken";

export interface FileState {
	/** Root-relative posix path, as the lock stores it. */
	readonly path: string;
	readonly health: FileHealth;
	/** Alias imports that no longer land on a file. */
	readonly unresolved: readonly string[];
}

export interface ItemState {
	readonly url: string;
	readonly item: LockItem;
	readonly files: readonly FileState[];
	readonly missingDeps: readonly string[];
}

const SCRIPT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const EXT = [
	"",
	".ts",
	".tsx",
	".js",
	".jsx",
	".svelte",
	"/index.ts",
	"/index.tsx",
	"/index.js",
];

function specifiers(path: string, code: string): string[] | undefined {
	const ext = extname(path);
	if (ext === ".svelte") {
		const out: string[] = [];
		for (const m of code.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)) {
			const parsed = parseSync("script.ts", m[1] ?? "");
			if (parsed.errors.length) return undefined;
			out.push(...parsed.module.staticImports.map((i) => i.moduleRequest.value));
		}
		return out;
	}
	if (!SCRIPT.has(ext)) return [];
	const parsed = parseSync(path, code);
	if (parsed.errors.length) return undefined;
	return [
		...parsed.module.staticImports.map((i) => i.moduleRequest.value),
		...parsed.module.staticExports.flatMap((e) =>
			e.entries.flatMap((x) => x.moduleRequest?.value ?? []),
		),
	];
}

/** Alias-prefixed imports in `code` that resolve to no file. */
export function unresolvedImports(
	path: string,
	code: string,
	project: Project,
): string[] | undefined {
	const found = specifiers(path, code);
	if (!found) return undefined;
	const prefixes = project.aliases.map((a) => a.prefix.slice(0, -1));
	if (project.dollarLib) prefixes.push("$lib");
	return found.filter((spec) => {
		if (!prefixes.some((p) => spec === p || spec.startsWith(`${p}/`))) return false;
		const base = resolveAlias(spec, project);
		if (!base) return true;
		const bare = base.replace(/\.js$/, "");
		return !EXT.some((e) => existsSync(base + e) || existsSync(bare + e));
	});
}

export function fileState(
	root: string,
	path: string,
	hash: string,
	project: Project,
): FileState {
	const abs = join(root, path);
	if (!existsSync(abs)) return { path, health: "missing", unresolved: [] };
	const code = readFileSync(abs, "utf8");
	const unresolved = unresolvedImports(abs, code, project);
	if (unresolved === undefined) return { path, health: "broken", unresolved: [] };
	return { path, health: sha256(code) === hash ? "clean" : "modified", unresolved };
}

/** The local state of every locked item in `cfg`'s project; no network. */
export async function inspect(cfg: InstallConfig, lock?: LockFile): Promise<ItemState[]> {
	const project = cfg.project;
	const { items } = lock ?? (await readLock(project.root));
	return Object.entries(items).map(([url, item]) => ({
		url,
		item,
		files: Object.entries(item.files).map(([path, hash]) =>
			fileState(project.root, path, hash, project),
		),
		missingDeps: item.dependencies.filter(
			(d) => !project.dependencies.has(packageName(d)),
		),
	}));
}

/** Lock entries whose name or URL matches one of `names`; all of them when `names` is empty. */
export function matchItems(
	lock: LockFile,
	names: readonly string[],
): Array<[string, LockItem]> {
	const entries = Object.entries(lock.items);
	if (!names.length) return entries;
	return entries.filter(
		([url, item]) => names.includes(item.name) || names.includes(url),
	);
}
