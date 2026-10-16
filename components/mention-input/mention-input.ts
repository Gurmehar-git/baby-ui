import { defineComponent } from "@baby-ui/registry-schema";

const SIZES = ["sm", "default", "lg"];
const SIDES = ["bottom", "top"];

const files = (main: string) => [
	{ path: `mention-input/${main}`, type: "registry:ui" as const },
	{ path: "mention-input/mention.ts", type: "registry:ui" as const },
	{ path: "mention-input/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

export const mentionInput = defineComponent({
	slug: "mention-input",
	name: "Mention Input",
	description:
		"A textarea with @ people and # channel mentions that move and delete as single tokens.",
	category: "advanced",
	status: "stable",
	variants: { size: SIZES },
	props: [
		{
			name: "value",
			type: "MentionValue",
			description:
				"`{ text, mentions }`, paired with `onValueChange`; bindable in Svelte. Each mention has `kind`, `id`, `label`, `start` and `end`.",
			control: { kind: "none" },
		},
		{
			name: "people",
			type: "MentionPerson[]",
			description:
				"`{ id, name, role?, avatar? }` offered after `@`; leave it out to turn person mentions off.",
			control: { kind: "none" },
		},
		{
			name: "channels",
			type: "MentionChannel[]",
			description:
				"`{ id, name, description? }` offered after `#`; leave it out to turn channel mentions off.",
			control: { kind: "none" },
		},
		{
			name: "onMentionAdd",
			type: "(mention: Mention) => void",
			description: "Called when a suggestion is chosen, e.g. to notify the person.",
			control: { kind: "none" },
		},
		{
			name: "submitOnEnter",
			type: "boolean",
			description: "Enter calls `onSubmit(value)` and Shift+Enter adds a line.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "minRows",
			type: "number",
			description: "Starting height in rows.",
			default: 2,
			control: { kind: "none" },
		},
		{
			name: "maxRows",
			type: "number",
			description: "The field grows to this many rows, then scrolls.",
			default: 8,
			control: { kind: "none" },
		},
		{
			name: "side",
			type: SIDES.map((v) => `"${v}"`).join(" | "),
			description: "Which side of the field the suggestions open on.",
			default: "bottom",
			control: { kind: "select", options: SIDES },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Text size and padding.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "name",
			type: "string",
			description: "Submits the text, mentions as typed, with a form.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Nothing animates.",
		behaviour: ["Chosen mentions are drawn as tinted chips behind the text."],
	},
	a11y: {
		keyboard: [
			{ keys: ["@", "#"], action: "Open people or channel suggestions" },
			{ keys: ["ArrowDown", "ArrowUp"], action: "Move through suggestions" },
			{ keys: ["Enter", "Tab"], action: "Insert the highlighted suggestion" },
			{ keys: ["Escape"], action: "Close suggestions" },
			{ keys: ["Backspace", "Delete"], action: "Remove a whole mention" },
		],
		notes: [
			"The textarea is a combobox that points at the highlighted option with aria-activedescendant.",
			"The caret and selection never land inside a mention.",
		],
	},
	guidance: {
		when: ["Comments, chat and task descriptions that tag people or channels."],
		whenNot: [
			{ text: "Picking people into a list without free text.", use: "multi-select" },
			{ text: "Plain multi-line text.", use: "textarea" },
		],
		responsive: ["Fills its container; suggestions open below or above it."],
		performance: [
			"Filtering runs on the arrays you pass; fetch and pass a short list for large teams.",
		],
		ai: [
			"Store `serializeMentions(value)` (`<@id>` tokens) rather than the display text.",
			"Pass only the kinds you support; omitting `channels` turns `#` into plain text.",
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
			entry: "MentionInput",
			files: files("mention-input.tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["avatar"],
		},
		svelte: {
			entry: "MentionInput",
			files: files("mention-input.svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["avatar"],
		},
	},
	keywords: ["mention", "tag", "at", "textarea", "comment", "chat", "autocomplete"],
});
