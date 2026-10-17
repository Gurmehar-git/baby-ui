import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { lightCaustics as lightCausticsVariants } from "./variants";

const TONES = ["ocean", "lagoon", "ember", "mono"];
const SPEEDS = ["slow", "normal", "fast"];
const POSITIONS = ["absolute", "fixed"];
const union = (values: string[]) => values.map((v) => `"${v}"`).join(" | ");

export const lightCaustics = defineComponent({
	slug: "light-caustics",
	name: "Light Caustics",
	description:
		"Rippling underwater caustic filaments over a tinted base, drawn in WebGL from theme tokens.",
	category: "backgrounds",
	status: "beta",
	variants: variantsOf(lightCausticsVariants, ["tone", "speed", "position"]),
	props: [
		{
			name: "tone",
			type: union(TONES),
			description: "Tint for the base, then two tokens for the filaments.",
			default: "ocean",
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
			entry: "LightCaustics",
		},
		svelte: {
			entry: "LightCaustics",
		},
	},
	keywords: ["background", "caustics", "water", "light", "webgl", "shader", "hero"],
});
