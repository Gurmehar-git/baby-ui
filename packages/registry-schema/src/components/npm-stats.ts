import { defineComponent } from "../index.ts";

const variantProp = {
	name: "variant",
	type: '"default" | "compact" | "minimal"',
	description:
		"`default` is the full block. `compact` keeps the total, two facts and the chart for a sidebar, without the package list. `minimal` drops the card for a mono ledger.",
	default: "default",
	control: {
		kind: "select" as const,
		options: ["default", "compact", "minimal"],
	},
};

const localeProp = {
	name: "locale",
	type: "string",
	description:
		"BCP 47 locale for compact number, day and week tick formatting in every chart.",
	control: { kind: "none" as const },
};

const labelsProp = {
	name: "labels",
	type: "Partial<NpmStatsLabels>",
	description:
		"Every visible and accessible string: facts, counts, range copy and the empty state. Defaults to English.",
	control: { kind: "none" as const },
};

export const npmStatsBlock = defineComponent({
	slug: "npm-stats",
	name: "NPM Stats",
	description:
		"npm downloads: the range total and its trend, the daily average, peak, busiest weekday and fastest-growing package, the chart, and every package's share.",
	category: "blocks",
	status: "beta",

	props: [
		{
			name: "packages",
			type: "NpmPackage[]",
			description:
				"Each entry carries `name`, `allTime`, `last30Days` (daily buckets) and `last90Days` (weekly ISO `'YYWww` buckets). The block aggregates them; no fetching of its own.",
			required: true,
			control: { kind: "none" },
		},
		variantProp,
		{
			name: "range",
			type: '"30d" | "90d"',
			description:
				"Window the chart, trend and package rows show. Controlled in React with `onRangeChange` (or `defaultRange`); bindable in Svelte.",
			default: "30d",
			control: { kind: "select", options: ["30d", "90d"] },
		},
		{
			name: "onRangeChange",
			type: "(range: NpmStatsRange) => void",
			description: "Fires when the range toggle changes.",
			control: { kind: "none" },
		},
		localeProp,
		labelsProp,
	],

	motion: {
		springs: [],
		reducedMotion:
			"Numbers show their final value; the chart, sparklines and share bar appear without motion.",
		behaviour: [
			"The range total and counts run up once scrolled into view; a range switch counts from the old value.",
			"The chart area sweeps in over the shared chart reveal clip; sparklines reveal left to right over 700ms.",
			"The share bar's segments regrow over 300ms when the range changes.",
		],
	},

	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Reaches the range toggle" },
			{ keys: ["Arrow keys"], action: "Move between ranges" },
			{ keys: ["Space", "Enter"], action: "Selects a range" },
		],
		notes: [
			"The chart's accessible name comes from `ChartContainer.title` plus a generated summary.",
			"Trend arrows are aria-hidden; the signed percent and its comparison window are read as text.",
			"Each package's share is written as text in its row; the stacked bar is decorative.",
			"Empty state uses `role=status` so screen readers announce when no packages are passed.",
			"The chart keeps the Chart plot's keyboard model and data-table summary.",
		],
	},

	impl: {
		react: {
			entry: "NpmStats",
			files: [
				{ path: "npm-stats/npm-stats.tsx", type: "registry:ui" },
				{ path: "npm-stats/downloads-chart.tsx", type: "registry:ui" },
				{ path: "npm-stats/package-breakdown.tsx", type: "registry:ui" },
				{ path: "npm-stats/sparkline.tsx", type: "registry:ui" },
				{ path: "npm-stats/trend-badge.tsx", type: "registry:ui" },
				{ path: "npm-stats/core.ts", type: "registry:ui" },
				{ path: "npm-stats/variants.ts", type: "registry:ui" },
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
			registryDependencies: [
				"area-chart",
				"badge",
				"card",
				"chart",
				"rolling-digits",
				"empty",
				"toggle-group",
			],
		},
		svelte: {
			entry: "NpmStats",
			files: [
				{ path: "npm-stats/npm-stats.svelte", type: "registry:ui" },
				{ path: "npm-stats/downloads-chart.svelte", type: "registry:ui" },
				{ path: "npm-stats/package-breakdown.svelte", type: "registry:ui" },
				{ path: "npm-stats/npm-sparkline.svelte", type: "registry:ui" },
				{ path: "npm-stats/trend-badge.svelte", type: "registry:ui" },
				{ path: "npm-stats/core.ts", type: "registry:ui" },
				{ path: "npm-stats/variants.ts", type: "registry:ui" },
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
			registryDependencies: [
				"area-chart",
				"badge",
				"card",
				"chart",
				"rolling-digits",
				"empty",
				"toggle-group",
			],
		},
	},

	keywords: ["npm", "stats", "dashboard", "downloads", "analytics", "block"],
});
