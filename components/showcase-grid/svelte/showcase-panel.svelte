<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { DOT_CORNERS, type ShowcaseSpan, showcasePanel } from "../variants";

type Props = {
	children?: Snippet;
	class?: string;
	/** Columns out of 12 from `md` up; below it every panel is full width. */
	span?: ShowcaseSpan;
	/** Top-right controls, shown on hover or focus and always on touch screens. */
	actions?: Snippet;
};

let { children, class: classProp, span = 12, actions }: Props = $props();

const s = $derived(showcasePanel({ span }));
</script>

<div data-slot="showcase-panel" class={cn(s.root(), classProp)}>
	{#each DOT_CORNERS as corner (corner)}
		<span aria-hidden="true" class={cn(s.dot(), corner)}></span>
	{/each}
	{#if actions}<div class={s.actions()}>{@render actions()}</div>{/if}
	<div class={s.content()}>{@render children?.()}</div>
</div>
