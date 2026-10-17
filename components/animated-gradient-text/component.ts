import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { gradientText as gradientTextVariants } from "./variants";

const TONES = ["primary", "muted"];

export const animatedGradientText = defineComponent({
	slug: "animated-gradient-text",
	name: "Animated Gradient Text",
	description: "Text filled with a gradient that sweeps back and forth.",
	category: "text",
	status: "stable",
	variants: variantsOf(gradientTextVariants, ["tone"]),
	props: [
		{
			name: "children",
			type: "ReactNode",
			description: "The text (or inline content) to fill with the gradient.",
			control: { kind: "none" },
		},
		{
			name: "as",
			type: "ElementType",
			description:
				"Tag to render. Defaults to `span`; pass `h1`/`h2`/`p`/etc. to use it as that element directly.",
			default: "span",
			control: { kind: "none" },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Gradient colour pair.",
			default: "primary",
			control: { kind: "select", options: TONES },
		},
		{
			name: "durationSeconds",
			type: "number",
			description: "One full sweep cycle, in seconds.",
			default: 3,
			control: { kind: "number", min: 0.5, max: 10, step: 0.5 },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The gradient stays static at its starting position.",
		behaviour: [
			"The gradient's background-position sweeps 0%→100% and back, `durationSeconds` per cycle.",
		],
	},
	a11y: {
		notes: [
			"Renders as whatever `as` resolves to (a `span` by default) with the real text as its content; nothing is decorative-only or hidden from assistive tech.",
		],
	},

	impl: {
		react: {
			entry: "AnimatedGradientText",
		},
		svelte: {
			entry: "AnimatedGradientText",
		},
	},
	keywords: ["text", "gradient", "animated", "heading"],
});
