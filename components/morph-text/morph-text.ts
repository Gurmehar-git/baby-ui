import { defineComponent } from "@baby-ui/registry-schema";

const SIZES = ["inherit", "sm", "md", "lg"];

export const morphText = defineComponent({
	slug: "morph-text",
	name: "Morph Text",
	description:
		"Display words that melt into one another through a blur and goo threshold.",
	category: "text",
	status: "stable",
	variants: { size: SIZES },
	props: [
		{
			name: "words",
			type: "string[]",
			description: "The words to morph between.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "index",
			type: "number",
			description: "Controlled: which word is showing. Omit to let the component cycle.",
			control: { kind: "none" },
		},
		{
			name: "defaultIndex",
			type: "number",
			description: "Uncontrolled starting index.",
			default: 0,
			control: { kind: "number", min: 0, max: 10, step: 1 },
		},
		{
			name: "onIndexChange",
			type: "(index: number) => void",
			description: "Fired every time the shown word changes.",
			control: { kind: "none" },
		},
		{
			name: "intervalMs",
			type: "number",
			description: "Time each word stays. Only runs while uncontrolled.",
			default: 3000,
			control: { kind: "number", min: 1200, max: 6000, step: 100 },
		},
		{
			name: "subtext",
			type: "string",
			description: "Line under the word, fading up once after a second.",
			control: { kind: "text" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Type scale; inherit takes the surrounding text size.",
			default: "inherit",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Words crossfade without blur or scale.",
		behaviour: [
			"The incoming word grows from 0.8 out of a 20px blur while the outgoing one grows to 1.2 into it, both 900ms on cubic-bezier(0.42, 0, 0.58, 1).",
			"A colour-matrix threshold filter fuses the overlapping blurs into one liquid shape.",
			"The subtext fades up 20px over 1s, starting 1s in.",
		],
	},
	licenseOrigin: {
		source: "iconiq",
		url: "https://iconiqui.com",
		license: "MIT",
		copyright: "Copyright (c) 2024-2026 Edwin Vakayil",
	},
	impl: {
		react: {
			entry: "MorphText",
			files: [
				{ path: "morph-text/morph-text.tsx", type: "registry:ui" },
				{ path: "morph-text/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "MorphText",
			files: [
				{ path: "morph-text/morph-text.svelte", type: "registry:ui" },
				{ path: "morph-text/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["morph", "blur", "goo", "headline", "words"],
});
