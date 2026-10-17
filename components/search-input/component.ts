import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["default", "pill"];
const SIZES = ["xs", "sm", "default", "lg", "xl"];

export const searchInput = defineComponent({
	slug: "search-input",
	name: "Search Input",
	description:
		"A search field with a leading glass, a clear button in a reserved slot, and an optional shortcut that focuses it.",
	category: "base",
	status: "stable",
	variants: { variant: VARIANTS, size: SIZES },
	props: [
		{
			name: "label",
			type: "string",
			description: "Accessible name; also the placeholder unless one is given.",
			required: true,
			control: { kind: "text" },
		},
		{
			name: "value",
			type: "string",
			description:
				"The query, paired with `onValueChange`; bindable in Svelte. `defaultValue` seeds it.",
			control: { kind: "none" },
		},
		{
			name: "shortcut",
			type: "string",
			description:
				'A key that focuses the field from anywhere, e.g. `"/"` or `"mod+k"`; shown while the field is empty.',
			control: { kind: "text" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "The field's own corners, or a full pill.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Height on the control ladder.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The clear button appears without the scale and blur.",
		behaviour: [
			"The clear button scales in from 80% with a short blur when there is text; the shortcut hint fades as you type.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Escape"], action: "Clear the field" },
			{
				keys: ["Shortcut"],
				action: "Focus the field from anywhere (when `shortcut` is set)",
			},
		],
		notes: [
			"A native search input named by `label`; the clear button is named and leaves the tab order while hidden.",
			"Clearing returns focus to the field, since the button disappears under the pointer.",
		],
	},
	guidance: {
		when: [
			"Filtering a list or table in place, and site or app search fields that stay visible.",
		],
		whenNot: [
			{
				text: "A search that waits as an icon in a crowded toolbar.",
				use: "expanding-search",
			},
			{ text: "Searching and running commands from anywhere.", use: "command" },
		],
		responsive: [
			"Fills its container; on phones the 16px text stops iOS from zooming in.",
		],
		performance: ["A plain input; debounce your own filtering if it is expensive."],
		ai: [
			"Always pass `label`; it names the field even when a placeholder is shown.",
			'Add `shortcut="/"` on pages where search is the main action.',
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
			entry: "SearchInput",
		},
		svelte: {
			entry: "SearchInput",
		},
	},
	keywords: ["search", "input", "filter", "field", "clear"],
});
