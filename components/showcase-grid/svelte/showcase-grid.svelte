<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/svelte/cn";
import { HATCH_MARKS, RULE_MARKS, type ShowcaseFrame, showcaseGrid } from "./variants";

type Props = {
	children: Snippet;
	class?: string;
	/** `rulers` draws corner ticks and hatch squares outside the grid from `md` up. */
	frame?: ShowcaseFrame;
};

let { children, class: classProp, frame = "rulers" }: Props = $props();

const s = $derived(showcaseGrid({ frame }));
</script>

<div data-slot="showcase-grid" class={cn(s.root(), classProp)}>
	{@render children()}
	<div aria-hidden="true" class={s.rules()}>
		{#each RULE_MARKS as mark (mark)}
			<span class={cn(s.rule(), mark)}></span>
		{/each}
		{#each HATCH_MARKS as mark (mark)}
			<span class={cn(s.hatch(), mark)}></span>
		{/each}
	</div>
</div>
