<script lang="ts">
import type { Snippet } from "svelte";
import { untrack } from "svelte";
import { cn } from "../../lib/cn";
import ScrollArea from "../../scroll-area/svelte/scroll-area.svelte";
import { getConversation } from "./context";

let {
	children: transcript,
	class: classProp,
	transcriptClass,
	"aria-label": ariaLabel = "Conversation",
}: {
	children?: Snippet;
	class?: string;
	transcriptClass?: string;
	"aria-label"?: string;
} = $props();

const conversation = getConversation();
let scrollable = $state(false);
let viewportRef = $state<HTMLDivElement | null>(null);
let transcriptRef = $state<HTMLDivElement | null>(null);
let previousScrollTop = 0;
let userScrollIntent = false;

function isNearBottom(el: HTMLDivElement) {
	const remaining = el.scrollHeight - el.clientHeight - el.scrollTop;
	return remaining <= Math.max(0, conversation.threshold);
}

function measure(el: HTMLDivElement) {
	scrollable = el.scrollHeight - el.clientHeight > 1;
	const nearBottom = isNearBottom(el);
	conversation.atBottom = nearBottom;
	if (nearBottom) {
		conversation.follow = true;
		conversation.scrollingToBottom = false;
	}
	return nearBottom;
}

function handleScroll(el: HTMLDivElement) {
	const nextScrollTop = el.scrollTop;
	const nearBottom = measure(el);
	if (
		!nearBottom &&
		(userScrollIntent ||
			(!conversation.scrollingToBottom && nextScrollTop < previousScrollTop - 1))
	) {
		conversation.follow = false;
		conversation.scrollingToBottom = false;
	}
	previousScrollTop = nextScrollTop;
	userScrollIntent = false;
}

$effect(() => {
	if (!viewportRef) return;
	const el = viewportRef;
	untrack(() => {
		conversation.viewport = el;
		previousScrollTop = el.scrollTop;
		measure(el);
	});

	const observer = new ResizeObserver(() => {
		if (conversation.follow) {
			conversation.scrollingToBottom = false;
			el.scrollTop = el.scrollHeight;
		} else {
			measure(el);
		}
	});
	observer.observe(el);
	if (transcriptRef) observer.observe(transcriptRef);
	return () => {
		observer.disconnect();
		if (conversation.viewport === el) conversation.viewport = null;
	};
});

// Keep pinned to the bottom while following, without waiting for the next resize tick.
$effect(() => {
	if (viewportRef && conversation.follow && !conversation.scrollingToBottom) {
		viewportRef.scrollTop = viewportRef.scrollHeight;
	}
});
</script>

<ScrollArea
	data-slot="conversation-content"
	data-state={conversation.follow ? "following" : "paused"}
	maxHeight="none"
	class={cn("h-full min-h-0", classProp)}
	bind:viewportRef
	viewportProps={{
		role: "log",
		"aria-label": ariaLabel,
		"aria-live": "polite",
		"aria-relevant": "additions text",
		tabindex: scrollable ? 0 : undefined,
		class: "[scrollbar-gutter:stable] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring/50",
		onscroll: (event: Event) => handleScroll(event.currentTarget as HTMLDivElement),
		onwheel: () => {
			userScrollIntent = true;
		},
		ontouchstart: () => {
			userScrollIntent = true;
		},
		onpointerdown: () => {
			userScrollIntent = true;
		},
	}}
>
	{#snippet children()}
		<div
			bind:this={transcriptRef}
			data-slot="conversation-transcript"
			class={cn("mx-auto flex min-h-full w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6", transcriptClass)}
		>
			{@render transcript?.()}
		</div>
	{/snippet}
</ScrollArea>
