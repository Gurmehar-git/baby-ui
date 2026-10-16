import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { animatedGradient as animatedGradientVariants } from "./react/variants";

const TONES = ["spectrum", "cool", "warm", "mono"];
const POSITIONS = ["absolute", "fixed"];

export const animatedGradient = defineComponent({
	slug: "animated-gradient",
	name: "Animated Gradient",
	description:
		"A full-bleed background of soft token-coloured blobs drifting on a CSS-only loop.",
	category: "backgrounds",
	status: "stable",
	variants: variantsOf(animatedGradientVariants, ["tone", "position"]),
	props: [
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Which theme tokens colour the blobs.",
			default: "spectrum",
			control: { kind: "select", options: TONES },
		},
		{
			name: "duration",
			type: "number",
			description: "Seconds for one drift cycle.",
			default: 20,
			control: { kind: "number", min: 4, max: 60, step: 2 },
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
		reducedMotion: "The blobs hold still.",
		behaviour: [
			"Two oversized layers of radial blobs drift, rotate and scale against each other on CSS keyframes; only transform animates.",
			"Colours are theme tokens, so a theme switch recolours the gradient with no script.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The blob layers are aria-hidden; children stay in the normal reading order.",
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
			entry: "AnimatedGradient",
		},
		svelte: {
			entry: "AnimatedGradient",
		},
	},
	keywords: ["background", "gradient", "mesh", "aurora", "css"],
});
