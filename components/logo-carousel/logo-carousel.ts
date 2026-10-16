import { defineComponent } from "@baby-ui/registry-schema";

const DIRECTIONS = ["ltr", "rtl"];
const VARIANTS = ["columns", "marquee"];
const TONES = ["color", "mono"];

export const logoCarousel = defineComponent({
	slug: "logo-carousel",
	name: "Logo Carousel",
	description:
		"Logos that cycle in staggered columns, or drift past in a draggable marquee strip with a pause control.",
	category: "blocks",
	status: "stable",
	variants: { variant: VARIANTS },
	props: [
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Cycle logos in place per column, or drift them past in one strip.",
			default: "columns",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "`mono` greys the logos until hovered.",
			default: "color",
			control: { kind: "select", options: TONES },
		},
		{
			name: "paused",
			type: "boolean",
			description:
				"Holds the motion still. Controlled with onPausedChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "pauseControl",
			type: "boolean",
			description:
				"A Pause / Play button under the logos; on by default for the marquee.",
			control: { kind: "none" },
		},
		{
			name: "children",
			type: "ReactNode",
			description:
				"Each child is one logo; distributed round-robin across `columnCount` columns.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "columnCount",
			type: "number",
			description: "How many columns to split the logos into.",
			default: 4,
			control: { kind: "number", min: 1, max: 8, step: 1 },
		},
		{
			name: "direction",
			type: DIRECTIONS.map((v) => `"${v}"`).join(" | "),
			description: "Which edge the per-column stagger counts from.",
			default: "ltr",
			control: { kind: "select", options: DIRECTIONS },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Each column shows its current logo with no slide, fade, or stagger.",
		behaviour: [
			"Every 1.6s, each column advances to its next logo: the outgoing logo slides up and fades out while the incoming one slides up and fades in from below, staggered 125ms per column.",
			"Paused while the carousel is scrolled out of view, the browser tab is hidden, or the page itself isn't visible, so it never animates unseen.",
			"The very first logo in each column appears instantly, with no entrance animation, only later cycles animate.",
			"Marquee: the strip drifts, holds under the pointer, can be dragged or thrown, and fades at both edges.",
		],
	},
	a11y: {
		notes: [
			"Purely decorative motion; the visible logo is the only one exposed at a time; hidden outgoing/incoming layers carry no separate accessible content.",
			"The Pause button (aria-pressed) stops motion that would otherwise run past five seconds.",
		],
	},
	impl: {
		react: {
			entry: "LogoCarousel",
			files: [
				{ path: "logo-carousel/logo-carousel.tsx", type: "registry:ui" },
				{ path: "logo-carousel/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["button", "draggable-marquee"],
		},
		svelte: {
			entry: "LogoCarousel",
			files: [
				{ path: "logo-carousel/logo-carousel.svelte", type: "registry:ui" },
				{ path: "logo-carousel/logo-column.svelte", type: "registry:ui" },
				{ path: "logo-carousel/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["button", "draggable-marquee"],
		},
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	keywords: ["logo", "carousel", "marquee", "cycle", "marketing", "social proof"],
});
