import { defineComponent } from "@baby-ui/registry-schema";

export const usageCard = defineComponent({
	slug: "usage-card",
	name: "Usage Card",
	description:
		"A settings-page usage panel: one ring per metric, or one segmented meter against a plan limit.",
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
			type: '"side" | "stacked" | "meter"',
			description:
				"Rings beside the legend, rings above it, or one bar whose rows share `limit`.",
			default: "side",
			control: { kind: "select", options: ["side", "stacked", "meter"] },
		},
		{
			name: "limit",
			type: "number",
			description:
				"Meter layout: the allowance every row shares. Defaults to the rows' total.",
			control: { kind: "none" },
		},
		{
			name: "unit",
			type: "string",
			description: 'Meter layout: unit after each amount, e.g. "GB".',
			control: { kind: "none" },
		},
		{
			name: "decimals",
			type: "number",
			description: "Meter layout: digits after the decimal point.",
			default: 1,
			control: { kind: "none" },
		},
		{
			name: "warnAt",
			type: "number",
			description:
				"Meter layout: share of the limit at which the badge reads almost full.",
			default: 0.9,
			control: { kind: "none" },
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
		behaviour: [
			"Rings inherit the ring chart's own sweep-in and hover motion.",
			"Meter segments grow in on mount and re-flow on new values; the headline rolls to the previewed share.",
			"Past the limit a hatch and a limit marker fade in over the overage.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Every legend entry is a real toggle (aria-pressed), so hiding a metric works from the keyboard.",
			"Keyboard follows the Ring chart: arrow keys move between segments.",
			"Meter: the legend is one tab stop; arrows rove, Enter pins a share, Escape clears it.",
			"Meter: a polite live region announces status changes and a growing overage.",
		],
	},
	impl: {
		react: {
			entry: "UsageCard",
			files: [
				{ path: "usage-card/usage-card.tsx", type: "registry:ui" },
				{ path: "usage-card/usage-meter.tsx", type: "registry:ui" },
				{ path: "usage-card/meter.ts", type: "registry:ui" },
				{ path: "usage-card/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["chart", "ring-chart", "card", "badge", "rolling-digits"],
		},
		svelte: {
			entry: "UsageCard",
			files: [
				{ path: "usage-card/usage-card.svelte", type: "registry:ui" },
				{ path: "usage-card/usage-meter.svelte", type: "registry:ui" },
				{ path: "usage-card/meter.ts", type: "registry:ui" },
				{ path: "usage-card/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["chart", "ring-chart", "card", "badge", "rolling-digits"],
		},
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	keywords: ["usage", "quota", "storage", "ring", "meter", "limit", "settings", "card"],
});
