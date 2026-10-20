<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { pricingPlans } from "../variants";
import { pricingPlanState, pricingPlansState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLParagraphElement> & { children?: Snippet } = $props();

const ctx = pricingPlansState("PricingPlanDescription");
const item = pricingPlanState("PricingPlanDescription");
</script>

{#if children || item.plan.description}
	<p
		data-slot="pricing-plan-description"
		class={cn(pricingPlans({ layout: ctx.layout, size: ctx.size }).description(), classProp)}
		{...rest}
	>
		{#if children}{@render children()}{:else}{item.plan.description}{/if}
	</p>
{/if}
