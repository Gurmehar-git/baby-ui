import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

export const COMPONENTS = resolve(import.meta.dir, "..");
export type Port = "react" | "svelte";

/** A `tv()` result's public axes, as option lists: the manifest's `variants` without retyping. */
export function axesOf(component: { variants: Record<string, Record<string, unknown>> }) {
	return Object.fromEntries(
		Object.entries(component.variants).map(([axis, options]) => [
			axis,
			Object.keys(options),
		]),
	);
}

// Framework runtimes are peers the CLI never installs.
const RUNTIMES = new Set(["react", "react-dom", "svelte"]);
const SPECIFIER = /(?:from|import)\s*\(?\s*["']([^"']+)["']/g;

const packageOf = (spec: string) =>
	spec.startsWith("@")
		? spec.split("/").slice(0, 2).join("/")
		: (spec.split("/")[0] ?? spec);

function resolveLocal(from: string, spec: string): string | undefined {
	const base = resolve(dirname(from), spec);
	const bare = base.replace(/\.js$/, "");
	return [
		base,
		`${bare}.ts`,
		`${bare}.tsx`,
		`${bare}.svelte`,
		join(base, "index.ts"),
	].find((p) => existsSync(p));
}

export interface Derived {
	files: Array<{ path: string; type: "registry:ui" | "registry:lib" }>;
	dependencies: string[];
	registryDependencies: string[];
}

/** Files, npm dependencies and registry dependencies of one port, read from its folder. */
export function derivePort(slug: string, port: Port): Derived {
	const own = join(COMPONENTS, slug, port);
	const lib = join(COMPONENTS, "lib", port);
	const files = new Map<string, Derived["files"][number]>();
	const deps = new Set<string>();
	const registryDeps = new Set<string>();
	const queue = readdirSync(own)
		.filter((f) => f !== "index.ts")
		.map((f) => join(own, f));

	while (queue.length) {
		const file = queue.shift();
		if (!file) break;
		const inLib = file.startsWith(lib);
		const path = inLib ? `lib/${basename(file)}` : `${slug}/${basename(file)}`;
		if (files.has(path)) continue;
		files.set(path, { path, type: inLib ? "registry:lib" : "registry:ui" });
		for (const [, spec] of readFileSync(file, "utf8").matchAll(SPECIFIER)) {
			if (!spec) continue;
			if (!spec.startsWith(".")) {
				if (!RUNTIMES.has(packageOf(spec))) deps.add(packageOf(spec));
				continue;
			}
			const target = resolveLocal(file, spec);
			if (!target) continue;
			if (target.startsWith(lib) || target.startsWith(own)) queue.push(target);
			else registryDeps.add(basename(dirname(dirname(target))));
		}
	}
	return {
		files: [...files.values()],
		dependencies: [...deps].sort(),
		registryDependencies: [...registryDeps].sort(),
	};
}
