import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { middleTruncation as middleTruncationVariants } from "./variants";

const VARIANTS = ["default", "code"];

export const middleTruncation = defineComponent({
	slug: "middle-truncation",
	name: "Middle Truncation",
	description:
		"Responsive single-line truncation that preserves meaningful text at both ends.",
	category: "text",
	status: "stable",
	variants: variantsOf(middleTruncationVariants, ["variant"]),
	props: [
		{
			name: "text",
			type: "string",
			description: "Full text measured and exposed as the native title.",
			required: true,
			control: { kind: "text" },
		},
		{
			name: "variant",
			type: VARIANTS.map((value) => `"${value}"`).join(" | "),
			description:
				"Typography treatment; `code` uses the monospace and tabular number tokens.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "end",
			type: "number",
			description:
				"Exact grapheme count preserved at the end; mutually exclusive with `minEnd`.",
			control: { kind: "none" },
		},
		{
			name: "minEnd",
			type: "number",
			description: "Minimum trailing graphemes preserved by an otherwise even split.",
			control: { kind: "none" },
		},
		{
			name: "ellipsis",
			type: "string",
			description: "Separator inserted between the preserved segments.",
			default: "…",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "No motion is used.",
		behaviour: [
			"Text is remeasured in the next animation frame after its container resizes.",
		],
	},
	a11y: {
		notes: [
			"The full value remains available through the native title attribute.",
			"Grapheme segmentation prevents splitting emoji and combined characters.",
		],
	},
	guidance: {
		when: [
			"File names, paths, URLs, hashes, and identifiers where both ends carry meaning.",
		],
		whenNot: [{ text: "Prose that can wrap onto another line.", use: "typography" }],
		responsive: ["ResizeObserver recalculates against the component's own inline width."],
		performance: [
			"A shared canvas context and binary search avoid DOM measurement loops.",
		],
		ai: ["Use `end` for known suffixes and `minEnd` for variable paths or identifiers."],
	},
	licenseOrigin: {
		source: "sv-chanhdai",
		url: "https://github.com/sv-chanhdai/sv-chanhdai",
		license: "MIT",
		copyright: "Copyright (c) 2026 Sikandar Bhide",
	},
	impl: {
		react: { entry: "MiddleTruncation" },
		svelte: { entry: "MiddleTruncation" },
	},
	keywords: ["truncate", "ellipsis", "text", "path", "filename"],
});
