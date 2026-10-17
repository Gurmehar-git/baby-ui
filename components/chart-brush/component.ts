import { defineComponent } from "@baby-ui/registry-schema";

export const chartBrush = defineComponent({
	slug: "chart-brush",
	name: "Chart Brush",
	description:
		"Overview strip under a time-series chart; drag, resize or key the window the chart shows.",
	category: "charts",
	status: "stable",
	props: [
		{
			name: "data",
			type: "Record<string, unknown>[]",
			description: "The full series, same rows as the chart it drives.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "dataKeys",
			type: "string[]",
			description: "Series drawn in the strip; hidden legend entries drop out.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "range",
			type: "[Date, Date]",
			description:
				"Selected window; pass it to the chart's xDomain. Controlled with onRangeChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: '"area" | "line"',
			description: "Overview drawn as filled areas or bare lines.",
			default: "area",
			control: { kind: "select", options: ["area", "line"] },
		},
		{
			name: "height",
			type: "number",
			description: "Strip height in pixels.",
			default: 64,
			control: { kind: "number", min: 40, max: 120, step: 8 },
		},
		{
			name: "margin",
			type: "{ left?: number; right?: number }",
			description: "Match the chart's side margins so the strip lines up.",
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description: "Accessible name of the range slider.",
			default: "Visible range",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Unchanged: the brush itself does not animate.",
		behaviour: [
			"The window tracks the pointer with no easing; the chart it drives retweens its y-domain over 500ms and morphs its lines.",
		],
	},
	a11y: {
		role: "slider",
		keyboard: [
			{ keys: ["Arrow keys"], action: "Slides the window one point" },
			{ keys: ["Shift+Arrow keys"], action: "Resizes the window's end" },
			{ keys: ["Page Up", "Page Down"], action: "Slides by the window's span" },
			{ keys: ["Home", "End"], action: "Jumps to either edge" },
		],
		notes: [
			"The strip is one slider whose value text reads the window's start and end dates in the chart's locale.",
		],
	},

	impl: {
		// The usage brushes a LineChart.
		react: { entry: "ChartBrush", registryDependencies: ["line-chart"] },
		svelte: { entry: "ChartBrush", registryDependencies: ["line-chart"] },
	},
	keywords: ["brush", "range", "zoom", "overview", "chart", "slider"],
});
