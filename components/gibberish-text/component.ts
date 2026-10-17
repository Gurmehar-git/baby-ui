import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { gibberishText as gibberishTextVariants } from "./variants";

const SIZES = ["sm", "md", "lg"];

export const gibberishText = defineComponent({
	slug: "gibberish-text",
	name: "Gibberish Text",
	description:
		"Each character scrambles through random letters, then resolves to the real one.",
	category: "text",
	status: "stable",
	variants: variantsOf(gibberishTextVariants, ["size"]),
	props: [
		{
			name: "text",
			type: "string",
			description: "The text to reveal.",
			control: { kind: "text" },
			default: "Gibberish",
		},
		{
			name: "speedMs",
			type: "number",
			description: "Interval between scramble frames.",
			default: 24,
			control: { kind: "number", min: 8, max: 80, step: 2 },
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
		reducedMotion:
			"Still scrambles briefly; the effect is a character swap, not travel or blur.",
		behaviour: [
			"Each character independently cycles through 5-14 random uppercase letters at `speedMs` per frame, then settles on its real character.",
		],
	},
	a11y: {
		notes: [
			"The scrambling happens per-character in the DOM text itself, so a screen reader announcing mid-scramble would read garbage: this component suits decorative headings, not primary content a reader depends on before it settles.",
		],
	},

	impl: {
		react: {
			entry: "GibberishText",
		},
		svelte: {
			entry: "GibberishText",
		},
	},
	keywords: ["text", "scramble", "decrypt", "reveal"],
});
