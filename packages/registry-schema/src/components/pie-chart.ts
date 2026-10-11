import { defineComponent } from "../index.ts";

export const pieChart = defineComponent({
	slug: "pie-chart",
	name: "Pie Chart",
	description:
		"Pie or donut that sweeps in slice by slice and pops the slice under the pointer.",
	category: "charts",
	status: "stable",
	props: [
		{
			name: "data",
			type: "Record<string, unknown>[]",
			description:
				"One row per slice, with a name under nameKey and a number under dataKey.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: '"pie" | "donut"',
			description:
				"Donut leaves a hole with the total, or the active slice, in the middle.",
			default: "donut",
			control: { kind: "select", options: ["donut", "pie"] },
		},
		{
			name: "hover",
			type: '"translate" | "grow"',
			description:
				"Active slice either slides out along its bisector or grows its outer radius.",
			default: "translate",
			control: { kind: "select", options: ["translate", "grow"] },
		},
		{
			name: "hoverOffset",
			type: "number",
			description: "Pixels the active slice moves out or grows by.",
			default: 10,
			control: { kind: "number", min: 0, max: 24, step: 2 },
		},
		{
			name: "cornerRadius",
			type: "number",
			description: "Rounds each slice's corners.",
			default: 4,
			control: { kind: "number", min: 0, max: 16, step: 1 },
		},
		{
			name: "labels",
			type: "boolean",
			description: "Percentage labels on slices wide enough to hold them.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "padAngle",
			type: "number",
			description: "Gap between slices, in radians.",
			default: 0.02,
			control: { kind: "none" },
		},
		{
			name: "centerLabel",
			type: "string",
			description: "Donut caption when no slice is active.",
			default: "Total",
			control: { kind: "none" },
		},
		{
			name: "activeIndex",
			type: "number | null",
			description:
				"Slice under the pointer or keyboard. Controlled with onActiveIndexChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Slices appear whole and the hover pop jumps to its end state.",
		behaviour: [
			"Each slice sweeps clockwise over 1100ms on cubic-bezier(0.85, 0, 0.15, 1), starting 100ms plus 80ms per slice.",
			"The active slice slides out or grows on a 400/25 spring; the others fade to 40% over 150ms.",
			"Hiding a slice from the legend replays the sweep with the remaining slices.",
		],
	},
	a11y: {
		role: "group",
		keyboard: [
			{ keys: ["Tab"], action: "Focuses the chart" },
			{ keys: ["Arrow keys"], action: "Moves between slices" },
			{ keys: ["Home", "End"], action: "Jumps to the first and last slice" },
			{ keys: ["Escape"], action: "Clears the active slice" },
		],
		notes: [
			"Keyboard moves announce the slice name, value and share.",
			"A visually hidden table lists every slice with its value and share; slice labels print the share, so colour is never the only cue.",
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
			entry: "PieChart",
			files: [
				{ path: "pie-chart/pie-chart.tsx", type: "registry:ui" },
				{ path: "pie-chart/geometry.ts", type: "registry:ui" },
				{ path: "pie-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "d3-shape"],
			registryDependencies: ["chart", "rolling-digits"],
		},
		svelte: {
			entry: "PieChart",
			files: [
				{ path: "pie-chart/pie-chart.svelte", type: "registry:ui" },
				{ path: "pie-chart/pie-plot.svelte", type: "registry:ui" },
				{ path: "pie-chart/pie-slice.svelte", type: "registry:ui" },
				{ path: "pie-chart/geometry.ts", type: "registry:ui" },
				{ path: "pie-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "d3-shape"],
			registryDependencies: ["chart", "rolling-digits"],
		},
	},
	keywords: ["pie", "donut", "chart", "share", "proportion"],
});
