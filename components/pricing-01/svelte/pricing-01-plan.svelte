<script lang="ts">
import type { Snippet } from "svelte";
import Card from "../../card/svelte/card.svelte";
import { cn } from "../../lib/cn";
import { pricing01 } from "../variants";
import { pricing01State, setPricing01Plan } from "./context";

let {
	featured = false,
	note,
	class: classProp,
	children,
}: {
	/** Outlines the card and fills its badge and button. */
	featured?: boolean;
	/** Rises above the card on hover and focus. */
	note?: string;
	class?: string;
	children?: Snippet;
} = $props();
const pricing = pricing01State();
setPricing01Plan({
	get featured() {
		return featured;
	},
});
</script>

<!-- One plan card: Pricing01PlanHeader, Pricing01PlanContent and Pricing01PlanFooter. -->
<div data-slot="pricing-01-plan" data-featured={featured || undefined} class={pricing.styles.item()}>
	{#if note}
		<p aria-hidden="true" class={pricing.styles.note()}>{note}</p>
	{/if}
	<Card
		variant={pricing.variant}
		class={cn(pricing01({ variant: pricing.variant, featured }).card(), classProp)}
	>
		{@render children?.()}
	</Card>
</div>
