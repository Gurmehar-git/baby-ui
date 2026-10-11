import { defineComponent } from "../index.ts";

export const hoverCard = defineComponent({
	slug: "hover-card",
	name: "Hover Card",
	description:
		"Rich preview that opens on hover with a delay and survives the trip to its own surface.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "side",
			type: '"top" | "right" | "bottom" | "left"',
			description:
				"HoverCardContent: preferred side. Flips automatically when there is not room.",
			default: "bottom",
			control: {
				kind: "select",
				options: ["top", "right", "bottom", "left"],
			},
		},
		{
			name: "openDelay",
			type: "number",
			description: "Milliseconds before opening.",
			default: 300,
			control: { kind: "number", min: 0, max: 1000, step: 50 },
		},
		{
			name: "closeDelay",
			type: "number",
			description: "Grace period before closing, so the pointer can reach the card.",
			default: 150,
			control: { kind: "number", min: 0, max: 600, step: 25 },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The card appears without the scale.",
		behaviour: [
			"A close delay keeps the card open while the pointer crosses the gap to it, which is the difference between a usable hover card and a flickering one.",
			"Hovering the card itself cancels the pending close.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Hover-only content is supplementary by definition; never put the only copy of something in here.",
			"The card is aria-describedby the trigger and opens on focus as well as hover.",
			"Positioning, hover-intent timing and portaling are delegated to Base UI's preview-card (React) and bits-ui's link-preview (Svelte); this component only owns the classes and data-slots.",
			"Focusing the trigger opens the card.",
		],
	},
	licenseOrigin: {
		source: "sivir-ui",
		url: "https://github.com/aidan-neel/sivir-ui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Aidan Neel",
	},
	impl: {
		react: {
			entry: "HoverCard",
			files: [
				{ path: "hover-card/hover-card.tsx", type: "registry:ui" },
				{ path: "lib/anchor.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["tailwind-variants", "clsx", "tailwind-merge", "@base-ui/react"],
		},
		svelte: {
			entry: "HoverCard",
			files: [
				{ path: "hover-card/hover-card.svelte", type: "registry:ui" },
				{ path: "hover-card/hover-card-trigger.svelte", type: "registry:ui" },
				{ path: "hover-card/hover-card-content.svelte", type: "registry:ui" },
				{ path: "lib/anchor.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["tailwind-variants", "clsx", "tailwind-merge", "bits-ui"],
		},
	},
	keywords: ["hover", "card", "overlay"],
});
