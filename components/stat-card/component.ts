import { defineComponent } from "@baby-ui/registry-schema";

const BKLIT = {
	source: "bklit-ui",
	url: "https://github.com/bklit/bklit-ui",
	license: "MIT",
	copyright: "Copyright (c) 2026 uixmat",
};

export const statCard = defineComponent({
	slug: "stat-card",
	name: "Stat Card",
	description:
		"A KPI card whose headline, caption and trend follow the point under the chart.",
	category: "blocks",
	status: "stable",
	demo: { mode: "auto", frame: "sm" },
	props: [
		{
			name: "data",
			type: "Record<string, unknown>[]",
			description:
				'Rows with a date under xKey and a number under dataKey. Optional with chart "none".',
			control: { kind: "none" },
		},
		{
			name: "value",
			type: "number",
			description: "Headline at rest, e.g. the period average.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "description",
			type: "string",
			description:
				"Context line under the headline; hidden in the empty and error states.",
			control: { kind: "text" },
		},
		{
			name: "trend",
			type: "number",
			description:
				"Change over the period in percent. Hovering shows the change from the previous row.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "comparisonLabel",
			type: "string",
			description:
				'What the trend compares against, read after it by screen readers, e.g. "vs last month".',
			control: { kind: "none" },
		},
		{
			name: "positive",
			type: '"up" | "down"',
			description:
				'Which direction is good news. Use "down" for churn, latency or cost; 0% is always neutral.',
			default: "up",
			control: { kind: "select", options: ["up", "down"] },
		},
		{
			name: "status",
			type: '"loading" | "ready" | "empty" | "error"',
			description:
				"Loading skeletons the headline and badge; empty and error replace the chart with a message.",
			default: "ready",
			control: { kind: "select", options: ["loading", "ready", "empty", "error"] },
		},
		{
			name: "onRetry",
			type: "() => void",
			description: "Shows a Retry button in the error state.",
			control: { kind: "none" },
		},
		{
			name: "chart",
			type: '"area" | "line" | "none"',
			description: 'Chart under the headline; "none" is a figure-only metric card.',
			default: "area",
			control: { kind: "select", options: ["area", "line", "none"] },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg"',
			description: "Chart height.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg"] },
		},
		{
			name: "activeIndex",
			type: "number | null",
			description:
				"The row driving the headline. Controlled with onActiveIndexChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "formatValue",
			type: "(value: number) => string",
			description: "Headline format, e.g. currency. Defaults to locale integers.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The headline swaps without counting; the chart settles instantly.",
		behaviour: [
			'With chart "none" the headline still counts on a new value, as a figure-only metric card.',
			"The headline counts over 400ms only when `value` changes; hovering the chart swaps the figure instantly.",
			"The chart keeps the area or line chart's own reveal and hover motion.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The trend badge pairs its colour with an arrow and a signed percentage, so direction never rests on colour alone.",
			'Screen readers hear the badge as a sentence ("Increased by 12.5% vs last month"); 0% reads as no change.',
			"A polite live region announces a new resting value, and the chart's summary uses the card's own number format.",
			"Keyboard follows the Chart plot: arrow keys move between points.",
		],
	},
	licenseOrigin: BKLIT,
	impl: {
		react: {
			entry: "StatCard",
		},
		svelte: {
			entry: "StatCard",
		},
	},
	keywords: ["stat", "kpi", "metric", "card", "dashboard"],
});

export const statCardMap = defineComponent({
	slug: "stat-card-map",
	name: "Stat Card Map",
	description:
		"A KPI card over a choropleth; the headline follows the region under the pointer.",
	category: "blocks",
	status: "stable",
	demo: { mode: "auto", frame: "lg" },
	props: [
		{
			name: "geo",
			type: "FeatureCollection",
			description: "Boundaries to draw. Bring your own; nothing is fetched.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "values",
			type: "Record<string, number>",
			description: "Value per feature key.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "trends",
			type: "Record<string, number>",
			description:
				"Optional change per feature key; the card trend shows when a region has none.",
			control: { kind: "none" },
		},
		{
			name: "projection",
			type: '"equalEarth" | "naturalEarth" | "mercator"',
			description: "Map projection.",
			default: "equalEarth",
			control: { kind: "select", options: ["equalEarth", "naturalEarth", "mercator"] },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg"',
			description: "Map height.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg"] },
		},
		{
			name: "activeIndex",
			type: "number | null",
			description:
				"The region driving the headline. Controlled with onActiveIndexChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The headline swaps without counting; the map settles instantly.",
		behaviour: [
			"The headline counts to the hovered region's value over 400ms and back when the pointer leaves.",
		],
	},
	a11y: {
		notes: [
			"Keyboard follows the Choropleth chart: arrow keys move between regions.",
			"The trend badge pairs its colour with an arrow and a signed percentage.",
		],
	},
	licenseOrigin: BKLIT,
	impl: {
		react: {
			entry: "StatCardMap",
		},
		svelte: {
			entry: "StatCardMap",
		},
	},
	keywords: ["stat", "kpi", "map", "choropleth", "card"],
});
