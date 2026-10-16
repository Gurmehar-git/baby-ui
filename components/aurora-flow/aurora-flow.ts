import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["veil", "silk"];
const TONES = ["chart", "accent", "ember", "violet", "pearl", "mono"];
const SPEEDS = ["slow", "normal", "fast"];
const POSITIONS = ["absolute", "fixed"];

export const auroraFlow = defineComponent({
	slug: "aurora-flow",
	name: "Aurora Flow",
	description:
		"Silk light drifting through a WebGL field, as layered veils or three sheened ribbons, coloured from theme tokens.",
	category: "backgrounds",
	status: "stable",
	variants: { variant: VARIANTS, tone: TONES, speed: SPEEDS, position: POSITIONS },
	props: [
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"`veil` drifts layered light along `direction`; `silk` lays three soft ribbons with a pearl sheen.",
			default: "veil",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Token palette; each tone has a veil and a silk reading.",
			default: "chart",
			control: { kind: "select", options: TONES },
		},
		{
			name: "speed",
			type: SPEEDS.map((v) => `"${v}"`).join(" | "),
			description: "Drift rate.",
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
			description: "Veil or ribbon strength, 0 to 2.",
			default: 1,
			control: { kind: "number", min: 0, max: 2, step: 0.1 },
		},
		{
			name: "grain",
			type: "number",
			description: "Film grain, 0 to 1. 0.22 for veil, 0.85 for silk.",
			control: { kind: "number", min: 0, max: 1, step: 0.05 },
		},
		{
			name: "direction",
			type: "number",
			description: "Veil: flow direction in degrees.",
			default: -18,
			control: { kind: "number", min: -180, max: 180, step: 5 },
			showWhen: { variant: ["veil"] },
		},
		{
			name: "interactive",
			type: "boolean",
			description: "Veils bend, or ribbons lean, toward the pointer.",
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
			entry: "AuroraFlow",
			files: [
				{ path: "aurora-flow/aurora-flow.tsx", type: "registry:ui" },
				{ path: "aurora-flow/aurora.ts", type: "registry:ui" },
				{ path: "aurora-flow/silk.ts", type: "registry:ui" },
				{ path: "aurora-flow/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
				{ path: "lib/shader.ts", type: "registry:lib" },
				{ path: "lib/surface.ts", type: "registry:lib" },
				{ path: "lib/use-canvas-engine.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "AuroraFlow",
			files: [
				{ path: "aurora-flow/aurora-flow.svelte", type: "registry:ui" },
				{ path: "aurora-flow/aurora-field.svelte", type: "registry:ui" },
				{ path: "aurora-flow/aurora.ts", type: "registry:ui" },
				{ path: "aurora-flow/silk.ts", type: "registry:ui" },
				{ path: "aurora-flow/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
				{ path: "lib/shader.ts", type: "registry:lib" },
				{ path: "lib/surface.ts", type: "registry:lib" },
				{ path: "lib/canvas-engine.svelte.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["background", "aurora", "webgl", "shader", "gradient", "hero"],
});
