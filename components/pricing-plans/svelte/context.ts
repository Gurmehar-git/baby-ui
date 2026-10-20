import { getContext, hasContext, setContext } from "svelte";
import type {
	PlanPrice,
	PricingCycle,
	PricingPlanOption,
	PricingPlansLabels,
} from "../pricing-plans-core";
import type { PricingPlansLayout, PricingPlansSize } from "../variants";

export type PricingPlansState = {
	id: string;
	plans: PricingPlanOption[];
	cycles: PricingCycle[];
	active: PricingCycle;
	setCycle: (next: PricingCycle) => void;
	money: (cents: number) => string;
	labels: PricingPlansLabels;
	layout: PricingPlansLayout;
	size: PricingPlansSize;
	currency: string;
	locale?: string;
	onSelect?: (planId: string, cycle: PricingCycle) => void;
	loadingPlanId: string | null;
};

export type PricingPlanState = {
	plan: PricingPlanOption;
	price: PlanPrice | null;
	custom: boolean;
	headingId: string;
};

const PLANS = Symbol("pricing-plans");
const PLAN = Symbol("pricing-plan");

/** Root and plan state behind getters, so every part reads the latest value. */
export const setPricingPlans = (state: PricingPlansState) => setContext(PLANS, state);
export function pricingPlansState(part: string): PricingPlansState {
	if (!hasContext(PLANS)) throw new Error(`${part} must be used inside <PricingPlans>`);
	return getContext<PricingPlansState>(PLANS);
}

export const setPricingPlan = (state: PricingPlanState) => setContext(PLAN, state);
export function pricingPlanState(part: string): PricingPlanState {
	if (!hasContext(PLAN)) throw new Error(`${part} must be used inside <PricingPlan>`);
	return getContext<PricingPlanState>(PLAN);
}
