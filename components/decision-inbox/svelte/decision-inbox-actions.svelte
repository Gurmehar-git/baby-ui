<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { decisionInboxItemState, decisionInboxState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();
const ctx = decisionInboxState("DecisionInboxActions");
const item = decisionInboxItemState("DecisionInboxActions");
</script>

<!-- The answers; once one is chosen they give way to it, with a check. -->
<div data-slot="decision-inbox-actions" class={cn(ctx.styles.actions(), classProp)}>
	{#if item.answer === undefined}
		{@render children?.()}
	{:else}
		<span data-slot="decision-inbox-done" class={ctx.styles.done()}>
			<svg viewBox="0 0 16 16" aria-hidden="true">
				<circle cx="8" cy="8" r="7" fill="currentColor" />
				<path d="m5 8.2 2 2 4-4.2" fill="none" stroke="var(--background)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			{item.answer}
		</span>
	{/if}
</div>
