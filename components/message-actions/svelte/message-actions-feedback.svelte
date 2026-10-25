<script lang="ts">
import { cn } from "../../lib/cn";
import { MESSAGE_ICONS } from "../icons";
import type { MessageFeedback } from "../variants";
import { messageActionsState } from "./context";

let {
	upLabel = "Good response",
	downLabel = "Bad response",
	class: classProp,
}: { upLabel?: string; downLabel?: string; class?: string } = $props();
const ctx = messageActionsState("MessageActionsFeedback");

function vote(kind: MessageFeedback, name: string) {
	const next = ctx.feedback === kind ? null : kind;
	ctx.setFeedback(next);
	if (next) ctx.announce(`Marked as ${name.toLowerCase()}`);
}
</script>

<!-- Thumbs up and down; each fills with a squish, and pressing it again takes the vote back. -->
<button type="button" data-slot="message-actions-up" aria-label={upLabel} aria-pressed={ctx.feedback === "up"} class={cn(ctx.styles.button(), classProp)} onclick={() => vote("up", upLabel)}>
	<svg viewBox="0 0 24 24" aria-hidden="true" class={cn(ctx.styles.icon(), ctx.styles.thumb())}><path d={MESSAGE_ICONS.thumb} /></svg>
</button>
<button type="button" data-slot="message-actions-down" aria-label={downLabel} aria-pressed={ctx.feedback === "down"} class={cn(ctx.styles.button(), classProp)} onclick={() => vote("down", downLabel)}>
	<svg viewBox="0 0 24 24" aria-hidden="true" class={cn(ctx.styles.icon(), ctx.styles.thumb(), "rotate-180")}><path d={MESSAGE_ICONS.thumb} /></svg>
</button>
