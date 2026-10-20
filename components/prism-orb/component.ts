import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { prismOrb as prismOrbVariants } from "./variants";

const TONES = ["chart", "accent", "violet", "mono"];
const SPEEDS = ["slow", "normal", "fast"];
const POSITIONS = ["absolute", "fixed"];
const union = (values: string[]) => values.map((v) => `"${v}"`).join(" | ");

export const prismOrb = defineComponent({
	slug: "prism-orb",
	name: "Prism Orb",
	description:
		"A refracting glass sphere drifting over prism bands, with chromatic dispersion at its rim.",
	category: "backgrounds",
	status: "beta",
	variants: variantsOf(prismOrbVariants, ["tone", "speed", "position"]),
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
		reducedMotion: "A single still frame at a fixed time: no drift, no lean.",
		behaviour: [
			"The sphere drifts on two slow sine paths; prism bands swirl behind it at the chosen speed.",
			"Inside the sphere each colour channel samples the bands at a different refraction, so edges split into a spectral fringe.",
			"On fine pointers the sphere leans a little toward the cursor, easing in over about half a second; touch screens get no lean.",
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
			entry: "PrismOrb",
		},
		svelte: {
			entry: "PrismOrb",
		},
	},
	keywords: [
		"background",
		"prism",
		"orb",
		"glass",
		"refraction",
		"dispersion",
		"webgl",
		"shader",
		"hero",
	],
});
