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
			name: "plans",
			type: "Pricing01Plan[]",
			description:
				"One entry per card: id, name, prices keyed by period, features, and optional description, note, badge, featured, cta and href.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "periods",
			type: "Pricing01Period[]",
			description:
				"Billing periods (value, label, cadence). The toggle shows when there are two or more.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "period",
			type: "string",
			description:
				"Active period value. Controlled with defaultPeriod and onPeriodChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "onSelect",
			type: "(planId: string, period: string) => void",
			description:
				"Called by a plan's button when the plan has no href. Plans with neither show no button.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Flat cards, or cards inside the inset rim Card uses for `framed`.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "eyebrow",
			type: "string",
			description: "Small caps line above the title.",
			control: { kind: "none" },
		},
		{
			name: "title",
			type: "string",
			description: "Section heading.",
			control: { kind: "none" },
		},
		{
			name: "description",
			type: "string",
			description: "Copy beside the heading.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "Partial<Pricing01Labels>",
			description: "The toggle's accessible name and the fallback button prefix.",
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
