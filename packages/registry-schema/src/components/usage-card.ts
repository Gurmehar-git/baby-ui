import { defineComponent } from "../index.ts";

export const usageCard = defineComponent({
	slug: "usage-card",
	name: "Usage Card",
	description:
		"A settings-page usage panel: one ring per metric, with a legend breakdown.",
	category: "blocks",
	status: "stable",
	demo: { mode: "auto", frame: "sm" },
	props: [
		{
			name: "data",
			type: "Record<string, unknown>[]",
			description: "One row per metric, with a value, a maximum and a name.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "config",
			type: "ChartConfig",
			description: "Label and colour per ring, keyed by nameKey.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "layout",
			type: '"side" | "stacked"',
			description: "Rings beside the legend, or rings above it.",
			default: "side",
			control: { kind: "select", options: ["side", "stacked"] },
		},
		{
			name: "cap",
			type: '"round" | "butt"',
			description: "Ring stroke end cap.",
			default: "round",
			control: { kind: "select", options: ["round", "butt"] },
		},
		{
			name: "centerLabel",
			type: "string",
			description: "Caption under the centre value when no ring is active.",
			default: "Total",
			control: { kind: "text" },
		},
		{
			name: "activeIndex",
			type: "number | null",
			description:
				"The ring driving the centre value. Controlled with onActiveIndexChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Rings reach their resting sweep with no animation.",
		behaviour: ["Inherits the ring chart's own sweep-in and hover motion."],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Every legend entry is a real toggle (aria-pressed), so hiding a metric works from the keyboard.",
			"Keyboard follows the Ring chart: arrow keys move between segments.",
		],
	},
	impl: {
		react: {
			entry: "UsageCard",
			files: [
				{ path: "usage-card/usage-card.tsx", type: "registry:ui" },
				{ path: "usage-card/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["chart", "ring-chart", "card"],
		},
		svelte: {
			entry: "UsageCard",
			files: [
				{ path: "usage-card/usage-card.svelte", type: "registry:ui" },
				{ path: "usage-card/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["chart", "ring-chart", "card"],
		},
	},
	keywords: ["usage", "quota", "storage", "ring", "settings", "card"],
});
