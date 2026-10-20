<script lang="ts">
import {
	type PricingCycle,
	PricingPlan,
	PricingPlanAction,
	PricingPlanDescription,
	PricingPlanFeatures,
	PricingPlanHeader,
	PricingPlanPrice,
	PricingPlans,
	PricingPlansCycle,
	PricingPlansGrid,
	type PricingPlansLayout,
	type PricingPlansSize,
	PricingPlanTitle,
} from "@baby-ui/svelte";
import { PRO_PLANS } from "../data/pricing-plans";

let { props = {} }: { props?: Record<string, unknown> } = $props();

let cycle = $state<PricingCycle>("lifetime");
let loadingPlanId = $state<string | null>(null);

// Controls panel values win when they change, then the switch takes over again.
$effect(() => {
	const next = props.cycle;
	if (next === "monthly" || next === "annual" || next === "lifetime") cycle = next;
});

// Stands in for the hosted checkout redirect.
function select(planId: string) {
	loadingPlanId = planId;
	setTimeout(() => (loadingPlanId = null), 1600);
}
</script>

<div class="w-full max-w-5xl">
	<PricingPlans
		plans={PRO_PLANS}
		bind:cycle
		{loadingPlanId}
		onSelect={select}
		layout={(props.layout as PricingPlansLayout) ?? "cards"}
		size={(props.size as PricingPlansSize) ?? "default"}
	>
		<PricingPlansCycle />
		<PricingPlansGrid>
			{#each PRO_PLANS as plan (plan.id)}
				<PricingPlan {plan}>
					<PricingPlanHeader>
						<PricingPlanTitle />
						<PricingPlanDescription />
					</PricingPlanHeader>
					<PricingPlanPrice />
					<PricingPlanAction />
					<PricingPlanFeatures />
				</PricingPlan>
			{/each}
		</PricingPlansGrid>
	</PricingPlans>
</div>
