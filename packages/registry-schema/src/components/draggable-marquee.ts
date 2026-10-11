import { defineComponent } from "../index.ts";

export const draggableMarquee = defineComponent({
	slug: "draggable-marquee",
	isNew: true,
	name: "Draggable Marquee",
	description:
		"An endless drifting row you can grab and throw; it coasts with inertia, then drifts on.",
	category: "advanced",
	status: "stable",
	variants: { gap: ["sm", "md", "lg"], direction: ["left", "right"] },
	props: [
		{
			name: "children",
			type: "ReactNode | Snippet",
			description: "One set of items; it repeats as often as the width needs.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "speed",
			type: "number",
			description: "Drift in px per frame; 0 holds still until dragged.",
			default: 1,
			control: { kind: "number", min: 0, max: 4, step: 0.25 },
		},
		{
			name: "direction",
			type: '"left" | "right"',
			description: "Drift direction.",
			default: "left",
			control: { kind: "select", options: ["left", "right"] },
		},
		{
			name: "gap",
			type: '"sm" | "md" | "lg"',
			description: "Space between items: 12, 24 or 40px.",
			default: "md",
			control: { kind: "select", options: ["sm", "md", "lg"] },
		},
		{
			name: "pauseOnHover",
			type: "boolean",
			description: "Stop drifting while the pointer is over it.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "friction",
			type: "number",
			description: "Share of a throw's velocity kept each frame, 0 to 1.",
			default: 0.975,
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description: "Accessible name of the region.",
			default: "Scrolling gallery. Drag, or use the left and right arrow keys.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"No drift and no throw: it moves only while dragged or with the arrow keys.",
		behaviour: [
			"Drag follows the pointer 1:1; releasing throws it at the release velocity (capped at 60px per frame), decaying by `friction` each frame.",
			"Holding still for 80ms before release drops the throw, so a careful drag stops where you leave it.",
			"A drag past 4px swallows the click it ends with, so links and buttons inside only fire on a real click.",
			"It repeats the set as often as the width needs, re-measuring on resize, and stops working while offscreen.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Focuses the marquee" },
			{ keys: ["Arrow Left", "Arrow Right"], action: "Moves it by a third of its width" },
		],
		notes: [
			'A labelled region with aria-roledescription="marquee"; the repeated copies are aria-hidden and inert.',
			"Vertical touch scrolling passes through (touch-action: pan-y).",
		],
	},
	impl: {
		react: {
			entry: "DraggableMarquee",
			files: [
				{ path: "draggable-marquee/draggable-marquee.tsx", type: "registry:ui" },
				{ path: "draggable-marquee/marquee.ts", type: "registry:ui" },
				{ path: "draggable-marquee/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "DraggableMarquee",
			files: [
				{ path: "draggable-marquee/draggable-marquee.svelte", type: "registry:ui" },
				{ path: "draggable-marquee/marquee.ts", type: "registry:ui" },
				{ path: "draggable-marquee/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["marquee", "carousel", "drag", "inertia", "gallery", "infinite", "scroll"],
});
