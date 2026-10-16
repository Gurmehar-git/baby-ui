import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { githubCalendar as githubCalendarVariants } from "./react/variants";

const VARIANTS = ["default", "glow", "minimal"];
const SHAPES = ["square", "rounded", "circle"];
const SIZES = ["sm", "md", "lg", "fluid"];
const TONES = ["scale", "success", "primary"];

export const githubCalendar = defineComponent({
	slug: "github-calendar",
	name: "GitHub Calendar",
	description:
		"A contribution heatmap: one cell per day in week columns, with a tooltip per day and a colour legend.",
	category: "blocks",
	status: "stable",
	demo: { mode: "auto", frame: "none" },
	variants: variantsOf(githubCalendarVariants, ["variant", "shape", "size", "tone"]),
	props: [
		{
			name: "days",
			type: "GithubCalendarDay[]",
			description:
				"One entry per day: `date` (`YYYY-MM-DD` or Date), `count` and an optional pinned `level` 0 to 4. Gaps render as 0.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Flat cells, cells that glow in their own colour, or shrunken dots.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "shape",
			type: SHAPES.map((v) => `"${v}"`).join(" | "),
			description: "Cell corners.",
			default: "rounded",
			control: { kind: "select", options: SHAPES },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description:
				"Cell size: 10, 12 or 16px, or `fluid` to share the width (scrolling below 10px).",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description:
				"Level colours: the chart scale, the success green, or the primary colour.",
			default: "scale",
			control: { kind: "select", options: TONES },
		},
		{
			name: "title",
			type: "string",
			description: "Heading on the left of the header, e.g. a username.",
			control: { kind: "none" },
		},
		{
			name: "showTotal",
			type: "boolean",
			description: "Show the summed count in the header.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "showLegend",
			type: "boolean",
			description: "Show the Less to More swatches.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "weekStart",
			type: '"sunday" | "monday"',
			description: "First row of each week column.",
			default: "sunday",
			control: { kind: "select", options: ["sunday", "monday"] },
		},
		{
			name: "thresholds",
			type: "number[]",
			description:
				"Upper bounds of levels 1 to 3; quarters of the busiest day when omitted.",
			control: { kind: "none" },
		},
		{
			name: "value",
			type: "string | null",
			description:
				"Selected day as `YYYY-MM-DD`. Controlled with defaultValue and onValueChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "Partial<GithubCalendarLabels>",
			description:
				"Every visible string: grid, total, contribution, contributions, on, less, more.",
			control: { kind: "none" },
		},
		{
			name: "locale",
			type: "string",
			description:
				"Formats months, weekdays, dates and counts; the runtime's locale when omitted.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Cells render in place; hover changes colour state without scaling.",
		behaviour: [
			"Cells fade and scale up from 30% over 360ms, each week column 8ms after the previous.",
			"Hovering a cell scales it to 125%; a day's tooltip opens after 100ms.",
			"The grid scrolls to the newest week on mount when it is wider than its container.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Focuses the grid once, on the selected or newest day" },
			{ keys: ["Arrow Up", "Arrow Down"], action: "Moves a day, Left and Right a week" },
			{ keys: ["Home", "End"], action: "Jumps to either end" },
			{ keys: ["Enter", "Space"], action: "Toggles the day's selection" },
		],
		notes: [
			"Each cell is a button labelled with its count and date; its tooltip repeats that text.",
			"Month and weekday labels are decorative; the legend is aria-hidden.",
		],
	},
	licenseOrigin: {
		source: "componentry",
		url: "https://componentry.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "GithubCalendar",
		},
		svelte: {
			entry: "GithubCalendar",
		},
	},
	keywords: ["github", "contributions", "calendar", "heatmap", "activity", "streak"],
});
