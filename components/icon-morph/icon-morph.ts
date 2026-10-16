import { defineComponent } from "@baby-ui/registry-schema";

const SIZES = ["sm", "default", "lg"];
const NAMES = ["menu", "play", "plus", "copy", "theme", "chevron", "bell", "heart"];

const files = (main: string) => [
	{ path: `icon-morph/${main}`, type: "registry:ui" as const },
	{ path: "icon-morph/engine.ts", type: "registry:ui" as const },
	{ path: "icon-morph/icons.ts", type: "registry:ui" as const },
	{ path: "icon-morph/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

export const iconMorph = defineComponent({
	slug: "icon-morph",
	name: "Icon Morph",
	description:
		"Icons that morph between two looks instead of swapping: menu to close, play to pause, plus to check, sun to moon, a ringing bell and a bursting heart.",
	category: "animated",
	status: "stable",
	variants: { size: SIZES },
	props: [
		{
			name: "name",
			type: NAMES.map((v) => `"${v}"`).join(" | "),
			description: "Which icon.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "state",
			type: "boolean",
			description:
				"The second look: close, pause, check, check, moon, turned, on, liked. Drive it from the button's pressed state.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "16, 20 or 24px. Inside a Button, the button's size sets the icon's.",
			default: "default",
			control: { kind: "none" },
		},
		{
			name: "strokeWidth",
			type: "number",
			description: "Stroke width in the 24-unit grid.",
			default: 1.75,
			control: { kind: "number", min: 1, max: 3, step: 0.25 },
		},
		{
			name: "turn",
			type: "number",
			description:
				"Chevron only: degrees it turns when on. 180 flips down to up; 90 turns right to down.",
			default: 180,
			control: { kind: "none" },
		},
		{
			name: "pointing",
			type: '"down" | "right"',
			description: "Chevron only: where it points at rest.",
			default: "down",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Icons jump to the new look; the ring, pop and burst are skipped.",
		behaviour: [
			"Every part rides one interruptible spring, so toggling quickly reverses from wherever the icon is.",
			"Shapes interpolate their outlines point by point; lines rotate and slide into place.",
			"The bell rings from its top with the clapper lagging; the heart pops and bursts a ring of sparks once per like.",
			"A liked heart takes `--icon-morph-like`, falling back to the destructive red.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Decorative: the SVG is aria-hidden. Put it in a button that carries the accessible name and aria-pressed (or swaps its label).",
		],
	},
	guidance: {
		when: [
			"Two-state controls whose icon should explain the change: menu toggles, play buttons, copy confirmations, likes, theme switches.",
		],
		whenNot: [
			{ text: "Static icons that never change.", use: "button" },
			{ text: "A full theme switch with its own button and menu.", use: "theme-toggle" },
		],
		responsive: ["Sized in px by `size`; inherits colour from the text around it."],
		performance: [
			"One requestAnimationFrame loop per icon, only while a part is moving.",
		],
		ai: [
			"Wrap the icon in a button with `aria-pressed` and an accessible name; the icon itself says nothing to assistive tech.",
			"Bind `state` to the same value as the button's pressed state so they never disagree.",
		],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "IconMorph",
			files: files("icon-morph.tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "IconMorph",
			files: files("icon-morph.svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["icon", "morph", "toggle", "menu", "play", "heart", "bell", "animated"],
});
