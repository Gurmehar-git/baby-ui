import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { closingPlasma as closingPlasmaVariants } from "./react/variants";

const TONES = ["chart", "accent", "violet", "mono"];
const SPEEDS = ["slow", "normal", "fast"];
const POSITIONS = ["absolute", "fixed"];

export const closingPlasma = defineComponent({
	slug: "closing-plasma",
	name: "Closing Plasma",
	description:
		"A ridged simplex plasma in WebGL that follows the theme between dark and light.",
	category: "backgrounds",
	status: "stable",
	variants: variantsOf(closingPlasmaVariants, ["tone", "speed", "position"]),
	props: [
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Token hue mixed into the plasma body and ridges.",
			default: "chart",
			control: { kind: "select", options: TONES },
		},
		{
			name: "speed",
			type: SPEEDS.map((v) => `"${v}"`).join(" | "),
			description: "Flow rate.",
			default: "normal",
			control: { kind: "select", options: SPEEDS },
		},
		{
			name: "position",
			type: POSITIONS.map((v) => `"${v}"`).join(" | "),
			description: "Fill the nearest positioned parent, or the viewport.",
			default: "absolute",
			control: { kind: "none" },
		},
		{
			name: "turbulence",
			type: "number",
			description: "Noise frequency growth per octave, 0 to 2.",
			default: 1,
			control: { kind: "number", min: 0, max: 2, step: 0.1 },
		},
		{
			name: "sparkle",
			type: "number",
			description: "Sparkle strength, 0 to 2.",
			default: 1,
			control: { kind: "number", min: 0, max: 2, step: 0.1 },
		},
		{
			name: "grain",
			type: "number",
			description: "Film grain, 0 to 2.",
			default: 1,
			control: { kind: "number", min: 0, max: 2, step: 0.1 },
		},
		{
			name: "interactive",
			type: "boolean",
			description: "The field leans toward the pointer.",
			default: true,
			control: { kind: "boolean" },
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
		reducedMotion: "One static frame is drawn and the pointer has no effect.",
		behaviour: [
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
	licenseOrigin: {
		source: "componentry",
		url: "https://componentry.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "ClosingPlasma",
		},
		svelte: {
			entry: "ClosingPlasma",
		},
	},
	keywords: ["background", "plasma", "webgl", "shader", "noise", "hero"],
});
