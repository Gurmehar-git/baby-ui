import { defineComponent } from "../index.ts";

const VARIANTS = ["fade", "shrink"];
const SIZES = ["sm", "md", "lg"];

export const pixelImageTrail = defineComponent({
	slug: "pixel-image-trail",
	name: "Pixel Image Trail",
	description:
		"A hidden image revealed in square fragments that trail the pointer and fade away.",
	category: "animated",
	status: "stable",
	variants: { variant: VARIANTS, size: SIZES },
	props: [
		{
			name: "src",
			type: "string",
			description: "Image revealed square by square under the pointer.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "alt",
			type: "string",
			description: "Accessible description of the image.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Trail squares fade out, or shrink to their centre.",
			default: "fade",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Height of the area.",
			default: "md",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "pixelSize",
			type: "number",
			description: "Edge of one square, in px (at least 12).",
			default: 36,
			control: { kind: "number", min: 12, max: 80, step: 4 },
		},
		{
			name: "fadeDuration",
			type: "number",
			description: "Time in ms before a trail square has fully faded.",
			default: 900,
			control: { kind: "number", min: 200, max: 3000, step: 100 },
		},
		{
			name: "maxPixels",
			type: "number",
			description: "Most trail squares kept at once; the oldest drop first.",
			default: 84,
			control: { kind: "number", min: 4, max: 200, step: 4 },
		},
		{
			name: "initialPixels",
			type: "number",
			description: "Dimmed fragments shown before any interaction.",
			default: 24,
			control: { kind: "number", min: 0, max: 80, step: 4 },
		},
		{
			name: "radius",
			type: "number",
			description:
				"Reveal reach in px: squares whose centre lies within it show. 0 reveals only the square under the pointer.",
			default: 40,
			control: { kind: "number", min: 0, max: 200, step: 10 },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"No trail and no fading: only the squares under the pointer show, and they clear on leave.",
		behaviour: [
			"The pointer's grid cell and every cell whose centre lies within `radius` reveal the image at full strength; occasional satellites land just past it.",
			"Cells crossed between two moves are filled in, then fade over `fadeDuration` (or shrink, per `variant`).",
			"The frame loop runs only while trail squares are fading, and stops while the pointer rests or the tab is hidden.",
			"Keyboard focus inside the area reveals its centre; touch drives it through pointer events.",
		],
	},
	a11y: {
		role: "group",
		keyboard: [
			{
				keys: ["Tab"],
				action: "Focuses the area and reveals its centre; blur clears it",
			},
		],
		notes: ["The canvas is aria-hidden; the focusable group is labelled by `alt`."],
	},
	licenseOrigin: {
		source: "componentry",
		url: "https://componentry.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "PixelImageTrail",
			files: [
				{ path: "pixel-image-trail/pixel-image-trail.tsx", type: "registry:ui" },
				{ path: "pixel-image-trail/pixel-trail.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "PixelImageTrail",
			files: [
				{ path: "pixel-image-trail/pixel-image-trail.svelte", type: "registry:ui" },
				{ path: "pixel-image-trail/pixel-trail.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["image", "pixel", "trail", "reveal", "canvas", "cursor", "interactive"],
});
