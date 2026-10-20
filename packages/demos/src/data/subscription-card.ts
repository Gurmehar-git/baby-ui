import type {
	SubscriptionPlan,
	SubscriptionSeats,
} from "../../../../components/subscription-card/subscription-core";

const DAY = 86_400_000;

/** A date `days` from `now`; demos pass the page's own clock. */
export const daysFrom = (now: Date, days: number) => new Date(now.getTime() + days * DAY);

export type SubscriptionScenario =
	| "team"
	| "lifetime"
	| "past_due"
	| "trialing"
	| "canceled";

export const SUBSCRIPTION_SCENARIOS: Record<
	SubscriptionScenario,
	{
		plan: SubscriptionPlan;
		seats?: SubscriptionSeats;
		renewsIn?: number;
		endsIn?: number;
		trialEndsIn?: number;
	}
> = {
	team: {
		plan: {
			name: "Baby UI Pro Team",
			interval: "year",
			amount: 29_900,
			currency: "USD",
			status: "active",
		},
		seats: { used: 5, total: 5 },
		renewsIn: 23,
	},
	lifetime: {
		plan: {
			name: "Baby UI Pro",
			interval: "lifetime",
			amount: 14_900,
			currency: "USD",
			status: "lifetime",
		},
	},
	past_due: {
		plan: {
			name: "Baby UI Pro Team",
			interval: "month",
			amount: 2_900,
			currency: "USD",
			status: "past_due",
		},
		seats: { used: 3, total: 5 },
	},
	trialing: {
		plan: {
			name: "Baby UI Pro Team",
			interval: "month",
			amount: 2_900,
			currency: "USD",
			status: "trialing",
		},
		seats: { used: 2, total: 5 },
		trialEndsIn: 9,
	},
	canceled: {
		plan: {
			name: "Baby UI Pro Team",
			interval: "year",
			amount: 29_900,
			currency: "USD",
			status: "canceled",
		},
		seats: { used: 5, total: 5 },
		endsIn: 41,
	},
};
