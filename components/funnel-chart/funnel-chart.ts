import { defineComponent } from "@baby-ui/registry-schema";

export const funnelChart = defineComponent({
	slug: "funnel-chart",
	name: "Funnel Chart",
	description:
		"Stage-by-stage drop-off as layered bands that grow in turn and swell around the stage under the pointer.",
	category: "charts",
	status: "stable",
	props: [
		{
			name: "data",
			type: "FunnelStage[]",
			description: "Stages in order as { label, value, displayValue?, color? }.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "orientation",
			type: '"horizontal" | "vertical"',
			description: "Direction the funnel flows.",
			default: "horizontal",
			control: { kind: "select", options: ["horizontal", "vertical"] },
		},
		{
			name: "edges",
			type: '"curved" | "straight"',
			description: "Bezier bands or straight trapezoids between stages.",
			default: "curved",
			control: { kind: "select", options: ["curved", "straight"] },
		},
		{
			name: "labelLayout",
			type: '"spread" | "grouped"',
			description: "Value, share and name spread across the band or stacked together.",
			default: "spread",
			control: { kind: "select", options: ["spread", "grouped"] },
		},
		{
			name: "pattern",
			type: '"none" | "lines" | "dots" | "grid"',
			description:
				"Texture over each stage's solid ring, so stages never differ by colour alone.",
			default: "none",
			control: { kind: "select", options: ["none", "lines", "dots", "grid"] },
		},
		{
			name: "layers",
			type: "number",
			description: "Halo rings per stage; the innermost is solid.",
			default: 3,
			control: { kind: "number", min: 1, max: 4, step: 1 },
		},
		{
			name: "gap",
			type: "number",
			description: "Pixels between stages.",
			default: 4,
			control: { kind: "number", min: 0, max: 16, step: 2 },
		},
		{
			name: "grid",
			type: "boolean",
			description: "Alternate background bands and rules between stages.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "showValues",
			type: "boolean",
			description: "Stage value on each band.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "showPercentage",
			type: "boolean",
			description: "Share of the first stage on each band.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "showLabels",
			type: "boolean",
			description: "Stage name on each band.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "activeIndex",
			type: "number | null",
			description:
				"Stage under the pointer or keyboard. Controlled with onActiveIndexChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Stages and labels appear at once and the hover swell jumps to its end state.",
		behaviour: [
			"Each stage grows from scale 0.9, not 0, over 1100ms on cubic-bezier(0.85, 0, 0.15, 1), 120ms apart.",
			"Labels fade in over 350ms, 250ms after their stage.",
			"The active stage's rings swell on springs from 300/24 inward to 180/18 outward; other stages fade to 40% over 150ms.",
		],
	},
	a11y: {
		role: "group",
		keyboard: [
			{ keys: ["Arrow keys"], action: "Moves between stages" },
			{ keys: ["Escape"], action: "Clears the active stage" },
		],
		notes: [
			"Stage colours step down one blue ramp in order and every band prints its value, share and name, so colour is never the only cue.",
			"The hidden table lists each stage with its share of the first and of the previous stage.",
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
			entry: "FunnelChart",
			files: [
				{ path: "funnel-chart/funnel-chart.tsx", type: "registry:ui" },
				{ path: "funnel-chart/geometry.ts", type: "registry:ui" },
				{ path: "funnel-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["chart"],
		},
		svelte: {
			entry: "FunnelChart",
			files: [
				{ path: "funnel-chart/funnel-chart.svelte", type: "registry:ui" },
				{ path: "funnel-chart/funnel-plot.svelte", type: "registry:ui" },
				{ path: "funnel-chart/funnel-ring.svelte", type: "registry:ui" },
				{ path: "funnel-chart/geometry.ts", type: "registry:ui" },
				{ path: "funnel-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["chart"],
		},
	},
	keywords: ["funnel", "conversion", "drop-off", "stages", "chart"],
});
