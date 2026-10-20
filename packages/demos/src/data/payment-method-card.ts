import type { PaymentMethod } from "../../../../components/payment-method-card/payment-method-core";

export type PaymentMethodSample =
	| "visa"
	| "mastercard"
	| "amex"
	| "paypal"
	| "link"
	| "none";

/** Sample methods; the Visa expires next month relative to `now`. */
export function paymentMethodSample(
	sample: PaymentMethodSample,
	now: Date,
): PaymentMethod | null {
	const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
	switch (sample) {
		case "visa":
			return {
				type: "card",
				brand: "visa",
				last4: "4242",
				expMonth: next.getMonth() + 1,
				expYear: next.getFullYear(),
			};
		case "mastercard":
			return {
				type: "card",
				brand: "mastercard",
				last4: "5100",
				expMonth: 8,
				expYear: now.getFullYear() + 3,
			};
		case "amex":
			return {
				type: "card",
				brand: "amex",
				last4: "0005",
				expMonth: 3,
				expYear: now.getFullYear() + 2,
			};
		case "paypal":
			return { type: "paypal", email: "billing@acme.dev" };
		case "link":
			return { type: "link", email: "billing@acme.dev" };
		default:
			return null;
	}
}
