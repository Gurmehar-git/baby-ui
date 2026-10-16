import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["default", "start"];
const SIZES = ["xs", "sm", "default", "lg", "xl"];

const files = (main: string) => [
	{ path: `money-input/${main}`, type: "registry:ui" as const },
	{ path: "money-input/money.ts", type: "registry:ui" as const },
	{ path: "money-input/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

export const moneyInput = defineComponent({
	slug: "money-input",
	name: "Money Input",
	description:
		"An amount field that groups digits as you type, stores minor units, refuses amounts past the limit, steps with the arrows and offers quick-add chips.",
	category: "base",
	status: "stable",
	variants: { variant: VARIANTS, size: SIZES },
	props: [
		{
			name: "label",
			type: "string",
			description: "Accessible name of the amount field.",
			required: true,
			control: { kind: "text" },
		},
		{
			name: "value",
			type: "number | null",
			description:
				"Amount in minor units (cents for USD, yen for JPY), paired with `onValueChange(value, details)`; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "currency",
			type: "string",
			description:
				"ISO 4217 code, paired with `onCurrencyChange`; bindable in Svelte. `defaultCurrency` seeds it.",
			default: "USD",
			control: { kind: "none" },
		},
		{
			name: "currencies",
			type: "string[]",
			description:
				"Codes offered by the currency menu; one code (or none) shows the symbol instead.",
			control: { kind: "none" },
		},
		{
			name: "min, max",
			type: "number",
			description:
				"Bounds in minor units: `max` refuses typing past it with a nudge, `min` is checked on blur.",
			control: { kind: "none" },
		},
		{
			name: "quickAdd",
			type: "number[]",
			description: "Quick-add chips in major units, such as `[10, 50, 100]`.",
			control: { kind: "none" },
		},
		{
			name: "step",
			type: "number",
			description:
				"Arrow keys move by this many minor units, Shift by ten times; one major unit by default.",
			control: { kind: "none" },
		},
		{
			name: "locale",
			type: "string",
			description:
				"Formatting locale; fixed by default so server and client render the same digits.",
			default: "en-US",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Amount aligned to the end like a ledger, or to the start.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Field height on the control ladder.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The refusal nudge is skipped.",
		behaviour: [
			"Digits group as you type while the caret stays after the same digit.",
			"Typing past `max` is refused with a short horizontal shake.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["ArrowUp", "ArrowDown"], action: "Step the amount by one major unit" },
			{ keys: ["Shift", "ArrowUp"], action: "Step by ten times as much" },
		],
		notes: [
			"The field is named with the label and the currency code; range messages are an alert tied to it.",
			"The currency menu is a select named Currency.",
		],
	},
	guidance: {
		when: [
			"Prices, budgets, transfers and tips: any amount you store as an integer of minor units.",
		],
		whenNot: [
			{ text: "Plain quantities without a currency.", use: "number-input" },
			{ text: "Showing an amount that cannot be edited.", use: "slot-text" },
		],
		responsive: ["Fills its container; chips wrap under the field."],
		performance: ["Formatting uses Intl.NumberFormat once per currency."],
		ai: [
			"Store `value` as an integer of minor units and send it with the currency code.",
			"Pass `min` and `max` in minor units too, such as `max={100000}` for $1,000.",
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
			entry: "MoneyInput",
			files: files("money-input.tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["input-group", "select", "button"],
		},
		svelte: {
			entry: "MoneyInput",
			files: files("money-input.svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["input-group", "select", "button"],
		},
	},
	keywords: ["money", "currency", "amount", "price", "input", "form"],
});
