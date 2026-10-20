<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import Badge from "../../badge/svelte/badge.svelte";
import { cn } from "../../lib/cn";
import { pricingPlans } from "../variants";
import { pricingPlanState, pricingPlansState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();

const ctx = pricingPlansState("PricingPlanTitle");
const item = pricingPlanState("PricingPlanTitle");
const s = $derived(pricingPlans({ layout: ctx.layout, size: ctx.size }));
</script>

<!-- The plan name and its badge; defaults to the plan's own. -->
<div data-slot="pricing-plan-title" class={cn(s.head(), classProp)} {...rest}>
	<h3 id={item.headingId} class={s.name()}>
		{#if children}{@render children()}{:else}{item.plan.name}{/if}
	</h3>
	{#if item.plan.badge}
		<Badge variant={item.plan.highlighted ? "default" : "outline"} size="sm">{item.plan.badge}</Badge>
	{/if}
</div>
