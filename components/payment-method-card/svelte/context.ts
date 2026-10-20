import { getContext, hasContext, setContext } from "svelte";
import type {
	ExpiryState,
	PaymentMethod,
	PaymentMethodLabels,
	PaymentMethodStatus,
} from "../payment-method-core";
import type { paymentMethodCard } from "../variants";

export type PaymentMethodCardState = {
	method: PaymentMethod | null;
	expiry: ExpiryState;
	status: PaymentMethodStatus;
	locale?: string;
	labels: PaymentMethodLabels;
	styles: ReturnType<typeof paymentMethodCard>;
};

const KEY = Symbol("payment-method-card");

/** The root's state behind getters, so every part reads the latest value. */
export const setPaymentMethodCard = (state: PaymentMethodCardState) =>
	setContext(KEY, state);
export function paymentMethodCardState(part: string): PaymentMethodCardState {
	if (!hasContext(KEY))
		throw new Error(`${part} must be used inside <PaymentMethodCard>`);
	return getContext<PaymentMethodCardState>(KEY);
}
