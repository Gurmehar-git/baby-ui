import { defineComponent } from "@baby-ui/registry-schema";

export const sankeyChart = defineComponent({
	slug: "sankey-chart",
	name: "Sankey Chart",
	description:
		"Flows between stages, drawn link by link, with every path through a node lit on hover.",
	category: "charts",
	status: "stable",
	props: [
		{
			name: "data",
			type: "{ nodes: { name: string; color?: string }[]; links: { source: number; target: number; value: number }[] }",
			description: "Nodes, and links that point at them by index.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "orientation",
			type: '"horizontal" | "vertical"',
			description: "Direction the flow runs: left to right, or top to bottom.",
			default: "horizontal",
			control: { kind: "select", options: ["horizontal", "vertical"] },
		},
		{
			name: "linkColor",
			type: '"gradient" | "source" | "target"',
			description: "Links blend source into target, or take one end's colour.",
			default: "gradient",
			control: { kind: "select", options: ["gradient", "source", "target"] },
		},
		{
			name: "labels",
			type: "boolean",
			description: "Node names and totals beside each node.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "nodeWidth",
			type: "number",
			description: "Node thickness in pixels.",
			default: 16,
			control: { kind: "number", min: 6, max: 32, step: 2 },
		},
		{
			name: "nodePadding",
			type: "number",
			description: "Gap between nodes in the same column, in pixels.",
			default: 24,
			control: { kind: "number", min: 8, max: 48, step: 4 },
		},
		{
			name: "text",
			type: "Partial<{ total: string; flow: string; share: string; headers: [string, string, string, string] }>",
			description: "Tooltip and data-table copy, for translation.",
			control: { kind: "none" },
		},
		{
			name: "activeIndex",
			type: "number | null",
			description:
				"Highlighted link. Controlled with onActiveIndexChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Links, nodes and labels appear in place; hover fades still run.",
		behaviour: [
			"Links draw along their length over 1100ms on cubic-bezier(0.85, 0, 0.15, 1), starting at 220ms and staggered across 352ms.",
			"Nodes grow from scaleY 0.9 and fade in, staggered across 264ms, never from 0.",
			"Names slide 8px out of the node and fade in; value labels follow 60ms later and settle at 0.6 opacity.",
			"Hovering a link or node lights its paths at 0.65 and fades the rest to 0.1 over 180ms ease-out.",
		],
	},
	a11y: {
		role: "group",
		keyboard: [
			{ keys: ["Arrow keys"], action: "Walks the links" },
			{ keys: ["Home", "End"], action: "Jumps to the first and last link" },
			{ keys: ["Escape"], action: "Clears the highlight" },
		],
		notes: [
			"Each keyboard move announces source, target, value and share of the source.",
			"The hidden data table lists every flow with its share, so the diagram never relies on colour.",
		],
	},

	licenseOrigin: {
		source: "bklit-ui",
		url: "https://github.com/bklit/bklit-ui",
		license: "MIT",
		copyright: "Copyright (c) 2026 uixmat",
	},
	impl: {
		react: {
			entry: "SankeyChart",
			files: [
				{ path: "sankey-chart/sankey-chart.tsx", type: "registry:ui" },
				{ path: "sankey-chart/layout.ts", type: "registry:ui" },
				{ path: "sankey-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "d3-sankey"],
			registryDependencies: ["chart"],
		},
		svelte: {
			entry: "SankeyChart",
			files: [
				{ path: "sankey-chart/sankey-chart.svelte", type: "registry:ui" },
				{ path: "sankey-chart/sankey-plot.svelte", type: "registry:ui" },
				{ path: "sankey-chart/layout.ts", type: "registry:ui" },
				{ path: "sankey-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "d3-sankey"],
			registryDependencies: ["chart"],
		},
	},
	keywords: ["sankey", "flow", "funnel", "chart", "journey"],
});
