import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { numberInput as numberInputVariants } from "./variants";

export const numberInput = defineComponent({
	slug: "number-input",
	name: "Number Input",
	description:
		"A stepper with hold-to-repeat buttons, keyboard steps, Intl formatting and a label you can drag to scrub, or a compact inline scrub field.",
	category: "base",
	status: "beta",
	variants: variantsOf(numberInputVariants, ["variant", "size"]),
	props: [
		{
			name: "value",
			type: "number | null",
			description: "Current value; `null` is an empty field. Bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "min",
			type: "number",
			description: "Lowest value.",
			control: { kind: "none" },
		},
		{
			name: "max",
			type: "number",
			description: "Highest value.",
			control: { kind: "none" },
		},
		{
			name: "step",
			type: "number",
			description: "Arrow and button step.",
			default: 1,
			control: { kind: "none" },
		},
		{
			name: "largeStep",
			type: "number",
			description: "PageUp/PageDown and Shift+Arrow step.",
			default: 10,
			control: { kind: "none" },
		},
		{
			name: "formatOptions",
			type: "Intl.NumberFormatOptions",
			description: "Display format, e.g. currency or percent.",
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description: "Visible label. Drag it sideways to scrub the value.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: '"default" | "scrub"',
			description:
				"`default` stacks the label above a stepper; `scrub` folds the label into the field as its drag handle, with no steppers.",
			default: "default",
			control: { kind: "select", options: ["default", "scrub"] },
		},
		{
			name: "size",
			type: '"xs" | "sm" | "default" | "lg" | "xl"',
			description: "Field height.",
			default: "default",
			control: { kind: "select", options: ["xs", "sm", "default", "lg", "xl"] },
		},
		{
			name: "suffix",
			type: "string",
			description: 'Text after the value, such as "px" or " seats".',
			control: { kind: "text" },
		},
		{
			name: "prefix",
			type: "string",
			description: 'Text before the value, such as "$".',
			control: { kind: "none" },
		},
		{
			name: "limitHint",
			type: "boolean | ((edge, limit) => string)",
			description:
				"A short note under the field when a key press runs into min or max, with a shake; a function writes the copy.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "disabled",
			type: "boolean",
			description: "Disable the field.",
			default: false,
			control: { kind: "boolean" },
		},
	],
	a11y: {
		role: "spinbutton",
		keyboard: [
			{ keys: ["Arrow Up", "Arrow Down"], action: "Steps by step" },
			{
				keys: ["Shift+Arrow", "Page Up", "Page Down"],
				action: "Steps by the large step",
			},
			{ keys: ["Home", "End"], action: "Jumps to min and max" },
		],
		notes: [
			"The field is a spinbutton with the formatted value as its value text.",
			"The minus and plus buttons repeat while held and stay out of the tab order; the keys cover them.",
		],
	},
	impl: {
		react: {
			entry: "NumberInput",
		},
		svelte: {
			entry: "NumberInput",
		},
	},
	keywords: ["number input", "stepper", "spinbutton", "quantity", "currency", "scrub"],
});
