import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { waffleChart as waffleChartVariants } from "./react/variants";

const VARIANTS = ["mixed", "square", "round"];

export const waffleChart = defineComponent({
	slug: "waffle-chart",
	name: "Waffle Chart",
	description:
		"A unit chart where every cell is one share of the whole; cells travel between parts when the data or legend changes.",
	category: "charts",
	status: "stable",
	variants: variantsOf(waffleChartVariants, ["variant"]),
	props: [
		{
			name: "data",
			type: "Record<string, unknown>[]",
			description:
				"Rows with a name under nameKey and a number under dataKey; names match `config` keys.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "rows",
			type: "number",
			description: "Grid rows; rows times columns cells make the whole.",
			default: 10,
			control: { kind: "none" },
		},
		{
			name: "columns",
			type: "number",
			description: "Grid columns.",
			default: 10,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"Cell shape; `mixed` cycles square, round and framed so neighbours differ without colour.",
			default: "mixed",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "activeIndex",
			type: "number | null",
			description: "Focused part, paired with `onActiveIndexChange`; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Cells appear in place; data changes swap without travel.",
		behaviour: [
			"Cells grow in from the bottom-left corner, column by column.",
			"New data moves as few cells as possible, each on a staggered transform transition.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["ArrowLeft", "ArrowRight"], action: "Previous or next part" },
			{ keys: ["Home", "End"], action: "First or last part" },
			{ keys: ["Escape"], action: "Clear the focus" },
		],
		notes: [
			"A figure with a summary and a data table of value, share and cells per part.",
		],
	},
	guidance: {
		when: [
			"Parts of a whole people should be able to count, like survey answers or a mix.",
		],
		whenNot: [
			{ text: "More than six parts.", use: "bar-chart" },
			{ text: "Shares over time.", use: "area-chart" },
		],
		responsive: ["The grid fits the container's shorter side."],
		performance: ["One SVG rect per cell; 100 cells by default."],
		ai: ["Keep to two to six parts; a 10 by 10 grid reads as percent."],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "WaffleChart",
		},
		svelte: {
			entry: "WaffleChart",
		},
	},
	keywords: ["waffle", "unit chart", "share", "proportion", "grid", "percent"],
});
