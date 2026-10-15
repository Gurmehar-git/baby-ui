import MagicString from "magic-string";
import { parseSync } from "oxc-parser";
import type { AliasKey } from "../project/paths.ts";

type Aliases = Partial<Record<AliasKey, string>> & { components: string };

// `#`-style package-import aliases are mapped back to the `@/` forms the rules below expect.
function normalize(specifier: string, aliases: Aliases): string {
	if (specifier === "#registry") return "@/registry";
	if (specifier.startsWith("#/")) return `@/${specifier.slice(2)}`;
	if (specifier.startsWith("#registry/")) return `@/registry/${specifier.slice(10)}`;
	const slots: Array<[string | undefined, string]> = [
		[aliases.ui, "@/components/ui"],
		[aliases.components, "@/components"],
		[aliases.hooks, "@/hooks"],
		[aliases.lib, "@/lib"],
		[aliases.utils, "@/lib/utils"],
	];
	const hashed = slots
		.filter((slot): slot is [string, string] => slot[0]?.startsWith("#") === true)
		.sort((a, b) => b[0].length - a[0].length);
	for (const [alias, canonical] of hashed) {
		if (specifier === alias) return canonical;
		if (specifier.startsWith(`${alias}/`))
			return canonical + specifier.slice(alias.length);
	}
	return specifier;
}

/** shadcn's alias rewrite for one specifier, so output matches the stock CLI byte for byte. */
export function rewriteSpecifier(input: string, aliases: Aliases): string {
	const specifier = normalize(input, aliases);
	if (!specifier.startsWith("@/")) return specifier;
	if (specifier === "@/registry") return aliases.components;

	if (!specifier.startsWith("@/registry/")) {
		if (specifier === "@/lib/utils" && aliases.utils) return aliases.utils;
		if (aliases.ui && /^@\/components\/ui(?=\/|$)/.test(specifier)) {
			return specifier.replace(/^@\/components\/ui/, aliases.ui);
		}
		if (/^@\/components(?=\/|$)/.test(specifier)) {
			return specifier.replace(/^@\/components/, aliases.components);
		}
		if (aliases.hooks && /^@\/hooks(?=\/|$)/.test(specifier)) {
			return specifier.replace(/^@\/hooks/, aliases.hooks);
		}
		if (aliases.lib && /^@\/lib(?=\/|$)/.test(specifier)) {
			return specifier.replace(/^@\/lib/, aliases.lib);
		}
		return specifier.replace(/^@\//, `${aliases.components.split("/")[0]}/`);
	}

	if (/^@\/registry\/(.+)\/ui/.test(specifier)) {
		return specifier.replace(
			/^@\/registry\/(.+)\/ui/,
			aliases.ui ?? `${aliases.components}/ui`,
		);
	}
	if (aliases.utils && /^@\/registry\/(.+)\/lib\/utils$/.test(specifier))
		return aliases.utils;
	if (/^@\/registry\/(.+)\/components/.test(specifier)) {
		return specifier.replace(/^@\/registry\/(.+)\/components/, aliases.components);
	}
	if (aliases.lib && /^@\/registry\/(.+)\/lib/.test(specifier)) {
		return specifier.replace(/^@\/registry\/(.+)\/lib/, aliases.lib);
	}
	if (aliases.hooks && /^@\/registry\/(.+)\/hooks/.test(specifier)) {
		return specifier.replace(/^@\/registry\/(.+)\/hooks/, aliases.hooks);
	}
	return specifier.replace(/^@\/registry\/[^/]+/, aliases.components);
}

export interface ScriptTransform {
	aliases: Aliases;
	/** Strip a leading `"use client"` (shadcn does this when `rsc` is false). */
	stripUseClient: boolean;
	/** Second pass: re-point an import whose rewritten form does not resolve. */
	resolve?: (original: string, rewritten: string) => string;
}

/** Rewrites import/export/dynamic-import specifiers in a TS/JS(X) file. */
export function transformScript(
	code: string,
	filename: string,
	opts: ScriptTransform,
): string {
	const { program, module } = parseSync(filename, code);
	const out = new MagicString(code);
	const spans = [
		...module.staticImports.map((i) => i.moduleRequest),
		...module.staticExports.flatMap((e) =>
			e.entries.flatMap((x) => x.moduleRequest ?? []),
		),
		...module.dynamicImports.map((d) => d.moduleRequest),
	];
	const seen = new Set<number>();
	for (const { start, end } of spans) {
		if (seen.has(start)) continue;
		seen.add(start);
		const literal = code.slice(start, end);
		const quote = literal[0];
		if (quote !== '"' && quote !== "'") continue;
		const value = literal.slice(1, -1);
		const rewritten = rewriteSpecifier(value, opts.aliases);
		const next = opts.resolve ? opts.resolve(value, rewritten) : rewritten;
		if (next !== value) out.overwrite(start, end, `${quote}${next}${quote}`);
	}
	if (opts.stripUseClient) {
		const first = program.body[0];
		if (
			first?.type === "ExpressionStatement" &&
			/^["']use client["']$/.test(
				code.slice(first.expression.start, first.expression.end),
			)
		) {
			out.remove(first.start, first.end);
		}
	}
	return out.toString();
}
