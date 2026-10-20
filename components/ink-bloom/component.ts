import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { inkBloom as inkBloomVariants } from "./variants";

const TONES = ["chart", "accent", "violet", "mono"];
const SPEEDS = ["slow", "normal", "fast"];
const POSITIONS = ["absolute", "fixed"];
const union = (values: string[]) => values.map((v) => `"${v}"`).join(" | ");

export const inkBloom = defineComponent({
	slug: "ink-bloom",
	name: "Ink Bloom",
	description:
		"Coloured ink diffusing and blooming through water, drawn from theme tokens.",
	category: "backgrounds",
	status: "beta",
	variants: variantsOf(inkBloomVariants, ["tone", "speed", "position"]),
	props: [
		{
			name: "tone",
			type: union(TONES),
			description: "Which theme tokens colour the scene.",
			default: "chart",
			control: { kind: "select", options: TONES },
		},
		{
			name: "speed",
			type: union(SPEEDS),
			description: "How fast the scene moves.",
			default: "normal",
			control: { kind: "select", options: SPEEDS },
		},
		{
			name: "intensity",
			type: "number",
			description: "Colour strength, from the flat base colour (0) to full (1).",
			default: 1,
			control: { kind: "number", min: 0, max: 1, step: 0.05 },
		},
		{
			name: "grain",
			type: "number",
			description: "Film grain, 0 to 1.",
			default: 0,
			control: { kind: "number", min: 0, max: 1, step: 0.05 },
		},
		{
			name: "position",
			type: union(POSITIONS),
			description:
				"`absolute` fills the nearest positioned parent; `fixed` fills the viewport.",
			default: "absolute",
			control: { kind: "none" },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description: "Rendered above the background.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A single still frame at a fixed time.",
		behaviour: [
			"Two passes of domain-warped noise fold two inks through the water very slowly.",
			"The warp field decides where each ink blooms, so colours meet and part organically instead of cycling.",
			"Frames are capped at 30 per second and stop offscreen, in a hidden tab or when the speed is 0.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The canvas is aria-hidden and purely decorative; children stay in the normal reading order.",
			"Without WebGL, or after a lost context, a CSS gradient in the same tokens shows instead.",
		],
	},
	impl: {
		react: {
			entry: "InkBloom",
		},
		svelte: {
			entry: "InkBloom",
		},
	},
	keywords: [
		"background",
		"ink",
		"water",
		"bloom",
		"fluid",
		"watercolor",
		"webgl",
		"shader",
		"hero",
	],
});
