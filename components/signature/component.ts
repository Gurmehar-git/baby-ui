import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { signature as signatureVariants } from "./variants";

const VARIANTS = ["ink", "outline"];

export const signature = defineComponent({
	slug: "signature",
	name: "Signature",
	description:
		"Text that writes itself: each glyph's outline strokes in left to right, then fills, in whatever font the element inherits.",
	category: "animated",
	status: "stable",
	variants: variantsOf(signatureVariants, ["variant"]),
	props: [
		{
			name: "text",
			type: "string",
			description: "The text to write.",
			required: true,
			default: "Baby UI",
			control: { kind: "text" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"Ink fills each glyph after its stroke; outline keeps the stroke only.",
			default: "ink",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "duration",
			type: "number",
			description: "Seconds across the whole text.",
			default: 2,
			control: { kind: "number", min: 0.5, max: 6, step: 0.5 },
		},
		{
			name: "delay",
			type: "number",
			description: "Seconds before the first glyph starts.",
			default: 0,
			control: { kind: "number", min: 0, max: 3, step: 0.25 },
		},
		{
			name: "strokeWidth",
			type: "number",
			description: "Outline stroke width, in px.",
			default: 1,
			control: { kind: "number", min: 0.5, max: 3, step: 0.25 },
		},
		{
			name: "inView",
			type: "boolean",
			description: "Wait until the element scrolls into view.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "once",
			type: "boolean",
			description:
				"With `inView`, play only the first time; otherwise replay on every entry.",
			default: true,
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The text renders written and filled at once.",
		behaviour: [
			"Each glyph is a `<tspan>` whose stroke-dashoffset animates, one step after the previous glyph; ink then fades the fill in.",
			"No font file or path extraction: the SVG text inherits the element's font, so pass a script font through `class`.",
			"Changing `text` restarts the writing.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"A transparent HTML copy of the text sizes the element and is what assistive tech reads; the SVG is aria-hidden.",
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
			entry: "Signature",
		},
		svelte: {
			entry: "Signature",
		},
	},
	keywords: ["signature", "handwriting", "svg", "stroke", "text", "draw"],
});
