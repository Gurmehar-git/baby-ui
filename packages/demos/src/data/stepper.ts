/** A checkout flow for the stepper demo. */
export const CHECKOUT_STEPS = [
	{ id: "cart", label: "Cart", description: "Review your items" },
	{ id: "shipping", label: "Shipping", description: "Where it should go" },
	{ id: "payment", label: "Payment", description: "Card or bank transfer" },
	{ id: "review", label: "Review", description: "Confirm and place the order" },
];

export const PAYMENT_ERROR = "Card declined. Try another card.";
