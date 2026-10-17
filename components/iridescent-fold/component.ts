import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { iridescentFold as iridescentFoldVariants } from "./variants";

const VARIANTS = ["foil", "silk"];
const TONES = ["holo", "pearl", "opal", "lavender", "spectrum", "cool", "warm", "mono"];
const SPEEDS = ["slow", "normal", "fast"];
const POSITIONS = ["absolute", "fixed"];
const union = (values: string[]) => values.map((v) => `"${v}"`).join(" | ");

export const iridescentFold = defineComponent({
	slug: "iridescent-fold",
	name: "Iridescent Fold",
	description:
		"Holographic foil or satin: crumpled creases or long draped folds, a pastel thin-film sheen and specular streaks, drawn in WebGL.",
	category: "backgrounds",
	status: "beta",
	variants: variantsOf(iridescentFoldVariants, ["variant", "tone", "speed", "position"]),
	props: [
		{
			name: "variant",
			type: union(VARIANTS),
			description:
				"`foil` crumples into sharp creases with rainbow glints; `silk` drapes in long sheened folds with a fine sparkle.",
			default: "foil",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "tone",
			type: union(TONES),
			description:
				"The three colours the thin film sweeps through: holo, pearl, opal and lavender are pastel foil and satin palettes; the rest come from theme tokens.",
			default: "holo",
			control: { kind: "select", options: TONES },
		},
		{
			name: "speed",
			type: union(SPEEDS),
			description: "Motion rate.",
			default: "normal",
			control: { kind: "select", options: SPEEDS },
		},
		{
			name: "intensity",
			type: "number",
			description: "Effect strength, 0 to 2.",
			default: 1,
			control: { kind: "number", min: 0, max: 2, step: 0.1 },
		},
		{
			name: "position",
			type: union(POSITIONS),
			description: "Fill the nearest positioned parent, or the viewport.",
			default: "absolute",
			control: { kind: "none" },
		},
		{
			name: "grain",
			type: "number",
			description: "Film grain, 0 to 1.",
			default: 0,
			control: { kind: "number", min: 0, max: 1, step: 0.05 },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description: "Content layered above the background.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "One static frame is drawn.",
		behaviour: [
			"Ridged noise octaves fold into sharp creases over soft billows; colour follows fold height and surface angle, and creases catch white highlights.",
			"Draws at most 30 frames a second on a low-power WebGL context.",
			"The frame loop pauses while the element is off screen or the tab is hidden.",
			"Colours resolve from theme tokens and resample when the theme changes.",
			"Without WebGL, or after a lost context, a token gradient shows instead.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The canvas and fallback are aria-hidden; children stay in the reading order.",
		],
	},
	impl: {
		react: {
			entry: "IridescentFold",
		},
		svelte: {
			entry: "IridescentFold",
		},
	},
	keywords: [
		"background",
		"iridescent",
		"holographic",
		"foil",
		"webgl",
		"shader",
		"hero",
	],
});
