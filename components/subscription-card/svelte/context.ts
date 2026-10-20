import { getContext, hasContext, setContext } from "svelte";
import type {
	availableActions,
	SubscriptionLabels,
	SubscriptionPending,
	SubscriptionPlan,
} from "../subscription-core";
import type { subscriptionCard } from "../variants";

export type SubscriptionCardState = {
	id: string;
	plan: SubscriptionPlan;
	renewsAt?: string | number | Date;
	actions: ReturnType<typeof availableActions>;
	schedule: string | null;
	pending: SubscriptionPending | null;
	locale?: string;
	labels: SubscriptionLabels;
	styles: ReturnType<typeof subscriptionCard>;
};

const KEY = Symbol("subscription-card");

/** The root's state behind getters, so every part reads the latest value. */
export const setSubscriptionCard = (state: SubscriptionCardState) =>
	setContext(KEY, state);
export function subscriptionCardState(part: string): SubscriptionCardState {
	if (!hasContext(KEY)) throw new Error(`${part} must be used inside <SubscriptionCard>`);
	return getContext<SubscriptionCardState>(KEY);
}
