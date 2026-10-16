import { defineComponent } from "@baby-ui/registry-schema";

export const liveLineChart = defineComponent({
	slug: "live-line-chart",
	name: "Live Line Chart",
	description:
		"Streaming line that scrolls with the clock and eases toward the latest value.",
	category: "charts",
	status: "stable",
	props: [
		{
			name: "data",
			type: "{ time: number; value: number }[]",
			description:
				"Samples, oldest first; `time` is unix seconds. The component never invents them.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "value",
			type: "number",
			description: "Latest value; the tip eases toward it.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "window",
			type: "number",
			description: "Visible window in seconds.",
			default: 30,
			control: { kind: "select", options: ["15", "30", "60"] },
		},
		{
			name: "paused",
			type: "boolean",
			description: "Freezes the scroll; the value still settles, then the loop stops.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "exaggerate",
			type: "boolean",
			description: "Tight y padding (3%) instead of 15%, so small moves fill the plot.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "nowOffsetUnits",
			type: "number",
			description: "Empty lead after the live tip, in x-tick units.",
			default: 0,
			control: { kind: "number", min: 0, max: 2, step: 0.5 },
		},
		{
			name: "lerpSpeed",
			type: "number",
			description:
				"Fraction eased per 60fps frame, applied by elapsed time so any frame rate matches.",
			default: 0.08,
			control: { kind: "select", options: ["0.04", "0.08", "0.2", "1"] },
		},
		{
			name: "curve",
			type: '"monotone" | "linear" | "step"',
			description: "LiveLine: interpolation between samples.",
			default: "monotone",
			control: { kind: "select", options: ["monotone", "linear", "step"] },
		},
		{
			name: "tint",
			type: '"dot" | "line"',
			description: "LiveLine: momentum colours the tip only, or the whole line.",
			default: "dot",
			control: { kind: "select", options: ["dot", "line"] },
		},
		{
			name: "fill",
			type: "boolean",
			description: "LiveLine: gradient fill under the line.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "pulse",
			type: "boolean",
			description: "LiveLine: expanding ring on the tip while scrolling.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "badge",
			type: "boolean",
			description: "LiveLine: value pill with a momentum arrow beside the tip.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "guide",
			type: "boolean",
			description: "LiveLine: dashed rule across the plot at the live value.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "position",
			type: '"left" | "right"',
			description: "LiveYAxis: side the value labels sit on.",
			default: "left",
			control: { kind: "select", options: ["left", "right"] },
		},
		{
			name: "formatTime",
			type: "(ms: number) => string",
			description: "Formats wall-clock ms for axis, pill, tooltip and table.",
			control: { kind: "none" },
		},
		{
			name: "activeIndex",
			type: "number | null",
			description:
				"Sample under the pointer or keyboard. Controlled with onActiveIndexChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The value and y-range jump to their targets and the tip stops pulsing.",
		behaviour: [
			"The window scrolls with the clock; the value and a shrinking y-range ease by 1 - 0.92^(dt / 16.7ms), a time constant of about 200ms at any frame rate.",
			"A growing y-range snaps so a spike is never clipped.",
			"The tip ring grows from the dot to 3.5 times its radius and fades from 0.5 to 0 over 1.5s, repeating while the chart scrolls.",
			"While scrubbing, the tip and badge dim to 0.25 over 300ms; the time pill follows on a 300/30 spring.",
			"Y labels move and fade on a 180/24 spring; leaving labels fade out before they unmount.",
			"The loop stops when paused and settled, offscreen, or in a hidden tab.",
		],
	},
	a11y: {
		role: "group",
		keyboard: [
			{
				keys: ["Arrow Left", "Arrow Right"],
				action: "Moves between samples in the window",
			},
			{ keys: ["Home", "End"], action: "Jumps to the oldest and newest sample" },
			{ keys: ["Escape"], action: "Clears the active sample" },
		],
		notes: [
			"The summary reports the latest value and the window's range; the hidden table lists the samples in view.",
			"Momentum is shown by colour and by an up, down or flat arrow in the badge.",
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
			entry: "LiveLineChart",
			files: [
				{ path: "live-line-chart/live-line-chart.tsx", type: "registry:ui" },
				{ path: "live-line-chart/live-line.tsx", type: "registry:ui" },
				{ path: "live-line-chart/live-axes.tsx", type: "registry:ui" },
				{ path: "live-line-chart/live.ts", type: "registry:ui" },
				{ path: "live-line-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: [
				"clsx",
				"tailwind-merge",
				"tailwind-variants",
				"d3-array",
				"d3-scale",
				"d3-shape",
			],
			registryDependencies: ["chart"],
		},
		svelte: {
			entry: "LiveLineChart",
			files: [
				{ path: "live-line-chart/live-line-chart.svelte", type: "registry:ui" },
				{ path: "live-line-chart/live-plot.svelte", type: "registry:ui" },
				{ path: "live-line-chart/live-line.svelte", type: "registry:ui" },
				{ path: "live-line-chart/live-x-axis.svelte", type: "registry:ui" },
				{ path: "live-line-chart/live-time-pill.svelte", type: "registry:ui" },
				{ path: "live-line-chart/live-y-axis.svelte", type: "registry:ui" },
				{ path: "live-line-chart/live-y-tick.svelte", type: "registry:ui" },
				{ path: "live-line-chart/context.ts", type: "registry:ui" },
				{ path: "live-line-chart/live.ts", type: "registry:ui" },
				{ path: "live-line-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: [
				"clsx",
				"tailwind-merge",
				"tailwind-variants",
				"d3-array",
				"d3-scale",
				"d3-shape",
			],
			registryDependencies: ["chart"],
		},
	},
	keywords: ["live", "streaming", "realtime", "line", "chart", "ticker"],
});
