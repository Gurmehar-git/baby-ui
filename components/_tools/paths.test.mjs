import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { toFolders, toLegacy } from "./paths.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const SOURCES = {
	react: join(ROOT, "packages/ui-react/src"),
	svelte: join(ROOT, "packages/ui-svelte/src/lib"),
};
const SPIKE = ["button", "dialog", "fullscreen-nav"];

const walk = (dir) =>
	readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? walk(path) : [path];
	});
const sources = (dir) => walk(dir).filter((f) => /\.(ts|tsx|svelte)$/.test(f));

test("spike folders map back to today's sources byte for byte", () => {
	for (const slug of SPIKE) {
		for (const [framework, src] of Object.entries(SOURCES)) {
			const folder = join(ROOT, "components", slug, framework);
			for (const file of sources(folder)) {
				const legacy = join(src, slug, relative(folder, file));
				assert.equal(
					toLegacy(readFileSync(file, "utf8")),
					readFileSync(legacy, "utf8"),
					file,
				);
			}
		}
	}
});

test("the rewrite round-trips every source file in both ports", () => {
	let files = 0;
	for (const [framework, src] of Object.entries(SOURCES)) {
		for (const file of sources(src)) {
			const code = readFileSync(file, "utf8");
			assert.equal(toLegacy(toFolders(code, framework)), code, file);
			files++;
		}
	}
	assert.ok(files > 1500, `only ${files} files scanned`);
});
