import { defineComponent } from "@baby-ui/registry-schema";

export const label = defineComponent({
	slug: "label",
	name: "Label",
	description:
		"Form label with a required marker and a disabled state that matches its control.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "required",
			type: "boolean",
			description: "Show a required marker after the text.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "disabled",
			type: "boolean",
			description: "Dim the label to match a disabled control.",
			default: false,
			control: { kind: "boolean" },
		},
	],
	a11y: {
		keyboard: [],
		notes: [
			"Always renders a real label element, so clicking it focuses the control.",
			"The required marker is aria-hidden; mark the control required so it is announced once, not twice.",
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
			entry: "Label",
		},
		svelte: {
			entry: "Label",
		},
	},
	keywords: ["label", "form", "field"],
});
