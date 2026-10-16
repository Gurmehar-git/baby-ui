import { defineComponent } from "@baby-ui/registry-schema";

export const choroplethChart = defineComponent({
	slug: "choropleth-chart",
	name: "Choropleth Chart",
	description:
		"Map that shades regions on a five-step scale, fades in, dims around the pointer and zooms.",
	category: "charts",
	status: "stable",
	props: [
		{
			name: "data",
			type: "FeatureCollection",
			description: "GeoJSON boundaries. Bring your own; nothing is fetched at runtime.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "values",
			type: "Record<string, number>",
			description: "Value per region, keyed by keyProp (falls back to the feature id).",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "projection",
			type: '"mercator" | "equalEarth" | "naturalEarth"',
			description: "Map projection, fitted to the plot.",
			default: "equalEarth",
			control: { kind: "select", options: ["equalEarth", "naturalEarth", "mercator"] },
		},
		{
			name: "graticule",
			type: "boolean",
			description: "Latitude and longitude grid behind the regions.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "legend",
			type: "boolean",
			description: "Five-step scale with its range, plus the no-data swatch.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "zoomable",
			type: "boolean",
			description:
				"Wheel, drag and pinch zoom with +, - and reset buttons; +, -, 0 and shift+arrows on the keyboard.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "dimOpacity",
			type: "number",
			description: "Opacity of the other regions while one is active.",
			default: 0.4,
			control: { kind: "number", min: 0.1, max: 0.9, step: 0.1 },
		},
		{
			name: "zoom",
			type: "{ k: number; x: number; y: number }",
			description: "Zoom transform. Controlled with onZoomChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "keyProp",
			type: "string",
			description: "Feature property that keys `values`.",
			default: "name",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "Partial<ChoroplethLabels>",
			description: "Value, region, no-data and zoom button labels.",
			control: { kind: "none" },
		},
		{
			name: "activeIndex",
			type: "number | null",
			description:
				"Active region in label order. Controlled with onActiveIndexChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Regions appear at once and zoom steps apply without easing; dimming keeps its opacity fade.",
		behaviour: [
			"Regions fade in over 1100ms on cubic-bezier(0.85, 0, 0.15, 1).",
			"Other regions dim over 180ms ease-out and undim on the same transition instead of snapping back.",
			"Zoom steps ease over 180ms; dragging and pinching track the pointer with no transition.",
		],
	},
	a11y: {
		role: "group",
		keyboard: [
			{ keys: ["Arrow keys"], action: "Walks regions with data in label order" },
			{ keys: ["+", "-"], action: "Zoom in and out when zoomable" },
			{ keys: ["0"], action: "Resets the zoom" },
			{ keys: ["Shift+Arrow keys"], action: "Pans when zoomable" },
			{ keys: ["Escape"], action: "Clears the active region" },
		],
		notes: [
			"Regions without data use the muted fill and a No data legend entry, so the scale never implies a zero.",
			"The data table lists every region with a value; the summary names the highest and lowest.",
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
			entry: "ChoroplethChart",
			files: [
				{ path: "choropleth-chart/choropleth-chart.tsx", type: "registry:ui" },
				{ path: "choropleth-chart/geometry.ts", type: "registry:ui" },
				{ path: "choropleth-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: [
				"clsx",
				"tailwind-merge",
				"tailwind-variants",
				"d3-geo",
				"@types/geojson",
			],
			registryDependencies: ["chart"],
		},
		svelte: {
			entry: "ChoroplethChart",
			files: [
				{ path: "choropleth-chart/choropleth-chart.svelte", type: "registry:ui" },
				{ path: "choropleth-chart/choropleth-plot.svelte", type: "registry:ui" },
				{ path: "choropleth-chart/choropleth-legend.svelte", type: "registry:ui" },
				{ path: "choropleth-chart/geometry.ts", type: "registry:ui" },
				{ path: "choropleth-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: [
				"clsx",
				"tailwind-merge",
				"tailwind-variants",
				"d3-geo",
				"@types/geojson",
			],
			registryDependencies: ["chart"],
		},
	},
	keywords: ["map", "choropleth", "geo", "world", "region", "chart"],
});
