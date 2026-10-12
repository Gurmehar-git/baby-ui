import { defineComponent } from "../index.ts";

export const textReel = defineComponent({
	slug: "text-reel",
	name: "Text Reel",
	description:
		"An endless reel of words, a vertical column or a horizontal marquee, that drifts, then speeds up and reverses with page scroll.",
	category: "text",
	status: "stable",
	variants: { orientation: ["vertical", "horizontal"], size: ["sm", "default", "lg"] },
	props: [
		{
			name: "orientation",
			type: '"vertical" | "horizontal"',
			description:
				"Vertical rolls a column like a slot reel; horizontal drifts one marquee band.",
			default: "vertical",
			control: { kind: "select", options: ["vertical", "horizontal"] },
		},
		{
			name: "items",
			type: "string[]",
			description: "Lines in the reel, repeated as often as the height needs.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "prefix",
			type: "string",
			description: "Small caption above the reel.",
			control: { kind: "text" },
		},
		{
			name: "speed",
			type: "number",
			description: "Drift in px per frame while the page is still.",
			default: 0.6,
			control: { kind: "number", min: 0.2, max: 3, step: 0.1 },
		},
		{
			name: "paused",
			type: "boolean",
			description: "Hold the reel where it is.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg"',
			description: "Type scale; the window shows about two lines of it.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg"] },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The reel stands still on its first lines, without the fade mask.",
		behaviour: [
			"Drifts down at `speed`; scrolling the page down reverses it upward and boosts it with the scroll delta, up to 12px per frame.",
			"120ms after scrolling stops, it eases back to `speed` in the last scroll direction.",
			"It stops working while offscreen, and the top and bottom fade through a mask.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Only the first copy of the items is exposed to assistive tech; the repeats are aria-hidden.",
			"Motion follows the OS reduced-motion setting live, without a reload.",
		],
	},
	impl: {
		react: {
			entry: "TextReel",
			files: [
				{ path: "text-reel/text-reel.tsx", type: "registry:ui" },
				{ path: "text-reel/reel.ts", type: "registry:ui" },
				{ path: "text-reel/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "TextReel",
			files: [
				{ path: "text-reel/text-reel.svelte", type: "registry:ui" },
				{ path: "text-reel/reel.ts", type: "registry:ui" },
				{ path: "text-reel/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["reel", "stream", "scroll", "velocity", "words", "loop", "text animation"],
});
