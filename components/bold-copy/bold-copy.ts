import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { boldCopy as boldCopyVariants } from "./react/variants";

const SIZES = ["sm", "md", "xl"];

export const boldCopy = defineComponent({
	slug: "bold-copy",
	name: "Bold Copy",
	description:
		"A faint background copy of the text, a sharp copy on top that grows on hover.",
	category: "text",
	status: "stable",
	demo: { mode: "auto", frame: "none" },
	variants: variantsOf(boldCopyVariants, ["size"]),
	props: [
		{
			name: "text",
			type: "string",
			description: "The word or short phrase shown, doubled.",
			control: { kind: "text" },
			default: "baby ui",
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Type scale for both copies.",
			default: "xl",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "durationMs",
			type: "number",
			description: "How long the hover fill/scale takes, in ms.",
			default: 300,
			control: { kind: "number", min: 100, max: 1000, step: 50 },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The size/opacity change on hover still applies instantly, no easing lost.",
		behaviour: [
			"On hover, the sharp foreground copy grows and the faint background copy dims further.",
		],
	},
	a11y: {
		notes: [
			"The background copy is decorative; the foreground copy carries the text once for assistive tech.",
		],
	},

	impl: {
		react: {
			entry: "BoldCopy",
		},
		svelte: {
			entry: "BoldCopy",
		},
	},
	keywords: ["text", "bold", "hover", "hero"],
});
