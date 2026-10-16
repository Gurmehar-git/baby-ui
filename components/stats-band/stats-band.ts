import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["plain", "divided"];

const files = (main: string) => [
	{ path: `stats-band/${main}`, type: "registry:ui" as const },
	{ path: "stats-band/stats.ts", type: "registry:ui" as const },
	{ path: "stats-band/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

export const statsBand = defineComponent({
	slug: "stats-band",
	name: "Stats Band",
	description:
		"Three or four headline numbers that count up once seen, each with an optional tiny visual: a trend, an uptime strip, a histogram or a dotted world.",
	category: "blocks",
	status: "stable",
	variants: { variant: VARIANTS },
	props: [
		{
			name: "stats",
			type: "Stat[]",
			description:
				"Each with a `value`, `label`, optional prefix/suffix, `notation`, `detail`, hover `context` and `visual`.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Stats on whitespace, or a hairline grid ruled above and below.",
			default: "plain",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "title",
			type: "string",
			description: 'Heading; the band is labelled by it, else by "Key numbers".',
			control: { kind: "none" },
		},
		{
			name: "description",
			type: "string",
			description: "One line beside the title.",
			control: { kind: "none" },
		},
		{
			name: "locale",
			type: "string",
			description: "Number format locale.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Numbers show their final value and visuals are drawn at rest.",
		behaviour: [
			"Once a third of the band is in view, stats rise in 90ms apart and each number counts up.",
			"Visuals draw in after: the trend line, bars growing left to right, the map wiping in.",
			"Hover or focus swaps a stat's detail for its context and hands its visual the accent.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Tab"], action: "Focus a stat with context to read it" }],
		notes: [
			"A description list: each label is a dt, the number and caption are dd.",
			"Visuals are decorative and hidden; screen readers read the final numbers.",
		],
	},
	guidance: {
		when: [
			"A landing page proving scale, speed or reliability with three or four numbers.",
		],
		whenNot: [{ text: "A single KPI with a chart.", use: "stat-card" }],
		responsive: [
			"One column, then two from 36rem of container, then all in a row from 56rem.",
		],
		performance: [
			"One IntersectionObserver; visuals are CSS transitions over static SVG and bars.",
		],
		ai: [
			"Keep labels to one line and context to one short sentence.",
			"Use `compact` notation for millions.",
		],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "StatsBand",
			files: files("stats-band.tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["rolling-digits", "sparkline"],
		},
		svelte: {
			entry: "StatsBand",
			files: files("stats-band.svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["rolling-digits", "sparkline"],
		},
	},
	keywords: ["stats", "numbers", "metrics", "kpi", "marketing", "band", "section"],
});
