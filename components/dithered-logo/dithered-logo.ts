import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["solid", "inverted"];
const TONES = ["foreground", "primary", "muted", "chart"];
const SIZES = ["sm", "md", "lg"];

export const ditheredLogo = defineComponent({
	slug: "dithered-logo",
	name: "Dithered Logo",
	description:
		"A logo dithered into a dot grid in token colours; dots shy from the pointer and ripple on click.",
	category: "backgrounds",
	status: "stable",
	demo: { mode: "auto", frame: "lg" },
	variants: { variant: VARIANTS, tone: TONES, size: SIZES },
	props: [
		{
			name: "src",
			type: "string",
			description:
				"Logo image URL, SVG or data URI. Remote images need CORS headers to be read.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "alt",
			type: "string",
			description: "Accessible name for the logo.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"`solid` dots the logo; `inverted` dots a plate and knocks the logo out.",
			default: "solid",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Theme token the dots are drawn in.",
			default: "foreground",
			control: { kind: "select", options: TONES },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Height of the box.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "gridSize",
			type: "number",
			description: "Dots across the longer side of the logo.",
			default: 96,
			control: { kind: "number", min: 24, max: 200, step: 4 },
		},
		{
			name: "scale",
			type: "number",
			description: "Share of the shorter box side the logo fills, 0 to 1.",
			default: 0.7,
			control: { kind: "number", min: 0.2, max: 1, step: 0.05 },
		},
		{
			name: "dotScale",
			type: "number",
			description: "Dot size relative to its grid cell.",
			default: 0.8,
			control: { kind: "number", min: 0.2, max: 1.5, step: 0.05 },
		},
		{
			name: "threshold",
			type: "number",
			description: "Ink level, 0 to 1, a cell needs to become a dot.",
			default: 0.5,
			control: { kind: "number", min: 0.05, max: 0.95, step: 0.05 },
		},
		{
			name: "blur",
			type: "number",
			description: "Edge softening before dithering, in grid cells.",
			default: 1.5,
			control: { kind: "number", min: 0, max: 6, step: 0.5 },
		},
		{
			name: "cornerRadius",
			type: "number",
			description: "Corner radius of the inverted plate, as a share of its shorter side.",
			default: 0.2,
			control: { kind: "number", min: 0, max: 0.5, step: 0.05 },
		},
		{
			name: "radius",
			type: "number",
			description: "Pointer influence radius, in px.",
			default: 100,
			control: { kind: "number", min: 20, max: 240, step: 10 },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static dot grid; the pointer and clicks move nothing.",
		behaviour: [
			"The image is rasterised at `gridSize`, softened by `blur` and dithered with serpentine Floyd-Steinberg error diffusion.",
			"Dots inside the pointer radius ease away and back; a click sends a ring outward.",
			"The loop stops once every dot settles, offscreen or in a hidden tab. Dots take the tone token and redraw on theme change.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			'The root is role="img" named by `alt`; the canvas is aria-hidden and the pointer effects are decorative.',
		],
	},
	licenseOrigin: {
		source: "componentry",
		url: "https://componentry.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "DitheredLogo",
			files: [
				{ path: "dithered-logo/dithered-logo.tsx", type: "registry:ui" },
				{ path: "dithered-logo/dither.ts", type: "registry:ui" },
				{ path: "dithered-logo/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "DitheredLogo",
			files: [
				{ path: "dithered-logo/dithered-logo.svelte", type: "registry:ui" },
				{ path: "dithered-logo/dither.ts", type: "registry:ui" },
				{ path: "dithered-logo/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["logo", "dither", "dots", "canvas", "halftone", "cursor", "ripple"],
});
