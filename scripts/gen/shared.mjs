import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./core.mjs";

const EXCEPTIONS = new Set(
	JSON.parse(readFileSync(join(ROOT, "scripts/shared-exceptions.json"), "utf8")).files,
);

export const isShared = (name) =>
	name.endsWith(".ts") && !name.endsWith(".d.ts") && name !== "index.ts";

/** A shared React file as its Svelte copy: sibling imports name the port (`../../chart/react/core`). */
export const toSveltePort = (code) =>
	code.replace(/(["']\.\.\/\.\.\/[a-z0-9-]+\/)react(["'/])/g, "$1svelte$2");

function copyShared(output, dir, reactDir, svelteDir, port = (code) => code) {
	for (const file of readdirSync(reactDir)) {
		if (!isShared(file)) continue;
		if (EXCEPTIONS.has(`${dir}/${file}`)) {
			output.protect(join(svelteDir, file));
			continue;
		}
		// A React file generated earlier in this run is newer than the copy on disk.
		const src = join(reactDir, file);
		const code = output.files.get(src) ?? readFileSync(src, "utf8");
		output.add(join(svelteDir, file), port(code), { source: src });
	}
}

/** `components/<dir>/react/*.ts` copied into `components/<dir>/svelte/` (React-only folders skipped). */
export function componentSharedFiles(output) {
	const root = join(ROOT, "components");
	for (const entry of readdirSync(root, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const reactDir = join(root, entry.name, "react");
		const svelteDir = join(root, entry.name, "svelte");
		if (existsSync(reactDir) && existsSync(svelteDir)) {
			copyShared(output, entry.name, reactDir, svelteDir, toSveltePort);
		}
	}
}

/** Copies every shared React .ts into the matching Svelte folder (React-only folders are skipped). */
export function sharedFiles(output, target) {
	const reactRoot = join(ROOT, target.react);
	const svelteRoot = join(ROOT, target.svelte);
	if (!existsSync(reactRoot) || !existsSync(svelteRoot)) return;
	for (const entry of readdirSync(reactRoot, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const destDir = join(svelteRoot, entry.name);
		if (existsSync(destDir))
			copyShared(output, entry.name, join(reactRoot, entry.name), destDir);
	}
}
