import { defineComponent } from "../index.ts";

const TONES = ["ocean", "ember", "mono"];
const SPEEDS = ["slow", "normal", "fast"];
const POSITIONS = ["absolute", "fixed"];

export const webglLiquid = defineComponent({
	slug: "webgl-liquid",
	name: "WebGL Liquid",
	description:
		"A rising liquid field that fades up into the surface, drawn in WebGL from theme tokens.",
	category: "backgrounds",
	status: "stable",
	variants: { tone: TONES, speed: SPEEDS, position: POSITIONS },
	props: [
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Token colours for the mid and highlight bands.",
			default: "ocean",
			control: { kind: "select", options: TONES },
		},
		{
			name: "speed",
			type: SPEEDS.map((v) => `"${v}"`).join(" | "),
			description: "Rise rate.",
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
			name: "flow",
			type: "number",
			description: "Large-scale flow and glow strength, 0 to 2.",
			default: 1,
			control: { kind: "number", min: 0, max: 2, step: 0.1 },
		},
		{
			name: "grain",
			type: "number",
			description: "Dither amount, 0 to 0.2.",
			default: 0.05,
			control: { kind: "number", min: 0, max: 0.2, step: 0.01 },
		},
		{
			name: "reveal",
			type: "boolean",
			description: "Sweep the field in from the left the first time it is on screen.",
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
		reducedMotion: "One static frame is drawn.",
		behaviour: [
			"The frame loop pauses while the element is off screen or the tab is hidden.",
			"Colours resolve from theme tokens and resample when the theme changes.",
			"The reveal sweep runs once, on the first frames the element is on screen.",
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
			entry: "WebglLiquid",
			files: [
				{ path: "webgl-liquid/webgl-liquid.tsx", type: "registry:ui" },
				{ path: "webgl-liquid/liquid.ts", type: "registry:ui" },
				{ path: "webgl-liquid/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
				{ path: "lib/shader.ts", type: "registry:lib" },
				{ path: "lib/surface.ts", type: "registry:lib" },
				{ path: "lib/use-canvas-engine.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "WebglLiquid",
			files: [
				{ path: "webgl-liquid/webgl-liquid.svelte", type: "registry:ui" },
				{ path: "webgl-liquid/liquid.ts", type: "registry:ui" },
				{ path: "webgl-liquid/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
				{ path: "lib/shader.ts", type: "registry:lib" },
				{ path: "lib/surface.ts", type: "registry:lib" },
				{ path: "lib/canvas-engine.svelte.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["background", "liquid", "fluid", "webgl", "shader", "hero"],
});
