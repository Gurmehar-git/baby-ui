<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { pricingComparisonState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();

const ctx = pricingComparisonState("PricingComparisonEmpty");
</script>

<!-- Announces, and shows, when "differences only" leaves nothing to compare. -->
<p class={cn(ctx.nothingDiffers ? ctx.styles.empty() : "sr-only", classProp)} role="status">
	{#if ctx.nothingDiffers}
		{#if children}{@render children()}{:else}{ctx.labels.noDifferences}{/if}
	{/if}
</p>
