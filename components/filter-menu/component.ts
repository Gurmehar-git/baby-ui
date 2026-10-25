import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { filterMenu as filterMenuVariants } from "./variants";

const VARIANTS = ["card", "plain"];

export const filterMenu = defineComponent({
	slug: "filter-menu",
	name: "Filter Menu",
	description:
		"Grouped filters as checkboxes in folding groups, with the picks on top as removable chips and a count on each group.",
	category: "blocks",
	status: "beta",
	added: "2026-10-21",
	variants: variantsOf(filterMenuVariants, ["variant"]),
	props: [
		{
			name: "groups",
			type: "{ id: string; label: string; options: { id: string; label: string }[]; chipPrefix?: string }[]",
			description:
				'FilterMenu: every group and its options. `chipPrefix` goes before the option on its chip, e.g. "Score: ".',
			required: true,
			control: { kind: "none" },
		},
		{
			name: "value",
			type: "Record<string, string[]>",
			description:
				"FilterMenu: picked option ids, by group. Controlled with onValueChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "open",
			type: "string[]",
			description:
				"FilterMenu: open groups; the first starts open. Controlled with onOpenChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"FilterMenu: a bordered surface, or no frame for use inside a popover or sidebar.",
			default: "card",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "pickedLabel",
			type: "(count: number) => string",
			description:
				'FilterMenuGroups: the pick count beside a group. Defaults to "2 picked".',
			control: { kind: "none" },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"FilterMenu: FilterMenuHeader (FilterMenuTitle, FilterMenuClear), FilterMenuChips and FilterMenuGroups.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Chips and groups appear and fold without animating.",
		behaviour: [
			"The chip row folds open with the first pick and shut with the last, on grid rows; each chip pops in at 95% scale.",
			"Groups open and close on the accordion's own fold.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["ArrowUp", "ArrowDown"], action: "Move between group headers" },
			{ keys: ["Enter", "Space"], action: "Open a group, or toggle a filter" },
		],
		notes: [
			"Groups are an accordion of disclosure buttons; options are labelled checkboxes.",
			"Each chip's remove button is named after the chip; the chip row is a polite live region.",
		],
	},
	guidance: {
		when: ["Narrowing a list or table by several facets at once."],
		whenNot: [
			{ text: "Filtering inside the table's own columns.", use: "filter-table" },
			{ text: "Picking one value from a long list.", use: "combobox" },
		],
		ai: ["Keep groups to the facets people actually use; under ten options each."],
	},
	licenseOrigin: {
		source: "affectui",
		url: "https://github.com/flohoeller/affectui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Florian Höller (adfects)",
	},
	impl: {
		react: { entry: "FilterMenu" },
		svelte: { entry: "FilterMenu" },
	},
	keywords: ["filters", "facets", "chips", "checkbox", "refine", "search"],
});
