import { defineComponent } from "../index.ts";

const VARIANTS = ["default", "line"];

const files = (main: string) => [
	{ path: `signature-pad/${main}`, type: "registry:ui" as const },
	{ path: "signature-pad/ink.ts", type: "registry:ui" as const },
	{ path: "signature-pad/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

const deps = ["button", "toggle-group"];

export const signaturePad = defineComponent({
	slug: "signature-pad",
	name: "Signature Pad",
	description:
		"A signature field with real ink: width follows pen pressure or speed, ends taper, with undo, redo, a wiping clear and cropped PNG or SVG export.",
	category: "advanced",
	status: "stable",
	variants: { variant: VARIANTS },
	props: [
		{
			name: "value",
			type: "InkStroke[]",
			description:
				"The strokes; empty means unsigned. Controlled with onValueChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "A bordered pad, or only the baseline.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "signer",
			type: "string",
			description: "Printed under the line.",
			control: { kind: "none" },
		},
		{
			name: "hint",
			type: "string",
			description: "Rests on the baseline until the first stroke.",
			default: "Sign here",
			control: { kind: "none" },
		},
		{
			name: "downloadable",
			type: "boolean",
			description: "Adds a Download button that saves a cropped transparent PNG.",
			default: false,
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Clearing removes the ink at once.",
		behaviour: [
			"Ink follows the pointer with light streamlining; pen pressure or drawing speed sets the width.",
			"Clear wipes the ink away left to right before the strokes are dropped.",
			"The hint fades once the first stroke lands.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Mod+Z"], action: "Undo the last stroke" },
			{ keys: ["Shift+Mod+Z", "Mod+Y"], action: "Redo" },
			{ keys: ["Delete"], action: "Clear the pad" },
		],
		notes: [
			"The pad is focusable and named as signed or empty; the shortcuts are described to screen readers.",
			"Every action also has a toolbar button, so nothing depends on the keyboard shortcuts.",
		],
	},
	guidance: {
		when: [
			"Contracts, consent forms and delivery confirmations that need a drawn signature.",
		],
		whenNot: [{ text: "An animated handwritten name.", use: "signature" }],
		responsive: ["The pad keeps a 60:26 ratio and scales strokes with it."],
		performance: [
			"Coalesced pointer events keep fast strokes smooth without extra renders.",
		],
		ai: [
			"Store `value` or the `signatureToSvg` output; strokes are in pad units, independent of size.",
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
			entry: "SignaturePad",
			files: files("signature-pad.tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: deps,
		},
		svelte: {
			entry: "SignaturePad",
			files: files("signature-pad.svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: deps,
		},
	},
	keywords: ["signature", "sign", "pad", "draw", "ink", "pen", "form"],
});
