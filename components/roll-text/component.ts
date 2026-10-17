import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { rollText as rollTextVariants } from "./variants";

const SIZES = ["sm", "md", "lg"];
const MOTIONS = ["slide", "tilt"];

export const rollText = defineComponent({
	slug: "roll-text",
	name: "Roll Text",
	description:
		"A label that rolls on hover like a flip-clock digit, or swaps to a second label on hover and click.",
	category: "text",
	status: "stable",
	variants: variantsOf(rollTextVariants, ["size", "motion"]),
	props: [
		{
			name: "text",
			type: "string",
			description: "Label duplicated across the two stacked roll layers.",
			control: { kind: "text" },
			default: "Roll text",
		},
		{
			name: "to",
			type: "string",
			description:
				"A second label: hover previews it and click toggles to it, turning the roll into a swap.",
			default: "",
			control: { kind: "text" },
		},
		{
			name: "active",
			type: "boolean",
			description: "Controlled swap state when `to` is set.",
			control: { kind: "none" },
		},
		{
			name: "defaultActive",
			type: "boolean",
			description: "Uncontrolled starting swap state.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "onActiveChange",
			type: "(active: boolean) => void",
			description: "Fires when a click toggles the swap.",
			control: { kind: "none" },
		},
		{
			name: "groupHover",
			type: "boolean",
			description:
				"Plays when the nearest `[data-roll-group]`/`.group/roll` ancestor is hovered or focused, instead of this element itself.",
			default: false,
			control: { kind: "boolean" },
			showWhen: { to: [""] },
		},
		{
			name: "disabled",
			type: "boolean",
			description: "Hover and focus do not trigger the roll.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "stagger",
			type: '"none" | "word" | "character"',
			description:
				"Stagger the roll across words or characters. `none` animates the whole label at once.",
			default: "none",
			control: { kind: "select", options: ["none", "word", "character"] },
			showWhen: { to: [""] },
		},
		{
			name: "staggerMs",
			type: "number",
			description: "Delay step between staggered units.",
			default: 32,
			control: { kind: "number", min: 0, max: 100, step: 4 },
		},
		{
			name: "durationMs",
			type: "number",
			description: "Per-unit roll travel duration.",
			default: 450,
			control: { kind: "number", min: 100, max: 1000, step: 50 },
		},
		{
			name: "motion",
			type: MOTIONS.map((v) => `"${v}"`).join(" | "),
			description:
				"Slide rolls a second copy up into place; tilt tips each letter back while its copy flips up in 3D.",
			default: "slide",
			control: { kind: "select", options: MOTIONS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Type scale.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The roll completes instantly to its open state instead of animating.",
		behaviour: [
			"Tilt: the front letter tips back and blurs away while an echo flips up from below with a slight overshoot; units finish on the echo landing.",
			"With `to`, the root is a toggle button: slide lifts one label out and the next in, tilt turns each letter over in 3D and replays backwards on the way out.",
			"On hover/focus, two stacked copies of the label roll: the top slides up out of view, the bottom rises in to replace it. Re-triggering while open rolls again from the top.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The rolling track is `aria-hidden`; a single `sr-only` copy carries the real text once.",
			"Focusable by default (`tabindex=0`) unless `groupHover` is set; then the wrapping link or button carries focus.",
		],
	},

	impl: {
		react: {
			entry: "RollText",
		},
		svelte: {
			entry: "RollText",
		},
	},
	keywords: ["text", "roll", "hover", "flip", "swap", "toggle"],
});
