<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { isCustomPlan, type PricingPlanOption, planPrice } from "../pricing-plans-core";
import { pricingPlans } from "../variants";
import { pricingPlansState, setPricingPlan } from "./context";

let {
	plan,
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & {
	plan: PricingPlanOption;
	children?: Snippet;
} = $props();

const ctx = pricingPlansState("PricingPlan");
const headingId = $derived(`${ctx.id}-${plan.id}`);

setPricingPlan({
	get plan() {
		return plan;
	},
	get price() {
		return planPrice(plan, ctx.active);
	},
	get custom() {
		return isCustomPlan(plan);
	},
	get headingId() {
		return headingId;
	},
});
</script>

<!-- One plan. Its parts read the plan, so they need no props of their own. -->
<article
	data-slot="pricing-plan"
	data-highlighted={plan.highlighted || undefined}
	aria-labelledby={headingId}
	class={cn(pricingPlans({ layout: ctx.layout, size: ctx.size }).plan(), classProp)}
	{...rest}
>
	{@render children?.()}
</article>
