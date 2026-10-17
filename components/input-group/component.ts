import { defineComponent } from "@baby-ui/registry-schema";

export const inputGroup = defineComponent({
	slug: "input-group",
	name: "Input Group",
	description:
		"An input or textarea with icons, text or buttons docked inside its border, sharing one focus ring.",
	category: "base",
	status: "stable",
	variants: {
		size: ["xs", "sm", "default", "lg", "xl"],
		align: ["inline-start", "inline-end", "block-start", "block-end"],
	},
	props: [
		{
			name: "size",
			type: '"xs" | "sm" | "default" | "lg" | "xl"',
			description: "InputGroup height.",
			default: "default",
			control: { kind: "select", options: ["xs", "sm", "default", "lg", "xl"] },
		},
		{
			name: "align",
			type: '"inline-start" | "inline-end" | "block-start" | "block-end"',
			description: "InputGroupAddon only. Which edge the addon docks to.",
			default: "inline-start",
			control: { kind: "none" },
		},
	],
	a11y: {
		role: "group",
		keyboard: [],
		notes: [
			"Clicking an addon's padding focuses the control, as a label would. Buttons inside keep their own click.",
			"The group's ring follows the control's focus and aria-invalid, so the whole box reads as one field.",
		],
	},
	licenseOrigin: {
		source: "shadcn/ui",
		url: "https://github.com/shadcn-ui/ui",
		license: "MIT",
		copyright: "Copyright (c) 2023 shadcn",
	},
	impl: {
		react: {
			entry: "InputGroup",
		},
		svelte: {
			entry: "InputGroup",
		},
	},
	keywords: ["input group", "addon", "prefix", "suffix", "input", "icon"],
});
