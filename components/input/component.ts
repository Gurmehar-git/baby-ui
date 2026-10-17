import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { input as inputVariants } from "./variants";

export const input = defineComponent({
	slug: "input",
	name: "Input",
	description: "Text field with invalid and disabled states that stay legible together.",
	category: "base",
	status: "stable",
	variants: variantsOf(inputVariants, ["size", "variant"]),
	props: [
		{
			name: "size",
			type: '"xs" | "sm" | "default" | "lg" | "xl"',
			description: "Height and horizontal padding.",
			default: "default",
			control: { kind: "select", options: ["xs", "sm", "default", "lg", "xl"] },
		},
		{
			name: "variant",
			type: '"outline" | "ring"',
			description: "Focus shows as the border alone, or `ring` adds a soft halo.",
			default: "outline",
			control: { kind: "select", options: ["outline", "ring"] },
		},
		{
			name: "invalid",
			type: "boolean",
			description: "Mark the field as failing validation. Sets aria-invalid.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "disabled",
			type: "boolean",
			description: "Disable the field.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "placeholder",
			type: "string",
			description: "Placeholder text. Never a substitute for a label.",
			default: "Enter a value",
			control: { kind: "text" },
		},
		{
			name: "value",
			type: "string",
			description: "Current value. Bindable.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The focus ring appears without the transition.",
		behaviour: [
			"The focus ring fades in over 140ms rather than snapping, so tabbing through a form does not strobe.",
			"An invalid field keeps its red border while focused; focus does not mask the error.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"aria-invalid is set from `invalid`. Pair the field with a real label; a placeholder disappears the moment the user types.",
		],
	},
	licenseOrigin: {
		source: "sivir-ui",
		url: "https://github.com/aidan-neel/sivir-ui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Aidan Neel",
	},
	impl: {
		react: {
			entry: "Input",
		},
		svelte: {
			entry: "Input",
		},
	},
	keywords: ["input", "text field", "form"],
});
