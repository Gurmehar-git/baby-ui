import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { circuitBoard as circuitBoardVariants } from "./react/variants";

const TONES = ["primary", "chart", "foreground"];
const SPEEDS = ["slow", "normal", "fast"];

export const circuitBoard = defineComponent({
	slug: "circuit-board",
	name: "Circuit Board",
	description:
		"Nodes joined by right-angled SVG traces that draw in, then carry glowing pulses along each connection.",
	category: "animated",
	status: "stable",
	demo: { mode: "auto", frame: "lg" },
	variants: variantsOf(circuitBoardVariants, ["tone", "speed"]),
	props: [
		{
			name: "nodes",
			type: "CircuitNode[]",
			description:
				"`{ id, x, y, label?, status? }` in board units; status is idle, active, busy or error.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "connections",
			type: "CircuitConnection[]",
			description:
				"`{ from, to, bidirectional?, animated? }` by node id; unknown ids are skipped.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "width",
			type: "number",
			description: "Board width in node units; the SVG scales to its container.",
			default: 600,
			control: { kind: "none" },
		},
		{
			name: "height",
			type: "number",
			description: "Board height in node units.",
			default: 400,
			control: { kind: "none" },
		},
		{
			name: "nodeSize",
			type: "number",
			description: "Node square side, in board units.",
			default: 32,
			control: { kind: "number", min: 16, max: 56, step: 4 },
		},
		{
			name: "gridSize",
			type: "number",
			description: "Dot grid spacing, in board units.",
			default: 20,
			control: { kind: "number", min: 10, max: 40, step: 5 },
		},
		{
			name: "showGrid",
			type: "boolean",
			description: "Dot grid behind the traces.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Pulse colour; chart gives return pulses their own slot.",
			default: "primary",
			control: { kind: "select", options: TONES },
		},
		{
			name: "speed",
			type: SPEEDS.map((v) => `"${v}"`).join(" | "),
			description: "Time for a pulse to cross one trace.",
			default: "normal",
			control: { kind: "select", options: SPEEDS },
		},
		{
			name: "label",
			type: "string",
			description: "Accessible name; without it the board is decorative.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Traces and nodes render drawn; pulses and the busy breathing are removed.",
		behaviour: [
			"Every trace carries `pathLength=100`, so draw-in and pulse dashes are exact on any route length.",
			"Traces draw in with a stagger, nodes pop in after, then pulses loop with stroke-dashoffset keyframes; bidirectional traces run a second pulse half a cycle behind.",
			"All motion is CSS; there is no frame loop.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Decorative by default (`aria-hidden`); pass `label` to expose it as an image.",
			"Status is shown by colour and by the busy node's breathing, so describe critical states in `label` too.",
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
			entry: "CircuitBoard",
		},
		svelte: {
			entry: "CircuitBoard",
		},
	},
	keywords: ["circuit", "svg", "traces", "network", "diagram", "pulse"],
});
