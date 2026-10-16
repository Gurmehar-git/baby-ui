import { defineComponent } from "@baby-ui/registry-schema";

export const copyButton = defineComponent({
	slug: "copy-button",
	name: "Copy Button",
	description:
		"Clipboard button that confirms, announces, and degrades when the API is blocked.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "text",
			type: "string",
			description: "Value written to the clipboard.",
			default: "npx shadcn add button",
			control: { kind: "text" },
		},
		{
			name: "label",
			type: "string",
			description: "Idle label.",
			default: "Copy",
			control: { kind: "text" },
		},
		{
			name: "copiedLabel",
			type: "string",
			description: "Label after a successful copy.",
			default: "Copied",
			control: { kind: "text" },
		},
		{
			name: "iconOnly",
			type: "boolean",
			description: "Drop the label and keep the icon.",
			default: false,
			control: { kind: "boolean" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The press scale is removed; the icon still swaps.",
		behaviour: [
			"The confirmation holds for 1.6s, long enough to read and short enough not to look stuck.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Enter", "Space"], action: "Copies" }],
		notes: [
			"A visually hidden live region announces the confirmation; a label that only changes visually is silent to a screen reader.",
			"Clipboard access throws outside a secure context, so the catch tells the user to press Ctrl+C rather than showing a false success.",
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
			entry: "CopyButton",
		},
		svelte: {
			entry: "CopyButton",
		},
	},
	keywords: ["copy", "button"],
});
