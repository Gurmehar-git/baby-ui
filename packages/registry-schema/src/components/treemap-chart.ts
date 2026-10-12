import { defineComponent } from "../index.ts";

const VARIANTS = ["default", "flat"];

export const treemapChart = defineComponent({
	slug: "treemap-chart",
	name: "Treemap Chart",
	description:
		"A zoomable hierarchy of parts: tiles size by value, deepen with a second measure, and zoom into a branch on click or Enter.",
	category: "charts",
	status: "stable",
	variants: { variant: VARIANTS },
	props: [
		{
			name: "data",
			type: "TreemapNode",
			description:
				"The root `{ id, label, value?, color?, children? }`; branches sum their children.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "colorLabel",
			type: "string",
			description:
				'Names the shading measure, such as "Growth"; tiles deepen with each leaf\'s `color`.',
			control: { kind: "none" },
		},
		{
			name: "focus",
			type: "string",
			description:
				"Id of the node that fills the view, paired with `onFocusChange`; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "`flat` squares the tile corners.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Tiles appear and zoom without the glide.",
		behaviour: [
			"Tiles grow in a quick wave from the largest.",
			"Zooming carries tiles from the tile that grows to fill the view, or back into it.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"],
				action: "Nearest tile in that direction",
			},
			{ keys: ["Enter", "Space"], action: "Zoom into the branch" },
			{ keys: ["Escape", "Backspace"], action: "Zoom out a level" },
		],
		notes: [
			"A figure with a summary and a data table of every path, value and share of its parent.",
		],
	},
	guidance: {
		when: [
			"Hierarchies of parts where size matters more than exact comparison, like revenue by region and plan.",
		],
		whenNot: [
			{ text: "Exact comparison between parts.", use: "bar-chart" },
			{ text: "One level of parts.", use: "waffle-chart" },
		],
		responsive: [
			"Labels hide on tiles too small to hold them; the tooltip still names them.",
		],
		performance: [
			"One squarified layout per focus; tiles are moved, never re-rendered, during a zoom.",
		],
		ai: ["Keep to three levels and give every node a stable id."],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "TreemapChart",
			files: [
				{ path: "treemap-chart/treemap-chart.tsx", type: "registry:ui" },
				{ path: "treemap-chart/layout.ts", type: "registry:ui" },
				{ path: "treemap-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["chart", "breadcrumb"],
		},
		svelte: {
			entry: "TreemapChart",
			files: [
				{ path: "treemap-chart/treemap-chart.svelte", type: "registry:ui" },
				{ path: "treemap-chart/treemap-plot.svelte", type: "registry:ui" },
				{ path: "treemap-chart/layout.ts", type: "registry:ui" },
				{ path: "treemap-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["chart", "breadcrumb"],
		},
	},
	keywords: ["treemap", "hierarchy", "chart", "zoom", "drill down", "parts"],
});
