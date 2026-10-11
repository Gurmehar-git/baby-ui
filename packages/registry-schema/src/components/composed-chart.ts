import { defineComponent } from "../index.ts";

export const composedChart = defineComponent({
	slug: "composed-chart",
	name: "Composed Chart",
	description:
		"Bars, lines and areas on one time axis, sharing the domain, tooltip and legend.",
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
			name: "stacked",
			type: "boolean",
			description:
				"On the chart: stack SeriesBar segments; lines and areas stay unstacked.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "variant",
			type: '"solid" | "soft" | "outline"',
			description: "SeriesBar: fill treatment.",
			default: "solid",
			control: { kind: "select", options: ["solid", "soft", "outline"] },
		},
		{
			name: "barSize",
			type: "number",
			description:
				"On the chart: fixed bar width in px; unset sizes bars to 88% of a slot.",
			default: 0,
			control: { kind: "number", min: 0, max: 20, step: 2 },
		},
		{
			name: "barGap",
			type: "number",
			description: "On the chart: gap between grouped bars in px.",
			default: 4,
			control: { kind: "number", min: 0, max: 12, step: 1 },
		},
		{
			name: "radius",
			type: "number",
			description: "SeriesBar: corner radius in px.",
			default: 3,
			control: { kind: "number", min: 0, max: 8, step: 1 },
		},
		{
			name: "status",
			type: '"loading" | "ready"',
			description:
				"Loading hides the series and retweens the grid; ready replays the growth.",
			default: "ready",
			control: { kind: "select", options: ["ready", "loading"] },
		},
		{
			name: "maxBarSize",
			type: "number",
			description: "On the chart: widest a bar may grow in px.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Bars and lines appear in place and data swaps without a tween.",
		behaviour: [
			"Bars grow from the baseline over 1100ms on cubic-bezier(0.85, 0, 0.15, 1), staggered by i x 440ms / n; each bar finishes its own growth, so none is cut short.",
			"Data changes retween every bar over 500ms; concealing shrinks them back in the same stagger.",
			"While the pointer is on the plot, bars off the active date dim to 30% over 120ms ease-out.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Every SeriesBar, Line and Area registers, so tooltip rows, summary and table list them all.",
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
			entry: "ComposedChart",
			files: [
				{ path: "composed-chart/composed-chart.tsx", type: "registry:ui" },
				{ path: "composed-chart/geometry.ts", type: "registry:ui" },
				{ path: "composed-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["chart", "chart-series", "line-chart", "area-chart"],
		},
		svelte: {
			entry: "ComposedChart",
			files: [
				{ path: "composed-chart/composed-chart.svelte", type: "registry:ui" },
				{ path: "composed-chart/series-bar.svelte", type: "registry:ui" },
				{ path: "composed-chart/context.ts", type: "registry:ui" },
				{ path: "composed-chart/geometry.ts", type: "registry:ui" },
				{ path: "composed-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["chart", "chart-series", "line-chart", "area-chart"],
		},
	},
	keywords: ["composed", "combo", "bar", "line", "area", "chart"],
});
