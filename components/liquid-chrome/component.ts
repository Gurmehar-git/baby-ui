import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { liquidChrome as liquidChromeVariants } from "./variants";

const TONES = ["chrome", "chart", "accent"];
const SPEEDS = ["slow", "normal", "fast"];
const POSITIONS = ["absolute", "fixed"];

export const liquidChrome = defineComponent({
	slug: "liquid-chrome",
	name: "Liquid Chrome",
	description:
		"Domain-warped liquid metal with silver and specular bands, drawn in WebGL from theme tokens.",
	category: "backgrounds",
	status: "stable",
	variants: variantsOf(liquidChromeVariants, ["tone", "speed", "position"]),
	props: [
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Token tint for the metal base and silver band.",
			default: "chrome",
			control: { kind: "select", options: TONES },
		},
		{
			name: "speed",
			type: SPEEDS.map((v) => `"${v}"`).join(" | "),
			description: "Warp rate.",
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
			name: "amplitude",
			type: "number",
			description: "Domain-warp depth of the metal, 0 to 1.5.",
			default: 0.6,
			control: { kind: "number", min: 0, max: 1.5, step: 0.05 },
		},
		{
			name: "interactive",
			type: "boolean",
			description: "The surface bulges away from the pointer instead of the centre.",
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
			entry: "LiquidChrome",
		},
		svelte: {
			entry: "LiquidChrome",
		},
	},
	keywords: ["background", "chrome", "metal", "liquid", "webgl", "shader"],
});
