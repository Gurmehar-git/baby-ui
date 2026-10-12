import { defineComponent } from "../index.ts";

export const scatterChart = defineComponent({
	slug: "scatter-chart",
	name: "Scatter Chart",
	description:
		"Time series as markers with a shape per series, revealed left to right and picked by true nearest point.",
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
			name: "size",
			type: '"sm" | "default" | "lg"',
			description: "Scatter: marker radius, 3, 4.5 or 6px.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg"] },
		},
		{
			name: "shape",
			type: '"circle" | "square" | "diamond" | "triangle"',
			description:
				"Scatter: marker shape. Unset, series take circle, square, diamond, triangle in order.",
			default: "auto",
			control: {
				kind: "select",
				options: ["auto", "circle", "square", "diamond", "triangle"],
			},
		},
		{
			name: "status",
			type: '"loading" | "ready"',
			description:
				"Loading fades the markers out and retweens the grid; ready replays the reveal.",
			default: "ready",
			control: { kind: "select", options: ["ready", "loading"] },
		},
		{
			name: "xKey",
			type: "string",
			description: "Key holding each row's date.",
			default: "date",
			control: { kind: "none" },
		},
		{
			name: "activeIndex",
			type: "number | null",
			description:
				"Row under the pointer or keyboard. Controlled with onActiveIndexChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Markers appear in place with no blur.",
		behaviour: [
			"Each marker fades in and unblurs from 2px over 500ms on cubic-bezier(0.85, 0, 0.15, 1), delayed by its x position across 1100ms, so markers follow a left-to-right sweep.",
			"The pointer picks the nearest marker in two dimensions; the rest dim to 50% with a 2px blur over 150ms and the picked marker scales to 1.35.",
			"The chart turns interactive when the last marker lands, not on a timer.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Every series has its own marker shape, so series never differ by colour alone.",
			"Keyboard follows the Chart plot: arrow keys move between points, selecting a whole row.",
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
			entry: "ScatterChart",
			files: [
				{ path: "scatter-chart/scatter-chart.tsx", type: "registry:ui" },
				{ path: "scatter-chart/geometry.ts", type: "registry:ui" },
				{ path: "scatter-chart/variants.ts", type: "registry:ui" },
			],
			dependencies: ["tailwind-variants", "d3-array", "d3-scale"],
			registryDependencies: ["chart"],
		},
		svelte: {
			entry: "ScatterChart",
			files: [
				{ path: "scatter-chart/scatter-chart.svelte", type: "registry:ui" },
				{ path: "scatter-chart/scatter-plot.svelte", type: "registry:ui" },
				{ path: "scatter-chart/scatter.svelte", type: "registry:ui" },
				{ path: "scatter-chart/context.ts", type: "registry:ui" },
				{ path: "scatter-chart/geometry.ts", type: "registry:ui" },
				{ path: "scatter-chart/variants.ts", type: "registry:ui" },
			],
			dependencies: ["tailwind-variants", "d3-array", "d3-scale"],
			registryDependencies: ["chart"],
		},
	},
	keywords: ["scatter", "chart", "points", "markers", "distribution"],
});
