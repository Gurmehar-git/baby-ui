import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { toFolders, toLegacy } from "./paths.mjs";

const COMPONENTS = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FRAMEWORKS = ["react", "svelte"];

const walk = (dir) =>
	readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? walk(path) : [path];
	});
const sources = (dir) => walk(dir).filter((f) => /\.(ts|tsx|svelte)$/.test(f));

test("the rewrite round-trips every component source in both ports", () => {
	let files = 0;
	for (const slug of readdirSync(COMPONENTS)) {
		if (slug === "lib" || slug.startsWith("_") || slug === "node_modules") continue;
		for (const framework of FRAMEWORKS) {
			const folder = join(COMPONENTS, slug, framework);
			if (!statSync(folder, { throwIfNoEntry: false })?.isDirectory()) continue;
			for (const file of sources(folder)) {
				const code = readFileSync(file, "utf8");
				assert.equal(toFolders(toLegacy(code), framework), code, file);
				files++;
			}
		}
	}
	assert.ok(files > 1500, `only ${files} files scanned`);
});
