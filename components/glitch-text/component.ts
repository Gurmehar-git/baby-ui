import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { glitchText as glitchTextVariants } from "./variants";

const SIZES = ["sm", "md", "lg"];

export const glitchText = defineComponent({
	slug: "glitch-text",
	name: "Glitch Text",
	description:
		"RGB-split glitch on text: two coloured ghosts jitter while the label stays sharp on top.",
	category: "text",
	status: "stable",
	variants: variantsOf(glitchTextVariants, ["size"]),
	props: [
		{
			name: "text",
			type: "string",
			description: "The text to glitch.",
			control: { kind: "text" },
			default: "Glitch",
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Type scale.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "intensity",
			type: "number",
			description: "Unitless multiplier on the ghost offset.",
			default: 5,
			control: { kind: "number", min: 1, max: 12, step: 1 },
		},
		{
			name: "durationSeconds",
			type: "number",
			description: "Glitch burst cycle.",
			default: 2.5,
			control: { kind: "number", min: 0.5, max: 6, step: 0.5 },
		},
		{
			name: "baseColor",
			type: "string",
			description:
				"Main layer colour, on top. Inherits the surrounding text colour by default.",
			control: { kind: "none" },
		},
		{
			name: "colorA",
			type: "string",
			description: "Back ghost layer A.",
			default: "#ff00ff",
			control: { kind: "color" },
		},
		{
			name: "colorB",
			type: "string",
			description: "Back ghost layer B.",
			default: "#00ffff",
			control: { kind: "color" },
		},
		{
			name: "blendMode",
			type: '"screen" | "normal"',
			description: "Ghost layer blend mode.",
			default: "screen",
			control: { kind: "select", options: ["screen", "normal"] },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Ghost layers freeze at low opacity instead of animating.",
		behaviour: [
			"Two colour ghosts (magenta, cyan by default) jitter on independent keyframe loops under the sharp base layer, which stays on top and legible.",
		],
	},
	a11y: {
		notes: [
			"The two ghost layers are `aria-hidden`; the base layer carries the real text once.",
		],
	},

	impl: {
		react: {
			entry: "GlitchText",
		},
		svelte: {
			entry: "GlitchText",
		},
	},
	keywords: ["text", "glitch", "rgb", "animated"],
});
