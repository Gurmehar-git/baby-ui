import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { splitText as splitTextVariants } from "./variants";

const SIZES = ["sm", "md", "lg"];

export const splitText = defineComponent({
	slug: "split-text",
	name: "Split Text",
	description:
		"Each letter splits top/bottom around the hovered one, fanning out its neighbours.",
	category: "text",
	status: "stable",
	demo: { mode: "auto", frame: "none" },
	variants: variantsOf(splitTextVariants, ["size"]),
	props: [
		{
			name: "text",
			type: "string",
			description: "The word to split.",
			control: { kind: "text" },
			default: "BABY UI",
		},
		{
			name: "durationMs",
			type: "number",
			description: "How long the fan-out transition takes.",
			default: 300,
			control: { kind: "number", min: 100, max: 800, step: 50 },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Type scale; `lg` is fluid, 36px up to 128px with the viewport.",
			default: "lg",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The split still applies, just without the ease.",
		behaviour: [
			"Hovering a letter splits it top/bottom by the most; its 1-2 nearest neighbours split by less, falling off with distance.",
		],
	},
	a11y: {
		notes: [
			"The split letters are `aria-hidden`; a single `sr-only` copy carries the real text.",
		],
	},

	impl: {
		react: {
			entry: "SplitText",
		},
		svelte: {
			entry: "SplitText",
		},
	},
	keywords: ["text", "split", "hover", "hero"],
});
