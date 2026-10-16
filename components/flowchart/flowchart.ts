import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { flowchartCanvas as flowchartCanvasVariants } from "./react/variants";

const BACKGROUNDS = ["dots", "grid", "none"];

export const flowchart = defineComponent({
	slug: "flowchart",
	name: "Flowchart",
	description:
		"A workflow canvas: draggable nodes joined by a measured bezier connector.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(flowchartCanvasVariants, ["background"]),
	props: [
		{
			name: "steps",
			type: "StepNode[]",
			description:
				"Every node on the canvas; each is draggable and positioned from its own `row`/`x`.",
			control: { kind: "none" },
		},
		{
			name: "edges",
			type: "FlowchartEdge[]",
			description: "Connectors drawn between nodes, by id.",
			control: { kind: "none" },
		},
		{
			name: "background",
			type: BACKGROUNDS.map((v) => `"${v}"`).join(" | "),
			description: "The canvas's own background pattern.",
			default: "dots",
			control: { kind: "select", options: BACKGROUNDS },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The connector's lit/unlit colour and the node cards' hover shadow both drop their transition.",
		behaviour: [
			"A node's connector re-measures via `ResizeObserver`, so its own bezier curve tracks the node's real height rather than an assumed one.",
			"Dragging a node moves only that node; the connector recomputes on every frame from its live position.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Tab"],
				action: "Reaches each node card and every condition row's real Select",
			},
		],
		notes: [
			"The connector SVG is `aria-hidden`; the information it conveys (which nodes are linked) comes from the `edges` prop driving actual DOM adjacency, not the line alone.",
			"Condition rows compose the real Select, so their own keyboard and screen-reader semantics aren't reimplemented here.",
		],
	},
	licenseOrigin: {
		source: "beUI",
		url: "https://beui.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 beUI",
	},
	impl: {
		react: {
			entry: "Flowchart",
		},
		svelte: {
			entry: "Flowchart",
		},
	},
	keywords: ["flowchart", "workflow", "canvas", "diagram", "agent"],
});
