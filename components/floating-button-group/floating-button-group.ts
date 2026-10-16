import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { floatingButtonGroup as floatingButtonGroupVariants } from "./react/variants";

const SIZES = ["sm", "default"];
const VARIANTS = ["default", "floating"];
const ORIENTATIONS = ["horizontal", "vertical"];

export const floatingButtonGroup = defineComponent({
	slug: "floating-button-group",
	name: "Floating Button Group",
	description:
		"Soft buttons in a quiet tray with one shared highlight that glides to whichever button the pointer or keyboard is on.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(floatingButtonGroupVariants, ["variant", "size"]),
	props: [
		{
			name: "items",
			type: '(FloatingButtonGroupAction | { type: "separator" })[]',
			description:
				"Actions: `{ id, label, icon?, iconOnly?, onSelect?, disabled?, pressed?, shortcut?, reserveLabels? }`, with separators between groups.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description: 'Accessible name of the toolbar, e.g. "Board actions".',
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"A quiet tinted tray, or a raised one for overlays such as a selection toolbar.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "30 or 36px buttons.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "orientation",
			type: ORIENTATIONS.map((v) => `"${v}"`).join(" | "),
			description: "A row, or a column for side rails; arrow keys follow it.",
			default: "horizontal",
			control: { kind: "select", options: ORIENTATIONS },
		},
		{
			name: "iconOnly",
			type: "boolean",
			description:
				"Every item with an icon shows only the icon, with its label in a tooltip.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "tooltipSide",
			type: '"top" | "bottom" | "left" | "right"',
			description:
				"Side of the tooltips; top for a row and right for a column by default.",
			control: { kind: "none" },
		},
		{
			name: "onAction",
			type: "(id: string) => void",
			description: "Called with the item id after the item's own `onSelect`.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The highlight jumps between buttons and labels swap without the rise.",
		behaviour: [
			"One highlight glides between buttons on a spring; appearing from nothing it lands in place and grows from 94%.",
			"It fades when the pointer leaves the tray and dips to 96.5% with a darker tint while a button is pressed.",
			"A label change crossfades in place; `reserveLabels` keeps the button at its widest label so nothing shifts.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["ArrowLeft", "ArrowRight"],
				action: "Move between buttons (ArrowUp and ArrowDown when vertical)",
			},
			{ keys: ["Home", "End"], action: "First or last button" },
			{ keys: ["Enter", "Space"], action: "Run the focused button" },
		],
		notes: [
			"A toolbar with roving focus from the primitive; disabled buttons are skipped by the arrows but stay readable.",
			"Toggle actions set aria-pressed; icon-only buttons are named by their label and show it in a tooltip.",
			"The highlight is the only hover and focus indicator, so it follows keyboard focus as well as the pointer.",
		],
	},
	guidance: {
		when: [
			"Canvas and editor toolbars, selection toolbars, and side rails of tools.",
			"Groups of actions and toggles that read better without individual button chrome.",
		],
		whenNot: [
			{
				text: "One action should stay labelled while the rest are icons.",
				use: "expanding-button-group",
			},
			{ text: "Choosing one of several values.", use: "toggle-group" },
		],
		responsive: [
			"The tray keeps its natural size and never wraps; switch to a vertical rail or a menu on narrow screens.",
		],
		performance: [
			"The highlight is one element moved by transform; buttons never re-render as it moves.",
		],
		ai: [
			"Give every item a `label` even when `iconOnly`; it names the button and fills the tooltip.",
			"Use `pressed` for modes such as Present, and `reserveLabels` for labels that change in place.",
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
			entry: "FloatingButtonGroup",
		},
		svelte: {
			entry: "FloatingButtonGroup",
		},
	},
	keywords: ["toolbar", "actions", "highlight", "tray", "icon buttons"],
});
