import { defineComponent } from "@baby-ui/registry-schema";

export const conversation = defineComponent({
	slug: "conversation",
	name: "Conversation",
	description:
		"Transcript viewport that follows new turns only when the reader is at the bottom.",
	category: "agents",
	status: "stable",
	props: [
		{
			name: "threshold",
			type: "number",
			description:
				"Auto-follow stays engaged while the reader is within this many px of the bottom.",
			default: "80",
			control: { kind: "number" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The jump-to-latest scrolls instantly instead of smoothly; the transcript itself has no motion to drop.",
		behaviour: [
			"New turns are followed only while the reader is within `threshold` px of the bottom, which tolerates sub-pixel scroll rounding.",
			"A `ResizeObserver` on both the scroll viewport and the transcript catches content growth (streaming replies, images loading in) and keeps following without waiting for a scroll event.",
			"Wheel, touch and pointer-down are tracked separately from scroll position, so a user actively scrolling up detaches follow immediately; a programmatic `scrollToBottom()` call never gets mistaken for that.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Tab"],
				action: "Focuses the transcript when it overflows, so arrow keys scroll it",
			},
			{ keys: ["Tab"], action: "Reaches the jump-to-latest button when it shows" },
		],
		notes: [
			'The transcript is `role="log"` with `aria-live="polite"` and `aria-relevant="additions text"`, so assistive tech announces new turns without re-reading the whole history.',
			"Auto-scroll is suspended the moment the reader scrolls up. Yanking someone back to the bottom while they're reading is the single most common bug in a chat transcript.",
			"A jump-to-latest control appears only when the view is detached from the bottom, so it never covers content unnecessarily.",
		],
	},
	licenseOrigin: {
		source: "sivir-ui",
		url: "https://github.com/aidan-neel/sivir-ui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Aidan Neel",
	},
	impl: {
		react: {
			entry: "Conversation",
			files: [
				{ path: "conversation/conversation.tsx", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge"],
			registryDependencies: ["scroll-area"],
		},
		svelte: {
			entry: "Conversation",
			files: [
				{ path: "conversation/conversation.svelte", type: "registry:ui" },
				{ path: "conversation/conversation-content.svelte", type: "registry:ui" },
				{ path: "conversation/conversation-empty.svelte", type: "registry:ui" },
				{ path: "conversation/conversation-scroll-button.svelte", type: "registry:ui" },
				{ path: "conversation/context.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge"],
			registryDependencies: ["scroll-area"],
		},
	},
	keywords: ["conversation", "chat", "transcript", "auto-scroll"],
});
