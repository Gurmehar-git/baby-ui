import { ALIAS_KEYS, type AliasKey } from "../project/paths.ts";

/** shadcn-svelte's `$UI$`-style placeholders, replaced with the project's aliases. */
export function replacePlaceholders(
	code: string,
	aliases: Readonly<Record<AliasKey, string>>,
) {
	let out = code;
	for (const key of ALIAS_KEYS)
		out = out.replaceAll(`$${key.toUpperCase()}$`, aliases[key]);
	return out;
}
