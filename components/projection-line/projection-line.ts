import { defineComponent } from "@baby-ui/registry-schema";

export const projectionLine = defineComponent({
	slug: "projection-line",
	name: "Projection Line",
	description:
		"Dashed forecast from the last point to a horizon; the chart widens its axes to fit it.",
	category: "charts",
	status: "stable",
	props: [
		{
			name: "data",
			type: "ProjectionPoint[]",
			description: "Anchor plus horizon points; build them with buildProjection.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: '"dashed" | "dotted" | "gradient"',
			description: "Stroke pattern; gradient runs from stroke to gradientEnd.",
			default: "dashed",
			control: { kind: "select", options: ["dashed", "dotted", "gradient"] },
		},
		{
			name: "curve",
			type: '"linear" | "bezier"',
			description: "Straight segment or a flat-ended S-curve.",
			default: "linear",
			control: { kind: "select", options: ["linear", "bezier"] },
		},
		{
			name: "endMarker",
			type: "boolean",
			description: "Dot at the horizon.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "horizon",
			type: "number",
			description: "buildProjection: how many steps past the last row to project.",
			default: 7,
			control: { kind: "number", min: 2, max: 20, step: 1 },
		},
		{
			name: "stroke",
			type: "string",
			description: "Stroke colour.",
			default: "var(--chart-3)",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The line and end marker appear in place.",
		behaviour: [
			"The projection reveals inside the chart's left-to-right clip with the series.",
			"The end marker fades in over 280ms once the reveal lands and fades out on conceal.",
		],
	},
	a11y: {
		notes: [
			"Registers its extent with the chart, so the x and y domains grow to include the forecast.",
			"Dash pattern, not colour alone, separates the forecast from the series.",
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
			entry: "ProjectionLine",
			files: [
				{ path: "projection-line/projection-line.tsx", type: "registry:ui" },
				{ path: "projection-line/geometry.ts", type: "registry:ui" },
				{ path: "projection-line/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["chart", "line-chart"],
		},
		svelte: {
			entry: "ProjectionLine",
			files: [
				{ path: "projection-line/projection-line.svelte", type: "registry:ui" },
				{ path: "projection-line/geometry.ts", type: "registry:ui" },
				{ path: "projection-line/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["chart", "line-chart"],
		},
	},
	keywords: ["forecast", "projection", "trend", "chart", "line"],
});
