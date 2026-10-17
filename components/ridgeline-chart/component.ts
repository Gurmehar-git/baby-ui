import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ridgelineChart as ridgelineChartVariants } from "./variants";

const VARIANTS = ["tint", "series"];

export const ridgelineChart = defineComponent({
	slug: "ridgeline-chart",
	name: "Ridgeline Chart",
	description:
		"Compares the shape of many distributions at once: each series is a smoothed density on one shared axis, stacked with overlap.",
	category: "charts",
	status: "stable",
	variants: variantsOf(ridgelineChartVariants, ["variant"]),
	props: [
		{
			name: "series",
			type: "RidgelineSeries[]",
			description:
				"`{ id, label, values }` per ridge, top to bottom; values are raw observations.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "domain",
			type: "[number, number]",
			description: "Value range of the axis; defaults to the data with a little room.",
			control: { kind: "none" },
		},
		{
			name: "bandwidth",
			type: "number",
			description:
				"Kernel width in value units; defaults to Silverman's rule per series.",
			control: { kind: "none" },
		},
		{
			name: "overlap",
			type: "number",
			description: "How far a ridge may rise into the rows above, in row heights.",
			default: 2.4,
			control: { kind: "none" },
		},
		{
			name: "unit",
			type: "string",
			description: 'Appended to values, such as "°C".',
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"`tint` shades ridges by median; `series` uses each id's config colour.",
			default: "tint",
			control: { kind: "select", options: VARIANTS },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Ridges appear in place; data changes jump.",
		behaviour: [
			"Ridges rise from their baselines one after another.",
			"A new dataset morphs each ridge by id; the focused ridge lifts and shows its middle half.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["ArrowUp", "ArrowDown"], action: "Move between ridges" },
			{ keys: ["Home", "End"], action: "First or last ridge" },
			{ keys: ["Escape"], action: "Clear the focus" },
		],
		notes: [
			"A figure with a summary and a table of median, middle half and count per series.",
		],
	},
	guidance: {
		when: ["The shape of many distributions side by side, like daily highs by month."],
		whenNot: [
			{ text: "One distribution.", use: "bar-chart" },
			{ text: "Values over time.", use: "line-chart" },
		],
		responsive: ["Rows share the container's height; labels sit in a left gutter."],
		performance: [
			"Densities sample 96 points per series and recompute only when data changes.",
		],
		ai: ["Pass 20 or more values per series; fewer make lumpy ridges."],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "RidgelineChart",
		},
		svelte: {
			entry: "RidgelineChart",
		},
	},
	keywords: ["ridgeline", "joyplot", "distribution", "density", "chart"],
});
