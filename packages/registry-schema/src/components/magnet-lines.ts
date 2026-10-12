import { defineComponent } from "../index.ts";

const SIZES = ["sm", "md", "lg"];
const TONES = ["muted", "foreground", "primary", "chart"];
const union = (values: string[]) => values.map((v) => `"${v}"`).join(" | ");

export const magnetLines = defineComponent({
	slug: "magnet-lines",
	name: "Magnet Lines",
	description: "A grid of short lines that turn to face the pointer.",
	category: "animated",
	status: "stable",
	demo: { mode: "auto", frame: "none" },
	variants: { size: SIZES, tone: TONES },
	props: [
		{
			name: "rows",
			type: "number",
			description: "Rows of lines.",
			default: 9,
			control: { kind: "number", min: 2, max: 16, step: 1 },
		},
		{
			name: "columns",
			type: "number",
			description: "Columns of lines.",
			default: 9,
			control: { kind: "number", min: 2, max: 16, step: 1 },
		},
		{
			name: "size",
			type: union(SIZES),
			description: "Grid size and line length.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "tone",
			type: union(TONES),
			description: "Line colour token.",
			default: "muted",
			control: { kind: "select", options: TONES },
		},
		{
			name: "baseAngle",
			type: "number",
			description: "Degrees added to every line's pointer angle; also the resting angle.",
			default: 0,
			control: { kind: "number", min: -180, max: 180, step: 15 },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Lines stay at the resting angle.",
		behaviour: [
			"Pointer moves write one angle variable per line, rAF-throttled; a CSS rotate transition eases it.",
			"Each line takes the shortest turn modulo 180 degrees, so it never spins around.",
			"Nothing is computed while the grid is off screen.",
		],
	},
	a11y: {
		keyboard: [],
		notes: ["Purely decorative: the grid is aria-hidden."],
	},
	licenseOrigin: {
		source: "componentry",
		url: "https://componentry.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "MagnetLines",
			files: [
				{ path: "magnet-lines/magnet-lines.tsx", type: "registry:ui" },
				{ path: "magnet-lines/magnet.ts", type: "registry:ui" },
				{ path: "magnet-lines/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "MagnetLines",
			files: [
				{ path: "magnet-lines/magnet-lines.svelte", type: "registry:ui" },
				{ path: "magnet-lines/magnet.ts", type: "registry:ui" },
				{ path: "magnet-lines/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["pointer", "grid", "lines", "magnet", "cursor", "follow"],
});
