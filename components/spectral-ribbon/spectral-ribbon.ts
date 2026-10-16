import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { spectralRibbon as spectralRibbonVariants } from "./react/variants";

const TONES = ["spectrum", "chart", "mono"];
const SPEEDS = ["slow", "normal", "fast"];
const POSITIONS = ["absolute", "fixed"];

export const spectralRibbon = defineComponent({
	slug: "spectral-ribbon",
	name: "Spectral Ribbon",
	description:
		"A soft light trail with a prismatic fringe, drawn in WebGL from theme tokens.",
	category: "backgrounds",
	status: "stable",
	variants: variantsOf(spectralRibbonVariants, ["tone", "speed", "position"]),
	props: [
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Token colours for the fringe, warm belly to cool rim.",
			default: "spectrum",
			control: { kind: "select", options: TONES },
		},
		{
			name: "speed",
			type: SPEEDS.map((v) => `"${v}"`).join(" | "),
			description: "Sway rate of the trail.",
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
			name: "intensity",
			type: "number",
			description: "Ribbon brightness, 0.25 to 2.",
			default: 1,
			control: { kind: "number", min: 0.25, max: 2, step: 0.05 },
		},
		{
			name: "thickness",
			type: "number",
			description: "Ribbon thickness, 0.5 to 2.",
			default: 1,
			control: { kind: "number", min: 0.5, max: 2, step: 0.05 },
		},
		{
			name: "grain",
			type: "number",
			description: "Film grain, 0 to 1.",
			default: 0.45,
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
			entry: "SpectralRibbon",
		},
		svelte: {
			entry: "SpectralRibbon",
		},
	},
	keywords: ["background", "ribbon", "prism", "webgl", "shader", "hero"],
});
