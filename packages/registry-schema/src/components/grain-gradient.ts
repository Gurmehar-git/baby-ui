import { defineComponent } from "../index.ts";

const TONES = ["spectrum", "cool", "warm", "mono"];
const POSITIONS = ["absolute", "fixed"];

export const grainGradient = defineComponent({
	slug: "grain-gradient",
	name: "Grain Gradient",
	description:
		"A full-bleed glow and diffused shadow edge that breathe slowly under a static film grain.",
	category: "backgrounds",
	status: "stable",
	variants: { tone: TONES, position: POSITIONS },
	props: [
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Which theme tokens colour the glow and the shadow.",
			default: "spectrum",
			control: { kind: "select", options: TONES },
		},
		{
			name: "angle",
			type: "number",
			description: "Composition rotation in degrees.",
			default: 0,
			control: { kind: "number", min: -180, max: 180, step: 15 },
		},
		{
			name: "grain",
			type: "number",
			description: "Grain strength, 0 to 1.",
			default: 0.35,
			control: { kind: "number", min: 0, max: 1, step: 0.05 },
		},
		{
			name: "grainSize",
			type: "number",
			description: "Grain coarseness, 0.5 to 4.",
			default: 1,
			control: { kind: "number", min: 0.5, max: 4, step: 0.5 },
		},
		{
			name: "duration",
			type: "number",
			description: "Seconds for one breath.",
			default: 12,
			control: { kind: "number", min: 4, max: 40, step: 2 },
		},
		{
			name: "position",
			type: POSITIONS.map((v) => `"${v}"`).join(" | "),
			description:
				"`absolute` fills the nearest positioned parent; `fixed` fills the viewport.",
			default: "absolute",
			control: { kind: "none" },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description: "Rendered above the gradient.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The glow and the shadow hold still.",
		behaviour: [
			"The glow and the shadow edge breathe out of phase on CSS keyframes; only translate and scale animate.",
			"The grain is one seamless feTurbulence tile rendered once and repeated, never animated.",
			"Colours are theme tokens, so a theme switch recolours it with no script.",
		],
	},
	a11y: {
		keyboard: [],
		notes: ["All layers are aria-hidden; children stay in the normal reading order."],
	},
	licenseOrigin: {
		source: "componentry",
		url: "https://componentry.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "GrainGradient",
			files: [
				{ path: "grain-gradient/grain-gradient.tsx", type: "registry:ui" },
				{ path: "grain-gradient/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "GrainGradient",
			files: [
				{ path: "grain-gradient/grain-gradient.svelte", type: "registry:ui" },
				{ path: "grain-gradient/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["background", "gradient", "grain", "noise", "film"],
});
