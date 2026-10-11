import { defineComponent } from "../index.ts";

export const sunburstChart = defineComponent({
	slug: "sunburst-chart",
	name: "Sunburst Chart",
	description:
		"Hierarchy as nested rings that sweep in, drill down on click or Enter, and grow along the hovered path.",
	category: "charts",
	status: "stable",
	props: [
		{
			name: "data",
			type: "SunburstNode",
			description:
				"Tree of { name, value?, color?, children? }; branches sum their leaves.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: '"sunburst" | "donut"',
			description: "Donut keeps a hub with the focus total even at the root.",
			default: "sunburst",
			control: { kind: "select", options: ["sunburst", "donut"] },
		},
		{
			name: "labels",
			type: "boolean",
			description: "Names along arcs wide enough to hold them.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "breadcrumb",
			type: "boolean",
			description: "Drill-down path above the chart, one button per level.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "hoverPop",
			type: "number",
			description:
				"Pixels the hovered path grows outward, capped at 10% of a ring, split along the path.",
			default: 8,
			control: { kind: "select", options: ["0", "2", "4", "8"] },
		},
		{
			name: "staggerScale",
			type: "number",
			description: "Multiplies the ring and clockwise enter stagger; floored at 0.25.",
			default: 1,
			control: { kind: "number", min: 0.25, max: 2, step: 0.25 },
		},
		{
			name: "focus",
			type: "string",
			description:
				'Id of the zoomed node, names joined by " / ". Controlled with onFocusChange; bindable in Svelte.',
			control: { kind: "none" },
		},
		{
			name: "activeIndex",
			type: "number | null",
			description:
				"Arc under the pointer or keyboard, among those visible under the focus. Controlled with onActiveIndexChange.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Rings appear whole; zoom and hover grow land on their end state at once.",
		behaviour: [
			"The chart fades in over 350ms on cubic-bezier(0.22, 1, 0.36, 1); each arc sweeps clockwise over 1100ms, 120ms per ring plus 80ms per position.",
			"Arcs grow from scale 0.9, not 0, so nothing appears from a point.",
			"Drilling lerps every arc's angles and radii over 750ms on cubic-bezier(0.22, 1, 0.36, 1) along the shorter way round; arcs entering or leaving collapse to a point.",
			"The hovered path grows outward over 420ms and unrelated arcs fade to 25% over 160ms.",
		],
	},
	a11y: {
		role: "group",
		keyboard: [
			{ keys: ["Arrow keys"], action: "Walks the arcs visible under the focus" },
			{ keys: ["Enter"], action: "Drills into the active arc" },
			{ keys: ["Backspace"], action: "Goes up a level" },
			{ keys: ["Escape"], action: "Clears the active arc, then goes up" },
		],
		notes: [
			"The breadcrumb is a nav of real buttons, so every level is reachable without the chart.",
			"Keyboard moves announce the full path, value and share of the focus; the hidden table lists every node by path.",
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
			entry: "SunburstChart",
			files: [
				{ path: "sunburst-chart/sunburst-chart.tsx", type: "registry:ui" },
				{ path: "sunburst-chart/geometry.ts", type: "registry:ui" },
				{ path: "sunburst-chart/variants.ts", type: "registry:ui" },
			],
			dependencies: ["tailwind-variants"],
			registryDependencies: ["chart"],
		},
		svelte: {
			entry: "SunburstChart",
			files: [
				{ path: "sunburst-chart/sunburst-chart.svelte", type: "registry:ui" },
				{ path: "sunburst-chart/sunburst-plot.svelte", type: "registry:ui" },
				{ path: "sunburst-chart/geometry.ts", type: "registry:ui" },
				{ path: "sunburst-chart/variants.ts", type: "registry:ui" },
			],
			dependencies: ["tailwind-variants"],
			registryDependencies: ["chart"],
		},
	},
	keywords: ["sunburst", "hierarchy", "tree", "drill down", "chart"],
});
