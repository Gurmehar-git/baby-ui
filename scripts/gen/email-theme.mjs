import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./core.mjs";

// Email clients support neither CSS variables nor oklch, so tokens become literal hex colours.
const TOKENS = [
	"background",
	"foreground",
	"card",
	"card-foreground",
	"muted",
	"muted-foreground",
	"border",
	"border-strong",
	"primary",
	"primary-foreground",
	"destructive",
	"destructive-foreground",
	"success",
	"warning",
	"info",
	"chart-1",
	"chart-2",
	"chart-3",
	"chart-4",
	"chart-5",
];

function block(css, selector) {
	const start = css.indexOf(`${selector} {`);
	if (start < 0) return {};
	const body = css.slice(start, css.indexOf("\n}", start));
	const out = {};
	for (const m of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim();
	return out;
}

function sharedBlock(css) {
	// Find rule where selector contains both :root and .dark (handles `:root,\n.dark` formatting).
	const match = css.match(/(?::root\s*,\s*\.dark|\.dark\s*,\s*:root)\s*\{([\s\S]*?)\n\}/);
	if (!match) return {};
	const out = {};
	for (const m of match[1].matchAll(/--([\w-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim();
	return out;
}

const toHex = (n) =>
	Math.round(Math.min(255, Math.max(0, n)))
		.toString(16)
		.padStart(2, "0");

/** sRGB 0-255 + alpha from an oklch(), rgb() or #hex value. */
function parse(value) {
	const hex = value.match(/^#([0-9a-f]{6})$/i);
	if (hex) {
		const v = Number.parseInt(hex[1], 16);
		return [(v >> 16) & 255, (v >> 8) & 255, v & 255, 1];
	}
	const rgb = value.match(
		/^rgb\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/,
	);
	if (rgb) return [+rgb[1], +rgb[2], +rgb[3], rgb[4] === undefined ? 1 : +rgb[4]];
	const ok = value.match(
		/^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/,
	);
	if (!ok) throw new Error(`email-theme: cannot convert "${value}"`);
	const l = +ok[1] / 100;
	const c = +ok[2];
	const h = (+ok[3] * Math.PI) / 180;
	const a = c * Math.cos(h);
	const b = c * Math.sin(h);
	const lp = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const mp = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const sp = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
	const linear = [
		4.0767416621 * lp - 3.3077115913 * mp + 0.2309699292 * sp,
		-1.2684380046 * lp + 2.6097574011 * mp - 0.3413193965 * sp,
		-0.0041960863 * lp - 0.7034186147 * mp + 1.707614701 * sp,
	];
	const gamma = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
	return [
		...linear.map((x) => gamma(Math.min(1, Math.max(0, x))) * 255),
		ok[4] === undefined ? 1 : +ok[4],
	];
}

/** Resolves var() chains, then flattens any alpha onto the palette's background. */
function palette(vars) {
	const resolve = (name, depth = 0) => {
		const raw = vars[name];
		if (!raw || depth > 8) throw new Error(`email-theme: --${name} is not defined`);
		const ref = raw.match(/^var\(--([\w-]+)\)$/);
		return ref ? resolve(ref[1], depth + 1) : raw;
	};
	const [br, bg, bb] = parse(resolve("background"));
	const out = {};
	for (const token of TOKENS) {
		const [r, g, b, a] = parse(resolve(token));
		out[token] =
			`#${toHex(r * a + br * (1 - a))}${toHex(g * a + bg * (1 - a))}${toHex(b * a + bb * (1 - a))}`;
	}
	// Soft fills for callouts and badges: email cannot mix colours at render time.
	const [lr, lg, lb] = parse(resolve("background"));
	for (const token of ["primary", "info", "success", "warning", "destructive"]) {
		const [r, g, b] = parse(resolve(token));
		const k = lr > 128 ? 0.1 : 0.18;
		out[`${token}-soft`] =
			`#${toHex(r * k + lr * (1 - k))}${toHex(g * k + lg * (1 - k))}${toHex(b * k + lb * (1 - k))}`;
	}
	return out;
}

/** Writes `lib/email-theme.ts` into both ports (a generated React file is not on disk yet). */
export function emailTheme(output) {
	const css = readFileSync(join(ROOT, "packages/tokens/src/tokens.css"), "utf8");
	const shared = sharedBlock(css);
	const root = { ...block(css, ":root"), ...shared };
	const light = palette(root);
	const dark = palette({ ...root, ...block(css, ".dark") });
	const colors = {
		...light,
		...Object.fromEntries(Object.entries(dark).map(([k, v]) => [`${k}-dark`, v])),
	};
	const body = [
		"/** Theme tokens resolved to hex: email clients support neither CSS variables nor oklch. */",
		`export const emailColors = ${JSON.stringify(colors, null, "\t")} as const;`,
		"",
		"/** Web fonts load in few inboxes, so the stack falls back to each platform's system face. */",
		"export const emailFonts = {",
		'\tsans: ["Inter", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],',
		'\tmono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Consolas", "monospace"],',
		"} as const;",
		"",
		"/** Tailwind theme for React Email's `<Tailwind config>` and Better Svelte Email's",
		" * `new Renderer({ tailwindConfig })`; `dark:` classes pair with the `-dark` colours. */",
		"export const emailTailwindConfig = {",
		"\ttheme: {",
		"\t\t// px, not Tailwind's rem default: several inboxes ignore rem in media queries.",
		'\t\tscreens: { sm: "480px" },',
		"\t\textend: {",
		"\t\t\tcolors: emailColors,",
		"\t\t\tfontFamily: emailFonts,",
		'\t\t\tborderRadius: { DEFAULT: "10px", sm: "6px", lg: "14px" },',
		"\t\t},",
		"\t},",
		"};",
		"",
	].join("\n");
	output.add(join(ROOT, "packages/ui-react/src/lib/email-theme.ts"), body);
	output.add(join(ROOT, "packages/ui-svelte/src/lib/lib/email-theme.ts"), body);
}
