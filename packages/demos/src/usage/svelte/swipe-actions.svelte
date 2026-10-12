<script lang="ts">
import { SwipeActions, SwipeActionsRow } from "@baby-ui/svelte";
import type { Snippet } from "svelte";

type Message = { id: string; subject: string };

let {
	messages,
	trash,
	remove,
}: { messages: Message[]; trash: Snippet; remove: (id: string) => void } = $props();
</script>

<SwipeActions label="Inbox">
	{#each messages as message (message.id)}
		<SwipeActionsRow
			label={message.subject}
			trailing={[{ label: "Delete", icon: trash, tone: "destructive", onSelect: () => remove(message.id) }]}
		>
			{message.subject}
		</SwipeActionsRow>
	{/each}
</SwipeActions>
