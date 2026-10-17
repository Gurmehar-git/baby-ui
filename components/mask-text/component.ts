import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { maskText as maskTextVariants } from "./variants";

const SIZES = ["sm", "md", "lg"];

export const maskText = defineComponent({
	slug: "mask-text",
	name: "Mask Text",
	description: "A cursor-following circular mask reveals a second copy of the text.",
	category: "text",
	status: "stable",
	demo: { mode: "auto", frame: "none" },
	variants: variantsOf(maskTextVariants, ["size"]),
	props: [
		{
			name: "revealText",
			type: "string",
			description: "Shown through the cursor-following mask.",
			control: { kind: "text" },
			default: "Hello there",
		},
		{
			name: "baseText",
			type: "string",
			description: "Shown underneath, everywhere the mask isn't.",
			control: { kind: "text" },
			default: "Move your cursor",
		},
		{
			name: "revealSize",
			type: "number",
			description: "Mask diameter on hover, in pixels.",
			default: 240,
			control: { kind: "number", min: 60, max: 400, step: 10 },
		},
		{
			name: "durationMs",
			type: "number",
			description: "How long the mask grows/shrinks on hover.",
			default: 500,
			control: { kind: "number", min: 150, max: 1200, step: 50 },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Type scale.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The mask still opens/closes on hover, just without the ease.",
		behaviour: [
			"A circular mask tracks the cursor and grows from 0 to `revealSize` on hover, revealing `revealText` in place of `baseText` inside it.",
		],
	},
	a11y: {
		notes: [
			"`revealText` is `aria-hidden`; `baseText` carries the real content for assistive tech.",
		],
	},

	impl: {
		react: {
			entry: "MaskText",
		},
		svelte: {
			entry: "MaskText",
		},
	},
	keywords: ["text", "mask", "cursor", "hover", "reveal"],
});
