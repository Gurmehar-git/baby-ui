import { defineComponent } from "../index.ts";

const VARIANTS = ["default", "rounded", "glow"];
const TONES = ["spectrum", "cool", "warm", "mono"];
const POSITIONS = ["absolute", "fixed"];

export const pixelCanvas = defineComponent({
	slug: "pixel-canvas",
	name: "Pixel Canvas",
	description:
		"A full-bleed pixel grid that lights up in token colours around the pointer and fades behind it.",
	category: "backgrounds",
	status: "stable",
	variants: { variant: VARIANTS, tone: TONES, position: POSITIONS },
	props: [
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Square cells, rounded cells, or square cells with a soft halo.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Which theme tokens the lit cells cycle through.",
			default: "spectrum",
			control: { kind: "select", options: TONES },
		},
		{
			name: "gap",
			type: "number",
			description: "Cell pitch in CSS px, including the 1px gutter.",
			default: 8,
			control: { kind: "number", min: 4, max: 24, step: 1 },
		},
		{
			name: "decay",
			type: "number",
			description: "Fade rate per frame once the pointer moves on, 0 to 1.",
			default: 0.04,
			control: { kind: "number", min: 0.01, max: 0.3, step: 0.01 },
		},
		{
			name: "radius",
			type: "number",
			description: "Pointer influence radius, in px.",
			default: 90,
			control: { kind: "number", min: 30, max: 240, step: 10 },
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
			description: "Rendered above the grid; the pointer still lights cells through it.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Cells light and clear instantly with the pointer, with no fading trail.",
		behaviour: [
			"Cells inside the pointer radius light up quickly and fade at `decay` once it moves on.",
			"The loop runs only while some cell is still changing; it stops when the grid settles, offscreen or in a hidden tab.",
			"The faint base grid is drawn once per resize or theme change; colours come from theme tokens.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The canvas is aria-hidden and purely decorative; children stay in the normal reading order.",
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
			entry: "PixelCanvas",
			files: [
				{ path: "pixel-canvas/pixel-canvas.tsx", type: "registry:ui" },
				{ path: "pixel-canvas/pixels.ts", type: "registry:ui" },
				{ path: "pixel-canvas/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
				{ path: "lib/surface.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "PixelCanvas",
			files: [
				{ path: "pixel-canvas/pixel-canvas.svelte", type: "registry:ui" },
				{ path: "pixel-canvas/pixels.ts", type: "registry:ui" },
				{ path: "pixel-canvas/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
				{ path: "lib/surface.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["background", "pixel", "grid", "cursor", "trail", "canvas"],
});
