<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { decisionInboxItemState, decisionInboxState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();
const ctx = decisionInboxState("DecisionInboxTitle");
const item = decisionInboxItemState("DecisionInboxTitle");
</script>

<!-- The question; while folded it is the button that opens the row. -->
{#if item.collapsed}
	<button type="button" data-slot="decision-inbox-title" aria-expanded={false} class={cn(ctx.styles.title(), classProp)} onclick={() => ctx.expand(item.value)}>
		{@render children?.()}
	</button>
{:else}
	<p data-slot="decision-inbox-title" class={cn(ctx.styles.title(), classProp)}>
		{@render children?.()}
	</p>
{/if}
