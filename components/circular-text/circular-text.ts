import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { circularText as circularTextVariants } from "./react/variants";

const DIRECTIONS = ["clockwise", "counterclockwise"];

export const circularText = defineComponent({
	slug: "circular-text",
	name: "Circular Text",
	description: "Text arranged in a rotating circular path.",
	category: "text",
	status: "stable",
	demo: { mode: "auto", frame: "none" },
	variants: variantsOf(circularTextVariants, ["direction"]),
	props: [
		{
			name: "text",
			type: "string",
			description: "The text to arrange around the ring.",
			control: { kind: "text" },
			default: "CIRCULAR TEXT · ",
		},
		{
			name: "spinSeconds",
			type: "number",
			description: "Full loop duration.",
			default: 30,
			control: { kind: "number", min: 4, max: 60, step: 1 },
		},
		{
			name: "radius",
			type: "number",
			description: "Distance from centre to each character's baseline, in pixels.",
			default: 80,
			control: { kind: "number", min: 30, max: 160, step: 5 },
		},
		{
			name: "direction",
			type: DIRECTIONS.map((v) => `"${v}"`).join(" | "),
			description: "Spin direction.",
			default: "clockwise",
			control: { kind: "select", options: DIRECTIONS },
		},
		{
			name: "as",
			type: "ElementType",
			description: "Tag to render. Defaults to `div`.",
			default: "div",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The ring stops spinning; the text stays in its current position.",
		behaviour: [
			"The ring spins continuously at a constant rate; each character's own placement around it is static.",
		],
	},
	a11y: {
		notes: [
			"Renders the real text as its content, split into one span per character for placement.",
		],
	},

	impl: {
		react: {
			entry: "CircularText",
		},
		svelte: {
			entry: "CircularText",
		},
	},
	keywords: ["text", "circular", "spin", "rotate", "logo"],
});
