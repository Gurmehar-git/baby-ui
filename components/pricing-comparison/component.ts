import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { pricingComparison as pricingComparisonVariants } from "./variants";

export const pricingComparison = defineComponent({
	slug: "pricing-comparison",
	name: "Pricing Comparison",
	description:
		"Composable feature matrix for plans: a real table with a sticky plan header, collapsible groups, a highlighted column and a differences-only switch, with a plan picker on narrow screens.",
	category: "blocks",
	status: "beta",
	variants: variantsOf(pricingComparisonVariants, ["density"]),
	props: [
		{
			name: "plans",
			type: "ComparisonPlan[]",
			description:
				"PricingComparison: columns, left to right. Mark one `highlighted` to outline its column.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "groups",
			type: "ComparisonGroup[]",
			description:
				"PricingComparison: labelled groups of rows. Each row maps plan ids to true, false or a short string.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "density",
			type: '"compact" | "comfortable"',
			description: "PricingComparison: cell padding.",
			default: "comfortable",
			control: { kind: "select", options: ["compact", "comfortable"] },
		},
		{
			name: "differencesOnly",
			type: "boolean",
			description:
				"PricingComparison: collapses rows that read the same on every plan; PricingComparisonDifferences toggles it. Controlled with onDifferencesOnlyChange; bindable in Svelte.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "collapsedGroups",
			type: "string[]",
			description:
				"PricingComparison: labels of collapsed groups. Controlled with onCollapsedGroupsChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "activePlanId",
			type: "string",
			description:
				"PricingComparison: plan shown by PricingComparisonMobile; defaults to the highlighted plan. Controlled with onActivePlanChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "Partial<PricingComparisonLabels>",
			description:
				"Override any UI string, including the Included and Not included text.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Rows and groups show and hide without animating their height.",
		behaviour: [
			"Groups and filtered rows open and close by animating grid-template-rows, so nothing pops.",
			"Group toggles tint on hover and squish on press; the chevron turns over 200ms.",
			"The plan header sticks below --pricing-comparison-top while the table scrolls.",
			"Below the container's 2xl width the table swaps for a plan picker and a single plan list.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Reaches the differences switch and each group toggle" },
			{ keys: ["Enter", "Space"], action: "Toggles" },
			{
				keys: ["Arrow keys"],
				action: "Moves between plans in the narrow layout's picker",
			},
		],
		notes: [
			"A real table: plan headers use scope col, feature names scope row, group toggles scope rowgroup.",
			"Checks and crosses carry Included and Not included as screen reader text.",
			"Collapsed rows are inert and hidden from assistive tech; each toggle reports aria-expanded.",
		],
	},
	impl: {
		react: {
			entry: "PricingComparison",
		},
		svelte: {
			entry: "PricingComparison",
		},
	},
	keywords: [
		"pricing",
		"comparison",
		"feature matrix",
		"plans",
		"table",
		"compare",
		"saas",
	],
});
