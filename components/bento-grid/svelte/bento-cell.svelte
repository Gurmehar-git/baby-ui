<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { type BentoSpan, bentoCell } from "../variants";

export type { BentoSpan };

type Props = {
	children?: Snippet;
	class?: string;
	span?: BentoSpan;
	title?: string;
	description?: string;
};

let { children, class: classProp, span = "1x1", title, description }: Props = $props();
</script>

<div class={cn(bentoCell({ span }), classProp)}>
	{#if title}<h3 class="font-medium text-foreground text-sm">{title}</h3>{/if}
	{#if description}
		<p class="mt-1 text-muted-foreground text-xs leading-relaxed">{description}</p>
	{/if}
	<div class="min-h-0 flex-1">{@render children?.()}</div>
</div>
