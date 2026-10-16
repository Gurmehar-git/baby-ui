import { defineComponent } from "@baby-ui/registry-schema";

const ALIGNS = ["start", "end"];
const MOTIONS = ["spring", "fade", "none"];
const BUBBLE_VARIANTS = ["default", "primary", "ghost"];

export const message = defineComponent({
	slug: "message",
	name: "Message",
	description:
		"Composable chat-turn parts: group, row, avatar, content, bubble, header and footer, assembled shadcn-primitive style.",
	category: "agents",
	status: "stable",
	variants: {
		align: ALIGNS,
		motion: MOTIONS,
		variant: BUBBLE_VARIANTS,
	},
	props: [
		{
			name: "align",
			type: ALIGNS.map((v) => `"${v}"`).join(" | "),
			description:
				"On `Message`. `end` reads as sent: row reversed, entrance from the right. `start` reads as received: entrance from the left.",
			default: "start",
			control: { kind: "select", options: ALIGNS },
		},
		{
			name: "animated",
			type: "boolean",
			description:
				"On `Message`. Play the entrance. Set false for history already on screen, so only newly arriving messages animate.",
			default: true,
			control: { kind: "boolean" },
			showWhen: { motion: ["spring", "fade"] },
		},
		{
			name: "motion",
			type: MOTIONS.map((v) => `"${v}"`).join(" | "),
			description:
				"On `Message`. `spring` slides and scales in from the side (the default); `fade` is opacity-only; `none` skips the entrance regardless of `animated`.",
			default: "spring",
			control: { kind: "select", options: MOTIONS },
		},
		{
			name: "variant",
			type: BUBBLE_VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"On `MessageBubble`. `default` is a muted pill for received messages, `primary` a filled pill for sent ones, `ghost` drops the pill entirely for bare text like a streamed reply.",
			default: "default",
			control: { kind: "select", options: BUBBLE_VARIANTS },
		},
	],
	motion: {
		springs: ["snappy"],
		reducedMotion: "The row appears in place; no slide, scale, or fade plays.",
		behaviour: [
			"`Message` plays its entrance once, on mount, only when `animated` is true and `motion` isn't `none`: a CSS overshoot standing in for a real spring, not a spring that resettles.",
			"`MessageAvatar` lifts clear of `MessageFooter` when both are present in the same message, so a timestamp line never sits under the avatar.",
			"`MessageContent`'s children (anything carrying a `data-slot`) self-align to match `Message`'s own `align`, so `MessageBubble`/`MessageHeader`/`MessageFooter` never need their own align prop.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"`Message` is a real `<article>`; pass your own `aria-label` (e.g. the sender's name) since the composable API no longer generates one from a `name` prop.",
			'`MessageTyping` is `role="status"` with an `sr-only` label, so assistive tech hears "Thinking" once rather than three decorative dots.',
		],
	},
	impl: {
		react: {
			entry: "Message",
			files: [
				{ path: "message/message.tsx", type: "registry:ui" },
				{ path: "message/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "Message",
			files: [
				{ path: "message/message.svelte", type: "registry:ui" },
				{ path: "message/message-group.svelte", type: "registry:ui" },
				{ path: "message/message-avatar.svelte", type: "registry:ui" },
				{ path: "message/message-content.svelte", type: "registry:ui" },
				{ path: "message/message-bubble.svelte", type: "registry:ui" },
				{ path: "message/message-header.svelte", type: "registry:ui" },
				{ path: "message/message-footer.svelte", type: "registry:ui" },
				{ path: "message/message-typing.svelte", type: "registry:ui" },
				{ path: "message/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["message", "chat", "ai", "transcript", "bubble"],
});
