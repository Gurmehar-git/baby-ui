import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./core.mjs";

const EXCEPTIONS = new Set(
	JSON.parse(readFileSync(join(ROOT, "scripts/shared-exceptions.json"), "utf8")).files,
);

export const isShared = (name) =>
	name.endsWith(".ts") && !name.endsWith(".d.ts") && name !== "index.ts";

/** Copies every shared React .ts into the matching Svelte folder (React-only folders are skipped). */
export function sharedFiles(output, target) {
	const reactRoot = join(ROOT, target.react);
	const svelteRoot = join(ROOT, target.svelte);
	if (!existsSync(reactRoot) || !existsSync(svelteRoot)) return;
	for (const entry of readdirSync(reactRoot, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const destDir = join(svelteRoot, entry.name);
		if (!existsSync(destDir)) continue;
		for (const file of readdirSync(join(reactRoot, entry.name))) {
			if (!isShared(file)) continue;
			if (EXCEPTIONS.has(`${entry.name}/${file}`)) {
				output.protect(join(destDir, file));
				continue;
			}
			// A React file generated earlier in this run is newer than the copy on disk.
			const src = join(reactRoot, entry.name, file);
			output.add(
				join(destDir, file),
				output.files.get(src) ?? readFileSync(src, "utf8"),
				{
					source: src,
				},
			);
		}
	}
}
