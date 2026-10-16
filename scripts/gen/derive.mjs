import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import ts from "typescript";
import { ROOT } from "./core.mjs";
import { filesIn } from "./exports.mjs";

const PORTS = ["react", "svelte"];
// Framework runtimes are peers the CLI never installs.
const RUNTIMES = new Set(["react", "react-dom", "svelte"]);
const LIB = join(ROOT, "components", "lib");

const packageOf = (spec) =>
	spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];

/** The package that provides `name`: itself, or `@types/<name>` when only types exist (geojson). */
function installable(name, nodeModules) {
	if (existsSync(join(nodeModules, name))) return name;
	const types = `@types/${name.replace(/^@/, "").replace("/", "__")}`;
	return existsSync(join(nodeModules, types)) ? types : name;
}

const isFile = (path) => existsSync(path) && statSync(path).isFile();

function resolveLocal(from, spec, exists) {
	const base = resolve(dirname(from), spec);
	return [
		base,
		`${base}.ts`,
		`${base}.tsx`,
		`${base}.svelte`,
		`${base}.svelte.ts`,
		join(base, "index.ts"),
	].find(exists);
}

/** Every module a source file imports or re-exports, dynamic imports and `import type` included. */
function specifiers(text, path) {
	const code = path.endsWith(".svelte")
		? [...text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
				.map((m) => m[1])
				.join("\n")
		: text;
	return ts.preProcessFile(code, true, true).importedFiles.map((f) => f.fileName);
}

/** Primary file (`<slug>.<ext>`) first, then the component's other files, then `lib/`. */
const order = (slug) => (a, b) => {
	const rank = (p) =>
		p.startsWith("lib/") ? 2 : /^[^/]+\/([^/]+)\.[a-z]+$/.exec(p)?.[1] === slug ? 0 : 1;
	return rank(a) - rank(b) || (a < b ? -1 : 1);
};

/**
 * What one port ships, read from its imports: its own files plus every `lib/` file they reach,
 * the npm packages they import, and the other components they import (registry dependencies).
 */
export function derivePort(output, root, slug, port) {
	const own = join(root, slug, port);
	const lib = join(LIB, port);
	const nodeModules = join(root, "node_modules");
	// A fresh checkout has this run's generated copies only in `output`, not on disk yet.
	const read = (path) => output.files.get(path) ?? readFileSync(path, "utf8");
	const exists = (path) => output.files.has(path) || isFile(path);
	const files = new Map();
	const dependencies = new Set();
	const registryDependencies = new Set();
	const queue = filesIn(output, own)
		.filter((f) => f !== "index.ts")
		.map((f) => join(own, f));
	while (queue.length) {
		const file = queue.shift();
		const inLib = file.startsWith(lib + sep);
		const path = `${inLib ? "lib" : slug}/${relative(inLib ? lib : own, file).replaceAll(sep, "/")}`;
		if (files.has(path)) continue;
		files.set(path, inLib ? "registry:lib" : "registry:ui");
		for (const spec of specifiers(read(file), file)) {
			if (!spec.startsWith(".")) {
				const name = packageOf(spec);
				if (!RUNTIMES.has(name)) dependencies.add(installable(name, nodeModules));
				continue;
			}
			const target = resolveLocal(file, spec, exists);
			if (!target) continue;
			if (target.startsWith(own + sep) || target.startsWith(lib + sep))
				queue.push(target);
			else registryDependencies.add(relative(root, target).split(sep)[0]);
		}
	}
	return {
		files: [...files.keys()]
			.sort(order(slug))
			.map((path) => ({ path, type: files.get(path) })),
		dependencies: [...dependencies].sort(),
		registryDependencies: [...registryDependencies].sort(),
	};
}

/** Derived impl fields for every component folder under `root`, by slug and port. */
export function deriveAll(output, root = join(ROOT, "components")) {
	const out = {};
	for (const slug of filesIn(output, root)) {
		if (slug === "lib" || slug.startsWith("_") || slug === "node_modules") continue;
		for (const port of PORTS) {
			if (!existsSync(join(root, slug, port))) continue;
			out[slug] ??= {};
			out[slug][port] = derivePort(output, root, slug, port);
		}
	}
	return out;
}
