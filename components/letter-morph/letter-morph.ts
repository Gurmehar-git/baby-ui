import { defineComponent } from "@baby-ui/registry-schema";

const SIZES = ["inherit", "sm", "default", "lg"];
const VARIANTS = ["default", "mono"];

const files = (main: string) => [
	{ path: `letter-morph/${main}`, type: "registry:ui" as const },
	{ path: "letter-morph/letters.ts", type: "registry:ui" as const },
	{ path: "letter-morph/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

export const letterMorph = defineComponent({
	slug: "letter-morph",
	name: "Letter Morph",
	description:
		"Morphs one short label into the next in place: shared letters glide to their new spots, new ones sharpen in, removed ones blur away, and the width follows.",
	category: "text",
	status: "stable",
	variants: { variant: VARIANTS, size: SIZES },
	props: [
		{
			name: "text",
			type: "string",
			description: "The label; change it to morph.",
			required: true,
			control: { kind: "text" },
		},
		{
			name: "as",
			type: '"span" | "div" | "p" | "strong" | "h1" | "h2" | "h3"',
			description: "The element to render.",
			default: "span",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "The surrounding font, or monospace.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Inherit the text size, or a display step.",
			default: "inherit",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The label swaps in place.",
		behaviour: [
			"Letters both labels share glide to their new positions; they match by character and occurrence.",
			"New letters sharpen in with a small rise, staggered in reading order; removed letters blur away where they stood.",
			"The width springs to the new label behind a soft trailing mask, so the layout around it glides.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Assistive tech reads the plain label from a visually hidden span; the animated letters are aria-hidden.",
		],
	},
	guidance: {
		when: [
			"Status words that change a few letters at a time: Publish, Publishing, Published; Follow and Following.",
		],
		whenNot: [
			{ text: "Display words that should melt into each other.", use: "morph-text" },
			{ text: "Numbers and prices.", use: "slot-text" },
			{ text: "Long or multi-line text: it stays on one line.", use: "text-transition" },
		],
		responsive: [
			"Stays on one line and follows font loading and responsive sizes without animating.",
		],
		performance: ["Moves letters with CSS transitions; nothing runs between changes."],
		ai: [
			"Use it inside buttons and badges whose label changes with state; keep labels short.",
			"Change `text` only when the state changes, not on every render tick.",
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
			entry: "LetterMorph",
			files: files("letter-morph.tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "LetterMorph",
			files: files("letter-morph.svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["text", "morph", "label", "status", "letters", "text animation"],
});
