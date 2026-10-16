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

/** `<root>/<dir>/react/*.ts` copied into `<root>/<dir>/svelte/` (React-only folders skipped). */
export function componentSharedFiles(output, root = "components") {
	const dir = join(ROOT, root);
	if (!existsSync(dir)) return;
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const reactDir = join(dir, entry.name, "react");
		const svelteDir = join(dir, entry.name, "svelte");
		if (existsSync(reactDir) && existsSync(svelteDir)) {
			copyShared(output, entry.name, reactDir, svelteDir, toSveltePort);
		}
	}
}
