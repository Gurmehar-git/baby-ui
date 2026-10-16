import { defineComponent } from "@baby-ui/registry-schema";

const EFFECTS = [
	"wipe",
	"ripple",
	"parallax",
	"curtain",
	"diagonal",
	"morph",
	"strips",
	"slide",
];
const DIRECTIONS = [
	"top",
	"right",
	"bottom",
	"left",
	"top-left",
	"top-right",
	"bottom-right",
	"bottom-left",
	"center",
];
const union = (values: string[]) => values.map((v) => `"${v}"`).join(" | ");

export const hoverTransition = defineComponent({
	slug: "hover-transition",
	name: "Hover Transition",
	description:
		"A card that swaps its content for a second view on hover or focus, with eight reveal effects.",
	category: "animated",
	status: "stable",
	variants: { effect: EFFECTS, direction: DIRECTIONS },
	props: [
		{
			name: "children",
			type: "ReactNode | Snippet",
			description: "Resting content.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "hoverContent",
			type: "ReactNode | Snippet",
			description: "Content revealed on hover or keyboard focus.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "effect",
			type: union(EFFECTS),
			description: "How the hover content replaces the resting content.",
			default: "wipe",
			control: { kind: "select", options: EFFECTS },
		},
		{
			name: "direction",
			type: union(DIRECTIONS),
			description: "Where the reveal starts or which way it travels.",
			default: "right",
			control: { kind: "select", options: DIRECTIONS },
		},
		{
			name: "durationMs",
			type: "number",
			description: "Reveal duration. Ripple and diagonal run 1.25x longer.",
			default: 720,
			control: { kind: "number", min: 200, max: 2000, step: 20 },
		},
		{
			name: "tilt",
			type: "boolean",
			description: "Tilt a couple of degrees toward a mouse pointer.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "active",
			type: "boolean",
			description:
				"Whether the hover content is shown. Controlled with onActiveChange in React, bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "defaultActive",
			type: "boolean",
			description: "Initial state when uncontrolled (React).",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "onActiveChange",
			type: "(active: boolean) => void",
			description: "Fires when hover or focus enters or leaves.",
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description: "Accessible name of the focusable wrapper.",
			default: "Hover to reveal more",
			control: { kind: "text" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Content swaps instantly and the tilt is off.",
		behaviour: [
			"Every effect is a CSS transition on clip-path, transform, opacity, filter and radius; leaving plays it back in reverse.",
			"Parallax, curtain, diagonal and slide move the resting content too, drawn as its own layers.",
			"Curtain leaves retract away from the named edge or corner, nearer leaf first; center splits into four quadrants.",
			"Diagonal corners swing open on a hinge at the opposite corner; edges slide out named edge first; center splits into four triangles.",
			"Strips stagger eight slices over the first 15% of the duration, reversing order on exit; center lands them from the middle outward.",
			"The stage lifts 1.2% and tilts up to 2.4 degrees toward a mouse pointer.",
		],
	},
	a11y: {
		role: "group",
		keyboard: [],
		notes: [
			"Exactly one copy of the visible view is exposed: the resting content while idle, one hover copy while active.",
			"Every duplicate layer is aria-hidden and inert, so interactive hover content has a single tab stop.",
			"Focus reveals the hover content; blur restores the resting content.",
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
			entry: "HoverTransition",
			files: [
				{ path: "hover-transition/hover-transition.tsx", type: "registry:ui" },
				{ path: "hover-transition/effects.ts", type: "registry:ui" },
				{ path: "hover-transition/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "HoverTransition",
			files: [
				{ path: "hover-transition/hover-transition.svelte", type: "registry:ui" },
				{ path: "hover-transition/effects.ts", type: "registry:ui" },
				{ path: "hover-transition/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["hover", "reveal", "card", "wipe", "ripple", "transition", "swap"],
});
