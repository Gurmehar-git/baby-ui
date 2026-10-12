import { defineComponent } from "../index.ts";

const TONES = ["spectrum", "cool", "warm", "mono"];
const MATRICES = ["bayer2", "bayer4", "bayer8"];
const POSITIONS = ["absolute", "fixed"];

export const ditherGradient = defineComponent({
	slug: "dither-gradient",
	name: "Dither Gradient",
	description:
		"A full-bleed token-coloured gradient drawn with ordered Bayer dithering on a canvas.",
	category: "backgrounds",
	status: "stable",
	variants: { tone: TONES, matrix: MATRICES, position: POSITIONS },
	props: [
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description:
				"Which theme tokens make up the ramp; it always starts at the surface.",
			default: "spectrum",
			control: { kind: "select", options: TONES },
		},
		{
			name: "matrix",
			type: MATRICES.map((v) => `"${v}"`).join(" | "),
			description: "Bayer threshold matrix: larger means finer, less banded patterns.",
			default: "bayer4",
			control: { kind: "select", options: MATRICES },
		},
		{
			name: "angle",
			type: "number",
			description: "Gradient direction in degrees.",
			default: 45,
			control: { kind: "number", min: 0, max: 360, step: 15 },
		},
		{
			name: "speed",
			type: "number",
			description: "Drift speed multiplier; 0 holds a still frame.",
			default: 1,
			control: { kind: "number", min: 0, max: 4, step: 0.25 },
		},
		{
			name: "pixelSize",
			type: "number",
			description: "Size of one dither cell, in CSS px.",
			default: 3,
			control: { kind: "number", min: 1, max: 12, step: 1 },
		},
		{
			name: "position",
			type: POSITIONS.map((v) => `"${v}"`).join(" | "),
			description:
				"`absolute` fills the nearest positioned parent; `fixed` fills the viewport.",
			default: "absolute",
			control: { kind: "none" },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description: "Rendered above the gradient.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "One still frame is drawn.",
		behaviour: [
			"Each cell picks one of two neighbouring ramp colours against a Bayer threshold, drawn at cell resolution and scaled up unsmoothed.",
			"The gradient offset and a soft wave drift over time; the loop pauses offscreen, in a hidden tab and at speed 0.",
			"Ramp colours are read from theme tokens and resampled on resize and theme change.",
		],
	},
	a11y: {
		keyboard: [],
		notes: ["The canvas is aria-hidden; children stay in the normal reading order."],
	},
	licenseOrigin: {
		source: "componentry",
		url: "https://componentry.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "DitherGradient",
			files: [
				{ path: "dither-gradient/dither-gradient.tsx", type: "registry:ui" },
				{ path: "dither-gradient/dither.ts", type: "registry:ui" },
				{ path: "dither-gradient/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "DitherGradient",
			files: [
				{ path: "dither-gradient/dither-gradient.svelte", type: "registry:ui" },
				{ path: "dither-gradient/dither.ts", type: "registry:ui" },
				{ path: "dither-gradient/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["background", "gradient", "dither", "bayer", "retro", "canvas"],
});
