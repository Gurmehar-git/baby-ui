"use client";

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
} from "@baby-ui/react";
import { useEffect, useState } from "react";
import { PRO_PLANS } from "../data/pricing-plans";

type Props = Record<string, unknown>;

export function PricingPlansDemo({ props }: { props: Props }) {
	const [cycle, setCycle] = useState<PricingCycle>("lifetime");
	const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

	// Controls panel values win when they change, then the switch takes over again.
	useEffect(() => {
		const next = props.cycle;
		if (next === "monthly" || next === "annual" || next === "lifetime") setCycle(next);
	}, [props.cycle]);

	// Stands in for the hosted checkout redirect.
	const select = (planId: string) => {
		setLoadingPlanId(planId);
		setTimeout(() => setLoadingPlanId(null), 1600);
	};

	return (
		<div className="w-full max-w-5xl">
			<PricingPlans
				plans={PRO_PLANS}
				cycle={cycle}
				onCycleChange={setCycle}
				loadingPlanId={loadingPlanId}
				onSelect={select}
				layout={(props.layout as PricingPlansLayout) ?? "cards"}
				size={(props.size as PricingPlansSize) ?? "default"}
			>
				<PricingPlansCycle />
				<PricingPlansGrid>
					{PRO_PLANS.map((plan) => (
						<PricingPlan key={plan.id} plan={plan}>
							<PricingPlanHeader>
								<PricingPlanTitle />
								<PricingPlanDescription />
							</PricingPlanHeader>
							<PricingPlanPrice />
							<PricingPlanAction />
							<PricingPlanFeatures />
						</PricingPlan>
					))}
				</PricingPlansGrid>
			</PricingPlans>
		</div>
	);
}
