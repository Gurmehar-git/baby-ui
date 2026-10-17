export interface Pricing01Period {
	value: string;
	label: string;
	/** Shown after the price, e.g. "/month". */
	cadence: string;
}

export interface Pricing01Plan {
	id: string;
	name: string;
	description?: string;
	/** Display price keyed by period value, already formatted. */
	prices: Record<string, string>;
	features: string[];
	/** Rises above the card on hover and focus. */
	note?: string;
	/** Pill beside the name, e.g. "Popular". */
	badge?: string;
	featured?: boolean;
	cta?: string;
	href?: string;
}

export interface Pricing01Labels {
	/** Accessible name of the billing period toggle. */
	period: string;
	/** Button text when a plan has no `cta`; the plan name follows. */
	choose: string;
}

export const PRICING_01_LABELS: Pricing01Labels = {
	period: "Billing period",
	choose: "Choose",
};
