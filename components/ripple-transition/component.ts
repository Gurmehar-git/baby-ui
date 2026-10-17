import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { rippleTransition as rippleTransitionVariants } from "./variants";

const RINGS = ["none", "single", "echo"];
const RADII = ["none", "md", "xl"];
const union = (values: string[]) => values.map((v) => `"${v}"`).join(" | ");

export const rippleTransition = defineComponent({
	slug: "ripple-transition",
	name: "Ripple Transition",
	description: "An image stack where the next image ripples open from the click point.",
	category: "animated",
	status: "stable",
	variants: variantsOf(rippleTransitionVariants, ["rings", "radius"]),
	props: [
		{
			name: "images",
			type: "{ src: string; alt: string }[]",
			description: "Images in order; clicking advances to the next one.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "value",
			type: "number",
			description:
				"Index of the current image. Controlled with onValueChange in React, bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "defaultValue",
			type: "number",
			description: "Initial index when uncontrolled (React).",
			default: 0,
			control: { kind: "none" },
		},
		{
			name: "onValueChange",
			type: "(value: number) => void",
			description: "Fires when a click or arrow key picks another image.",
			control: { kind: "none" },
		},
		{
			name: "duration",
			type: "number",
			description: "Reveal length in ms.",
			default: 1200,
			control: { kind: "number", min: 400, max: 3000, step: 100 },
		},
		{
			name: "rings",
			type: union(RINGS),
			description: "Rings riding the reveal edge.",
			default: "single",
			control: { kind: "select", options: RINGS },
		},
		{
			name: "radius",
			type: union(RADII),
			description: "Corner rounding.",
			default: "xl",
			control: { kind: "select", options: RADII },
		},
		{
			name: "label",
			type: "string",
			description: "Accessible name of the advance button.",
			default: "Show next image",
			control: { kind: "text" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Images swap instantly.",
		behaviour: [
			"The next image opens as a clip-path circle from the click point (the centre for keys), sized to reach the farthest corner.",
			"The incoming image settles from a 1.12 scale and bright saturation; the outgoing one pushes to 1.06 and dims.",
			"Rings grow with the circle's edge and fade; echo adds two more a beat behind.",
			"Input is ignored while a reveal runs; a controlled value change always starts one.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter", "Space"], action: "Shows the next image" },
			{ keys: ["Arrow Right", "Arrow Left"], action: "Steps forward and back" },
		],
		notes: [
			"A full-size button carries the label; the current image's alt text is announced in a polite live region.",
			"Images other than the current one are aria-hidden.",
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
			entry: "RippleTransition",
		},
		svelte: {
			entry: "RippleTransition",
		},
	},
	keywords: [
		"image",
		"ripple",
		"transition",
		"slideshow",
		"reveal",
		"clip-path",
		"gallery",
	],
});
