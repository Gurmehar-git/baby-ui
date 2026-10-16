import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { sparkline as sparklineVariants } from "./react/variants";

const VARIANTS = ["default", "success", "warning", "destructive"];

export const sparkline = defineComponent({
	slug: "sparkline",
	name: "Sparkline",
	description:
		"A small trend line with a headline that draws in once seen, morphs on new data and scrubs by pointer or keys.",
	category: "charts",
	status: "stable",
	variants: variantsOf(sparklineVariants, ["variant"]),
	props: [
		{
			name: "data",
			type: "number[]",
			description: "Values in order; new data morphs from the line on screen.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description: "Caption and accessible name.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "value",
			type: "string",
			description: 'Headline, such as "$12.4k"; scrubbing swaps in the point\'s value.',
			control: { kind: "none" },
		},
		{
			name: "change",
			type: "string",
			description: 'Context beside the value, such as "+8.2%".',
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "string[]",
			description: "One label per point, shown while it is scrubbed.",
			control: { kind: "none" },
		},
		{
			name: "area",
			type: "boolean",
			description: "A faint fill under the line.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "interactive",
			type: "boolean",
			description: "Pointer and keyboard scrubbing.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Line and change colour.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
	],
	motion: {
		springs: ["snappy"],
		reducedMotion: "The line shows finished; morphs and the cursor jump.",
		behaviour: [
			"The line draws left to right once half visible, the fill following the pen; then the end dot lands.",
			"The cursor springs along the line to the scrubbed point; the stretch after it dims.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["ArrowLeft", "ArrowRight"], action: "Previous or next point" },
			{ keys: ["PageUp", "PageDown"], action: "Jump a sixth of the series" },
			{ keys: ["Home", "End"], action: "First or latest point" },
			{ keys: ["Escape"], action: "Stop scrubbing" },
		],
		notes: [
			"The figure is named with the label, value and change; the plot is a slider with spoken values.",
		],
	},
	guidance: {
		when: ["KPI cards and table cells that show a trend at a glance."],
		whenNot: [
			{ text: "Comparing several series with axes.", use: "chart" },
			{ text: "A single number that changes.", use: "rolling-digits" },
		],
		responsive: ["Fills its container's width at the given ratio."],
		performance: ["One SVG; numeric motion runs through the shared chart kernel."],
		ai: ["Pass 7 to 60 points; summarise longer series before rendering."],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "Sparkline",
		},
		svelte: {
			entry: "Sparkline",
		},
	},
	keywords: ["sparkline", "trend", "kpi", "mini chart", "line"],
});
