import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { animatedBeam as animatedBeamVariants } from "./variants";

export const animatedBeam = defineComponent({
	slug: "animated-beam",
	name: "Animated Beam",
	description:
		"A composable integrations diagram: logo nodes around a hub or in a row, joined by curved beams that pulses travel along.",
	category: "animated",
	status: "beta",
	props: [
		{
			name: "nodes",
			type: "{ id: string; label: string; src?: string; icon?: Snippet | ReactNode }[]",
			description:
				"Every node, each with an accessible label and either an image URL or an icon.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "beams",
			type: "{ from: string; to: string; delay?: number; duration?: number; reverse?: boolean }[]",
			description:
				"Which nodes a beam joins, by id. Per beam: start delay and pulse duration in ms, and reverse to run the pulse back.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "center",
			type: "string",
			description:
				"Id of the hub, or of the target in a row. Defaults to the first node.",
			control: { kind: "none" },
		},
		{
			name: "layout",
			type: '"hub" | "row"',
			description:
				"Hub puts the centre node in the middle with the rest around it; row lines the rest up on the left of the target.",
			default: "hub",
			control: { kind: "select", options: ["hub", "row"] },
		},
		{
			name: "size",
			type: '"sm" | "md" | "lg"',
			description: "Node size; the centre node is always one step larger.",
			default: "md",
			control: { kind: "select", options: ["sm", "md", "lg"] },
		},
		{
			name: "tone",
			type: '"primary" | "spectrum"',
			description: "Pulse colour: the primary colour, or a success-to-violet gradient.",
			default: "primary",
			control: { kind: "select", options: ["primary", "spectrum"] },
		},
		{
			name: "curvature",
			type: "number",
			description: "How far each beam bows away from a straight line, in px.",
			default: 24,
			control: { kind: "number", min: 0, max: 80, step: 4 },
		},
		{
			name: "showLabels",
			type: "boolean",
			description:
				"AnimatedBeamNodes: print each node's label under it; otherwise the label is for screen readers only.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "label",
			type: "string",
			description: "AnimatedBeamNodes: accessible name of the node list.",
			default: "Integrations",
			control: { kind: "text" },
		},
	],
	variants: variantsOf(animatedBeamVariants, ["layout", "size", "tone"]),
	motion: {
		springs: [],
		reducedMotion: "Beams draw as static lines; no pulse runs.",
		behaviour: [
			"Each beam is a quadratic curve between the measured centres of its two nodes, re-measured on resize and on layout, size or label changes.",
			"A pulse covering 22% of the beam travels its length on the Web Animations API, eased cubic-bezier(0.45, 0, 0.55, 1), 3200ms by default, repeating after its own delay.",
			"Pulses pause while the diagram is offscreen or the tab is hidden, and resume where they stopped.",
		],
	},
	a11y: {
		role: "list",
		keyboard: [],
		notes: [
			"Nodes are a labelled list of real elements; the beam drawing is aria-hidden.",
			"Node images are decorative (empty alt); each node's label is its accessible name.",
		],
	},
	impl: {
		react: {
			entry: "AnimatedBeam",
		},
		svelte: {
			entry: "AnimatedBeam",
		},
	},
	keywords: [
		"beam",
		"integrations",
		"connections",
		"diagram",
		"hub",
		"network",
		"marketing",
		"hero",
	],
});
