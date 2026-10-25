<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { REACTION_PATHS } from "../icons";
import { type ReactionIcon, reactionBar } from "../variants";

let {
	icon,
	class: classProp,
	children,
}: { icon?: ReactionIcon; class?: string; children?: Snippet } = $props();
</script>

<!-- A built-in `icon`, or your own as children; it squishes while held and springs back. -->
<span aria-hidden="true" data-slot="reaction-bar-icon" class={cn(reactionBar().icon(), classProp)}>
	{#if icon}
		<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
			{#each REACTION_PATHS[icon] as p (p.d)}
				<path d={p.d} data-fill={p.fill ? "" : undefined} />
			{/each}
		</svg>
	{:else}
		{@render children?.()}
	{/if}
</span>
