#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { args, finding, isMain, report } from "./lib/findings.mjs";

const HELP = `Usage: scan-source.mjs <dir|file ...> [--json]

Static checks over .ts, .tsx, .svelte and .css: raw colours, off-system motion, oversized
shadows, arbitrary font sizes, dashes in copy, and components laid out from props instead of parts.`;

const SKIP = new Set([
	"node_modules",
	".svelte-kit",
	"dist",
	"build",
	".git",
	".turbo",
	"coverage",
]);
// OG images and emails render as one fixed-size artifact: no parts, pixel type is correct there.
const TEMPLATE = /(?:^|[\\/])(?:og|email)-[\w-]+[\\/]/;
const TEMPLATE_EXEMPT = new Set(["TYPE-001", "COMPOSE-001", "COMPOSE-002"]);
const EXTENSIONS = new Set([".ts", ".tsx", ".svelte", ".css"]);

// [rule, severity, pattern, what it means, fix]; patterns run per line.
const LINE_RULES = [
	[
		"TOKEN-001",
		"high",
		/\b(?:bg|text|border|ring|fill|stroke|from|via|to|outline|decoration)-\[(?:#|rgba?\(|oklch\(|hsla?\()/,
		"raw colour in a class",
		"Use a semantic token class (bg-primary, text-muted-foreground).",
	],
	[
		"TOKEN-002",
		"high",
		/\b(?:bg|text|border|ring|fill|stroke)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-\d{2,3}\b/,
		"palette colour instead of a token",
		"Map it to a semantic token so themes and dark mode follow.",
	],
	[
		"MOTION-001",
		"high",
		/\btransition-all\b|transition:\s*all\b/,
		"transition: all",
		"List the properties: transition-[transform,opacity].",
	],
	[
		"MOTION-002",
		"high",
		/\bease-in\b(?!-out)|ease-in(?![-\w])/,
		"ease-in on UI",
		"Use ease-(--ease-ui-out) for enter, ease-(--ease-ui-in-out) for moves.",
	],
	[
		"MOTION-003",
		"high",
		/\bscale-0\b|scale\(0\)/,
		"animates from scale(0)",
		"Start from scale-95 or higher with opacity-0.",
	],
	[
		"MOTION-004",
		"medium",
		/\bduration-(?:\d{2,4}|\[\d+m?s\])(?![\w-])/,
		"raw duration",
		"Use a duration token: duration-(--duration-fast) and friends.",
	],
	[
		"SURF-003",
		"medium",
		/\bshadow-(?:xl|2xl)\b/,
		"off-system shadow",
		"Floating panels use shadow-(--overlay-shadow); raised bodies shadow-(--surface-shadow).",
	],
	[
		"TYPE-001",
		"medium",
		/\btext-\[\d+(?:\.\d+)?(?:px|rem|em)\]/,
		"arbitrary font size",
		"Use the type ladder: text-xs, text-sm, text-base, text-lg or a display size.",
	],
	[
		"COPY-001",
		"low",
		/[–—]/,
		"en or em dash",
		"Rewrite with a comma, colon, full stop or parentheses.",
	],
];

// Props that carry layout or copy; three or more on one component suggests a prop-driven monolith.
const LAYOUT_PROPS =
	/^\s*(title|description|subtitle|eyebrow|label|icon|actions|footer|header|media|badge|note|items|cta|primaryAction|secondaryAction)\??\s*:/;

function* walk(path) {
	const stat = statSync(path);
	if (stat.isFile()) {
		if (EXTENSIONS.has(extname(path))) yield path;
		return;
	}
	for (const entry of readdirSync(path)) {
		if (SKIP.has(entry) || entry.startsWith(".")) continue;
		yield* walk(join(path, entry));
	}
}

/** The props block of a React interface or a Svelte $props() type, as lines. */
function propBlocks(text) {
	const blocks = [];
	for (const m of text.matchAll(/interface\s+\w*Props[^{]*\{([\s\S]*?)\n\}/g))
		blocks.push(m[1]);
	for (const m of text.matchAll(/\}\s*:\s*[\s\S]*?\{([\s\S]*?)\}\s*=\s*\$props\(\)/g))
		blocks.push(m[1]);
	return blocks;
}

export function scanText(text, where) {
	const out = [];
	const lines = text.split(/\r?\n/);
	lines.forEach((line, i) => {
		// Comments are the comment gate's job; dashes and patterns in them are not UI.
		const code = line.replace(/\/\/.*$|\/\*.*?\*\/|<!--.*?-->/g, "");
		for (const [rule, severity, pattern, what, fix] of LINE_RULES)
			if (pattern.test(code))
				out.push(finding(rule, severity, `${where}:${i + 1}`, what, fix));
	});
	for (const block of propBlocks(text)) {
		const keys = block.split("\n").flatMap((l) => l.match(LAYOUT_PROPS)?.[1] ?? []);
		if (keys.length >= 3)
			out.push(
				finding(
					"COMPOSE-001",
					"blocker",
					where,
					`layout props: ${keys.join(", ")}`,
					"Split into parts (Root, Header, Title, Item...) composed by the user, like Empty or Card.",
				),
			);
	}
	return out;
}

/** COMPOSE-002: a sizeable component that ships as one export (React) or one file (Svelte). */
export function partsFindings(files) {
	const out = [];
	const byDir = new Map();
	const tsxByDir = new Map();
	for (const { file, text } of files) {
		const dir = file.replace(/[\\/][^\\/]+$/, "");
		if (file.endsWith(".svelte"))
			byDir.set(dir, [...(byDir.get(dir) ?? []), { file, text }]);
		if (file.endsWith(".tsx"))
			tsxByDir.set(dir, [...(tsxByDir.get(dir) ?? []), { file, text }]);
	}
	// Parts may live in sibling files, so exports are counted per component folder.
	for (const tsx of tsxByDir.values()) {
		const parts = tsx.flatMap(({ text }) => [
			...text.matchAll(/^export function ([A-Z]\w*)/gm),
		]);
		const main = tsx.find(({ text }) => /^export function [A-Z]/m.test(text));
		if (!main || parts.length !== 1) continue;
		const lines = main.text.split("\n").length;
		if (lines > 120 && /return \(\s*</.test(main.text))
			out.push(
				finding(
					"COMPOSE-002",
					"high",
					main.file,
					`one export (${parts[0]?.[1]}) over ${lines} lines`,
					"Expose its regions as parts the user arranges, keeping data arrays as props.",
				),
			);
	}
	for (const [dir, svelte] of byDir) {
		const lines = svelte.reduce((n, s) => n + s.text.split("\n").length, 0);
		if (svelte.length === 1 && lines > 120)
			out.push(
				finding(
					"COMPOSE-002",
					"high",
					svelte[0]?.file ?? dir,
					`one .svelte file over ${lines} lines`,
					"Split into one file per part plus context.ts.",
				),
			);
	}
	return out;
}

export function scanPaths(paths, root = process.cwd()) {
	const files = paths.flatMap((p) =>
		[...walk(p)].map((file) => ({
			file: relative(root, file),
			text: readFileSync(file, "utf8"),
		})),
	);
	return [
		...files.flatMap(({ file, text }) => scanText(text, file)),
		...partsFindings(files),
	].filter((f) => !(TEMPLATE.test(f.where) && TEMPLATE_EXEMPT.has(f.rule)));
}

if (isMain(import.meta.url)) {
	const { flags, positional } = args(process.argv.slice(2));
	if (flags.has("help") || !positional.length) {
		console.log(HELP);
		process.exit(positional.length ? 0 : 1);
	}
	report("Source", scanPaths(positional), { json: flags.has("json") });
}
