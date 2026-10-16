import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { textTransition as textTransitionVariants } from "./react/variants";

const VARIANTS = [
	"blur-out-up",
	"bottom-up-letters",
	"top-down-letters",
	"fade-through",
	"focus-blur-resolve",
	"jump-in",
	"kinetic-center-build",
	"letter-drop",
	"line-by-line-slide",
	"mask-reveal-up",
	"micro-scale-fade",
	"per-character-rise",
	"per-word-crossfade",
	"scale-down-fade",
	"shared-axis-y",
	"shared-axis-z",
	"shimmer-sweep",
	"short-slide-down",
	"short-slide-right",
	"soft-blur-in",
	"spring-scale-in",
	"wave-drop",
];

export const textTransition = defineComponent({
	slug: "text-transition",
	name: "Text Transition",
	description:
		"22 named text-reveal presets (per-character, per-word or whole-text) sharing one CSS animation engine.",
	category: "text",
	status: "stable",
	variants: variantsOf(textTransitionVariants, ["variant"]),
	props: [
		{
			name: "text",
			type: "string",
			description:
				"Replaying the animation is driven by this value changing, not a timer.",
			control: { kind: "text" },
			default: "Ship it in seconds",
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Which preset to play.",
			default: "blur-out-up",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "durationMs",
			type: "number",
			description: "Overrides the preset's own duration.",
			control: { kind: "number", min: 100, max: 1500, step: 50 },
		},
		{
			name: "staggerMs",
			type: "number",
			description: "Overrides the preset's own per-unit stagger.",
			control: { kind: "number", min: 0, max: 200, step: 10 },
		},
		{
			name: "as",
			type: "ElementType",
			description: "Tag to render. Defaults to `span`.",
			default: "span",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Units still fade in on a fixed schedule; no travel, scale or blur.",
		behaviour: [
			"Each preset animates a `whole`, `word`, or `character` unit in from a starting opacity/position/scale/blur to its own natural laid-out state, staggered by unit index.",
			"Changing `text` remounts the animated units, replaying the entrance; there's no built-in timer or cycling.",
		],
	},
	a11y: {
		notes: [
			"Renders as whatever `as` resolves to (a `span` by default) with the real text as visible content across every unit.",
		],
	},

	impl: {
		react: {
			entry: "TextTransition",
		},
		svelte: {
			entry: "TextTransition",
		},
	},
	keywords: ["text", "transition", "reveal", "animated", "preset"],
});
