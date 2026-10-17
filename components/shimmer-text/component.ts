import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { shimmerText as shimmerTextVariants } from "./variants";

const SIZES = ["inherit", "sm", "md", "lg"];
const VARIANTS = ["default", "bell"];

export const shimmerText = defineComponent({
	slug: "shimmer-text",
	name: "Shimmer Text",
	description:
		"Muted text with a bright band sweeping across it, for loading and thinking states.",
	category: "text",
	status: "stable",
	variants: variantsOf(shimmerTextVariants, ["variant", "size"]),
	props: [
		{
			name: "text",
			type: "string",
			description: "The text to shimmer.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "durationMs",
			type: "number",
			description: "One sweep across the text.",
			default: 2000,
			control: { kind: "number", min: 500, max: 5000, step: 100 },
		},
		{
			name: "spread",
			type: "number",
			description: "Band half-width in px per character.",
			default: 2,
			control: { kind: "number", min: 1, max: 6, step: 1 },
		},
		{
			name: "active",
			type: "boolean",
			description:
				"Sweep while work is ongoing; false settles the text to solid and clears aria-busy.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"A straight band, or a bell falloff that brightens through soft shoulders.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Type scale; inherit takes the surrounding text size.",
			default: "inherit",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "as",
			type: "string",
			description: "Element to render.",
			default: "p",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The loop stops and the text shows in the muted colour.",
		behaviour: [
			"The band crosses from right to left, linear, and repeats with no pause.",
			"Setting `active` to false eases the muted base up to the band's colour, so the sweep fades out instead of cutting.",
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
			entry: "ShimmerText",
		},
		svelte: {
			entry: "ShimmerText",
		},
	},
	keywords: ["shimmer", "loading", "thinking", "gradient", "text"],
});
