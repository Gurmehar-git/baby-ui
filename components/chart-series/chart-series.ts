import { defineComponent } from "@baby-ui/registry-schema";

export const chartSeries = defineComponent({
	slug: "chart-series",
	name: "Chart Series",
	description:
		"Series extras shared by line and area charts: loading pulse and sweep, hover highlight, markers and a dashed tail.",
	category: "charts",
	status: "stable",
	props: [
		{
			name: "markerAppearance",
			type: '"solid" | "ring" | "hollow"',
			description: "SeriesMarkers: filled dot, dot with a ring, or an outline only.",
			default: "ring",
			control: { kind: "select", options: ["solid", "ring", "hollow"] },
		},
		{
			name: "loadingStyle",
			type: '"pulse" | "sweep"',
			description: "Which loading visual the demo shows while status is loading.",
			default: "pulse",
			control: { kind: "select", options: ["pulse", "sweep"] },
		},
		{
			name: "status",
			type: '"loading" | "ready"',
			description: "On the chart root; loading shows the pulse or sweep.",
			default: "loading",
			control: { kind: "select", options: ["loading", "ready"] },
		},
		{
			name: "fromX",
			type: "number",
			description:
				"DashTail: plot x where the stroke turns dashed. The demo sets it by data index.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The pulse and sweep hold still as a static silhouette; markers and the highlight band appear in place.",
		behaviour: [
			"Pulse: 2.2s on cubic-bezier(0.85, 0, 0.15, 1) across the whole grow-then-chase, a 280ms pause, then again; on exit it finishes from its current progress.",
			"Sweep: a 25 degree band crosses the silhouette linearly every 2s; the silhouette re-rolls once the band clears the right edge.",
			"Highlight: the band rides a 180/28 spring and jumps when it first appears.",
			"Markers fade and unblur over 500ms, each delayed to meet the reveal edge; the terminal ring scales from 0.55 over 280ms.",
		],
	},
	a11y: {
		notes: [
			"Loading silhouettes are placeholders drawn from a seeded hash, not data; the plot's live region and table carry the real values.",
			"The dashed tail and marker appearance give a second cue besides colour.",
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
			entry: "LoadingPulse",
			files: [
				{ path: "chart-series/loading.tsx", type: "registry:ui" },
				{ path: "chart-series/highlight.tsx", type: "registry:ui" },
				{ path: "chart-series/markers.tsx", type: "registry:ui" },
				{ path: "chart-series/dash-tail.tsx", type: "registry:ui" },
				{ path: "chart-series/core.ts", type: "registry:ui" },
				{ path: "chart-series/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "d3-shape"],
			registryDependencies: ["chart"],
		},
		svelte: {
			entry: "LoadingPulse",
			files: [
				{ path: "chart-series/loading-pulse.svelte", type: "registry:ui" },
				{ path: "chart-series/loading-sweep.svelte", type: "registry:ui" },
				{ path: "chart-series/loading-mode.svelte.ts", type: "registry:ui" },
				{ path: "chart-series/highlight-band.svelte", type: "registry:ui" },
				{ path: "chart-series/series-markers.svelte", type: "registry:ui" },
				{ path: "chart-series/marker-shape.svelte", type: "registry:ui" },
				{ path: "chart-series/terminal-marker.svelte", type: "registry:ui" },
				{ path: "chart-series/dash-tail.svelte", type: "registry:ui" },
				{ path: "chart-series/core.ts", type: "registry:ui" },
				{ path: "chart-series/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "d3-shape"],
			registryDependencies: ["chart"],
		},
	},
	keywords: ["chart", "series", "loading", "skeleton", "markers", "highlight"],
});
