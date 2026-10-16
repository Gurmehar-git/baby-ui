import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { cardStack as cardStackVariants } from "./react/variants";

const SIZES = ["sm", "default", "lg"];
const VARIANTS = ["stack", "fan", "flat"];

export const cardStack = defineComponent({
	slug: "card-stack",
	name: "Card Stack",
	description:
		"A deck reviewed one card at a time: drag or flick the top card left or right, with undo that flies it back.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(cardStackVariants, ["variant", "size"]),
	props: [
		{
			name: "items",
			type: "T[]",
			description: "The cards, in order. Pair with getKey and getLabel.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "getLabel",
			type: "(item: T) => string",
			description:
				'Short name used in the card\'s accessible label and announcements, e.g. "Lisbon".',
			required: true,
			control: { kind: "none" },
		},
		{
			name: "renderCard",
			type: "(item: T) => ReactNode | Snippet<[T]>",
			description: "Card face. Svelte takes a `card` snippet.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"How the cards behind sit: peeking below (`stack`), splayed to the side (`fan`), or hidden under the top card (`flat`).",
			default: "stack",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "buttons",
			type: "boolean",
			description: "Show the decision and undo buttons. Drag and keys work either way.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "index",
			type: "number",
			description:
				"Position of the top card in `items`. Controlled with onIndexChange; bindable in Svelte.",
			default: 0,
			control: { kind: "none" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Card size.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "labels",
			type: "{ left: string; right: string }",
			description:
				"Action names for each side, on the buttons and the stamps shown while dragging.",
			default: '{ left: "Pass", right: "Keep" }',
			control: { kind: "none" },
		},
		{
			name: "outcomes",
			type: "{ left: string; right: string }",
			description:
				'Past tense of each action for announcements, e.g. "skipped" and "shortlisted".',
			control: { kind: "none" },
		},
		{
			name: "onDecide",
			type: '(item: T, decision: "left" | "right") => void',
			description:
				"Fires when a card is thrown, from a drag, a button or a key. `onUndo` and `onReset` mirror it.",
			control: { kind: "none" },
		},
		{
			name: "renderEmpty",
			type: "(reset: () => void) => ReactNode",
			description: "Shown once every card is decided. Svelte takes an `empty` snippet.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Cards fade out and in instead of flying; the stack settles without springs.",
		behaviour: [
			"The top card follows the pointer and tilts with travel; grabbing its lower half tilts it the other way.",
			"Vertical travel past 48px resists like a rubber band, since only horizontal travel decides.",
			"A flick faster than 500px/s, or a drag past a third of the card, throws it along the flick; otherwise it springs home with the release speed.",
			"The cards behind rise as the top card leaves, and a fourth card fades in at the back.",
			"Undo flies the card back from where it left; start over deals the deck back, deepest card first.",
		],
	},
	a11y: {
		role: "group",
		keyboard: [
			{
				keys: ["Arrow Left", "Arrow Right"],
				action: "Decide the top card left or right",
			},
			{ keys: ["Backspace", "Ctrl+Z"], action: "Undo the last decision" },
			{
				keys: ["Tab"],
				action: "Moves from the stack to the pass, undo and keep buttons",
			},
		],
		notes: [
			"The stack is a labelled group with aria-roledescription card stack; only the top card is exposed, the rest are inert.",
			"Each decision is announced with the card's name and how many remain.",
			"Buttons stay focusable with aria-disabled when the deck runs out, so focus never drops to the page.",
		],
	},
	guidance: {
		when: [
			"Quick, one-by-one triage where each item deserves a moment: shortlisting places, candidates or designs.",
			"Mobile-first flows where a swipe reads naturally.",
		],
		whenNot: [
			{ text: "Comparing items side by side, or sorting them.", use: "data-table" },
			{ text: "Browsing items without deciding on each.", use: "carousel" },
		],
		responsive: [
			"Below 26rem the card shortens and the three controls stay on one row; under 22.5rem Undo shows its icon only.",
		],
		performance: [
			"Only the top four cards render; thrown cards unmount once they fade out.",
			"Drag and throw write transforms straight to the DOM without re-rendering the cards.",
		],
		ai: [
			"Keep decisions in your own state via `onDecide`; the stack only tracks its position and undo history.",
			'Provide `outcomes` in past tense so announcements read naturally ("Lisbon shortlisted. 4 left.").',
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
			entry: "CardStack",
		},
		svelte: {
			entry: "CardStack",
		},
	},
	keywords: ["card", "stack", "swipe", "deck", "triage", "media"],
});
