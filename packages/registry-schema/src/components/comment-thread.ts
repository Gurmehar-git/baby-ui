import { defineComponent } from "../index.ts";

const VARIANTS = ["default", "flat"];

const files = (main: string) => [
	{ path: `comment-thread/${main}`, type: "registry:ui" as const },
	{ path: "comment-thread/thread.ts", type: "registry:ui" as const },
	{ path: "comment-thread/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];
const deps = ["avatar", "button", "collapsible", "mention-input", "rolling-digits"];

export const commentThread = defineComponent({
	slug: "comment-thread",
	name: "Comment Thread",
	description:
		"A threaded discussion with nested replies, reactions, inline edit and delete, @mentions, and a resolve state that folds it into a chip.",
	category: "advanced",
	status: "stable",
	variants: { variant: VARIANTS },
	props: [
		{
			name: "comments",
			type: "ThreadComment[]",
			description:
				"`{ id, author, body, createdAt, edited?, deleted?, reactions?, replies? }`, paired with `onCommentsChange(next, event)`; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "currentUser",
			type: "CommentAuthor",
			description:
				"`{ id, name, avatar? }` of the person writing; their comments can be edited and deleted.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "people",
			type: "CommentAuthor[]",
			description: "People offered after `@`; defaults to everyone in the thread.",
			control: { kind: "none" },
		},
		{
			name: "resolved",
			type: "boolean",
			description:
				"Folds the thread into a chip, paired with `onResolvedChange`; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "title",
			type: "string",
			description: "What the thread is about, shown in the header and the resolved chip.",
			control: { kind: "none" },
		},
		{
			name: "reactions",
			type: "string[]",
			description: "Emoji offered by the reaction picker.",
			control: { kind: "none" },
		},
		{
			name: "maxDepth",
			type: "number",
			description: "Replies deeper than this attach to the deepest allowed parent.",
			default: 2,
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "Partial<CommentThreadLabels>",
			description:
				"Every visible and announced word; counts and names are functions for your plural rules.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "`flat` drops the bordered surface to sit inside your own panel.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Folds, grows and pops become instant.",
		behaviour: [
			"Resolving folds the thread while the chip opens, so the frame morphs between them.",
			"New comments, the edit field and the reply banner open from zero height; reaction counts roll.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter"], action: "Send the reply or save the edit" },
			{ keys: ["Shift+Enter"], action: "New line" },
			{ keys: ["Escape"], action: "Cancel the edit, reply, picker or delete prompt" },
			{ keys: ["@"], action: "Mention someone" },
		],
		notes: [
			"Each comment is an article named with its author and time; reactions are toggle buttons with spoken counts.",
			"Resolving and reopening move focus to the matching button.",
		],
	},
	guidance: {
		when: ["Review comments on a design, document or record."],
		whenNot: [
			{ text: "A chat with an AI assistant.", use: "conversation" },
			{ text: "A single-line note field.", use: "textarea" },
		],
		responsive: ["The composer avatar hides on small screens; replies indent less."],
		performance: ["Renders the tree you pass; paginate very long threads."],
		ai: [
			"Store the tree from `onCommentsChange` and send only `event` to the server.",
			"Pass `people` so mentions autocomplete beyond the thread's own authors.",
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
			entry: "CommentThread",
			files: files("comment-thread.tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: deps,
		},
		svelte: {
			entry: "CommentThread",
			files: files("comment-thread.svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: deps,
		},
	},
	keywords: [
		"comments",
		"thread",
		"discussion",
		"review",
		"reply",
		"reactions",
		"mentions",
	],
});
