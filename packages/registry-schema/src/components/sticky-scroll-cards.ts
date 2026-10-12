import { defineComponent } from "../index.ts";

const SIZES = ["sm", "md", "lg", "auto"];
const VARIANTS = ["polaroid", "plain"];

export const stickyScrollCards = defineComponent({
	slug: "sticky-scroll-cards",
	name: "Sticky Scroll Cards",
	description:
		"Photo cards that pin as they scroll in and shrink back into a tilted stack as later ones land.",
	category: "animated",
	status: "stable",
	variants: { size: SIZES, variant: VARIANTS },
	props: [
		{
			name: "cards",
			type: "{ title: string; src: string; alt?: string }[]",
			description: "The cards, in stacking order.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "A framed print with a caption strip, or a full-bleed photo.",
			default: "polaroid",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description:
				"Height of its own scroll box; `auto` rides the nearest scrolling ancestor.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "tilt",
			type: "number",
			description: "Multiplier on each card's resting tilt; 0 keeps them straight.",
			default: 1,
			control: { kind: "number", min: 0, max: 4, step: 0.5 },
		},
		{
			name: "hint",
			type: "string",
			description: "Hint above the stack; empty hides it.",
			default: "Scroll to explore",
			control: { kind: "text" },
		},
		{
			name: "label",
			type: "string",
			description: "Accessible name of the stack.",
			default: "Photo stack",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Cards pin straight and keep full size.",
		behaviour: [
			"Every card sticks to the top of the scroll box; later cards land on top.",
			"Each card scales from 1 down to its resting size between its own start point and the end of the stack, so earlier cards shrink the most.",
			"CSS view timeline on the stack with a per-card `animation-range`; without scroll timelines a rAF-throttled scroll listener scrubs the same paused keyframes.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Focuses the scroll box" },
			{ keys: ["Arrow keys", "Page Up", "Page Down"], action: "Scroll it" },
		],
		notes: ["A labelled region of figures with visible captions."],
	},
	licenseOrigin: {
		source: "componentry",
		url: "https://componentry.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "StickyScrollCards",
			files: [
				{ path: "sticky-scroll-cards/sticky-scroll-cards.tsx", type: "registry:ui" },
				{ path: "sticky-scroll-cards/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "StickyScrollCards",
			files: [
				{ path: "sticky-scroll-cards/sticky-scroll-cards.svelte", type: "registry:ui" },
				{ path: "sticky-scroll-cards/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["scroll", "sticky", "stack", "cards", "photos"],
});
