import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["default", "minimal"];

export const slopeChart = defineComponent({
	slug: "slope-chart",
	name: "Slope Chart",
	description:
		"How several items changed between exactly two moments, and how their order changed, with rank movement beside each end.",
	category: "charts",
	status: "stable",
	variants: { variant: VARIANTS },
	props: [
		{
			name: "data",
			type: "Record<string, unknown>[]",
			description:
				"Rows with a name and a start and end number; names match `config` keys.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "startLabel",
			type: "string",
			description: 'Heading of the first column, such as "Q1".',
			required: true,
			control: { kind: "none" },
		},
		{
			name: "endLabel",
			type: "string",
			description: "Heading of the second column.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "highlightKey",
			type: "string | null",
			description: "The one item drawn in colour while the rest stay neutral.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "`minimal` drops label leaders and rank movement.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
	],
	motion: {
		springs: ["snappy"],
		reducedMotion: "Lines and dots appear drawn; data changes jump.",
		behaviour: [
			"Start dots pop, lines draw across, then end dots and labels land.",
			"A new dataset morphs each line and label by its name.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["ArrowUp", "ArrowDown"], action: "Move between items in end order" },
			{ keys: ["Home", "End"], action: "First or last item" },
			{ keys: ["Escape"], action: "Clear the focus" },
		],
		notes: [
			"A figure with a summary and a table of start, end, change and rank per item.",
		],
	},
	guidance: {
		when: ["Before and after comparisons where the change in order matters."],
		whenNot: [
			{ text: "Many time points.", use: "line-chart" },
			{ text: "One moment.", use: "bar-chart" },
		],
		responsive: ["Label columns narrow below 440px."],
		performance: [
			"Geometry tweens through the shared chart kernel only on data changes.",
		],
		ai: ["Keep to three to ten items so labels stay readable."],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "SlopeChart",
			files: [
				{ path: "slope-chart/slope-chart.tsx", type: "registry:ui" },
				{ path: "slope-chart/geometry.ts", type: "registry:ui" },
				{ path: "slope-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["chart"],
		},
		svelte: {
			entry: "SlopeChart",
			files: [
				{ path: "slope-chart/slope-chart.svelte", type: "registry:ui" },
				{ path: "slope-chart/slope-plot.svelte", type: "registry:ui" },
				{ path: "slope-chart/geometry.ts", type: "registry:ui" },
				{ path: "slope-chart/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["chart"],
		},
	},
	keywords: ["slope", "before after", "rank", "comparison", "chart"],
});
