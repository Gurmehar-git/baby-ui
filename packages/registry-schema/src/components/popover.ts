import { defineComponent } from "../index.ts";

export const popover = defineComponent({
	slug: "popover",
	isNew: true,
	name: "Popover",
	description:
		"Anchored panel that flips and shifts to stay on screen, dismissed by Escape or an outside click.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "side",
			type: '"top" | "right" | "bottom" | "left"',
			description: "Preferred side. Flips automatically when there is not room.",
			default: "bottom",
			control: {
				kind: "select",
				options: ["top", "right", "bottom", "left"],
			},
		},
		{
			name: "sideOffset",
			type: "number",
			description: "Distance from the anchor, in pixels.",
			default: 4,
			control: { kind: "number", min: 0, max: 24, step: 1 },
		},
		{
			name: "align",
			type: '"start" | "center" | "end"',
			description: "Alignment along the side.",
			default: "center",
			control: { kind: "select", options: ["start", "center", "end"] },
		},
		{
			name: "alignOffset",
			type: "number",
			description: "Offsets the alignment from its default position, in pixels.",
			default: 0,
			control: { kind: "number", min: -24, max: 24, step: 1 },
		},
		{
			name: "open",
			type: "boolean",
			description: "Controlled open state. Bindable.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The panel appears without the scale; positioning is unchanged.",
		behaviour: [
			"Opens anchored to the trigger and flips to the opposite side when there is no room (Base UI/bits-ui popper collision detection).",
			"transform-origin follows the side the positioner settles on, so it always grows out of the trigger rather than from a fixed corner.",
			"Position is recalculated on scroll and resize; the primitive tears this down when the popover closes.",
		],
	},
	a11y: {
		role: "dialog",
		keyboard: [
			{ keys: ["Escape"], action: "Closes the popover and returns focus to the trigger" },
		],
		notes: [
			"The trigger carries aria-expanded and aria-controls, so the relationship is announced.",
			"Positioning, dismiss-on-outside-click, focus return and portaling are all delegated to Base UI (React) and bits-ui (Svelte); this component only owns the classes and data-slots.",
			"Part names and data-slot values match shadcn/ui, so this replaces an existing popover without touching call sites.",
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
			entry: "Popover",
			files: [
				{ path: "popover/popover.tsx", type: "registry:ui" },
				{ path: "popover/variants.ts", type: "registry:ui" },
				{ path: "lib/anchor.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["tailwind-variants", "clsx", "tailwind-merge", "@base-ui/react"],
		},
		svelte: {
			entry: "Popover",
			files: [
				{ path: "popover/popover.svelte", type: "registry:ui" },
				{ path: "popover/popover-trigger.svelte", type: "registry:ui" },
				{ path: "popover/popover-content.svelte", type: "registry:ui" },
				{ path: "popover/variants.ts", type: "registry:ui" },
				{ path: "lib/anchor.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["tailwind-variants", "clsx", "tailwind-merge", "bits-ui"],
		},
	},
	keywords: ["popover", "overlay"],
});
