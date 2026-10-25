<script lang="ts">
import {
	ReactionBar,
	ReactionBarCount,
	ReactionBarIcon,
	ReactionBarItem,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { REACTION_BAR_ITEMS } from "../data/reaction-bar";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ReactionBar>>(props));
let pressed = $state<string[]>(["comment"]);
</script>

<ReactionBar variant={p.variant} bind:value={pressed}>
	{#each REACTION_BAR_ITEMS as item (item.value)}
		<ReactionBarItem value={item.value} label={item.label} count={item.count} tone={item.tone}>
			<ReactionBarIcon icon={item.value} />
			<ReactionBarCount />
		</ReactionBarItem>
	{/each}
</ReactionBar>
