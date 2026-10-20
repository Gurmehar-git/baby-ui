"use client";

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
} from "@baby-ui/react";
import { useState } from "react";

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

export function Pricing() {
	const [cycle, setCycle] = useState<PricingCycle>("annual");
	const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

	async function checkout(planId: string, next: PricingCycle) {
		setLoadingPlanId(planId);
		const res = await fetch("/api/checkout", {
			method: "POST",
			body: JSON.stringify({ planId, cycle: next }),
		});
		window.location.href = (await res.json()).url;
	}

	return (
		<PricingPlans
			plans={plans}
			cycle={cycle}
			onCycleChange={setCycle}
			loadingPlanId={loadingPlanId}
			onSelect={checkout}
		>
			<PricingPlansCycle />
			<PricingPlansGrid>
				{plans.map((plan) => (
					<PricingPlan key={plan.id} plan={plan}>
						<PricingPlanHeader>
							<PricingPlanTitle />
						</PricingPlanHeader>
						<PricingPlanPrice />
						<PricingPlanAction />
						<PricingPlanFeatures />
					</PricingPlan>
				))}
			</PricingPlansGrid>
		</PricingPlans>
	);
}
