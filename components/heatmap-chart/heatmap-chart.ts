import { defineComponent } from "@baby-ui/registry-schema";

export const heatmapChart = defineComponent({
	slug: "heatmap-chart",
	name: "Heatmap Chart",
	description:
		"Calendar heatmap of daily values in five levels, with a legend that isolates a level.",
	category: "charts",
	status: "stable",
	props: [
		{
			name: "data",
			type: "Record<string, unknown>[]",
			description:
				"Rows with a date under dateKey and a number under valueKey; missing days count as 0.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "shape",
			type: '"square" | "rounded" | "circle"',
			description: "Cell corners.",
			default: "rounded",
			control: { kind: "select", options: ["rounded", "square", "circle"] },
		},
		{
			name: "patterns",
			type: "boolean",
			description:
				"Dots, lines and cross-hatch per level, so levels read without colour.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "weekStart",
			type: '"auto" | "sunday" | "monday"',
			description: "First row. Auto follows the locale's week.",
			default: "auto",
			control: { kind: "select", options: ["auto", "sunday", "monday"] },
		},
		{
			name: "gap",
			type: "number",
			description: "Gap between cells in pixels.",
			default: 3,
			control: { kind: "number", min: 0, max: 6, step: 1 },
		},
		{
			name: "legend",
			type: "boolean",
			description: "Demo toggle for the HeatmapLegend part below the grid.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "status",
			type: '"loading" | "ready"',
			description:
				"Loading fades the cells out and shimmers the grid; ready fades them back in.",
			default: "ready",
			control: { kind: "select", options: ["ready", "loading"] },
		},
		{
			name: "thresholds",
			type: "number[]",
			description: "Four cut points for levels 1 to 4. Defaults to quarters of the max.",
			control: { kind: "none" },
		},
		{
			name: "formatLabel",
			type: "(value: number, date: Date) => string",
			description:
				'Replaces the tooltip row, for a unit such as "4 commits". Defaults to "Value" and the number.',
			control: { kind: "none" },
		},
		{
			name: "locale",
			type: "string",
			description:
				"Month, weekday and date labels, and the auto week start; pass the same locale as ChartContainer.",
			default: "auto",
			control: { kind: "select", options: ["auto", "en-US", "en-GB", "ar-EG", "ja-JP"] },
		},
		{
			name: "activeIndex",
			type: "number | null",
			description: "Active day. Controlled with onActiveIndexChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Cells appear at once, the shimmer holds at a flat 0.2 and hover dims still fade.",
		behaviour: [
			"Cells fade in over 1600ms on cubic-bezier(0.85, 0, 0.916, 0.282) with a seeded per-cell delay; at the default length the spread is zero, so they fade together.",
			"Ready to loading fades the cells out over 450ms, then each cell pulses to a seeded 0 to 0.85 over 0.35 to 1.2s and rests 80 to 500ms.",
			"Hovering a day or a legend level fades every other cell to 0.3 over 220ms on cubic-bezier(0.4, 0, 0.2, 1).",
			"Phases advance when their clock ends, not on a timer set at the start.",
		],
	},
	a11y: {
		role: "group",
		keyboard: [
			{ keys: ["Arrow Up", "Arrow Down"], action: "Moves a day" },
			{ keys: ["Arrow Left", "Arrow Right"], action: "Moves a week" },
			{ keys: ["Page Up", "Page Down"], action: "Moves a tenth of the range" },
			{ keys: ["Home", "End"], action: "Jumps to the first and last day" },
			{ keys: ["Escape"], action: "Clears the active day" },
		],
		notes: [
			"Keyboard moves announce the full date and value.",
			"Legend levels are toggle buttons: hover or focus previews a level, a click pins it.",
			"Every day is in the hidden data table; patterns add a non-colour cue for the levels.",
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
			entry: "HeatmapChart",
		},
		svelte: {
			entry: "HeatmapChart",
		},
	},
	keywords: ["heatmap", "calendar", "contributions", "activity", "chart"],
});
