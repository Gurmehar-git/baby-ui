import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { pricing01 as pricing01Variants } from "./variants";

const VARIANTS = ["default", "framed"];

export const pricing01 = defineComponent({
	slug: "pricing-01",
	name: "Pricing 01",
	description:
		"A pricing section of plan cards that lift on hover while a note rises behind them, with a billing period toggle.",
	category: "blocks",
	status: "stable",
	retired: true,
	variants: variantsOf(pricing01Variants, ["variant"]),
	props: [
		{
			name: "periods",
			type: "Pricing01Period[]",
			description:
				"Pricing01: billing periods (value, label, cadence). Pricing01Periods shows a toggle when there are two or more.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "period",
			type: "string",
			description:
				"Pricing01: active period value. Controlled with defaultPeriod and onPeriodChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"Pricing01: flat cards, or cards inside the inset rim Card uses for `framed`.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"Pricing01: Pricing01Header (Pricing01Heading with eyebrow and title, Pricing01Aside with description and Pricing01Periods), then Pricing01Plans of Pricing01Plan cards.",
			control: { kind: "none" },
		},
		{
			name: "featured",
			type: "boolean",
			description:
				"Pricing01Plan: outlines the card and fills its badge and button. `note` rises behind the card on hover.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "prices",
			type: "Record<string, string>",
			description:
				"Pricing01PlanPrice: display price keyed by period value, already formatted.",
			required: true,
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Cards stay put; the note fades in without rising.",
		behaviour: [
			"Hovering or focusing inside a plan lifts its card 4px over 500ms.",
			"The plan's note rises 14px into view behind the card over 500ms and drops back over 150ms.",
			"The button arrow nudges up and right on hover.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Arrow keys"], action: "Moves between billing periods inside the toggle" },
		],
		notes: [
			"The billing toggle is a single-select ToggleGroup named by labels.period.",
			"The hover note is decorative (aria-hidden); put anything essential in features.",
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
			entry: "Pricing01",
		},
		svelte: {
			entry: "Pricing01",
		},
	},
	keywords: ["pricing", "plans", "tiers", "billing", "saas", "cards"],
});
