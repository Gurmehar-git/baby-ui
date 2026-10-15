import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { type ComponentsConfig, type Framework, readComponentsConfig } from "./config.ts";
import { isRecord, type Json, readJson } from "./fs.ts";
import { detectPm, type PackageManager, type PmSource } from "./pm.ts";

export type { Framework } from "./config.ts";

export type Meta =
	| "next"
	| "tanstack-start"
	| "react-router"
	| "vite-react"
	| "sveltekit"
	| "vite-svelte";

export type FrameworkSource = "components.json" | "dependencies";

/** An import prefix mapped to a directory, from tsconfig `paths` or package.json `imports`. */
export interface Alias {
	readonly prefix: string;
	readonly dir: string;
	/** Package `imports` resolve exact files, so specifiers need the extension. */
	readonly withExtension: boolean;
}

export interface Project {
	readonly root: string;
	readonly name: string | undefined;
	readonly framework: Framework | undefined;
	readonly frameworkSource: FrameworkSource | undefined;
	readonly meta: Meta | undefined;
	readonly pm: PackageManager;
	readonly pmSource: PmSource;
	readonly config: ComponentsConfig | undefined;
	readonly dependencies: ReadonlySet<string>;
	readonly aliases: readonly Alias[];
	/** SvelteKit before 3 aliases `src/lib` as `$lib`; Kit 3 uses package.json `imports`. */
	readonly dollarLib: boolean;
}

function dependencyVersions(pkg: Json | undefined): Record<string, string> {
	const versions: Record<string, string> = {};
	for (const field of ["dependencies", "devDependencies", "peerDependencies"]) {
		const block = pkg?.[field];
		if (!isRecord(block)) continue;
		for (const [name, range] of Object.entries(block)) {
			if (typeof range === "string") versions[name] ??= range;
		}
	}
	return versions;
}

export function detectMeta(deps: ReadonlySet<string>): Meta | undefined {
	if (deps.has("next")) return "next";
	if (deps.has("@tanstack/react-start")) return "tanstack-start";
	if (deps.has("react-router") || deps.has("@react-router/dev")) return "react-router";
	if (deps.has("@sveltejs/kit")) return "sveltekit";
	if (deps.has("svelte")) return "vite-svelte";
	if (deps.has("react")) return "vite-react";
	return undefined;
}

const META_FRAMEWORK: Record<Meta, Framework> = {
	next: "react",
	"tanstack-start": "react",
	"react-router": "react",
	"vite-react": "react",
	sveltekit: "svelte",
	"vite-svelte": "svelte",
};

interface TsPaths {
	paths: Record<string, unknown>;
	base: string;
}

// `paths` resolve against `baseUrl`, else the dir of the tsconfig declaring them; children override.
function tsconfigPaths(file: string, seen = new Set<string>()): TsPaths | undefined {
	if (seen.has(file)) return undefined;
	seen.add(file);
	const config = readJson(file);
	if (!config) return undefined;
	const dir = dirname(file);
	const options = isRecord(config.compilerOptions) ? config.compilerOptions : {};
	const baseUrl =
		typeof options.baseUrl === "string" ? resolve(dir, options.baseUrl) : undefined;
	if (isRecord(options.paths)) return { paths: options.paths, base: baseUrl ?? dir };

	const parents = [config.extends].flat().filter((p) => typeof p === "string");
	for (const parent of parents.reverse()) {
		if (!parent.startsWith(".")) continue;
		const target = resolve(dir, parent);
		const found = tsconfigPaths(
			target.endsWith(".json") ? target : `${target}.json`,
			seen,
		);
		if (found) return baseUrl ? { ...found, base: baseUrl } : found;
	}
	return undefined;
}

function detectAliases(root: string, pkg: Json | undefined): Alias[] {
	const aliases: Alias[] = [];
	const tsconfig = ["tsconfig.json", "jsconfig.json"]
		.map((name) => join(root, name))
		.find((file) => existsSync(file));
	const ts = tsconfig ? tsconfigPaths(tsconfig) : undefined;
	for (const [key, targets] of Object.entries(ts?.paths ?? {})) {
		const target = Array.isArray(targets) ? targets[0] : undefined;
		if (!key.endsWith("/*") || typeof target !== "string" || !target.endsWith("/*"))
			continue;
		aliases.push({
			prefix: key.slice(0, -1),
			dir: resolve(ts?.base ?? root, target.slice(0, -2)),
			withExtension: false,
		});
	}
	const imports = isRecord(pkg?.imports) ? pkg.imports : {};
	for (const [key, target] of Object.entries(imports)) {
		if (!key.endsWith("/*") || typeof target !== "string" || !target.endsWith("/*"))
			continue;
		aliases.push({
			prefix: key.slice(0, -1),
			dir: resolve(root, target.slice(0, -2)),
			withExtension: true,
		});
	}
	return aliases;
}

// The installed version wins; the declared range covers an app whose install hasn't run yet.
function kitMajor(root: string, versions: Record<string, string>): number {
	const installed = readJson(
		join(root, "node_modules", "@sveltejs", "kit", "package.json"),
	);
	const version = String(installed?.version ?? versions["@sveltejs/kit"] ?? "");
	const major = /(\d+)/.exec(version)?.[1];
	return major === undefined ? 3 : Number(major);
}

/** Detects one project directory; `stop` bounds the upward lockfile search (workspace root). */
export function detectProject(root: string, stop = root): Project {
	const pkg = readJson(join(root, "package.json"));
	const versions = dependencyVersions(pkg);
	const dependencies = new Set(Object.keys(versions));
	const config = readComponentsConfig(root);
	const meta = detectMeta(dependencies);
	const fromDeps = meta ? META_FRAMEWORK[meta] : undefined;
	const framework = config?.framework ?? fromDeps;
	return {
		root,
		name: typeof pkg?.name === "string" ? pkg.name : undefined,
		framework,
		frameworkSource: config?.framework
			? "components.json"
			: fromDeps
				? "dependencies"
				: undefined,
		meta,
		...detectPm(root, pkg, stop),
		config,
		dependencies,
		aliases: detectAliases(root, pkg),
		dollarLib: meta === "sveltekit" && kitMajor(root, versions) < 3,
	};
}
