import { defineComponent } from "../index.ts";

export const areaChart = defineComponent({
	slug: "area-chart",
	name: "Area Chart",
	description:
		"Filled time series that reveal, stack and morph fill and stroke together.",
	category: "charts",
	status: "stable",
	props: [
		{
			name: "data",
			type: "Record<string, unknown>[]",
			description: "Rows with a date under xKey and one number per series.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: '"gradient" | "solid" | "pattern"',
			description:
				"Area: fill style. Pattern adds a hatch so series differ without colour.",
			default: "gradient",
			control: { kind: "select", options: ["gradient", "solid", "pattern"] },
		},
		{
			name: "stacked",
			type: "boolean",
			description:
				"On the chart: stack areas in render order; the domain grows to the tallest total.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "curve",
			type: '"natural" | "monotone" | "linear" | "step"',
			description: "Area: interpolation between points.",
			default: "natural",
			control: { kind: "select", options: ["natural", "monotone", "linear", "step"] },
		},
		{
			name: "line",
			type: "boolean",
			description: "Area: stroke the top edge.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "fillOpacity",
			type: "number",
			description: "Area: top opacity of the gradient and solid fills.",
			default: 0.4,
			control: { kind: "number", min: 0.1, max: 1, step: 0.1 },
		},
		{
			name: "fadeEdges",
			type: 'boolean | "left" | "right"',
			description: "Area: fade into the plot edges.",
			default: "none",
			control: { kind: "select", options: ["none", "both", "left", "right"] },
		},
		{
			name: "loadingStyle",
			type: '"pulse" | "sweep"',
			description: "Area: loading visual while status is loading.",
			default: "pulse",
			control: { kind: "select", options: ["pulse", "sweep"] },
		},
		{
			name: "status",
			type: '"loading" | "ready"',
			description:
				"Loading conceals the areas and retweens the grid; ready replays the reveal.",
			default: "ready",
			control: { kind: "select", options: ["ready", "loading"] },
		},
		{
			name: "showMarkers",
			type: "boolean",
			description: "Area: point markers on unstacked areas.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "xKey",
			type: "string",
			description: "Key holding each row's date.",
			default: "date",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Areas appear in place and new data swaps without a morph.",
		behaviour: [
			"Areas reveal left to right with the chart clip over 1100ms on cubic-bezier(0.85, 0, 0.15, 1).",
			"New data morphs the top and bottom edges together over 500ms on the same curve, instead of snapping.",
			"While the pointer is on the plot every area dims to 60% over 400ms ease-in-out.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Each Area registers its series, so the summary, table and live region list it.",
			"The pattern variant hatches each fill so stacked series stay apart without colour.",
			"Keyboard follows the Chart plot: arrow keys move between points.",
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
			entry: "AreaChart",
			files: [
				{ path: "area-chart/area-chart.tsx", type: "registry:ui" },
				{ path: "area-chart/geometry.ts", type: "registry:ui" },
				{ path: "area-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "d3-shape"],
			registryDependencies: ["chart", "chart-series", "line-chart"],
		},
		svelte: {
			entry: "AreaChart",
			files: [
				{ path: "area-chart/area-chart.svelte", type: "registry:ui" },
				{ path: "area-chart/area.svelte", type: "registry:ui" },
				{ path: "area-chart/context.ts", type: "registry:ui" },
				{ path: "area-chart/geometry.ts", type: "registry:ui" },
				{ path: "area-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "d3-shape"],
			registryDependencies: ["chart", "chart-series", "line-chart"],
		},
	},
	keywords: ["area", "chart", "stacked", "time series"],
});
