import { defineComponent } from "../index.ts";

const SIZES = ["sm", "default"];
const VARIANTS = ["default", "ghost"];

const files = (main: string) => [
	{ path: `expanding-button-group/${main}`, type: "registry:ui" as const },
	{ path: "expanding-button-group/group.ts", type: "registry:ui" as const },
	{ path: "expanding-button-group/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

export const expandingButtonGroup = defineComponent({
	slug: "expanding-button-group",
	name: "Expanding Button Group",
	description:
		"A pill of icon buttons where one action always shows its label: pointing at or focusing another slides the label over, and actions confirm in place.",
	category: "advanced",
	status: "stable",
	variants: { variant: VARIANTS, size: SIZES },
	props: [
		{
			name: "items",
			type: "ExpandingButtonGroupItem[]",
			description:
				"Actions: `{ id, label, icon, doneLabel?, onSelect?, variant?, disabled? }`. `onSelect` may return a promise (busy until it settles) or false to skip the confirmation.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description: 'Accessible name of the toolbar, e.g. "Message actions".',
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"A bordered pill, or bare buttons for a toolbar that already has a surface.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "28 or 36px buttons.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "defaultExpanded",
			type: "string | null",
			description:
				"The action whose label shows at rest; defaults to the first enabled one.",
			control: { kind: "none" },
		},
		{
			name: "onAction",
			type: "(id: string) => void",
			description:
				"Called with the item id whenever an action runs, before its own `onSelect`.",
			control: { kind: "none" },
		},
		{
			name: "confirmDuration",
			type: "number",
			description: "How long the confirmation stays, in ms.",
			default: 1400,
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Labels and widths swap at once; the busy pulse stops.",
		behaviour: [
			"The label column opens on a spring while neighbours slide aside; the label slides out from behind the icon.",
			"A confirmation crossfades the icon into a drawn check and the word into its past tense, without resizing.",
			"Hover follows real pointer movement with a 4px threshold, so a button sliding under a resting pointer never takes over.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["ArrowLeft", "ArrowRight"],
				action: "Move between actions (expands the focused one)",
			},
			{ keys: ["Home", "End"], action: "First or last action" },
			{ keys: ["Enter", "Space"], action: "Run the focused action" },
		],
		notes: [
			"A toolbar with roving focus from the primitive; each button is named by its label even while collapsed.",
			"Confirmations are announced in a status region; disabled actions stay focusable so their label can be read.",
			"On touch the first tap reveals the label and the second runs it.",
		],
	},
	guidance: {
		when: [
			"Hover toolbars on messages, rows or cards where icons alone are ambiguous.",
			"A primary action that should read as text, with secondary actions a hover away.",
		],
		whenNot: [
			{ text: "Two or three always-labelled actions.", use: "button" },
			{
				text: "More than five or six actions; move the rest into a menu.",
				use: "dropdown-menu",
			},
		],
		responsive: [
			"The pill takes its natural width; keep labels to one short verb so the expanded width stays small.",
		],
		performance: [
			"Widths animate through one grid column per button; nothing is measured.",
		],
		ai: [
			"Give every item a short verb `label`; it is the accessible name even when only the icon shows.",
			"Add `doneLabel` only for actions that finish in place, not ones that open a dialog.",
			'Use `variant: "destructive"` on the delete item only.',
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
			entry: "ExpandingButtonGroup",
			files: files("expanding-button-group.tsx"),
			dependencies: ["@base-ui/react", "clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "ExpandingButtonGroup",
			files: files("expanding-button-group.svelte"),
			dependencies: ["bits-ui", "clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["toolbar", "actions", "icon buttons", "expand", "morph"],
});
