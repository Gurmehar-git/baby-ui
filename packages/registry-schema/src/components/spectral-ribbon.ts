import { defineComponent } from "../index.ts";

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
	variants: { tone: TONES, speed: SPEEDS, position: POSITIONS },
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
			files: [
				{ path: "spectral-ribbon/spectral-ribbon.tsx", type: "registry:ui" },
				{ path: "spectral-ribbon/ribbon.ts", type: "registry:ui" },
				{ path: "spectral-ribbon/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
				{ path: "lib/shader.ts", type: "registry:lib" },
				{ path: "lib/surface.ts", type: "registry:lib" },
				{ path: "lib/use-canvas-engine.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "SpectralRibbon",
			files: [
				{ path: "spectral-ribbon/spectral-ribbon.svelte", type: "registry:ui" },
				{ path: "spectral-ribbon/ribbon.ts", type: "registry:ui" },
				{ path: "spectral-ribbon/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
				{ path: "lib/shader.ts", type: "registry:lib" },
				{ path: "lib/surface.ts", type: "registry:lib" },
				{ path: "lib/canvas-engine.svelte.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["background", "ribbon", "prism", "webgl", "shader", "hero"],
});
