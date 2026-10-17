import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { pricing02 as pricing02Variants } from "./variants";

const VARIANTS = ["soft", "outline"];

export const pricing02 = defineComponent({
	slug: "pricing-02",
	name: "Pricing 02",
	description:
		"A pricing section with a monthly and yearly toggle whose prices roll digit by digit, and a feature list under each plan.",
	category: "blocks",
	status: "stable",
	retired: true,
	variants: variantsOf(pricing02Variants, ["variant"]),
	props: [
		{
			name: "periods",
			type: "Pricing02Period[]",
			description:
				"Pricing02: billing periods (value, label, cadence). Pricing02Periods shows a toggle when there are two or more.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "period",
			type: "string",
			description:
				"Pricing02: active period value. Controlled with defaultPeriod and onPeriodChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Pricing02: a raised panel per plan, or a dashed outline.",
			default: "soft",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"Pricing02: Pricing02Header (Pricing02Heading, Pricing02Aside with Pricing02Periods), Pricing02Plans of Pricing02Plan cards (Pricing02PlanPanel over Pricing02PlanList), then Pricing02Footnotes.",
			control: { kind: "none" },
		},
		{
			name: "featured",
			type: "boolean",
			description: "Pricing02Plan: tints the panel and fills the button.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "prices",
			type: "Record<string, string>",
			description:
				"Pricing02PlanPrice: display price keyed by period value, already formatted.",
			required: true,
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Prices swap instantly; hover glows fade without motion.",
		behaviour: [
			"On a period change each price character rises 8px in from blur over 500ms with a slight overshoot; the last two trail by 70ms each.",
			"Moving to a later period rolls digits up from below; back to the first rolls them down.",
			"Prices do not animate on first paint.",
			"Hovering a plan fades in a soft top glow and nudges the button arrow right.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Arrow keys"], action: "Moves between billing periods inside the toggle" },
		],
		notes: [
			"The billing toggle is a single-select ToggleGroup named by labels.period.",
			"Rolling digits are aria-hidden; a visually hidden copy reads the whole price.",
		],
	},
	licenseOrigin: {
		source: "componentry",
		url: "https://componentry.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "Pricing02",
		},
		svelte: {
			entry: "Pricing02",
		},
	},
	keywords: ["pricing", "plans", "billing", "monthly", "yearly", "saas"],
});
