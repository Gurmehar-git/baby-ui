import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { pricing02 as pricing02Variants } from "./react/variants";

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
			name: "plans",
			type: "Pricing02Plan[]",
			description:
				"One entry per plan: id, name, prices keyed by period, features, and optional description, featuresLabel, featured, cta and href.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "periods",
			type: "Pricing02Period[]",
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
			description:
				"`soft` fills each price panel, tinting the featured one; `outline` draws dashed panels with a solid primary rim on the featured one.",
			default: "soft",
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
			description: "Section heading; line breaks are kept.",
			control: { kind: "none" },
		},
		{
			name: "description",
			type: "string",
			description: "Copy above the toggle.",
			control: { kind: "none" },
		},
		{
			name: "footnotes",
			type: "string[]",
			description: "Small print under the plans.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "Partial<Pricing02Labels>",
			description: "The toggle's accessible name and the fallback button prefix.",
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
