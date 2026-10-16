#!/usr/bin/env node
import {
	cpSync,
	existsSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { toFolders } from "./paths.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const COMPONENTS = join(ROOT, "components");
const SOURCES = {
	react: join(ROOT, "packages/ui-react/src"),
	svelte: join(ROOT, "packages/ui-svelte/src/lib"),
};

function copyPort(slug, framework) {
	const from = join(SOURCES[framework], slug);
	if (!existsSync(from)) return 0;
	const to = join(COMPONENTS, slug, framework);
	rmSync(to, { recursive: true, force: true });
	cpSync(from, to, { recursive: true });
	let files = 0;
	for (const name of readdirSync(to, { recursive: true })) {
		const file = join(to, String(name));
		if (!/\.(ts|tsx|svelte)$/.test(file)) continue;
		writeFileSync(file, toFolders(readFileSync(file, "utf8"), framework));
		files++;
	}
	return files;
}

const slugs = process.argv.slice(2);
if (!slugs.length) {
	console.error("usage: node components/_tools/migrate.mjs <slug>...");
	process.exit(1);
}
for (const slug of slugs) {
	const react = copyPort(slug, "react");
	const svelte = copyPort(slug, "svelte");
	console.log(`${slug}: react ${react} files, svelte ${svelte} files`);
}
