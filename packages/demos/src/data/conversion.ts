/** Conversion rate by acquisition channel across two quarters, in percent. */
export const CONVERSION_BY_CHANNEL = [
	{ name: "search", start: 4.2, end: 5.1 },
	{ name: "social", start: 2.8, end: 2.1 },
	{ name: "email", start: 6.4, end: 7.9 },
	{ name: "referral", start: 5.6, end: 4.9 },
	{ name: "direct", start: 3.1, end: 3.6 },
];

export const CONVERSION_NEXT = [
	{ name: "search", start: 5.1, end: 6.3 },
	{ name: "social", start: 2.1, end: 3.4 },
	{ name: "email", start: 7.9, end: 7.2 },
	{ name: "referral", start: 4.9, end: 5.2 },
	{ name: "direct", start: 3.6, end: 3.3 },
];

export const CONVERSION_CONFIG = {
	search: { label: "Search", color: "var(--chart-1)" },
	social: { label: "Social", color: "var(--chart-2)" },
	email: { label: "Email", color: "var(--chart-3)" },
	referral: { label: "Referral", color: "var(--chart-4)" },
	direct: { label: "Direct", color: "var(--chart-5)" },
};
