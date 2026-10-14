export type TokenKind =
	| "colour"
	| "gradient"
	| "shadow"
	| "easing"
	| "duration"
	| "scale"
	| "length"
	| "font";

export type Token = { name: string; light: string; dark?: string; kind: TokenKind };

export type TokenGroup = { id: string; title: string; note: string; tokens: Token[] };

// First match wins; anything unmatched still lands in "Other", so no variable goes unlisted.
const GROUPS: { id: string; title: string; note: string; match: RegExp }[] = [
	{
		id: "surfaces",
		title: "Surfaces",
		note: "Page, card, muted and segment climb in steps; popover floats on its edge ring.",
		match:
			/^--(background|foreground|card|popover|muted|secondary|accent|segment)(-foreground)?$/,
	},
	{
		id: "brand",
		title: "Brand and focus",
		note: "One accent: the action fill, its hover and the focus ring.",
		match: /^--(primary|primary-foreground|primary-hover|ring)$/,
	},
	{
		id: "status",
		title: "Status",
		note: "Fill, label and a -strong ink for text on the page.",
		match: /^--(destructive|success|warning|info)(-[a-z]+)?$/,
	},
	{
		id: "edges",
		title: "Edges and fields",
		note: "Hairlines, field fill and the off track of switches and sliders.",
		match: /^--(border|border-strong|input|field|track)$/,
	},
	{
		id: "charts",
		title: "Charts",
		note: "Series in a fixed order, a sequential scale and up/down colours.",
		match: /^--chart-/,
	},
	{
		id: "effects",
		title: "Effects",
		note: "Opt-in: glass, brand gradients and two highlight hues.",
		match: /^--(neon|violet|glass-[a-z]+|gradient-[a-z]+)$/,
	},
	{
		id: "elevation",
		title: "Elevation",
		note: "Token shadows only; an overlay's edge is its shadow ring.",
		match: /-shadow$/,
	},
	{
		id: "shape",
		title: "Shape and type",
		note: "One radius knob and four font stacks.",
		match: /^--(radius|font-[a-z]+)$/,
	},
	{
		id: "easing",
		title: "Easing",
		note: "Strong curves and sampled springs; no built-in CSS easing.",
		match: /^--ease-/,
	},
	{
		id: "duration",
		title: "Duration",
		note: "Four speeds, named again by role.",
		match: /^--(duration-[a-z-]+|stagger-step)$/,
	},
	{
		id: "scale",
		title: "Press and enter",
		note: "Scale and lift for press, hover and overlay entrances.",
		match: /^--([a-z-]+-scale(-[a-z]+)?|enter-lift)$/,
	},
];

function kindOf(name: string, value: string): TokenKind {
	if (name.endsWith("-shadow")) return "shadow";
	if (name.startsWith("--ease-")) return "easing";
	if (/^--(duration|stagger)/.test(name)) return "duration";
	if (name.startsWith("--font-")) return "font";
	if (value.includes("gradient(")) return "gradient";
	if (/^--(press|hover|enter|popover|modal)-[a-z-]*scale/.test(name)) return "scale";
	if (name === "--radius" || name === "--enter-lift") return "length";
	return "colour";
}

/** Declarations of every column-0 rule whose selector is in `selectors`, in source order. */
function blocks(css: string, selectors: string[]): Record<string, string> {
	const out: Record<string, string> = {};
	const rule = /^([^\s@/}][^{]*)\{([\s\S]*?)^\}/gm;
	for (const [, head = "", body = ""] of css.matchAll(rule)) {
		const parts = head.split(",").map((s) => s.trim());
		if (!parts.every((p) => selectors.includes(p))) continue;
		const clean = body.replace(/\/\*[\s\S]*?\*\//g, "");
		for (const [, name = "", value = ""] of clean.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
			out[name] ??= value.replace(/\s+/g, " ").trim();
	}
	return out;
}

/** Every variable the theme declares, grouped by job. Values are the source text per mode. */
export function tokenGroups(tokensCss: string, motionCss: string): TokenGroup[] {
	const light = { ...blocks(tokensCss, [":root"]), ...blocks(motionCss, [":root"]) };
	const dark = blocks(tokensCss, [".dark"]);
	const shared = blocks(tokensCss, [":root", ".dark"]);
	const all = { ...light, ...shared };
	const groups = GROUPS.map((g) => ({ ...g, tokens: [] as Token[] }));
	const other: TokenGroup = {
		id: "other",
		title: "Other",
		note: "Declared but not yet filed.",
		tokens: [],
	};
	for (const [name, value] of Object.entries(all)) {
		const token = { name, light: value, dark: dark[name], kind: kindOf(name, value) };
		(groups.find((g) => g.match.test(name)) ?? other).tokens.push(token);
	}
	return [...groups, other]
		.filter((g) => g.tokens.length)
		.map(({ id, title, note, tokens }) => ({ id, title, note, tokens }));
}
