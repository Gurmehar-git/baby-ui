export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";

export interface CardPaymentMethod {
	type: "card";
	brand: CardBrand;
	last4: string;
	/** 1 to 12. */
	expMonth: number;
	/** Four digits. */
	expYear: number;
}

export interface WalletPaymentMethod {
	type: "paypal" | "link";
	email: string;
}

export type PaymentMethod = CardPaymentMethod | WalletPaymentMethod;

/** "redirecting" while the parent sends the customer to the provider's portal. */
export type PaymentMethodStatus = "idle" | "redirecting" | "error";

export type ExpiryState = "ok" | "soon" | "expired";

export interface PaymentMethodLabels {
	title: string;
	brand: Record<CardBrand | WalletPaymentMethod["type"], string>;
	cardLine: (brand: string, last4: string) => string;
	expires: (date: string) => string;
	expired: (date: string) => string;
	soonBadge: string;
	expiredBadge: string;
	update: string;
	add: string;
	empty: string;
	emptyHint: string;
	redirecting: string;
	error: string;
}

export const PAYMENT_METHOD_LABELS: PaymentMethodLabels = {
	title: "Payment method",
	brand: {
		visa: "Visa",
		mastercard: "Mastercard",
		amex: "American Express",
		discover: "Discover",
		unknown: "Card",
		paypal: "PayPal",
		link: "Link",
	},
	cardLine: (brand, last4) => `${brand} ending in ${last4}`,
	expires: (date) => `Expires ${date}`,
	expired: (date) => `Expired ${date}`,
	soonBadge: "Expires soon",
	expiredBadge: "Expired",
	update: "Update",
	add: "Add payment method",
	empty: "No payment method on file",
	emptyHint: "Add one to keep your plan running without interruption.",
	redirecting: "Opening secure billing portal",
	error: "Could not open the billing portal. Try again.",
};

/** Short wordmarks for the brand chip; text, so there is nothing to load. */
export const BRAND_MARK: Record<CardBrand | WalletPaymentMethod["type"], string> = {
	visa: "VISA",
	mastercard: "MC",
	amex: "AMEX",
	discover: "DISC",
	unknown: "CARD",
	paypal: "PayPal",
	link: "Link",
};

export const SOON_DAYS = 60;

export function isCard(
	method: PaymentMethod | null | undefined,
): method is CardPaymentMethod {
	return method?.type === "card";
}

/** A card works through the last day of its expiry month. */
export function expiryState(
	method: PaymentMethod | null | undefined,
	now: string | number | Date,
): ExpiryState {
	if (!isCard(method)) return "ok";
	const end = new Date(method.expYear, method.expMonth, 1).getTime();
	const at = now instanceof Date ? now.getTime() : new Date(now).getTime();
	if (at >= end) return "expired";
	return end - at <= SOON_DAYS * 86_400_000 ? "soon" : "ok";
}

/** Month and year as the locale writes them, "10/2026" in en-US. */
export function expiryLabel(method: CardPaymentMethod, locale?: string): string {
	return new Intl.DateTimeFormat(locale, { month: "2-digit", year: "numeric" }).format(
		new Date(method.expYear, method.expMonth - 1, 1),
	);
}
