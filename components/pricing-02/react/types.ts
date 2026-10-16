export interface Pricing02Period {
	value: string;
	label: string;
	/** Shown after the price, e.g. "/ month". */
	cadence: string;
}

export interface Pricing02Plan {
	id: string;
	name: string;
	description?: string;
	/** Display price keyed by period value, already formatted. */
	prices: Record<string, string>;
	features: string[];
	/** Heading over the feature list, e.g. "Everything in Starter, plus". */
	featuresLabel?: string;
	featured?: boolean;
	cta?: string;
	href?: string;
}

export interface Pricing02Labels {
	/** Accessible name of the billing period toggle. */
	period: string;
	/** Button text when a plan has no `cta`; the plan name follows. */
	choose: string;
}

export const PRICING_02_LABELS: Pricing02Labels = {
	period: "Billing period",
	choose: "Choose",
};

/** The last two characters trail the rest by 70ms each, like an odometer settling. */
export function digitDelay(index: number, length: number): string {
	return `${Math.max(0, index - (length - 3)) * 70}ms`;
}
