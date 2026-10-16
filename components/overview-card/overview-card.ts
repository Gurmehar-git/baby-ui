import { defineComponent } from "@baby-ui/registry-schema";

export const overviewCard = defineComponent({
	slug: "overview-card",
	name: "Overview Card",
	description:
		"A dashboard hero metric: headline, trend, an optional period switcher and a full-width chart.",
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
			description: "Headline at rest, e.g. the period total.",
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
			name: "periods",
			type: "{ value: string; label: string }[]",
			description: "Period switcher options. Omit to hide the toggle entirely.",
			control: { kind: "none" },
		},
		{
			name: "period",
			type: "string",
			description:
				"Selected period. Controlled with onPeriodChange; bindable in Svelte. Uncontrolled default is defaultPeriod or the first option.",
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
