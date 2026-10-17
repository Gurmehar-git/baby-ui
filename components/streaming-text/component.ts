import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { streamingText as streamingTextVariants } from "./variants";

const LAYOUTS = ["inline", "card"];
const SIZES = ["sm", "default", "lg"];

export const streamingText = defineComponent({
	slug: "streaming-text",
	name: "Streaming Text",
	description:
		"Word-by-word answer reveal, plain or with inline citation chips, then actions, sources and follow-ups once it settles.",
	category: "agents",
	status: "stable",
	variants: variantsOf(streamingTextVariants, ["layout", "size"]),
	props: [
		{
			name: "layout",
			type: LAYOUTS.map((v) => `"${v}"`).join(" | "),
			description:
				"`card` wraps the answer in a bordered surface; `inline` (default) has none, for embedding inside a Message bubble.",
			default: "inline",
			control: { kind: "select", options: LAYOUTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Type scale of the answer.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "markdown",
			type: "boolean",
			description:
				"Render `content` as Markdown. The reveal then follows `streaming` instead of the word timer.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "streaming",
			type: "boolean",
			description:
				"Markdown mode: `true` while chunks arrive, `false` once done. Actions and follow-ups show once it is `false`.",
			control: { kind: "none" },
		},
		{
			name: "caret",
			type: "boolean",
			description: "Blinking caret while the text reveals.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "actions",
			type: "boolean",
			description: "Copy, retry and feedback row once the reveal settles.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "content",
			type: "StreamingToken[] | string",
			description:
				'The answer: a plain string, or tokens where each is a word or `{ text: "", cite: n }` to place a citation chip for `sources[n]` inline.',
			control: { kind: "none" },
		},
		{
			name: "sources",
			type: "StreamingSource[]",
			description:
				"Cited sources, shown as inline chips and in the expandable sources list.",
			control: { kind: "none" },
		},
		{
			name: "followUps",
			type: "string[]",
			description:
				"Follow-up prompt suggestions shown once the answer finishes revealing.",
			control: { kind: "none" },
		},
		{
			name: "wordDelay",
			type: "number",
			description: "Milliseconds between each revealed word.",
			default: 55,
			control: { kind: "number", min: 10, max: 200, step: 5 },
			showWhen: { markdown: [false] },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The whole answer renders immediately; the caret and citation pop-ins drop.",
		behaviour: [
			"Words reveal one at a time and stop; there is no gallery-style auto-loop baked in.",
			"Actions, sources and follow-ups fade in together once every word has revealed.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Retry and the thumbs-up/down feedback buttons only render when `onRetry`/`onFeedback` are passed; Copy always works, reading the assembled plain text.",
			"Citation chips and source rows are real links, not styled spans with a click handler.",
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
			entry: "StreamingText",
		},
		svelte: {
			entry: "StreamingText",
		},
	},
	keywords: ["streaming", "answer", "citations", "sources", "follow-ups", "agent"],
});
