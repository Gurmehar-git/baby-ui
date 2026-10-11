import { defineComponent } from "../index.ts";

export const radarChart = defineComponent({
	slug: "radar-chart",
	name: "Radar Chart",
	description:
		"Series compared across metrics as polygons that grow out from the centre.",
	category: "charts",
	status: "stable",
	props: [
		{
			name: "data",
			type: "RadarSeries[]",
			description:
				"One entry per polygon: a label, a value per metric key and an optional colour.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "metrics",
			type: "RadarMetric[]",
			description: "Axes in clockwise order from the top, each a key and a label.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "grid",
			type: '"polygon" | "circle"',
			description: "Shape of the rings behind the series.",
			default: "polygon",
			control: { kind: "select", options: ["polygon", "circle"] },
		},
		{
			name: "variant",
			type: '"filled" | "outline"',
			description: "Filled polygons, or strokes only.",
			default: "filled",
			control: { kind: "select", options: ["filled", "outline"] },
		},
		{
			name: "levels",
			type: "number",
			description: "How many rings divide the scale.",
			default: 5,
			control: { kind: "number", min: 2, max: 8, step: 1 },
		},
		{
			name: "showPoints",
			type: "boolean",
			description: "RadarArea: a marker per vertex, one shape per series.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "max",
			type: "number",
			description: "Value at the outer ring. Defaults to a nice ceiling over the data.",
			control: { kind: "none" },
		},
		{
			name: "activeIndex",
			type: "number | null",
			description:
				"Highlighted series. Controlled with onActiveIndexChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Rings, axes, labels and polygons appear in place.",
		behaviour: [
			"Rings grow from 0.9 scale on a 100/15 spring, 80ms apart, never from 0.",
			"Axes draw out on an 80/15 spring, 50ms apart, and labels travel out on the same spring.",
			"Polygons grow radially over 1100ms on cubic-bezier(0.85, 0, 0.15, 1), 150ms apart.",
			"The active series scales to 1.05 on a 400/25 spring while the others fade to 30%.",
		],
	},
	a11y: {
		role: "group",
		keyboard: [
			{ keys: ["Arrow keys"], action: "Moves between series" },
			{ keys: ["Home", "End"], action: "Jumps to the first and last series" },
			{ keys: ["Escape"], action: "Clears the highlight" },
		],
		notes: [
			"The summary names each series' highest and lowest metric; the hidden table lists every value.",
			"Each series also has its own stroke dash and marker shape, so colour is never the only cue.",
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
			entry: "RadarChart",
			files: [
				{ path: "radar-chart/radar-chart.tsx", type: "registry:ui" },
				{ path: "radar-chart/geometry.ts", type: "registry:ui" },
				{ path: "radar-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "d3-scale"],
			registryDependencies: ["chart"],
		},
		svelte: {
			entry: "RadarChart",
			files: [
				{ path: "radar-chart/radar-chart.svelte", type: "registry:ui" },
				{ path: "radar-chart/radar-plot.svelte", type: "registry:ui" },
				{ path: "radar-chart/radar-grid.svelte", type: "registry:ui" },
				{ path: "radar-chart/radar-axis.svelte", type: "registry:ui" },
				{ path: "radar-chart/radar-labels.svelte", type: "registry:ui" },
				{ path: "radar-chart/radar-area.svelte", type: "registry:ui" },
				{ path: "radar-chart/radar-tooltip.svelte", type: "registry:ui" },
				{ path: "radar-chart/context.ts", type: "registry:ui" },
				{ path: "radar-chart/enter.svelte.ts", type: "registry:ui" },
				{ path: "radar-chart/geometry.ts", type: "registry:ui" },
				{ path: "radar-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "d3-scale"],
			registryDependencies: ["chart"],
		},
	},
	keywords: ["radar", "spider", "chart", "comparison", "metrics"],
});
