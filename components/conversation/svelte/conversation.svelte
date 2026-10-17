<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { type ConversationContext, setConversation } from "./context";

let {
	children,
	threshold = 80,
	class: classProp,
	...rest
}: {
	children?: Snippet;
	/** Auto-follow stays engaged while the reader is within this many px of the bottom. */
	threshold?: number;
} & HTMLAttributes<HTMLDivElement> = $props();

let follow = $state(true);
let atBottom = $state(true);
let viewport = $state<HTMLDivElement | null>(null);
let scrollingToBottom = $state(false);

const conversation: ConversationContext = {
	get follow() {
		return follow;
	},
	set follow(value) {
		follow = value;
	},
	get atBottom() {
		return atBottom;
	},
	set atBottom(value) {
		atBottom = value;
	},
	get threshold() {
		return threshold;
	},
	get viewport() {
		return viewport;
	},
	set viewport(value) {
		viewport = value;
	},
	get scrollingToBottom() {
		return scrollingToBottom;
	},
	set scrollingToBottom(value) {
		scrollingToBottom = value;
	},
	scrollToBottom(behavior = "auto") {
		follow = true;
		scrollingToBottom = behavior === "smooth";
		if (!viewport) {
			scrollingToBottom = false;
			return;
		}
		viewport.scrollTo({ top: viewport.scrollHeight, behavior });
	},
};

setConversation(conversation);
</script>

<!-- A scrollable transcript that follows new turns while the reader is already at the
bottom, and stops the moment they scroll up. -->
<div
	{...rest}
	data-slot="conversation"
	data-state={follow ? "following" : "paused"}
	class={cn("relative min-h-0 overflow-hidden", classProp)}
>
	{@render children?.()}
</div>
