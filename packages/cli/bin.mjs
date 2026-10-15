#!/usr/bin/env node
import { existsSync } from "node:fs";
import module from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

module.enableCompileCache();

const entry = resolve(dirname(fileURLToPath(import.meta.url)), "dist/index.js");

if (!existsSync(entry)) {
	console.error(
		"baby-ui: dist/index.js is missing, run `pnpm --filter @baby-ui/cli build`.",
	);
	process.exit(1);
}

// A file:// URL, since `C:\...` is not a valid ESM specifier on Windows.
const cli = await import(pathToFileURL(entry).href);
await cli.run(process.argv);
