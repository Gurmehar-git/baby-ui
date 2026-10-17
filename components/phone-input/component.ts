import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["default", "flag"];
const SIZES = ["xs", "sm", "default", "lg", "xl"];

export const phoneInput = defineComponent({
	slug: "phone-input",
	name: "Phone Input",
	description:
		"A phone number field with a searchable country picker that formats as you type, switches country on pasted international numbers, and reports E.164.",
	category: "base",
	status: "stable",
	variants: { variant: VARIANTS, size: SIZES },
	props: [
		{
			name: "label",
			type: "string",
			description: "Accessible name of the number field.",
			required: true,
			control: { kind: "text" },
		},
		{
			name: "value",
			type: "string",
			description:
				'The number in E.164, such as "+14155550132", paired with `onValueChange(value, details)`; bindable in Svelte.',
			control: { kind: "none" },
		},
		{
			name: "country",
			type: "string",
			description:
				"ISO code of the selected country, paired with `onCountryChange`; bindable in Svelte. `defaultCountry` seeds it.",
			control: { kind: "none" },
		},
		{
			name: "countries, preferredCountries",
			type: "string[]",
			description:
				"Limit the picker to these ISO codes, and pin some at the top under Suggested.",
			control: { kind: "none" },
		},
		{
			name: "validate",
			type: "boolean",
			description:
				"Show a message after blur when the number is incomplete or too long. `error` replaces it.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "name",
			type: "string",
			description:
				"Adds a hidden input carrying the E.164 value for native form submission.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Flag and calling code in the trigger, or the flag alone.",
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
		reducedMotion: "No motion beyond the picker's own open and close.",
		behaviour: [
			"The number reformats on every keystroke while the caret stays after the same digit.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter", "Space"], action: "Open the country picker" },
			{ keys: ["ArrowDown", "ArrowUp"], action: "Move through countries" },
			{ keys: ["Enter"], action: "Choose a country and return to the number" },
		],
		notes: [
			"The country trigger is named with the country and code; the field is a tel input named by `label`.",
			"Validation messages are an alert tied to the field after it loses focus.",
		],
	},
	guidance: {
		when: ["Sign-up, checkout and contact forms that store numbers in E.164."],
		whenNot: [
			{ text: "Short codes or extensions only.", use: "input" },
			{ text: "One-time verification codes.", use: "input-otp" },
		],
		responsive: ["Fills its container; the picker opens at 16rem wide."],
		performance: ["A compact built-in table of 50 countries; no metadata download."],
		ai: [
			"Store the E.164 `value` and read `details.valid` before submitting.",
			"Set `defaultCountry` from the user's locale and `preferredCountries` for your main markets.",
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
			entry: "PhoneInput",
		},
		svelte: {
			entry: "PhoneInput",
		},
	},
	keywords: ["phone", "tel", "telephone", "country", "e164", "input", "form"],
});
