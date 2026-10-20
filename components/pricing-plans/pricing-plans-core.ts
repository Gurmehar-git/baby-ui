export type PricingCycle = "monthly" | "annual" | "lifetime";

/** Integer cents per cycle; a missing cycle means the plan is not sold that way. */
export type PlanPrices = Partial<Record<PricingCycle, number>>;

export interface PricingPlanOption {
	id: string;
	name: string;
	description?: string;
	/** Leave empty for a plan priced on request, such as Enterprise. */
	prices: PlanPrices;
	features: string[];
	/** CTA text, e.g. "Get Solo" or "Contact". */
	cta: string;
	highlighted?: boolean;
	badge?: string;
	/** Shown under the price, e.g. "5 seats". */
	seats?: string;
}

export interface PlanPrice {
	/** The headline amount: per month for monthly and annual, once for lifetime. */
	cents: number;
	cycle: PricingCycle;
	/** Full yearly charge, annual only. */
	billedCents?: number;
	/** Annual saving against twelve monthly payments, rounded down. */
	savePercent?: number;
}

export interface PricingPlansLabels {
	cycle: string;
	monthly: string;
	annual: string;
	lifetime: string;
	perMonth: string;
	perMonthSpoken: string;
	oneTime: string;
	billedYearly: string;
	save: string;
	saveUpTo: string;
	includesUpdates: string;
	custom: string;
	customNote: string;
	unavailable: string;
	features: string;
	redirecting: string;
}

export const PRICING_PLANS_LABELS: PricingPlansLabels = {
	cycle: "Billing",
	monthly: "Monthly",
	annual: "Yearly",
	lifetime: "Lifetime",
	perMonth: "/mo",
	perMonthSpoken: "per month",
	oneTime: "one-time",
	billedYearly: "billed yearly",
	save: "Save",
	/** `{percent}` is replaced with the best annual saving. */
	saveUpTo: "Save up to {percent}% yearly",
	includesUpdates: "Includes updates",
	custom: "Custom",
	customNote: "Tailored to your team",
	unavailable: "Not offered on this cycle",
	features: "Includes",
	redirecting: "Redirecting…",
};

export const PRICING_CYCLES: readonly PricingCycle[] = ["monthly", "annual", "lifetime"];

/** Cycles at least one plan is priced on, in a fixed order. */
export function availableCycles(plans: PricingPlanOption[]): PricingCycle[] {
	return PRICING_CYCLES.filter((cycle) =>
		plans.some((plan) => plan.prices[cycle] !== undefined),
	);
}

export function annualSavePercent(prices: PlanPrices): number {
	const { monthly, annual } = prices;
	if (monthly === undefined || annual === undefined || monthly <= 0) return 0;
	return Math.max(0, Math.floor((1 - annual / (monthly * 12)) * 100));
}

export function maxAnnualSavePercent(plans: PricingPlanOption[]): number {
	return plans.reduce((best, plan) => Math.max(best, annualSavePercent(plan.prices)), 0);
}

/** Null when the plan has no price on this cycle. */
export function planPrice(
	plan: PricingPlanOption,
	cycle: PricingCycle,
): PlanPrice | null {
	const cents = plan.prices[cycle];
	if (cents === undefined) return null;
	if (cycle !== "annual") return { cents, cycle };
	return {
		cents: Math.round(cents / 12),
		cycle,
		billedCents: cents,
		savePercent: annualSavePercent(plan.prices),
	};
}

export function isCustomPlan(plan: PricingPlanOption): boolean {
	return PRICING_CYCLES.every((cycle) => plan.prices[cycle] === undefined);
}

export function formatPlanMoney(
	cents: number,
	currency: string,
	locale?: string,
): string {
	const whole = cents % 100 === 0;
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		minimumFractionDigits: whole ? 0 : 2,
		maximumFractionDigits: whole ? 0 : 2,
	}).format(cents / 100);
}

/** Amount and cadence for screen readers, e.g. "$10 per month". */
export function planPriceLabel(
	plan: PricingPlanOption,
	cycle: PricingCycle,
	labels: PricingPlansLabels,
	currency: string,
	locale?: string,
): string {
	if (isCustomPlan(plan)) return labels.custom;
	const price = planPrice(plan, cycle);
	if (!price) return labels.unavailable;
	const amount = formatPlanMoney(price.cents, currency, locale);
	return `${amount} ${cycle === "lifetime" ? labels.oneTime : labels.perMonthSpoken}`;
}

/** One line per plan for the polite live region, e.g. "Solo, $10 per month, $120 billed yearly". */
export function describePlanPrice(
	plan: PricingPlanOption,
	cycle: PricingCycle,
	labels: PricingPlansLabels,
	currency: string,
	locale?: string,
): string {
	const head = `${plan.name}, ${planPriceLabel(plan, cycle, labels, currency, locale)}`;
	const billed = isCustomPlan(plan) ? undefined : planPrice(plan, cycle)?.billedCents;
	return billed === undefined
		? head
		: `${head}, ${formatPlanMoney(billed, currency, locale)} ${labels.billedYearly}`;
}
