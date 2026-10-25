import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { decisionInbox as decisionInboxVariants } from "./variants";

const VARIANTS = ["tray", "plain"];

export const decisionInbox = defineComponent({
	slug: "decision-inbox",
	name: "Decision Inbox",
	description:
		"Open decisions with a quick answer each: the answer shows for a beat, the row folds away and the count goes down.",
	category: "agents",
	status: "beta",
	added: "2026-10-21",
	variants: variantsOf(decisionInboxVariants, ["variant"]),
	props: [
		{
			name: "value",
			type: "Record<string, string>",
			description:
				"DecisionInbox: the answer given to each decision, by its value. Controlled with onValueChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "collapsed",
			type: "string[]",
			description:
				"DecisionInbox: decisions folded to one line until clicked. Controlled with onCollapsedChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"DecisionInbox: the status line in a grey rim above a raised list, or one bordered card.",
			default: "tray",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "label",
			type: "(open: number) => string",
			description:
				'DecisionInboxHeader: the status text. Defaults to "2 need your input" and "All caught up".',
			control: { kind: "none" },
		},
		{
			name: "primary",
			type: "boolean",
			description:
				"DecisionInboxAction: the filled button, for the answer most people give.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"DecisionInbox: DecisionInboxHeader, DecisionInboxList of DecisionInboxItem (value; DecisionInboxTitle, DecisionInboxBody with DecisionInboxDetail and DecisionInboxActions of DecisionInboxAction), then DecisionInboxEmpty.",
			control: { kind: "none" },
		},
	],
	cssVars: {
		"--decision-inbox-hold": "How long an answer shows before its row folds away; 1s.",
	},
	motion: {
		springs: [],
		reducedMotion: "Answered rows and the empty state swap without folding.",
		behaviour: [
			"Answering swaps the actions for a check and the answer, which pops in at 95% scale.",
			"After --decision-inbox-hold the row folds to nothing on grid rows and fades; the empty line folds open once all are answered.",
			"A folded row's body opens on grid rows when its title is clicked.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Enter", "Space"], action: "Answer, or open a folded decision" }],
		notes: [
			"The status line is a polite live region and turns from a warning to a success colour, with a matching icon.",
			"Answering moves focus to the next open decision's first answer, or to the status line when none are left.",
			"Answered rows and folded bodies are inert.",
		],
	},
	guidance: {
		when: [
			"A queue of choices an agent or teammate is waiting on: approve a refund, pick a slot, confirm a send.",
		],
		whenNot: [
			{ text: "One high-stakes tool call with arguments and a diff.", use: "tool" },
			{ text: "Notifications that need no answer.", use: "notification-center" },
		],
		ai: [
			"Phrase each title as the question; keep detail to one line and answers to one or two words.",
		],
	},
	licenseOrigin: {
		source: "affectui",
		url: "https://github.com/flohoeller/affectui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Florian Höller (adfects)",
	},
	impl: {
		react: { entry: "DecisionInbox" },
		svelte: { entry: "DecisionInbox" },
	},
	keywords: [
		"decisions",
		"inbox",
		"approvals",
		"queue",
		"agent",
		"human in the loop",
		"triage",
	],
});
