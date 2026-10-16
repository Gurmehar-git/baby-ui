import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { morphSelect as morphSelectVariants } from "./react/variants";

const SIZES = ["sm", "default", "lg"];
const VARIANTS = ["default", "ghost"];

export const morphSelect = defineComponent({
	slug: "morph-select",
	name: "Morph Select",
	description:
		"A select whose trigger is the list: opening grows the trigger into the options surface, a highlight glides between rows, and the chosen label rolls into the trigger.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(morphSelectVariants, ["variant", "size"]),
	props: [
		{
			name: "label",
			type: "string",
			description:
				"Visible label, also the accessible name of the trigger and the list. `hideLabel` keeps it for assistive tech only.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "items",
			type: "(MorphSelectOption | { label: string; options: MorphSelectOption[] })[]",
			description:
				"Options, flat or in labelled groups. An option is `{ value, label, meta?, disabled? }`; `meta` is a short trailing detail.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "value",
			type: "string | null",
			description:
				"The chosen value, paired with `onValueChange`; bindable in Svelte. `defaultValue` seeds it when uncontrolled.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "A bordered field, or a ghost trigger for toolbars and headings.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Trigger height and type size.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "placeholder",
			type: "string",
			description: "Shown while nothing is chosen.",
			default: "Select",
			control: { kind: "none" },
		},
		{
			name: "panelWidth",
			type: "number",
			description: "Width of the open surface in px; never narrower than the trigger.",
			default: 272,
			control: { kind: "none" },
		},
		{
			name: "maxListHeight",
			type: "number",
			description: "Tallest the list gets before it scrolls, in px.",
			default: 296,
			control: { kind: "none" },
		},
		{
			name: "name",
			type: "string",
			description: "Adds a hidden input for native form submission.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The surface, highlight and label swap without movement.",
		behaviour: [
			"The popup opens over its trigger, clipped to the trigger's box, and the clip springs out to the full list; closing folds it back.",
			"A highlight glides between rows on a spring and fades when nothing is highlighted.",
			"A new value rolls into the trigger while the trigger's width springs to fit it.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter", "Space", "ArrowDown", "ArrowUp"], action: "Open the list" },
			{ keys: ["ArrowDown", "ArrowUp"], action: "Move between options" },
			{ keys: ["Home", "End"], action: "First or last option" },
			{ keys: ["Enter", "Space"], action: "Choose the highlighted option" },
			{ keys: ["Escape"], action: "Close without changing" },
			{ keys: ["Letters"], action: "Type ahead to an option" },
		],
		notes: [
			"Built on the same select primitive as Select: listbox roles, focus return and form submission come from it.",
			"The lid that repeats the trigger is aria-hidden; the trigger keeps the accessible name.",
		],
	},
	guidance: {
		when: [
			"Compact property pickers and form fields with a few to a few dozen options.",
			"Toolbars where the picker should feel like part of the control, not a separate menu.",
		],
		whenNot: [
			{ text: "Long lists people search by typing.", use: "combobox" },
			{ text: "Several values at once.", use: "multi-select" },
			{ text: "Two to five options that all fit on screen.", use: "toggle-group" },
		],
		responsive: [
			"The surface keeps `panelWidth` and never goes narrower than the trigger; long lists scroll inside.",
		],
		performance: [
			"The open and close are one clip-path transition; the highlight is one element moved by transform.",
		],
		ai: [
			"Pass `label` even when `hideLabel` hides it; it names the trigger and the list.",
			"Use groups for time zones, regions or teams, and `meta` for offsets or counts.",
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
			entry: "MorphSelect",
		},
		svelte: {
			entry: "MorphSelect",
		},
	},
	keywords: ["select", "listbox", "dropdown", "morph", "picker"],
});
