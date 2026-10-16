import { defineComponent } from "@baby-ui/registry-schema";

export const tagInput = defineComponent({
	slug: "tag-input",
	name: "Tag Input",
	description:
		"Free-text tags with Enter to commit and Backspace to remove the last one.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "tags",
			type: "string[]",
			description: "Current tags. Bindable.",
			control: { kind: "none" },
		},
		{
			name: "placeholder",
			type: "string",
			description: "Field placeholder.",
			default: "Add a tag\u2026",
			control: { kind: "text" },
		},
		{
			name: "max",
			type: "number",
			description: "Maximum number of tags.",
			default: 6,
			control: { kind: "number", min: 1, max: 12, step: 1 },
		},
		{
			name: "disabled",
			type: "boolean",
			description: "Disable the control.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "invalid",
			type: "boolean",
			description: "Marks the field invalid from outside, e.g. a form error.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "size",
			type: '"xs" | "sm" | "default" | "lg" | "xl"',
			description: "Field height and chip size.",
			default: "default",
			control: { kind: "select", options: ["xs", "sm", "default", "lg", "xl"] },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Chips appear without scaling.",
		behaviour: [
			"Backspace on an empty field rings the tag it will remove before removing it.",
			"A new tag pops in from 0.95 over 200ms; the field rings while the input has focus.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter", ","], action: "Commits the current text" },
			{
				keys: ["Backspace", "Delete"],
				action: "In an empty field, selects the last tag; press again to remove it",
			},
			{ keys: ["ArrowLeft", "ArrowRight"], action: "Move the selection between tags" },
			{ keys: ["Escape"], action: "Clear the selection" },
			{ keys: ["Tab"], action: "Reaches each tag's remove button" },
		],
		notes: [
			"A live region reports the tag count, and names the selected tag before Backspace removes it.",
			"Duplicates are rejected silently rather than added twice.",
			"Blur commits any pending text, so a half-typed tag is not lost when the user clicks away.",
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
			entry: "TagInput",
		},
		svelte: {
			entry: "TagInput",
		},
	},
	keywords: ["tag", "input"],
});
