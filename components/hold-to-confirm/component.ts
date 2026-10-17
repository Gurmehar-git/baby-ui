import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { holdToConfirm as holdToConfirmVariants } from "./variants";

const VARIANTS = ["default", "destructive", "secondary"];
const SIZES = ["sm", "default", "lg"];

export const holdToConfirm = defineComponent({
	slug: "hold-to-confirm",
	name: "Hold to Confirm",
	description:
		"A button that commits only after it is held: the fill tracks the hold, an early release rewinds it, and finishing morphs into a done state.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(holdToConfirmVariants, ["variant", "size"]),
	props: [
		{
			name: "label",
			type: "string",
			description: 'The instruction and the action, e.g. "Hold to delete project".',
			required: true,
			control: { kind: "text" },
		},
		{
			name: "confirmedLabel",
			type: "string",
			description: 'Shown once the hold completes, e.g. "Deleted".',
			default: "Done",
			control: { kind: "text" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"Fill colour: the primary, destructive for irreversible actions, or the foreground.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Height and type size.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "duration",
			type: "number",
			description: "Hold length in milliseconds.",
			default: 1200,
			control: { kind: "number", min: 400, max: 4000, step: 100 },
		},
		{
			name: "confirmed",
			type: "boolean",
			description:
				"The done state. Set it back to false to reset; bindable in Svelte. Leave it unset to let the button own it.",
			control: { kind: "none" },
		},
		{
			name: "onConfirm",
			type: "() => void",
			description:
				"Called once when the hold completes. `onHoldChange` reports each hold starting and ending.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "icon",
			type: "ReactNode | Snippet",
			description: "Icon beside the label; it swaps for a drawn tick when done.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The fill and rewind jump, and labels swap without blur or rise.",
		behaviour: [
			"The fill grows linearly over `duration` while held and resumes from where it was on a quick re-press.",
			"Letting go early rewinds the fill on a critically damped spring.",
			"The button presses to 97% while held; sliding 24px off it cancels the hold.",
			"On completion the label crossfades with a rise and blur while the width morphs, and the icon becomes a tick that draws itself.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Space", "Enter"], action: "Hold to fill; release early to cancel" },
		],
		notes: [
			'The hint ("Press and hold for 1.2 seconds") is linked by aria-describedby until the action completes.',
			"Completion is announced in a status region; the button then reports aria-disabled until reset.",
			"Text flips colour at the fill's edge because the fill is a second copy of the face, so contrast holds throughout.",
		],
	},
	guidance: {
		when: [
			"Destructive or hard-to-undo actions where a stray tap must not count, and the consequence is already on screen.",
			"Touch interfaces where a confirmation dialog would interrupt the flow.",
		],
		whenNot: [
			{ text: "When people need to read the consequences first.", use: "alert-dialog" },
			{ text: "Ordinary actions: holding is slower than a click.", use: "button" },
		],
		responsive: [
			"The button hugs its label; long labels morph their width on completion.",
		],
		performance: ["The fill animates one clip-path; nothing re-renders while held."],
		ai: [
			'Write the label as instruction plus action ("Hold to delete project"), and `confirmedLabel` in the past tense.',
			'Use `variant="destructive"` only for irreversible actions.',
			"To reset after a failed request, control `confirmed` and set it back to false.",
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
			entry: "HoldToConfirm",
		},
		svelte: {
			entry: "HoldToConfirm",
		},
	},
	keywords: ["hold", "confirm", "press", "destructive", "button", "morph"],
});
