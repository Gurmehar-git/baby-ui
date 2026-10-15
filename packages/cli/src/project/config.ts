import { join } from "node:path";
import { isRecord, type Json, readJson } from "./fs.ts";

export type Framework = "react" | "svelte";

export interface ComponentsConfig {
	readonly framework: Framework | undefined;
	readonly css: string | undefined;
	readonly aliases: Readonly<Record<string, string>>;
	readonly raw: Json;
}

// shadcn writes `tsx`/`rsc`, shadcn-svelte writes `typescript`/`registry`; `$schema` is optional.
function flavour(raw: Json): Framework | undefined {
	const schema = typeof raw.$schema === "string" ? raw.$schema : "";
	if (schema.includes("shadcn-svelte.com")) return "svelte";
	if (schema.includes("ui.shadcn.com")) return "react";
	if ("tsx" in raw || "rsc" in raw) return "react";
	if ("typescript" in raw || "registry" in raw) return "svelte";
	return undefined;
}

/** Reads `components.json` as-is; we never write keys into it (shadcn's schema is strict). */
export function readComponentsConfig(root: string): ComponentsConfig | undefined {
	const raw = readJson(join(root, "components.json"));
	return raw ? parseComponentsConfig(raw) : undefined;
}

export function parseComponentsConfig(raw: Json): ComponentsConfig {
	const tailwind = isRecord(raw.tailwind) ? raw.tailwind : {};
	const aliases: Record<string, string> = {};
	if (isRecord(raw.aliases)) {
		for (const [key, value] of Object.entries(raw.aliases)) {
			if (typeof value === "string") aliases[key] = value;
		}
	}
	return {
		framework: flavour(raw),
		css: typeof tailwind.css === "string" ? tailwind.css : undefined,
		aliases,
		raw,
	};
}
