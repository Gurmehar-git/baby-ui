import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";
import { detectProject, type Project } from "./detect.ts";
import { ancestors, isRecord, readJson, toPosix } from "./fs.ts";

export interface Workspace {
	readonly root: string;
	/** Package globs from pnpm-workspace.yaml or package.json `workspaces`; empty for a single app. */
	readonly patterns: readonly string[];
}

export interface Target extends Project {
	/** Path from the workspace root, `.` for the root itself. */
	readonly path: string;
}

async function pnpmPatterns(file: string): Promise<string[]> {
	const { parse } = await import("yaml");
	const doc: unknown = parse(readFileSync(file, "utf8"));
	const packages = isRecord(doc) ? doc.packages : undefined;
	return Array.isArray(packages) ? packages.filter((p) => typeof p === "string") : [];
}

function npmPatterns(workspaces: unknown): string[] | undefined {
	const list = isRecord(workspaces) ? workspaces.packages : workspaces;
	return Array.isArray(list) ? list.filter((p) => typeof p === "string") : undefined;
}

async function findRoot(
	cwd: string,
): Promise<{ workspace: Workspace; nearest?: string }> {
	let nearest: string | undefined;
	for (const dir of ancestors(resolve(cwd))) {
		const pnpm = join(dir, "pnpm-workspace.yaml");
		if (existsSync(pnpm)) {
			return { workspace: { root: dir, patterns: await pnpmPatterns(pnpm) }, nearest };
		}
		const pkg = readJson(join(dir, "package.json"));
		const patterns = npmPatterns(pkg?.workspaces);
		if (patterns) return { workspace: { root: dir, patterns }, nearest };
		if (pkg && !nearest) nearest = dir;
	}
	return { workspace: { root: nearest ?? resolve(cwd), patterns: [] } };
}

/**
 * The workspace containing `cwd`. A package inside a workspace folder that its patterns
 * don't list (a scratch app, an example) is treated as its own single-app workspace.
 */
export async function findWorkspace(cwd: string): Promise<Workspace> {
	const { workspace, nearest } = await findRoot(cwd);
	if (!nearest || nearest === workspace.root) return workspace;
	const members = await packageDirs(workspace);
	return members.includes(nearest) ? workspace : { root: nearest, patterns: [] };
}

async function packageDirs(workspace: Workspace): Promise<string[]> {
	if (!workspace.patterns.length) return [workspace.root];
	const { glob } = await import("tinyglobby");
	const include = workspace.patterns.filter((p) => !p.startsWith("!"));
	const ignore = workspace.patterns
		.filter((p) => p.startsWith("!"))
		.map((p) => p.slice(1));
	const manifests = await glob(
		include.map((p) => `${p.replace(/\/$/, "")}/package.json`),
		{ cwd: workspace.root, ignore: [...ignore, "**/node_modules/**"], absolute: true },
	);
	const dirs = manifests.map((file) => resolve(file, ".."));
	return [workspace.root, ...dirs.sort()];
}

/** Every package that has a components.json or a React/Svelte dependency. */
export async function discoverTargets(workspace: Workspace): Promise<Target[]> {
	const dirs = await packageDirs(workspace);
	const monorepo = workspace.patterns.length > 0;
	return (
		dirs
			.map((dir) => ({
				...detectProject(dir, workspace.root),
				path: toPosix(relative(workspace.root, dir)) || ".",
			}))
			.filter((t) => t.framework !== undefined)
			// A monorepo root often carries react as a tooling devDependency; only its config counts.
			.filter((t) => !(monorepo && t.path === "." && !t.config))
	);
}

/** The deepest target containing `cwd`, so running inside a package picks that package. */
export function targetAt(targets: readonly Target[], cwd: string): Target | undefined {
	const here = resolve(cwd);
	return targets
		.filter((t) => {
			const rest = relative(t.root, here);
			return !rest.startsWith("..") && !isAbsolute(rest);
		})
		.sort((a, b) => b.root.length - a.root.length)[0];
}

/** Matches `--target` against package name or workspace-relative path. */
export function matchTarget(
	targets: readonly Target[],
	query: string,
): Target | undefined {
	const path = toPosix(query).replace(/^\.\//, "").replace(/\/$/, "") || ".";
	return targets.find((t) => t.name === query || t.path === path);
}
