import { defineComponent } from "../index.ts";

const VARIANTS = ["image", "flow", "glitch"];
const TONES = ["mono", "spectrum", "cool", "warm", "source"];
const DITHERS = ["none", "bayer", "floyd-steinberg"];
const FITS = ["cover", "contain"];
const POSITIONS = ["absolute", "fixed"];

export const asciiEffect = defineComponent({
	slug: "ascii-effect",
	name: "ASCII Effect",
	description:
		"A full-bleed canvas that redraws an image as ASCII glyphs in the element's own font.",
	category: "backgrounds",
	status: "stable",
	variants: {
		variant: VARIANTS,
		tone: TONES,
		dither: DITHERS,
		fit: FITS,
		position: POSITIONS,
	},
	props: [
		{
			name: "src",
			type: "string",
			description:
				"Image URL; must be same-origin or served with CORS so its pixels can be read.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "alt",
			type: "string",
			description: "Describes the image; omit when the effect is purely decorative.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"`image` is still, `flow` drifts and ripples under the pointer, `glitch` tears rows.",
			default: "image",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description:
				"Token colour ramp by brightness, or `source` for the image's own colours.",
			default: "mono",
			control: { kind: "select", options: TONES },
		},
		{
			name: "dither",
			type: DITHERS.map((v) => `"${v}"`).join(" | "),
			description: "How brightness is quantised onto the glyph ramp.",
			default: "floyd-steinberg",
			control: { kind: "select", options: DITHERS },
		},
		{
			name: "fit",
			type: FITS.map((v) => `"${v}"`).join(" | "),
			description: "Crop to fill, or letterbox the whole image.",
			default: "cover",
			control: { kind: "select", options: FITS },
		},
		{
			name: "chars",
			type: "string",
			description: "Glyph ramp from sparse to dense.",
			default: " .:-=+*#%@",
			control: { kind: "text" },
		},
		{
			name: "fontSize",
			type: "number",
			description: "Glyph size in px.",
			default: 10,
			control: { kind: "number", min: 6, max: 24, step: 1 },
		},
		{
			name: "contrast",
			type: "number",
			description: "Brightness contrast around mid grey.",
			default: 1.1,
			control: { kind: "number", min: 0.5, max: 3, step: 0.1 },
		},
		{
			name: "brightness",
			type: "number",
			description: "Brightness multiplier before quantising.",
			default: 1.2,
			control: { kind: "number", min: 0.5, max: 3, step: 0.1 },
		},
		{
			name: "invert",
			type: "boolean",
			description: "Flip the brightness mapping.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "speed",
			type: "number",
			description: "Flow drift or glitch frequency multiplier; 0 holds a still frame.",
			default: 1,
			control: { kind: "number", min: 0, max: 4, step: 0.25 },
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
			description: "Rendered above the glyphs.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A still frame of the image is drawn; flow and glitch do not animate.",
		behaviour: [
			"The image is sampled to one pixel per glyph cell once per resize, option or theme change, then dithered onto the glyph ramp.",
			"`image` draws once; `flow` loops only while visible; `glitch` redraws only when a band tears or heals.",
			"On a light surface the mapping flips so bright areas read as empty paper; glyph colours come from theme tokens.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"With `alt` the canvas is an img with that label; without it the canvas is aria-hidden.",
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
			entry: "AsciiEffect",
			files: [
				{ path: "ascii-effect/ascii-effect.tsx", type: "registry:ui" },
				{ path: "ascii-effect/ascii.ts", type: "registry:ui" },
				{ path: "ascii-effect/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
				{ path: "lib/surface.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "AsciiEffect",
			files: [
				{ path: "ascii-effect/ascii-effect.svelte", type: "registry:ui" },
				{ path: "ascii-effect/ascii.ts", type: "registry:ui" },
				{ path: "ascii-effect/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
				{ path: "lib/surface.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["background", "ascii", "image", "glyphs", "dither", "canvas"],
});
