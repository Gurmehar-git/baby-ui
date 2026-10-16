import { defineComponent } from "@baby-ui/registry-schema";

const SHAPES = ["circle", "square"];
const SIZES = ["sm", "md", "lg"];

export const particleText = defineComponent({
	slug: "particle-text",
	name: "Particle Text",
	description:
		"Text drawn as canvas particles that scatter from the pointer and spring back into place.",
	category: "text",
	status: "stable",
	demo: { mode: "auto", frame: "lg" },
	variants: { shape: SHAPES, size: SIZES },
	props: [
		{
			name: "text",
			type: "string",
			description: "The text to draw; read once by screen readers.",
			default: "baby ui",
			control: { kind: "text" },
		},
		{
			name: "shape",
			type: SHAPES.map((v) => `"${v}"`).join(" | "),
			description: "Round dots or square pixels.",
			default: "circle",
			control: { kind: "select", options: SHAPES },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Canvas height.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "fontSize",
			type: "number",
			description: "Largest font size in px; shrinks to fit narrow containers.",
			default: 120,
			control: { kind: "number", min: 40, max: 200, step: 10 },
		},
		{
			name: "density",
			type: "number",
			description: "Sampling step in px: lower means more particles.",
			default: 6,
			control: { kind: "number", min: 3, max: 12, step: 1 },
		},
		{
			name: "particleSize",
			type: "number",
			description: "Radius of each particle, in px.",
			default: 1.5,
			control: { kind: "number", min: 0.5, max: 4, step: 0.5 },
		},
		{
			name: "strength",
			type: "number",
			description: "How hard the pointer pushes particles inside `radius`.",
			default: 15,
			control: { kind: "number", min: 2, max: 40, step: 1 },
		},
		{
			name: "radius",
			type: "number",
			description: "Pointer influence radius, in px.",
			default: 120,
			control: { kind: "number", min: 40, max: 240, step: 10 },
		},
		{
			name: "returnSpeed",
			type: "number",
			description: "Spring pull back home per frame, 0 to 1.",
			default: 0.08,
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Particles are drawn in place and the pointer has no effect.",
		behaviour: [
			"The text is rasterised once into a particle grid at the device pixel ratio, then assembles from a light scatter.",
			"The frame loop runs only while something moves: it stops once every particle is home and the pointer has left.",
			"Particles take the element's text colour and resample on resize, font load and theme change.",
		],
	},
	a11y: {
		keyboard: [],
		notes: ["The canvas is aria-hidden; a visually hidden copy carries the text once."],
	},
	licenseOrigin: {
		source: "componentry",
		url: "https://componentry.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "ParticleText",
		},
		svelte: {
			entry: "ParticleText",
		},
	},
	keywords: ["particles", "canvas", "text", "cursor", "interactive"],
});
