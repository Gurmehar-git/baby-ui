import { defineComponent } from "@baby-ui/registry-schema";

export const barChart = defineComponent({
	slug: "bar-chart",
	name: "Bar Chart",
	description:
		"Categories as grouped or stacked bars, flat, as square cells or as glass blocks with depth.",
	category: "charts",
	status: "stable",
	props: [
		{
			name: "data",
			type: "Record<string, unknown>[]",
			description: "Rows with a category under xKey and one number per series.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "orientation",
			type: '"vertical" | "horizontal"',
			description: "Which way bars grow; categories run along the other axis.",
			default: "vertical",
			control: { kind: "select", options: ["vertical", "horizontal"] },
		},
		{
			name: "variant",
			type: '"bar" | "squares" | "depth"',
			description:
				"Flat bars, stacks of square cells that cascade in, or glass blocks with perspective depth and a pulse on the active bar.",
			default: "bar",
			control: { kind: "select", options: ["bar", "squares", "depth"] },
		},
		{
			name: "stacked",
			type: "boolean",
			description: "Stack series in one bar instead of grouping them side by side.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "entrance",
			type: '"grow" | "fade"',
			description: "Bars grow from the baseline, or fade in from a 2px blur.",
			default: "grow",
			control: { kind: "select", options: ["grow", "fade"] },
		},
		{
			name: "lineCap",
			type: '"round" | "butt"',
			description: "Bar: rounded or square ends.",
			default: "round",
			control: { kind: "select", options: ["round", "butt"] },
		},
		{
			name: "texture",
			type: "boolean",
			description: "Bar: hatch each series at 45° or 135° so series read without colour.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "status",
			type: '"loading" | "ready"',
			description:
				"Loading shows seeded skeleton bars under a shimmer; ready replays the grow.",
			default: "ready",
			control: { kind: "select", options: ["ready", "loading"] },
		},
		{
			name: "xKey",
			type: "string",
			description: "Key holding each row's category label.",
			default: "name",
			control: { kind: "none" },
		},
		{
			name: "activeIndex",
			type: "number | null",
			description:
				"Category under the pointer or keyboard. Controlled with onActiveIndexChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Bars and cells appear at full size, the skeleton stays still and the depth pulse does not run.",
		behaviour: [
			"Bars grow from the baseline over 1100ms on cubic-bezier(0.85, 0, 0.15, 1), category i delayed by i x 0.4 x 1100ms / n; the chart turns interactive when the last bar lands.",
			"Square cells cascade bottom to top, each column spreading its cells over 40% of the entrance.",
			"Hovering a category dims the others to 0.3 over 150ms; data and legend changes morph every bar over 500ms, and hidden series collapse to the baseline.",
			"The depth variant sweeps a white band up the active bar every 2.4s, ease-in-out.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The summary names each series' highest and lowest category; the data table lists every value.",
			"`texture` hatches series so colour is never the only cue.",
			"Keyboard follows the Chart plot: arrow keys move between points, one category at a time.",
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
			entry: "BarChart",
		},
		svelte: {
			entry: "BarChart",
		},
	},
	keywords: ["bar", "column", "chart", "categories", "stacked", "grouped"],
});
