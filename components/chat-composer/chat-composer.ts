import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { chatComposer as chatComposerVariants } from "./react/variants";

const VARIANTS = ["framed", "outline"];
const SIZES = ["sm", "md"];

export const chatComposer = defineComponent({
	slug: "chat-composer",
	name: "Chat Composer",
	description:
		"A controlled chat panel: topic toggles, a scrolling thread and a composer, built from registry parts.",
	category: "agents",
	status: "stable",
	variants: variantsOf(chatComposerVariants, ["variant", "size"]),
	props: [
		{
			name: "messages",
			type: "ChatMessage[]",
			description:
				"Every message in the active thread, oldest first. Required: the caller appends replies, the panel never simulates them.",
			control: { kind: "none" },
		},
		{
			name: "topics",
			type: "ChatTopic[]",
			description: "Switchable threads shown as header toggles; hidden when empty.",
			control: { kind: "none" },
		},
		{
			name: "topic",
			type: "string",
			description:
				"Active topic key. Controlled with onTopicChange (React also defaultTopic); bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "value",
			type: "string",
			description:
				"Draft text. Controlled with onValueChange (React also defaultValue); bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "status",
			type: '"idle" | "streaming"',
			description:
				"`streaming` dims the newest assistant message and holds the send button until the caller settles it.",
			default: "idle",
			control: { kind: "none" },
		},
		{
			name: "onSend",
			type: "(text: string, topic?: string) => void",
			description:
				"Fired with the trimmed prompt (Enter, the send button, or a history pick).",
			control: { kind: "none" },
		},
		{
			name: "onNew",
			type: "() => void",
			description: 'Shows the "new conversation" action when provided.',
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"`framed` sits in Card's inset rim; `outline` is a flat bordered card.",
			default: "framed",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Panel height and message type size.",
			default: "sm",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "labels",
			type: "Partial<ChatComposerLabels>",
			description: "Every built-in string, including the placeholder and aria labels.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"New messages still appear; the fade-up and the resolving dim drop to an instant change.",
		behaviour: [
			"The panel height is fixed: the thread scrolls to the newest message instead of growing the card.",
			"New messages fade up; while `status` is streaming the newest assistant message dims, then settles.",
			"The draft grows up to four lines, then scrolls; Shift+Enter adds a line.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter"], action: "Sends" },
			{ keys: ["Shift+Enter"], action: "Adds a new line" },
			{ keys: ["Arrow keys"], action: "Moves between topic toggles" },
			{ keys: ["Tab"], action: "Reaches the actions, the prompt and send" },
		],
		notes: [
			"Topics are a single-select ToggleGroup, so each carries its checked state.",
			"The prompt, send, history and more-actions controls each have their own label from `labels`.",
			'Copying the conversation announces its result through a `role="status"` live region.',
		],
	},
	licenseOrigin: {
		source: "beUI",
		url: "https://beui.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 beUI",
	},
	impl: {
		react: {
			entry: "ChatComposer",
		},
		svelte: {
			entry: "ChatComposer",
		},
	},
	keywords: ["chat", "composer", "conversation", "agent"],
});
