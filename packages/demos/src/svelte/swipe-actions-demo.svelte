<script lang="ts">
import { Button, SwipeActions, SwipeActionsRow } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { INBOX } from "../data/swipe-actions";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof SwipeActions>>(props));
let messages = $state(INBOX);
let unread = $state<Record<string, boolean>>({ m1: true, m3: true });
const remove = (id: string) =>
	(messages = messages.filter((message) => message.id !== id));
</script>

{#snippet glyph(d: string)}
	<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
		<path {d} />
	</svg>
{/snippet}
{#snippet archive()}{@render glyph("M3 4h18v4H3zM5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4")}{/snippet}
{#snippet trash()}{@render glyph("M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14")}{/snippet}
{#snippet mail()}{@render glyph("M4 6h16v12H4zM4 7l8 6 8-6")}{/snippet}

<div class="flex w-full max-w-md flex-col gap-3">
	<SwipeActions label="Inbox" variant={p.variant} size={p.size}>
		{#each messages as message (message.id)}
			<SwipeActionsRow
				label={message.subject}
				leading={[
					{
						label: unread[message.id] ? "Read" : "Unread",
						icon: mail,
						tone: "primary",
						keepRow: true,
						onSelect: () => (unread[message.id] = !unread[message.id]),
					},
				]}
				trailing={[
					{ label: "Archive", icon: archive, onSelect: () => remove(message.id) },
					{ label: "Delete", icon: trash, tone: "destructive", onSelect: () => remove(message.id) },
				]}
			>
				<div class="flex items-baseline justify-between gap-3">
					<span class={unread[message.id] ? "font-semibold text-sm" : "text-sm"}>{message.from}</span>
					<span class="text-muted-foreground text-xs tabular-nums">{message.time}</span>
				</div>
				<p class="truncate text-muted-foreground text-sm">{message.subject}</p>
			</SwipeActionsRow>
		{/each}
	</SwipeActions>
	{#if messages.length < INBOX.length}
		<Button variant="ghost" size="sm" class="self-center" onclick={() => (messages = INBOX)}>Restore inbox</Button>
	{/if}
</div>
