import { existsSync, readFileSync } from "node:fs";
import { dirname, sep } from "node:path";

export type Json = Record<string, unknown>;

/** Parses JSON or JSONC (tsconfig): comments and trailing commas are dropped. */
export function readJson(file: string): Json | undefined {
	if (!existsSync(file)) return undefined;
	const text = readFileSync(file, "utf8")
		.replace(/("(?:\\.|[^"\\])*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g, (_, str) => str ?? "")
		.replace(/,(\s*[}\]])/g, "$1");
	try {
		const value: unknown = JSON.parse(text);
		return isRecord(value) ? value : undefined;
	} catch {
		return undefined;
	}
}

export function isRecord(value: unknown): value is Json {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const toPosix = (path: string) => path.split(sep).join("/");

/** `dir` and each parent up to the filesystem root. */
export function* ancestors(dir: string): Generator<string> {
	let current = dir;
	while (true) {
		yield current;
		const parent = dirname(current);
		if (parent === current) return;
		current = parent;
	}
}
