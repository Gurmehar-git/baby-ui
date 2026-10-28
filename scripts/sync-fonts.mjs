import { cp, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

// SvelteKit's fs guard refuses files outside the app, so each consumer gets a copy
// of the vendored fonts rather than resolving them across the workspace.
const SOURCE = resolve("packages/tokens/fonts");
const TARGETS = ["apps/site/static/fonts"];

for (const target of TARGETS) {
	const dir = resolve(target);
	await mkdir(dir, { recursive: true });
	await cp(SOURCE, dir, { recursive: true });
}
console.log(`sync-fonts: copied ${TARGETS.length} font directories`);
