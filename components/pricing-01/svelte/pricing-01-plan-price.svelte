<script lang="ts">
import { cn } from "../../lib/cn";
import { pricing01State } from "./context";

let {
	prices,
	class: classProp,
}: {
	/** Display price keyed by period value, already formatted. */
	prices: Record<string, string>;
	class?: string;
} = $props();
const pricing = pricing01State();
</script>

<!-- The price for the chosen period, then its cadence. -->
<div data-slot="pricing-01-plan-price" class={cn(pricing.styles.price(), classProp)}>
	<span class={pricing.styles.amount()}>{pricing.current ? prices[pricing.current.value] : ""}</span>
	{#if pricing.current}
		<span class={pricing.styles.cadence()}>{pricing.current.cadence}</span>
	{/if}
</div>
