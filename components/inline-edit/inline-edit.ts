import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["title", "body"];
const SIZES = ["sm", "default", "lg"];

const files = (main: string) => [
	{ path: `inline-edit/${main}`, type: "registry:ui" as const },
	{ path: "inline-edit/edit.ts", type: "registry:ui" as const },
	{ path: "inline-edit/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

export const inlineEdit = defineComponent({
	slug: "inline-edit",
	name: "Inline Edit",
	description:
		"Text that edits in place: click to put the caret where you clicked, Enter or blur saves, Escape cancels, and a failed save rolls back.",
	category: "advanced",
	status: "stable",
	variants: { variant: VARIANTS, size: SIZES },
	props: [
		{
			name: "value",
			type: "string",
			description:
				"The saved value; a new one from outside replaces the text while it is not being edited.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "onSave",
			type: "(next: string) => unknown",
			description:
				"Persists the new value. Return a promise to show saving; reject it to roll back.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description: 'Accessible name, e.g. "Project name".',
			required: true,
			control: { kind: "none" },
		},
		{
			name: "validate",
			type: "(next: string) => string | null | undefined",
			description:
				"Returns a message when the draft cannot be saved; the field stays open.",
			control: { kind: "none" },
		},
		{
			name: "multiline",
			type: "boolean",
			description:
				"Wraps and grows in height. Enter saves; Shift+Enter adds a line break.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "`title` for names and headings, `body` for descriptions.",
			default: "title",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Type size.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "as",
			type: '"span" | "p" | "h1" | "h2" | "h3"',
			description: "The element that holds the text, so a title can stay a heading.",
			default: "span",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Text swaps without rising.",
		behaviour: [
			"The field grows with the text as you type, sitting exactly where the text was.",
			"A saved value rises into place; a tick draws beside it, then fades.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter", "Space"], action: "Start editing with everything selected" },
			{ keys: ["Enter"], action: "Save (Shift+Enter adds a line in multiline)" },
			{ keys: ["Escape"], action: "Cancel and return to the text" },
		],
		notes: [
			"The text is a button named with the label and the current value; editing swaps it for a named field.",
			"Validation errors are an alert tied to the field; saving and saved are announced in a status region.",
			"Focus returns to the text after Enter or Escape.",
		],
	},
	guidance: {
		when: [
			"Renaming things where they are shown: project names, titles, short descriptions.",
		],
		whenNot: [
			{ text: "Several fields edited together.", use: "form" },
			{ text: "Long rich text.", use: "textarea" },
		],
		responsive: ["The text wraps like any other; multiline fields grow in height."],
		performance: ["One state machine per field; nothing runs while idle."],
		ai: [
			"Return the request's promise from `onSave` so failures roll back with a retry.",
			'Pass `as="h1"` (or h2, h3) when the text is a heading, so the document outline stays right.',
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
			entry: "InlineEdit",
			files: files("inline-edit.tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["spinner"],
		},
		svelte: {
			entry: "InlineEdit",
			files: files("inline-edit.svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["spinner"],
		},
	},
	keywords: ["inline", "edit", "rename", "editable", "text", "in place"],
});
