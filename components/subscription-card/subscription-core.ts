export type SubscriptionInterval = "month" | "year" | "lifetime";
export type SubscriptionStatus =
	| "active"
	| "trialing"
	| "past_due"
	| "canceled"
	| "lifetime";

export interface SubscriptionPlan {
	name: string;
	interval: SubscriptionInterval;
	/** Price per interval (or once, for lifetime) in the currency's minor unit. */
	amount: number;
	/** ISO 4217 code, e.g. "USD". */
	currency: string;
	status: SubscriptionStatus;
}

export interface SubscriptionSeats {
	used: number;
	total: number;
}

/** The action currently waiting on the parent; its button shows a loading state. */
export type SubscriptionPending = "manage" | "change" | "cancel" | "resume" | "payment";

export type SubscriptionBadgeTone =
	| "success"
	| "info"
	| "destructive"
	| "warning"
	| "default";

export interface SubscriptionLabels {
	status: Record<SubscriptionStatus, string>;
	perMonth: string;
	perYear: string;
	oneTime: string;
	lifetimeLine: string;
	renews: (date: string, days: number) => string;
	trialEnds: (date: string, days: number) => string;
	endsOn: (date: string, days: number) => string;
	ended: (date: string) => string;
	pastDue: string;
	seats: string;
	seatsValue: (used: number, total: number) => string;
	seatsFull: string;
	manage: string;
	changePlan: string;
	cancel: string;
	resume: string;
	updatePayment: string;
	cancelTitle: string;
	cancelBody: (date: string | null) => string;
	cancelConfirm: string;
	cancelKeep: string;
}

const inDays = (days: number) =>
	days === 0 ? "today" : days === 1 ? "tomorrow" : `in ${days} days`;

export const SUBSCRIPTION_LABELS: SubscriptionLabels = {
	status: {
		active: "Active",
		trialing: "Trial",
		past_due: "Past due",
		canceled: "Canceled",
		lifetime: "Lifetime",
	},
	perMonth: "per month",
	perYear: "per year",
	oneTime: "one-time",
	lifetimeLine: "Lifetime access, updates included.",
	renews: (date, days) => `Renews ${date}, ${inDays(days)}.`,
	trialEnds: (date, days) => `Trial ends ${date}, ${inDays(days)}.`,
	endsOn: (date, days) => `Access ends ${date}, ${inDays(days)}.`,
	ended: (date) => `Access ended ${date}.`,
	pastDue: "The last payment failed. Update your payment method to keep access.",
	seats: "Seats",
	seatsValue: (used, total) => `${used} of ${total}`,
	seatsFull: "All seats are in use.",
	manage: "Manage billing",
	changePlan: "Change plan",
	cancel: "Cancel plan",
	resume: "Resume plan",
	updatePayment: "Update payment method",
	cancelTitle: "Cancel your plan?",
	cancelBody: (date) =>
		date
			? `You keep access until ${date}. You can resume any time before then.`
			: "You keep access until the end of the current billing period.",
	cancelConfirm: "Cancel plan",
	cancelKeep: "Keep plan",
};

export const STATUS_TONE: Record<SubscriptionStatus, SubscriptionBadgeTone> = {
	active: "success",
	trialing: "info",
	past_due: "destructive",
	canceled: "warning",
	lifetime: "default",
};

const DAY = 86_400_000;

/** Accepts ISO strings, epoch milliseconds or dates. */
export function toTime(value: string | number | Date): number {
	return value instanceof Date ? value.getTime() : new Date(value).getTime();
}

/** Whole days from `now` to `at`, never negative. */
export function daysUntil(
	at: string | number | Date,
	now: string | number | Date,
): number {
	return Math.max(0, Math.ceil((toTime(at) - toTime(now)) / DAY));
}

export function formatMoney(amount: number, currency: string, locale?: string): string {
	return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
		amount / 100,
	);
}

export function formatDate(at: string | number | Date, locale?: string): string {
	return new Intl.DateTimeFormat(locale, {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(toTime(at));
}

export function intervalLabel(
	interval: SubscriptionInterval,
	labels: SubscriptionLabels,
) {
	return interval === "month"
		? labels.perMonth
		: interval === "year"
			? labels.perYear
			: labels.oneTime;
}

/** The one line under the price that says what happens next, or null when nothing does. */
export function scheduleLine(input: {
	plan: SubscriptionPlan;
	renewsAt?: string | number | Date;
	endsAt?: string | number | Date;
	trialEndsAt?: string | number | Date;
	now: string | number | Date;
	locale?: string;
	labels: SubscriptionLabels;
}): string | null {
	const { plan, renewsAt, endsAt, trialEndsAt, now, locale, labels } = input;
	if (plan.status === "lifetime" || plan.interval === "lifetime")
		return labels.lifetimeLine;
	if (plan.status === "trialing" && trialEndsAt)
		return labels.trialEnds(formatDate(trialEndsAt, locale), daysUntil(trialEndsAt, now));
	if (plan.status === "canceled" && endsAt) {
		return toTime(endsAt) <= toTime(now)
			? labels.ended(formatDate(endsAt, locale))
			: labels.endsOn(formatDate(endsAt, locale), daysUntil(endsAt, now));
	}
	if (plan.status === "active" && renewsAt)
		return labels.renews(formatDate(renewsAt, locale), daysUntil(renewsAt, now));
	return null;
}

/** Cancel is offered on live recurring plans; resume only while a canceled plan still runs. */
export function availableActions(input: {
	plan: SubscriptionPlan;
	endsAt?: string | number | Date;
	now: string | number | Date;
}): { cancel: boolean; resume: boolean; updatePayment: boolean } {
	const { plan, endsAt, now } = input;
	const recurring = plan.interval !== "lifetime" && plan.status !== "lifetime";
	return {
		cancel: recurring && (plan.status === "active" || plan.status === "trialing"),
		resume:
			recurring &&
			plan.status === "canceled" &&
			endsAt !== undefined &&
			toTime(endsAt) > toTime(now),
		updatePayment: plan.status === "past_due",
	};
}
