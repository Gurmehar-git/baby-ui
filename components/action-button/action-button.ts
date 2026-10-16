import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["default", "secondary", "outline", "ghost", "destructive"];
const SIZES = ["xs", "sm", "default", "lg", "xl"];

export const actionButton = defineComponent({
	slug: "action-button",
	name: "Action Button",
	description:
		"A button that runs its own async action: a spinner while it works, then a drawn tick and a past-tense label that morph in before it resets.",
	category: "advanced",
	status: "stable",
	variants: { variant: VARIANTS, size: SIZES },
	props: [
		{
			name: "label",
			type: "string",
			description: 'The action, e.g. "Copy link".',
			required: true,
			control: { kind: "text" },
		},
		{
			name: "onAction",
			type: "() => unknown",
			description:
				"Runs on click. Return a promise to show the pending state; a rejection calls `onActionError` and resets.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "successLabel",
			type: "string",
			description: 'Past-tense word after success, e.g. "Copied".',
			default: "Done",
			control: { kind: "text" },
		},
		{
			name: "pendingLabel",
			type: "string",
			description: "Beside the spinner while the promise runs.",
			default: "Working…",
			control: { kind: "none" },
		},
		{
			name: "resetAfterMs",
			type: "number",
			description: "How long the success state stays.",
			default: 1800,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: "ButtonVariant",
			description: "Any Button variant.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: "ButtonSize",
			description: "Any Button size.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "States swap without the morph and draw.",
		behaviour: [
			"Pending uses Button's own spinner face; success crossfades the label with a rise while the width morphs, and a tick draws in.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Enter", "Space"], action: "Run the action" }],
		notes: [
			"While pending the button is busy and announces its pending label; success is announced in a status region.",
		],
	},
	guidance: {
		when: ["Quick actions that finish in place: copy, save, send, refresh."],
		whenNot: [
			{ text: "Destructive actions that need a second thought.", use: "confirm-morph" },
			{ text: "Actions that navigate or open a dialog.", use: "button" },
		],
		responsive: ["Hugs its label; the width morphs between label and success word."],
		performance: ["No timers run at rest."],
		ai: [
			"Return the request's promise from `onAction` so pending and errors are real.",
			"Write `successLabel` as the past tense of `label`.",
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
			entry: "ActionButton",
		},
		svelte: {
			entry: "ActionButton",
		},
	},
	keywords: ["button", "async", "loading", "success", "copy", "action"],
});
