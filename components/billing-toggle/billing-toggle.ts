import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["default", "outline", "chip"];
const SIZES = ["xs", "sm", "default", "lg", "xl"];

const files = (main: string[]) => [
	...main.map((path) => ({
		path: `billing-toggle/${path}`,
		type: "registry:ui" as const,
	})),
	{ path: "billing-toggle/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

export const billingToggle = defineComponent({
	slug: "billing-toggle",
	name: "Billing Toggle",
	description:
		"A billing period switch with an optional savings badge, and a price whose digits roll and whose period morphs when it changes.",
	category: "advanced",
	status: "stable",
	variants: { variant: VARIANTS, size: SIZES },
	props: [
		{
			name: "value",
			type: "string",
			description:
				"The selected period, paired with `onValueChange`; bindable in Svelte. It can never be cleared.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "options",
			type: "BillingToggleOption[]",
			description:
				'`{ value, label, badge? }`; defaults to Monthly and Yearly. `badge` is a short note, e.g. "Save 20%".',
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Any Toggle Group variant.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Any Toggle Group size.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "BillingPrice",
			type: "component",
			description:
				"`amount` (major units), `currency`, `period`, `was` (struck through when higher) and `decimals`; digits roll with Slot Text and the period morphs with Letter Morph.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Prices and periods swap in place.",
		behaviour: [
			"Switching period rolls the price's changed digits and morphs the period word.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["ArrowLeft", "ArrowRight"], action: "Move between periods" }],
		notes: [
			"A single-select toggle group named by `label`; the price announces its new value politely.",
		],
	},
	guidance: {
		when: ["Pricing pages and plan pickers that offer monthly and yearly billing."],
		whenNot: [
			{ text: "More than three periods.", use: "select" },
			{ text: "Static prices that never change.", use: "typography" },
		],
		responsive: [
			"The toggle keeps its width; BillingPrice wraps the old price and period under the amount.",
		],
		performance: ["Reuses Slot Text and Letter Morph; nothing runs at rest."],
		ai: [
			"Drive every plan card's BillingPrice from the same `value`.",
			"Only show a `badge` with a real, current saving.",
		],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "BillingToggle",
			files: files(["billing-toggle.tsx"]),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["toggle-group", "badge", "slot-text", "letter-morph"],
		},
		svelte: {
			entry: "BillingToggle",
			files: files(["billing-toggle.svelte", "billing-price.svelte"]),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["toggle-group", "badge", "slot-text", "letter-morph"],
		},
	},
	keywords: ["billing", "pricing", "monthly", "yearly", "toggle", "plan"],
});
