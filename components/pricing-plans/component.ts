import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { pricingPlans as pricingPlansVariants } from "./variants";

export const pricingPlans = defineComponent({
	slug: "pricing-plans",
	name: "Pricing Plans",
	description:
		"Composable plan cards for monthly, yearly and lifetime pricing: a sliding cycle switch derived from the prices, rolling prices with yearly savings, and an action that hands off to hosted checkout.",
	category: "blocks",
	status: "beta",
	variants: variantsOf(pricingPlansVariants, ["layout", "size"]),
	props: [
		{
			name: "plans",
			type: "PricingPlanOption[]",
			description:
				"PricingPlans: plans with prices in cents per cycle, features and action text. Render each with PricingPlan; a plan with no prices reads as Custom.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "cycle",
			type: '"monthly" | "annual" | "lifetime"',
			description:
				"PricingPlans: billing cycle; PricingPlansCycle offers only cycles some plan is priced on. Controlled with onCycleChange; bindable in Svelte.",
			control: { kind: "select", options: ["monthly", "annual", "lifetime"] },
		},
		{
			name: "layout",
			type: '"cards" | "columns"',
			description:
				"PricingPlans: separate cards, or one bordered panel split into columns.",
			default: "cards",
			control: { kind: "select", options: ["cards", "columns"] },
		},
		{
			name: "size",
			type: '"sm" | "default"',
			description: "PricingPlans: padding, price size and action size.",
			default: "default",
			control: { kind: "select", options: ["sm", "default"] },
		},
		{
			name: "onSelect",
			type: "(planId: string, cycle: PricingCycle) => void",
			description:
				"PricingPlans: called by PricingPlanAction; start the hosted checkout redirect here.",
			control: { kind: "none" },
		},
		{
			name: "loadingPlanId",
			type: "string | null",
			description:
				"PricingPlans: the plan whose checkout is opening. Its action spins and the others disable.",
			control: { kind: "none" },
		},
		{
			name: "currency",
			type: "string",
			description: "ISO 4217 code used to format every amount.",
			default: "USD",
			control: { kind: "none" },
		},
		{
			name: "locale",
			type: "string",
			description: "BCP 47 locale for Intl.NumberFormat; the runtime default when unset.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "Partial<PricingPlansLabels>",
			description: "Override any UI string, e.g. cycle names or the saving note.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Prices swap to the new cycle without rolling; the cycle thumb jumps instead of sliding.",
		behaviour: [
			"The cycle thumb slides to the chosen cycle on the snappy spring (400ms).",
			"Each price rolls digit by digit when the cycle changes.",
			"Yearly shows the per month equivalent with the yearly charge and the saving underneath.",
			"The chosen plan's action morphs to a spinner while checkout loads.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Arrow keys"],
				action: "Moves between billing cycles inside the radio group",
			},
			{ keys: ["Tab"], action: "Reaches each plan's CTA in order" },
		],
		notes: [
			"The cycle switch is a native radio group inside a fieldset with a legend.",
			"After a cycle change, one polite live region reads every plan's new price.",
			"Rolling digits are hidden from screen readers; each plan carries a spoken price instead.",
		],
	},
	impl: {
		react: {
			entry: "PricingPlans",
		},
		svelte: {
			entry: "PricingPlans",
		},
	},
	keywords: [
		"pricing",
		"plans",
		"tiers",
		"lifetime",
		"subscription",
		"yearly",
		"checkout",
		"saas",
	],
});
