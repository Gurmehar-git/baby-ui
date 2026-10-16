import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { expandingSearch as expandingSearchVariants } from "./react/variants";

const SIZES = ["sm", "default", "lg"];
const VARIANTS = ["default", "ghost"];
const ANCHORS = ["end", "start"];

export const expandingSearch = defineComponent({
	slug: "expanding-search",
	name: "Expanding Search",
	description:
		"A search that waits as an icon button: it morphs into the field, results unfold beneath it, and Escape, choosing a result or leaving it empty folds it back.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(expandingSearchVariants, ["variant", "size"]),
	props: [
		{
			name: "label",
			type: "string",
			description:
				'Names the button, the field and the results, e.g. "Search projects and docs".',
			required: true,
			control: { kind: "none" },
		},
		{
			name: "items",
			type: "ExpandingSearchItem[]",
			description: "Searchable items: `{ id, title, meta?, group?, keywords? }`.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "suggestions",
			type: "ExpandingSearchItem[]",
			description:
				"Shown before anything is typed, such as recent searches, under `suggestionsLabel`.",
			control: { kind: "none" },
		},
		{
			name: "onSelect",
			type: "(item: ExpandingSearchItem) => void",
			description: "Called with the chosen result; the field folds back.",
			control: { kind: "none" },
		},
		{
			name: "expanded",
			type: "boolean",
			description:
				"Whether it is open as a field, paired with `onExpandedChange`; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "value",
			type: "string",
			description: "The typed query, paired with `onValueChange`; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "A bordered button, or a bare icon until it opens.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "32, 36 or 44px tall.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "anchor",
			type: ANCHORS.map((v) => `"${v}"`).join(" | "),
			description: "The edge the button sits on; the field grows away from it.",
			default: "end",
			control: { kind: "select", options: ANCHORS },
		},
		{
			name: "expandedWidth",
			type: "number",
			description: "The widest the field grows, in px; never past its container.",
			default: 360,
			control: { kind: "none" },
		},
		{
			name: "maxResults",
			type: "number",
			description: "Most results shown at once.",
			default: 6,
			control: { kind: "none" },
		},
		{
			name: "placeholder, suggestionsLabel, emptyHint",
			type: "string",
			description:
				'Copy: the placeholder defaults to `label`, suggestions sit under "Recent".',
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The field and panel open without the spring or unfold; only opacity changes.",
		behaviour: [
			"The button's width and corners spring together into the field; the placeholder fades in once it starts moving.",
			"The results panel unfolds from the field's edge, and a highlight glides between rows.",
			"Folding back settles without overshoot, so the circle never dips below its own size.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter", "Space"], action: "Open the field from the button" },
			{ keys: ["ArrowDown", "ArrowUp"], action: "Move between results" },
			{ keys: ["Enter"], action: "Choose the highlighted result" },
			{ keys: ["Escape"], action: "Close the results, then fold back to the button" },
		],
		notes: [
			"Built on the combobox primitive: the field is a combobox with a listbox of results, and the active row is announced.",
			"Focus moves into the field within the same click, so touch keyboards open; it returns to the button on Escape or a choice.",
		],
	},
	guidance: {
		when: [
			"Headers and toolbars where a full search field would crowd the layout.",
			"Quick jumps to a known project, doc or person.",
		],
		whenNot: [
			{
				text: "A search that should always be visible, such as on a results page.",
				use: "input-group",
			},
			{ text: "Running commands as well as finding things.", use: "command" },
		],
		responsive: [
			"It grows into the space you place it in, up to `expandedWidth`; give it the row's free width.",
		],
		performance: [
			"Ranking is a single pass over `items`; keep large indexes server-side and pass the current page.",
		],
		ai: [
			"Wrap it in the container it may grow into and pick the `anchor` edge that sits at the toolbar's end.",
			"Give items a `group` to section results and `keywords` for synonyms.",
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
			entry: "ExpandingSearch",
		},
		svelte: {
			entry: "ExpandingSearch",
		},
	},
	keywords: ["search", "combobox", "expand", "toolbar", "morph"],
});
