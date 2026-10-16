import { defineComponent } from "@baby-ui/registry-schema";

const MODES = ["light", "dark"];
const TONES = ["neutral", "chart", "primary"];
const union = (values: string[]) => values.map((v) => `"${v}"`).join(" | ");

export const ogStatsMetrics = defineComponent({
	slug: "og-stats-metrics",
	name: "OG Stats Metrics",
	description:
		"A 1200x630 metrics card led by one huge number and its delta, a headline, up to two plain secondary stats and a soft area chart behind, rendered to PNG with takumi.",
	category: "og-images",
	demo: { mode: "auto", frame: "og" },
	status: "stable",
	variants: { mode: MODES, tone: TONES },
	props: [
		{
			name: "headline",
			type: "string",
			description: "Headline; clamps to two lines.",
			required: true,
			default: "Q3 was our strongest quarter yet",
			control: { kind: "text" },
		},
		{
			name: "stats",
			type: '{ label: string; value: string; delta?: string; trend?: "up" | "down" }[]',
			description:
				"The first stat is the hero number with its delta chip; the next two print as one plain line; extras are dropped. Values arrive pre-formatted.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "period",
			type: "string",
			description: 'Pre-formatted muted text, top right, e.g. "Q3 2026".',
			control: { kind: "text" },
		},
		{
			name: "site",
			type: "string",
			description: "Brand name, top left.",
			control: { kind: "text" },
		},
		{
			name: "sparkline",
			type: "number[]",
			description:
				"Raw values drawn as a soft area chart bleeding off the bottom right corner; omit to hide it.",
			control: { kind: "none" },
		},
		{
			name: "logo",
			type: "string",
			description: "Brand logo URL beside the name.",
			control: { kind: "none" },
		},
		{
			name: "mode",
			type: union(MODES),
			description: "Light or dark card, independent of the page theme.",
			default: "light",
			control: { kind: "select", options: MODES },
		},
		{
			name: "tone",
			type: union(TONES),
			description: "Colour of the area chart and the hero label.",
			default: "neutral",
			control: { kind: "select", options: TONES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"Fixed 1200x630 canvas built only from flex layout and theme tokens, so takumi renders it the same as the browser.",
			"`mode` scopes the dark tokens to the card itself, so a dark card renders from a light page and vice versa.",
			"The hero delta chip takes the chart positive or negative token from its `trend`.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag a matching og:image:alt that names the key numbers.",
		],
	},
	impl: {
		react: {
			entry: "OgStatsMetrics",
			files: [
				{ path: "og-stats-metrics/og-stats-metrics.tsx", type: "registry:ui" },
				{ path: "og-stats-metrics/sparkline.ts", type: "registry:ui" },
				{ path: "og-stats-metrics/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "OgStatsMetrics",
			files: [
				{ path: "og-stats-metrics/og-stats-metrics.svelte", type: "registry:ui" },
				{ path: "og-stats-metrics/sparkline.ts", type: "registry:ui" },
				{ path: "og-stats-metrics/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: [
		"og",
		"open graph",
		"social card",
		"stats",
		"metrics",
		"kpi",
		"sparkline",
		"takumi",
	],
});
