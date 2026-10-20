<script lang="ts">
import {
	type PricingCycle,
	PricingPlan,
	PricingPlanAction,
	PricingPlanFeatures,
	PricingPlanHeader,
	type PricingPlanOption,
	PricingPlanPrice,
	PricingPlans,
	PricingPlansCycle,
	PricingPlansGrid,
	PricingPlanTitle,
} from "@baby-ui/svelte";

// Amounts in cents. A plan with no prices reads as Custom.
const plans: PricingPlanOption[] = [
	{
		id: "solo",
		name: "Solo",
		prices: { monthly: 1200, annual: 12000, lifetime: 14900 },
		features: ["All Pro components", "Commercial use"],
		cta: "Get Solo",
	},
	{
		id: "team",
		name: "Team",
		prices: { monthly: 2900, annual: 29900, lifetime: 39900 },
		features: ["Everything in Solo", "Five seats"],
		cta: "Get Team",
		highlighted: true,
		seats: "5 seats",
	},
];

let cycle = $state<PricingCycle>("annual");
let loadingPlanId = $state<string | null>(null);

async function checkout(planId: string, cycle: PricingCycle) {
	loadingPlanId = planId;
	const res = await fetch("/api/checkout", {
		method: "POST",
		body: JSON.stringify({ planId, cycle }),
	});
	window.location.href = (await res.json()).url;
}
</script>

<PricingPlans {plans} bind:cycle {loadingPlanId} onSelect={checkout}>
	<PricingPlansCycle />
	<PricingPlansGrid>
		{#each plans as plan (plan.id)}
			<PricingPlan {plan}>
				<PricingPlanHeader>
					<PricingPlanTitle />
				</PricingPlanHeader>
				<PricingPlanPrice />
				<PricingPlanAction />
				<PricingPlanFeatures />
			</PricingPlan>
		{/each}
	</PricingPlansGrid>
</PricingPlans>
