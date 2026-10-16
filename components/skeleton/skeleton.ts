import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { skeleton as skeletonVariants } from "./react/variants";

export const skeleton = defineComponent({
	slug: "skeleton",
	name: "Skeleton",
	description: "Loading placeholder that shimmers along the reading direction.",
	category: "base",
	status: "stable",
	variants: variantsOf(skeletonVariants, ["shape"]),
	props: [
		{
			name: "loading",
			type: "boolean",
			description:
				"With children: the placeholder takes their shape until false, then crossfades into them.",
			control: { kind: "none" },
		},
		{
			name: "width",
			type: "string",
			description: "CSS width, for example 100% or 12rem.",
			default: "100%",
			control: { kind: "text" },
		},
		{
			name: "height",
			type: "string",
			description: "CSS height.",
			default: "1rem",
			control: { kind: "text" },
		},
		{
			name: "shape",
			type: '"line" | "circle" | "block"',
			description: "Corner treatment.",
			default: "line",
			control: { kind: "select", options: ["line", "circle", "block"] },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The shimmer stops; the placeholder stays as a flat block.",
		behaviour: [
			"Wrapping content, the placeholder and the content share one cell, so revealing it crossfades without a layout jump.",
			"The shimmer sweeps left to right over 2s linear, matching reading direction.",
			"It animates background-position, so it stays off the layout and paint path.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"aria-hidden. The loading state belongs on the region being loaded, not on each placeholder.",
		],
	},
	licenseOrigin: {
		source: "sivir-ui",
		url: "https://github.com/aidan-neel/sivir-ui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Aidan Neel",
	},
	impl: {
		react: {
			entry: "Skeleton",
		},
		svelte: {
			entry: "Skeleton",
		},
	},
	keywords: ["skeleton", "loading", "placeholder", "shimmer"],
});
