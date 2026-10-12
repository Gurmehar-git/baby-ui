<script lang="ts">
import { EMPTY_MENTIONS, MentionInput, serializeMentions } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { MENTION_CHANNELS, MENTION_PEOPLE } from "../data/mentions";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof MentionInput>>(props));
let value = $state(EMPTY_MENTIONS);
let sent = $state("");
</script>

<div class="grid w-full max-w-md gap-2">
	<MentionInput
		bind:value
		people={MENTION_PEOPLE}
		channels={MENTION_CHANNELS}
		placeholder="Type @ to mention someone, # for a channel"
		submitOnEnter={p.submitOnEnter}
		onSubmit={(next) => {
			sent = serializeMentions(next);
			value = EMPTY_MENTIONS;
		}}
		side={p.side}
		size={p.size}
	/>
	{#if sent}<p class="truncate font-mono text-muted-foreground text-xs">Sent: {sent}</p>{/if}
</div>
