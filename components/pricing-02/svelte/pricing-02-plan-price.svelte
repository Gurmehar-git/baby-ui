<script lang="ts">
import { cn } from "../../lib/cn";
import { digitDelay } from "../types";
import { pricing02State } from "./context";

let {
	prices,
	class: classProp,
}: {
	/** Display price keyed by period value, already formatted. */
	prices: Record<string, string>;
	class?: string;
} = $props();
const pricing = pricing02State();
const price = $derived(pricing.current ? (prices[pricing.current.value] ?? "") : "");
const chars = $derived([...price]);
</script>

<!-- The price for the chosen period; its digits roll when the period changes. -->
<div data-slot="pricing-02-plan-price" class={cn(pricing.styles.price(), classProp)}>
	<span class="sr-only">{price}</span>
	<span
		aria-hidden="true"
		class={pricing.styles.amount()}
		style:--digit-dir={pricing.currentIndex > 0 ? 1 : -1}
	>
		{#key pricing.current?.value}
			{#each chars as char, i (i)}
				<span
					data-animate={pricing.moved ? "" : undefined}
					class={pricing.styles.digit()}
					style:--digit-delay={digitDelay(i, chars.length)}>{char}</span
				>
			{/each}
		{/key}
	</span>
	{#if pricing.current}
		<span class={pricing.styles.cadence()}>{pricing.current.cadence}</span>
	{/if}
</div>
