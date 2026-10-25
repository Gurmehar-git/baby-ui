import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { messageActions as messageActionsVariants } from "./variants";

const VARIANTS = ["quiet", "solid"];

export const messageActions = defineComponent({
	slug: "message-actions",
	name: "Message Actions",
	description:
		"The row under an assistant reply: copy, regenerate, versions, thumbs and read aloud, each answering the press in place, with a reason form on a thumbs down.",
	category: "agents",
	status: "beta",
	added: "2026-10-21",
	variants: variantsOf(messageActionsVariants, ["variant"]),
	props: [
		{
			name: "feedback",
			type: '"up" | "down" | null',
			description:
				"MessageActions: the vote on the message. Controlled with onFeedbackChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"MessageActions: fade the bar until the message (a group/message ancestor) is hovered or focused, or keep it at full strength.",
			default: "quiet",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "text",
			type: "string",
			description: "MessageActionsCopy: what goes on the clipboard.",
			control: { kind: "none" },
		},
		{
			name: "loading",
			type: "boolean",
			description:
				"MessageActionsRegenerate: keep the arrow turning while a new version is written.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "value / count",
			type: "number",
			description:
				"MessageActionsVersions: the shown version (from 0) and how many there are. Folds open at two; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "pressed",
			type: "boolean",
			description:
				"MessageActionsSpeak: playing. Drive it from your speech player; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "reasons",
			type: "string[]",
			description:
				"MessageActionsFeedbackPanel: the reasons to pick from on a thumbs down. `otherReason` opens a text field.",
			control: { kind: "none" },
		},
		{
			name: "onSubmit",
			type: "(reason: string) => void",
			description:
				"MessageActionsFeedbackPanel: called with the picked reason, or the typed text for the other reason.",
			control: { kind: "none" },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"MessageActions: MessageActionsBar (MessageActionsCopy, MessageActionsRegenerate, MessageActionsVersions, MessageActionsFeedback, MessageActionsSpeak), then MessageActionsFeedbackPanel.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: ["bouncy"],
		reducedMotion:
			"Icons swap without squish or turn; the panel and versions open without folding; the equalizer holds still.",
		behaviour: [
			"Thumbs squish to 75% on press and spring back as they fill.",
			"Regenerate turns its arrow a full circle per press, and spins while loading.",
			"Versions fold open on grid columns once there are two; the panel folds open on grid rows on a thumbs down.",
			"Read aloud swaps the speaker for a three-bar equalizer while playing.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["ArrowLeft", "ArrowRight"], action: "Move between the bar's buttons" },
			{ keys: ["Enter", "Space"], action: "Press the focused action" },
		],
		notes: [
			"The bar is a toolbar; thumbs and read aloud are toggle buttons with aria-pressed.",
			"Votes, version changes and the thanks line are read from a polite live region.",
			"The closed panel and the hidden versions stepper are inert.",
		],
	},
	guidance: {
		when: [
			"Under each assistant reply in a chat, so people can copy, retry and rate it.",
		],
		whenNot: [
			{ text: "Reactions with counts on a post or comment.", use: "reaction-bar" },
			{ text: "Copying a code block.", use: "copy-button" },
		],
		ai: [
			"Wrap the message in `group/message` so the quiet bar lights up on hover; keep reasons to four or five short phrases.",
		],
	},
	licenseOrigin: {
		source: "affectui",
		url: "https://github.com/flohoeller/affectui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Florian Höller (adfects)",
	},
	impl: {
		react: { entry: "MessageActions" },
		svelte: { entry: "MessageActions" },
	},
	keywords: [
		"message",
		"chat",
		"assistant",
		"feedback",
		"thumbs",
		"copy",
		"regenerate",
		"read aloud",
	],
});
