import { defineComponent } from "@baby-ui/registry-schema";

export const chartMarkers = defineComponent({
	slug: "chart-markers",
	name: "Chart Markers",
	description:
		"Event markers above a time-series chart that spring in after the reveal and fan out when stacked.",
	category: "charts",
	status: "stable",
	props: [
		{
			name: "items",
			type: "ChartMarker[]",
			description:
				"Events with a date, title and optional description, icon, colour, href or click handler.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg"',
			description: "Marker disc size.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg"] },
		},
		{
			name: "appearance",
			type: '"solid" | "outline"',
			description: "Filled card disc or outlined disc.",
			default: "solid",
			control: { kind: "select", options: ["solid", "outline"] },
		},
		{
			name: "showLines",
			type: "boolean",
			description: "Dashed guide from each marker to the plot floor.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "groupLabel",
			type: "(count: number, date: Date) => string",
			description: "Accessible name for a stack of markers on one date.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Markers, badges and fans appear in place.",
		behaviour: [
			"After the chart reveal, groups spring in 100ms apart from scale 0.85, opacity 0 and 2px blur on a 300/25 spring; the motion contract floors entrances at 0.85, never 0.",
			"A stack fans out over 160 degrees at 50px radius on a 400/22 spring, 40ms apart; the count badge and centre dot pop on 400/20.",
			"Clickable markers grow to 1.15 on hover and press to 0.95 on a 400/17 spring.",
			"Leaving the ready phase springs markers back out, mirroring the entrance.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Reaches each marker" },
			{ keys: ["Enter"], action: "On a stack, pins its fan open" },
			{ keys: ["Escape"], action: "Closes an open fan" },
		],
		notes: [
			"Markers with an href are links and with onClick are buttons; markers with neither are labelled images, never inert buttons.",
			"Stacks are buttons with aria-expanded; fanned markers join the tab order only while open.",
		],
	},

	licenseOrigin: {
		source: "bklit-ui",
		url: "https://github.com/bklit/bklit-ui",
		license: "MIT",
		copyright: "Copyright (c) 2026 uixmat",
	},
	impl: {
		// The usage marks a LineChart.
		react: { entry: "ChartMarkers", registryDependencies: ["line-chart"] },
		svelte: { entry: "ChartMarkers", registryDependencies: ["line-chart"] },
	},
	keywords: ["markers", "events", "annotations", "chart", "timeline"],
});
