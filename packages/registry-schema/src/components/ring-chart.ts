import { defineComponent } from "../index.ts";

export const ringChart = defineComponent({
	slug: "ring-chart",
	name: "Ring Chart",
	description:
		"Concentric progress rings that expand, then sweep to each value against its maximum.",
	category: "charts",
	status: "stable",
	props: [
		{
			name: "data",
			type: "Record<string, unknown>[]",
			description: "One row per ring: a name under nameKey, a value and a maximum.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "cap",
			type: '"round" | "butt"',
			description: "Round or square ends on each ring.",
			default: "round",
			control: { kind: "select", options: ["round", "butt"] },
		},
		{
			name: "track",
			type: "boolean",
			description: "Show the unfilled remainder of each ring in the border colour.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "strokeWidth",
			type: "number",
			description: "Ring thickness before the chart scales to fit.",
			default: 12,
			control: { kind: "number", min: 4, max: 24, step: 2 },
		},
		{
			name: "gap",
			type: "number",
			description: "Space between rings before the chart scales to fit.",
			default: 6,
			control: { kind: "number", min: 0, max: 16, step: 1 },
		},
		{
			name: "maxKey",
			type: "string",
			description: "Key holding each ring's maximum; missing maxima count as 100.",
			default: "max",
			control: { kind: "none" },
		},
		{
			name: "activeIndex",
			type: "number | null",
			description:
				"Ring under the pointer or keyboard. Controlled with onActiveIndexChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Rings appear filled and the hover scale jumps to its end state.",
		behaviour: [
			"Each ring expands from 0.9 scale over 1100ms, 80ms apart, then sweeps to its value from 600ms, 100ms apart.",
			"Rings start at 0.9, never 0, because nothing scales in from nothing.",
			"The active ring scales to 1.03 and rings outside it to 1.02 on a 400/25 spring; the others fade to 35% over 150ms.",
		],
	},
	a11y: {
		role: "group",
		keyboard: [
			{ keys: ["Tab"], action: "Focuses the chart" },
			{ keys: ["Arrow keys"], action: "Moves between rings" },
			{ keys: ["Escape"], action: "Clears the active ring" },
		],
		notes: [
			"Keyboard moves announce the ring name, value, maximum and progress.",
			"A visually hidden table lists every ring's value, maximum and progress.",
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
			entry: "RingChart",
			files: [
				{ path: "ring-chart/ring-chart.tsx", type: "registry:ui" },
				{ path: "ring-chart/geometry.ts", type: "registry:ui" },
				{ path: "ring-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "d3-shape"],
			registryDependencies: ["chart", "rolling-digits"],
		},
		svelte: {
			entry: "RingChart",
			files: [
				{ path: "ring-chart/ring-chart.svelte", type: "registry:ui" },
				{ path: "ring-chart/ring-plot.svelte", type: "registry:ui" },
				{ path: "ring-chart/ring.svelte", type: "registry:ui" },
				{ path: "ring-chart/geometry.ts", type: "registry:ui" },
				{ path: "ring-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "d3-shape"],
			registryDependencies: ["chart", "rolling-digits"],
		},
	},
	keywords: ["ring", "progress", "radial", "goal", "chart"],
});
