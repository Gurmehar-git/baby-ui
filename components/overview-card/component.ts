import { defineComponent } from "@baby-ui/registry-schema";

export const overviewCard = defineComponent({
	slug: "overview-card",
	name: "Overview Card",
	description:
		"A dashboard hero metric from parts: headline, trend, an optional period switcher and a full-width chart.",
	category: "blocks",
	status: "stable",
	retired: true,
	props: [
		{
			name: "data",
			type: "Record<string, unknown>[]",
			description: "Rows with a date under xKey and a number under dataKey.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "value",
			type: "number",
			description: "OverviewCard: headline at rest, e.g. the period total.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "trend",
			type: "number",
			description: "Change over the whole period, in percent.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "name",
			type: "string",
			description:
				"OverviewCard: what the metric is; the chart's accessible name and the period switcher's lead.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description: 'OverviewCard: caption under the headline at rest, e.g. "This month".',
			required: true,
			control: { kind: "none" },
		},
		{
			name: "value",
			type: "string",
			description:
				"OverviewCardPeriods: selected period. Controlled with onValueChange or defaultValue; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"OverviewCard: OverviewCardHeader (OverviewCardTitle, OverviewCardDescription, OverviewCardPeriods) and OverviewCardContent (OverviewCardValue, OverviewCardTrend, OverviewCardChart).",
			control: { kind: "none" },
		},
		{
			name: "chart",
			type: '"area" | "line"',
			description: "Chart under the headline.",
			default: "area",
			control: { kind: "select", options: ["area", "line"] },
		},
		{
			name: "size",
			type: '"default" | "lg"',
			description: "Chart height.",
			default: "default",
			control: { kind: "select", options: ["default", "lg"] },
		},
		{
			name: "activeIndex",
			type: "number | null",
			description:
				"The point driving the headline caption. Controlled with onActiveIndexChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The headline counter and the chart both settle instantly.",
		behaviour: [
			"The headline counts up over 400ms when its value changes.",
			"The chart keeps the area or line chart's own reveal and hover motion.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The trend badge pairs its colour with an arrow and a signed percentage, so direction never rests on colour alone.",
			"The period switcher is a real ToggleGroup, keyboard operable and announced by name.",
			"Keyboard follows the Chart plot: arrow keys move between points.",
		],
	},
	impl: {
		react: {
			entry: "OverviewCard",
		},
		svelte: {
			entry: "OverviewCard",
		},
	},
	keywords: ["overview", "dashboard", "hero metric", "chart", "card"],
});
