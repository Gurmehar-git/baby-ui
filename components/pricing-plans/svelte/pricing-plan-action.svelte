<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import { pricingPlans } from "../variants";
import { pricingPlanState, pricingPlansState } from "./context";

let {
	class: classProp,
	onclick,
	children,
}: { class?: string; onclick?: () => void; children?: Snippet } = $props();

const ctx = pricingPlansState("PricingPlanAction");
const item = pricingPlanState("PricingPlanAction");
</script>

<!-- Calls the root's `onSelect` unless you pass your own `onclick`. -->
<Button
	data-slot="pricing-plan-action"
	class={cn(pricingPlans({ layout: ctx.layout, size: ctx.size }).cta(), classProp)}
	variant={item.plan.highlighted ? "default" : "outline"}
	size={ctx.size === "sm" ? "sm" : "default"}
	loading={ctx.loadingPlanId === item.plan.id}
	loadingLabel={ctx.labels.redirecting}
	disabled={(!item.price && !item.custom) || (ctx.loadingPlanId != null && ctx.loadingPlanId !== item.plan.id)}
	onclick={onclick ?? (() => ctx.onSelect?.(item.plan.id, ctx.active))}
>
	{#if children}{@render children()}{:else}{item.plan.cta}{/if}
</Button>
