import { defineComponent } from "../index.ts";

const VARIANTS = ["wiggle", "silhouette", "zero"];

export const streamgraphChart = defineComponent({
	slug: "streamgraph-chart",
	name: "Streamgraph Chart",
	description:
		"How the mix of several parts changes over time: layers stack around a flowing baseline and thin out when hidden from the legend.",
	category: "charts",
	status: "stable",
	variants: { variant: VARIANTS },
	props: [
		{
			name: "data",
			type: "Record<string, unknown>[]",
			description: "Rows with a label under xKey and one number per config series.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "xKey",
			type: "string",
			description: "Key holding each row's label, shown on the axis and in the tooltip.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"Stack offset: flowing `wiggle`, centred `silhouette`, or flat `zero`.",
			default: "wiggle",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "directLabels",
			type: "boolean",
			description: "Names each layer inside its widest stretch when it is thick enough.",
			default: true,
			control: { kind: "boolean" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The stream appears whole; changes jump.",
		behaviour: [
			"The stream reveals left to right.",
			"New data and legend toggles morph every layer; hidden layers thin to nothing.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["ArrowLeft", "ArrowRight"], action: "Move between points in time" },
			{ keys: ["Home", "End"], action: "First or last point" },
			{ keys: ["Escape"], action: "Clear the focus" },
		],
		notes: [
			"A figure with a summary and a table of every series per point, with totals.",
		],
	},
	guidance: {
		when: [
			"How a mix shifts over time when the overall shape matters more than exact values.",
		],
		whenNot: [
			{ text: "Exact values over time.", use: "area-chart" },
			{ text: "One moment's mix.", use: "pie-chart" },
		],
		responsive: ["Axis labels thin to one per 72px."],
		performance: [
			"d3-shape stacks once per data or legend change; morphs tween the stacked bands.",
		],
		ai: ["Keep to three to eight series and eight or more points."],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "StreamgraphChart",
			files: [
				{ path: "streamgraph-chart/streamgraph-chart.tsx", type: "registry:ui" },
				{ path: "streamgraph-chart/stream.ts", type: "registry:ui" },
				{ path: "streamgraph-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "d3-shape"],
			registryDependencies: ["chart"],
		},
		svelte: {
			entry: "StreamgraphChart",
			files: [
				{ path: "streamgraph-chart/streamgraph-chart.svelte", type: "registry:ui" },
				{ path: "streamgraph-chart/stream-plot.svelte", type: "registry:ui" },
				{ path: "streamgraph-chart/stream.ts", type: "registry:ui" },
				{ path: "streamgraph-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "d3-shape"],
			registryDependencies: ["chart"],
		},
	},
	keywords: ["streamgraph", "stacked area", "stream", "mix", "time series", "chart"],
});
