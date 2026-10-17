<script lang="ts">
import type { Snippet } from "svelte";
import Card from "../../card/svelte/card.svelte";
import { cn } from "../../lib/cn";
import { pricing02State, setPricing02Plan } from "./context";

let {
	featured = false,
	class: classProp,
	children,
}: {
	/** Tints the panel and fills the button. */
	featured?: boolean;
	class?: string;
	children?: Snippet;
} = $props();
const pricing = pricing02State();
setPricing02Plan({
	get featured() {
		return featured;
	},
});
</script>

<!-- One plan card: Pricing02PlanPanel over Pricing02PlanList. -->
<Card data-slot="pricing-02-plan" class={cn(pricing.styles.plan(), classProp)}>
	<div aria-hidden="true" class={pricing.styles.glow()}></div>
	{@render children?.()}
</Card>
