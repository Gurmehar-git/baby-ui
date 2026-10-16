import { defineComponent } from "@baby-ui/registry-schema";

export const chart = defineComponent({
	slug: "chart",
	name: "Chart",
	description:
		"Chart base: container, config, grid, axes, tooltip and legend on d3 and SVG, shared by every chart.",
	category: "charts",
	status: "stable",
	props: [
		{
			name: "config",
			type: "ChartConfig",
			description:
				"Series labels and colours, keyed by data key. Same shape as shadcn's.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "aspect",
			type: '"video" | "wide" | "square" | "auto"',
			description: "Container aspect ratio. `auto` fills a parent with its own height.",
			default: "video",
			control: { kind: "select", options: ["video", "wide", "square", "auto"] },
		},
		{
			name: "locale",
			type: "string",
			description: "BCP 47 locale for dates and numbers. Defaults to the reader's own.",
			default: "auto",
			control: { kind: "select", options: ["auto", "en-GB", "de-DE", "ja-JP", "ar-EG"] },
		},
		{
			name: "title",
			type: "string",
			description: "Accessible name; also the caption of the screen-reader data table.",
			default: "Chart",
			control: { kind: "none" },
		},
		{
			name: "description",
			type: "string",
			description: "Replaces the generated screen-reader summary.",
			control: { kind: "none" },
		},
		{
			name: "hiddenSeries",
			type: "string[]",
			description:
				"Series switched off in the legend. Controlled with onHiddenSeriesChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "indicator",
			type: '"dot" | "line" | "dashed"',
			description: "ChartTooltipContent: series marker beside each row.",
			default: "dot",
			control: { kind: "select", options: ["dot", "line", "dashed"] },
		},
		{
			name: "datePill",
			type: "boolean",
			description: "ChartTooltip: date ticker that rolls under the crosshair.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "variant",
			type: '"dashed" | "dotted" | "solid"',
			description: "CartesianGrid: line pattern.",
			default: "dashed",
			control: { kind: "select", options: ["dashed", "dotted", "solid"] },
		},
		{
			name: "align",
			type: '"start" | "center" | "end"',
			description: "ChartLegendContent alignment.",
			default: "center",
			control: { kind: "select", options: ["start", "center", "end"] },
		},
		{
			name: "background",
			type: '"none" | "dots" | "lines" | "grid" | "gradient"',
			description: "Background part's `variant`; the demo omits it at none.",
			default: "none",
			control: { kind: "select", options: ["none", "dots", "lines", "grid", "gradient"] },
		},
		{
			name: "tone",
			type: '"muted" | "highlight" | "positive" | "negative"',
			description: "ReferenceArea: band colour. The demo shows a target band when set.",
			default: "none",
			control: {
				kind: "select",
				options: ["none", "muted", "highlight", "positive", "negative"],
			},
		},
		{
			name: "status",
			type: '"loading" | "ready"',
			description:
				"On the chart root. Ready to loading conceals the series and retweens the grid; back replays the reveal.",
			default: "ready",
			control: { kind: "select", options: ["ready", "loading"] },
		},
		{
			name: "activeIndex",
			type: "number | null",
			description:
				"On the chart root: the datum under the pointer or keyboard. Controlled with onActiveIndexChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "selection",
			type: "{ start: number; end: number } | null",
			description:
				"On the chart root: index range dragged with a mouse or pen, or grown with Shift+Arrow. Controlled with onSelectionChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "edge",
			type: '"dashed" | "solid" | "none"',
			description:
				"SelectionArea: rules at the range edges. Drag across the plot to see it.",
			default: "dashed",
			control: { kind: "select", options: ["dashed", "solid", "none"] },
		},
		{
			name: "xDomain",
			type: "[Date, Date]",
			description:
				"On the chart root: visible date window, e.g. from ChartBrush. Y-domain, keyboard and table follow it; the y-domain retweens on change.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Reveal, domain tweens and morphs settle on their end state at once; crosshair, dots and panel jump instead of springing.",
		behaviour: [
			"Series reveal left to right through a clip over 1100ms on cubic-bezier(0.85, 0, 0.15, 1); the next phase starts when the clip finishes, not on a timer.",
			"Data and visibility changes tween the y-domain over 500ms on the same curve; moves under 2% of the span snap.",
			"Crosshair and dots follow on a 300/30 spring, the panel on 100/20, and the panel enters at scale 0.85 with a 20px slide on a 300/25 spring.",
			"The date pill rolls its month and day stacks on a 400/35 spring.",
			"Keyboard moves jump instead of springing.",
			"A selected range fades in and out over 150ms and dims the series; the highlight band takes its width.",
		],
	},
	a11y: {
		role: "group",
		keyboard: [
			{ keys: ["Tab"], action: "Focuses the plot" },
			{ keys: ["Arrow Left", "Arrow Right"], action: "Moves between data points" },
			{ keys: ["Page Up", "Page Down"], action: "Moves a tenth of the data" },
			{ keys: ["Home", "End"], action: "Jumps to the first and last point" },
			{
				keys: ["Shift+Arrow Left", "Shift+Arrow Right"],
				action: "Grows a selected range from the active point",
			},
			{ keys: ["Escape"], action: "Clears the selected range, then the active point" },
		],
		notes: [
			"The plot is a focusable group with aria-roledescription, named by title and described by a generated summary.",
			"Every chart ships a visually hidden data table, and keyboard moves announce the active point in a polite live region.",
			"Legend entries are real toggles (aria-pressed), so hiding a series works from the keyboard and colour is never the only cue.",
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
			entry: "ChartContainer",
		},
		svelte: {
			entry: "ChartContainer",
		},
	},
	keywords: ["chart", "graph", "data", "visualization", "tooltip", "legend", "axis"],
});

export const lineChart = defineComponent({
	slug: "line-chart",
	name: "Line Chart",
	description:
		"Time series as lines that reveal, morph on new data and dim around the pointer.",
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
			name: "curve",
			type: '"natural" | "monotone" | "linear" | "step"',
			description: "Line: interpolation between points.",
			default: "natural",
			control: { kind: "select", options: ["natural", "monotone", "linear", "step"] },
		},
		{
			name: "variant",
			type: '"solid" | "dashed"',
			description: "Line: stroke pattern.",
			default: "solid",
			control: { kind: "select", options: ["solid", "dashed"] },
		},
		{
			name: "strokeWidth",
			type: "number",
			description: "Line: stroke width in pixels.",
			default: 2.5,
			control: { kind: "number", min: 1, max: 6, step: 0.5 },
		},
		{
			name: "fadeEdges",
			type: 'boolean | "left" | "right"',
			description:
				"Line: fade the stroke into the plot edges. `true` fades both, `false` fades neither.",
			default: "both",
			control: { kind: "select", options: ["both", "left", "right", "none"] },
		},
		{
			name: "status",
			type: '"loading" | "ready"',
			description:
				"Loading conceals the lines and retweens the grid; ready replays the reveal.",
			default: "ready",
			control: { kind: "select", options: ["ready", "loading"] },
		},
		{
			name: "loadingStyle",
			type: '"pulse" | "sweep"',
			description:
				"Line: what shows while status is loading. Pulse travels one eased 2.2s sweep; sweep shimmers over a placeholder silhouette.",
			default: "pulse",
			control: { kind: "select", options: ["pulse", "sweep"] },
		},
		{
			name: "showMarkers",
			type: "boolean",
			description: "Line: a marker per datum, fading in with the reveal edge.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "terminalMarker",
			type: "boolean",
			description: "Line: hollow ring on the last datum.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "dashFromIndex",
			type: "number",
			description:
				"Line: data index from which the stroke turns dashed, e.g. an incomplete period. The demo turns it off at -1.",
			default: -1,
			control: { kind: "number", min: -1, max: 28, step: 1 },
		},
		{
			name: "showHighlight",
			type: "boolean",
			description: "Line: brighten the stroke one point either side of the active point.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "encoding",
			type: '"dashed" | "dotted"',
			description:
				"ProfitLossLine: how the negative side differs beyond colour. The demo swaps in a profit/loss series when set.",
			default: "none",
			control: { kind: "select", options: ["none", "dashed", "dotted"] },
		},
		{
			name: "xKey",
			type: "string",
			description: "Key holding each row's date.",
			default: "date",
			control: { kind: "none" },
		},
		{
			name: "animate",
			type: "boolean",
			description: "Turn off every chart animation, not just under reduced motion.",
			default: true,
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Lines appear in place and new data swaps without a morph.",
		behaviour: [
			"New data morphs the line over 500ms on cubic-bezier(0.85, 0, 0.15, 1), point by point by date; new points grow out of their neighbour.",
			"While the pointer is on the plot every line dims to 30% over 400ms; hovering a legend entry dims the others the same way.",
			"The highlight band spans one point either side of the active one and follows on a 180/28 spring; its stroke fades in over 400ms.",
			"Loading pulse: one 2.2s sweep on cubic-bezier(0.85, 0, 0.15, 1), growing to the right then chasing its tail, 280ms apart; it exits from where it is when data arrives.",
			"Profit/loss segments dim to 25% over 200ms when the active point sits on the other side of the baseline.",
		],
	},
	a11y: {
		notes: [
			"Keyboard follows the Chart plot: arrow keys move between points.",
			"Each Line registers its series, so the summary, table and live region list it.",
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
			entry: "LineChart",
		},
		svelte: {
			entry: "LineChart",
		},
	},
	keywords: ["line", "chart", "time series", "trend"],
});
