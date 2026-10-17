import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { confirmMorph as confirmMorphVariants } from "./variants";

const VARIANTS = ["destructive", "default"];
const SIZES = ["sm", "default", "lg"];
const MODES = ["press", "hold", "countdown"];
const STATES = ["idle", "confirming", "pending", "done", "error"];

export const confirmMorph = defineComponent({
	slug: "confirm-morph",
	name: "Confirm Morph",
	description:
		"A button that asks in place: the pill morphs into a question with Cancel and Confirm, then a spinner, then a result with Undo.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(confirmMorphVariants, ["variant", "size"]),
	props: [
		{
			name: "label",
			type: "string",
			description: 'The resting label, e.g. "Delete project".',
			required: true,
			control: { kind: "text" },
		},
		{
			name: "prompt",
			type: "string",
			description:
				"The question while confirming. Defaults to the label with a question mark.",
			control: { kind: "text" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"Colour of the confirm answer: destructive for actions that destroy, default for reversible ones.",
			default: "destructive",
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
			name: "mode",
			type: MODES.map((v) => `"${v}"`).join(" | "),
			description:
				"`press` confirms on a press, `hold` asks for a held press, `countdown` confirms then counts down seconds that Cancel or Escape can still stop.",
			default: "press",
			control: { kind: "select", options: MODES },
		},
		{
			name: "state",
			type: STATES.map((v) => `"${v}"`).join(" | "),
			description:
				"Controlled state, paired with `onStateChange`; bindable in Svelte. `defaultState` seeds it when uncontrolled.",
			control: { kind: "none" },
		},
		{
			name: "onConfirm",
			type: "() => unknown",
			description:
				"Runs on confirm. A promise shows the pending face; a rejection shows the error face with Retry.",
			control: { kind: "none" },
		},
		{
			name: "onUndo",
			type: "() => unknown",
			description: "Offering it adds Undo to the result.",
			control: { kind: "none" },
		},
		{
			name: "confirmLabel, cancelLabel, pendingLabel, doneLabel, errorLabel, retryLabel, undoLabel, undoingLabel, countdownLabel",
			type: "string",
			description:
				"Copy for each face. Defaults read as a delete: Delete, Cancel, Deleting, Deleted.",
			control: { kind: "none" },
		},
		{
			name: "holdDuration",
			type: "number",
			description: "Milliseconds the confirm must be held in `hold` mode.",
			default: 1000,
			control: { kind: "none" },
		},
		{
			name: "countdown",
			type: "number",
			description: "Seconds counted down in `countdown` mode.",
			default: 3,
			control: { kind: "none" },
		},
		{
			name: "confirmTimeout",
			type: "number",
			description:
				"Milliseconds before an unanswered question returns to rest. A resting pointer pauses it; 0 turns it off.",
			default: 6000,
			control: { kind: "none" },
		},
		{
			name: "resultTimeout",
			type: "number",
			description:
				"Milliseconds a result stays before returning to rest; 0 turns it off.",
			default: 5000,
			control: { kind: "none" },
		},
		{
			name: "cancelOnOutsidePress",
			type: "boolean",
			description: "A press outside cancels an open question.",
			default: true,
			control: { kind: "none" },
		},
		{
			name: "icon",
			type: "ReactNode | Snippet",
			description: "Icon before the resting label.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The width and faces swap without the spring, blur or stagger.",
		behaviour: [
			"The pill's width springs to each face while the faces crossfade at their natural width, so text never squashes.",
			"A new face's parts arrive in reading order, each clearing a small blur.",
			"The done tick draws across a success disc; the countdown ring drains as the seconds roll down.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter"], action: "Answer yes from the question (except on Cancel)" },
			{ keys: ["Escape"], action: "Cancel the question, or dismiss a result" },
			{ keys: ["Space", "Enter"], action: "Hold the confirm in `hold` mode" },
		],
		notes: [
			"Focus follows the morph: Confirm while asking, the root while working, Undo or Retry on a result. A timeout never steals focus from elsewhere.",
			"The question is a labelled group; each face change is announced in a status region.",
			"A press within 280ms of the question opening is ignored, so a double tap cannot confirm by accident.",
		],
	},
	guidance: {
		when: [
			"Destructive or important actions where a modal would be heavy: deleting a project, revoking access, discarding a draft.",
			"Rows and toolbars where the confirmation should stay where the action was.",
		],
		whenNot: [
			{
				text: "When the consequences need explaining before the answer.",
				use: "alert-dialog",
			},
			{ text: "Single-gesture confirmation with no question.", use: "hold-to-confirm" },
			{ text: "Ordinary, reversible actions.", use: "button" },
		],
		responsive: ["The pill hugs each face; long prompts truncate at 16rem."],
		performance: [
			"All faces stay mounted and swap by attribute; only the width transitions.",
		],
		ai: [
			"Return the request's promise from `onConfirm` so pending and error faces appear; pass `onUndo` only when undo really works.",
			"Rewrite the labels for the action (Revoke, Revoking, Revoked); the defaults read as a delete.",
			'Use `variant="default"` for reversible actions and `mode="countdown"` when a slip must stay cancellable.',
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
			entry: "ConfirmMorph",
		},
		svelte: {
			entry: "ConfirmMorph",
		},
	},
	keywords: ["confirm", "inline", "delete", "undo", "morph", "destructive"],
});
