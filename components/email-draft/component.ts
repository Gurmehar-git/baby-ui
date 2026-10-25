import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { emailDraft as emailDraftVariants } from "./variants";

const VARIANTS = ["tray", "plain"];

export const emailDraft = defineComponent({
	slug: "email-draft",
	name: "Email Draft",
	description:
		"An agent-written email waiting for review: switch the recipient, drop the attachment, pick a tone or edit in place, then send or discard into a receipt with Undo.",
	category: "agents",
	status: "beta",
	added: "2026-10-21",
	variants: variantsOf(emailDraftVariants, ["variant"]),
	props: [
		{
			name: "status",
			type: '"draft" | "sending" | "sent" | "discarded"',
			description:
				"EmailDraft: where the draft is. Set it from your send flow; the email folds into the receipt at sent or discarded.",
			default: "draft",
			control: { kind: "none" },
		},
		{
			name: "onSend / onDiscard / onUndo",
			type: "() => void",
			description:
				"EmailDraft: called by EmailDraftSend (and ⌘/Ctrl Enter in the editor), EmailDraftDiscard and the receipt's Undo.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"EmailDraft: the record in a grey rim above the raised email, or one bordered card.",
			default: "tray",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "value",
			type: "string",
			description:
				'EmailDraftMessage: the email text, edited in place. Controlled with onValueChange; bindable in Svelte. EmailDraftTones: the picked tone, or "" after a hand edit.',
			control: { kind: "none" },
		},
		{
			name: "attached",
			type: "boolean",
			description:
				"EmailDraftAttachment: whether `name` is attached. Controlled with onAttachedChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "Record<status, string>",
			description:
				'EmailDraftState: the badge text per status. Defaults to "Ready for review", "Sending", "Sent" and "Discarded".',
			control: { kind: "none" },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"EmailDraft: EmailDraftHeader (EmailDraftTitle, a Badge, EmailDraftAmount, EmailDraftDescription), then EmailDraftPanel with EmailDraftContent (EmailDraftFields with EmailDraftTo and EmailDraftAttachment, EmailDraftMessage, EmailDraftOptions with EmailDraftTones, EmailDraftEdit and EmailDraftHint), EmailDraftReceipt and EmailDraftFooter (EmailDraftAuthor, EmailDraftState, EmailDraftActions with EmailDraftDiscard and EmailDraftSend).",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The email, receipt and actions swap without folding.",
		behaviour: [
			"Sending dims the email and turns Send into a spinner.",
			"At sent or discarded the email folds away on grid rows as the receipt folds open, and the actions fold out on grid columns.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Ctrl+Enter", "Meta+Enter"], action: "Send from the editor" },
			{ keys: ["Escape"], action: "Leave the editor" },
		],
		notes: [
			"The receipt is a polite live region; focus moves to Undo when the email folds, and back to Send after Undo.",
			"EmailDraftEdit is the keyboard path into the editor; clicking the text is a pointer shortcut.",
			"Removing or re-adding the attachment keeps focus on the button that replaces it.",
		],
	},
	guidance: {
		when: [
			"An agent drafted an email that a person should check before it goes out: renewals, follow-ups, collections.",
		],
		whenNot: [
			{ text: "A queue of quick yes/no calls.", use: "decision-inbox" },
			{ text: "One tool call with its arguments.", use: "tool" },
		],
		ai: [
			"Head the card with the record the email is about; keep tones to three and recompute their text when the recipient changes.",
		],
	},
	licenseOrigin: {
		source: "affectui",
		url: "https://github.com/flohoeller/affectui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Florian Höller (adfects)",
	},
	impl: {
		react: { entry: "EmailDraft" },
		svelte: { entry: "EmailDraft" },
	},
	keywords: [
		"email",
		"draft",
		"agent",
		"review",
		"send",
		"undo",
		"tone",
		"human in the loop",
	],
});
