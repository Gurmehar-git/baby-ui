import { defineComponent } from "@baby-ui/registry-schema";

export const heroStage = defineComponent({
	slug: "hero-stage",
	name: "Hero Stage",
	description:
		"A tilted stage of cards that start scattered over dashed slots and settle into place as the page scrolls.",
	category: "blocks",
	status: "stable",
	props: [
		{
			name: "motion",
			type: '"scroll" | "enter" | "none"',
			description:
				"`scroll` tilts the stage and scatters each slot, settling both over the first half screen of scroll. `enter` only fades the stage and slots in. `none` is static.",
			default: "scroll",
			control: { kind: "select", options: ["scroll", "enter", "none"] },
		},
		{
			name: "index",
			type: "number",
			description:
				"On HeroStageSlot: entrance order; each step delays the slot by 110ms.",
			default: 0,
			control: { kind: "none" },
		},
		{
			name: "x",
			type: "number",
			description:
				"On HeroStageSlot: scattered horizontal offset in px before scroll settles it.",
			default: 0,
			control: { kind: "none" },
		},
		{
			name: "y",
			type: "number",
			description: "On HeroStageSlot: scattered vertical offset in px.",
			default: 0,
			control: { kind: "none" },
		},
		{
			name: "rotate",
			type: "number",
			description: "On HeroStageSlot: scattered tilt in degrees.",
			default: 0,
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "No entrance, tilt or scatter: the stage renders settled and still.",
		behaviour: [
			"The stage rises in over 900ms from 40px below with an 18deg forward tilt.",
			"Slots fade and scale up over 700ms, starting 250ms in and staggered 110ms apart by `index`.",
			"With `scroll`, the page's first 55vh of scroll untilts the stage and the first 45vh moves each card from its scattered offset onto its slot, dropping the lifted shadow.",
			"Browsers without scroll-driven animations show the settled layout after the entrance.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Reaches whatever interactive content the slots hold" },
		],
		notes: [
			"A plain container: slots add no roles. Mark the stage aria-hidden when its cards are decorative.",
			"Scroll-linked motion is driven by the root scroller, so place the stage near the top of the page.",
		],
	},
	impl: {
		react: {
			entry: "HeroStage",
			files: [
				{ path: "hero-stage/hero-stage.tsx", type: "registry:ui" },
				{ path: "hero-stage/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "HeroStage",
			files: [
				{ path: "hero-stage/hero-stage.svelte", type: "registry:ui" },
				{ path: "hero-stage/hero-stage-slot.svelte", type: "registry:ui" },
				{ path: "hero-stage/context.ts", type: "registry:ui" },
				{ path: "hero-stage/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["hero", "landing", "scroll", "parallax", "dashboard", "marketing", "stage"],
});
