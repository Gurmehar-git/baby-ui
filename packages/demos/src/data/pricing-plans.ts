import type { PricingPlanOption } from "../../../../components/pricing-plans/pricing-plans-core";

/** baby-ui Pro licences in cents; Enterprise has no price and routes to sales. */
export const PRO_PLANS: PricingPlanOption[] = [
	{
		id: "solo",
		name: "Solo",
		description: "One developer, every Pro component.",
		prices: { monthly: 1200, annual: 12000, lifetime: 14900 },
		features: [
			"All Pro components and blocks",
			"Svelte and React ports",
			"Commercial use in unlimited projects",
			"Private registry access",
		],
		cta: "Get Solo",
		seats: "1 seat",
	},
	{
		id: "team",
		name: "Team",
		description: "Shared licence for a product team.",
		prices: { monthly: 2900, annual: 29900, lifetime: 39900 },
		features: [
			"Everything in Solo",
			"Five seats with one shared token",
			"Seat management dashboard",
			"Priority issue triage",
		],
		cta: "Get Team",
		highlighted: true,
		badge: "Popular",
		seats: "5 seats",
	},
	{
		id: "enterprise",
		name: "Enterprise",
		description: "Custom seats, invoicing and support terms.",
		prices: {},
		features: [
			"Everything in Team",
			"Unlimited seats",
			"Invoice and purchase order billing",
			"Dedicated support channel",
		],
		cta: "Contact",
	},
];
