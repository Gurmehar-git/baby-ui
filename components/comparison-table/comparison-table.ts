import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["plain", "card"];

const files = (main: string) => [
	{ path: `comparison-table/${main}`, type: "registry:ui" as const },
	{ path: "comparison-table/compare.ts", type: "registry:ui" as const },
	{ path: "comparison-table/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

const deps = ["button", "rolling-digits", "switch", "toggle-group"];

export const comparisonTable = defineComponent({
	slug: "comparison-table",
	name: "Comparison Table",
	description:
		"A feature matrix for plans or products: prices with a billing switch, grouped rows of checks and limits, and a differences-only filter.",
	category: "blocks",
	status: "stable",
	variants: { variant: VARIANTS },
	props: [
		{
			name: "columns",
			type: "ComparisonColumn[]",
			description:
				"Plans or products: name, caption, optional price (one number or monthly/yearly), highlight and action.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "sections",
			type: "ComparisonSection[]",
			description:
				'Groups of rows; each value is true, false, "partial", text, or { value, note }.',
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "On the page, or framed in a bordered surface.",
			default: "plain",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "differencesOnly",
			type: "boolean",
			description:
				"Fold away rows where every column reads the same; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "billing",
			type: '"monthly" | "yearly"',
			description: "Which price shows when columns carry both; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "value",
			type: "string | null",
			description: "The chosen column, from its action button; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "maxHeight",
			type: "string",
			description: "Scroll inside the block with the header row sticking to its top.",
			control: { kind: "none" },
		},
		{
			name: "sample",
			type: '"plans" | "products"',
			description: "Demo only: two priced plans, or a product against competitors.",
			default: "plans",
			control: { kind: "select", options: ["plans", "products"] },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Rows appear and disappear without folding; numbers change in place.",
		behaviour: [
			"Differences only folds shared rows away on grid rows; the feature count rolls.",
			"Prices count to the new period's value when billing switches.",
			"The chosen column tints down its whole length.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"An ARIA table with column and row headers; icons carry text for screen readers.",
			"Folded rows are hidden from assistive tech; the feature count is a polite live region.",
			"Select buttons report their state with aria-pressed.",
		],
	},
	guidance: {
		when: ["A pricing page's detail section, or a comparison against alternatives."],
		whenNot: [{ text: "Choosing a plan at a glance.", use: "pricing-01" }],
		responsive: ["Scrolls sideways under its width, with the feature column pinned."],
		performance: ["Plain markup and CSS; only the counters animate in script."],
		ai: ["Keep feature names short; put the detail in `hint` or a value's `note`."],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "ComparisonTable",
			files: files("comparison-table.tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: deps,
		},
		svelte: {
			entry: "ComparisonTable",
			files: files("comparison-table.svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: deps,
		},
	},
	keywords: ["comparison", "compare", "plans", "pricing", "features", "matrix", "table"],
});
