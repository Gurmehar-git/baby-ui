<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { pricingPlans } from "../variants";
import { pricingPlanState, pricingPlansState } from "./context";

let {
	class: classProp,
	...rest
}: Omit<HTMLAttributes<HTMLUListElement>, "children"> = $props();

const ctx = pricingPlansState("PricingPlanFeatures");
const item = pricingPlanState("PricingPlanFeatures");
const s = $derived(pricingPlans({ layout: ctx.layout, size: ctx.size }));
</script>

{#if item.plan.features.length}
	<ul
		data-slot="pricing-plan-features"
		aria-label="{item.plan.name}: {ctx.labels.features}"
		class={cn(s.features(), classProp)}
		{...rest}
	>
		{#each item.plan.features as feature (feature)}
			<li class={s.feature()}>
				<svg class={s.check()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M5 12l5 5l10 -10" />
				</svg>
				<span>{feature}</span>
			</li>
		{/each}
	</ul>
{/if}
