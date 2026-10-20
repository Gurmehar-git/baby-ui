<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { paymentMethodCardState } from "./context";

let {
	headingLevel = 3,
	class: classProp,
	children,
}: { headingLevel?: 2 | 3 | 4 | 5 | 6; class?: string; children?: Snippet } = $props();

const ctx = paymentMethodCardState("PaymentMethodCardTitle");
</script>

<!-- The heading; children replace "Payment method". -->
<svelte:element this={`h${headingLevel}`} class={cn(ctx.styles.title(), classProp)}>
	{#if children}{@render children()}{:else}{ctx.labels.title}{/if}
</svelte:element>
