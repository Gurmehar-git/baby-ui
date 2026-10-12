/** Weekly support tickets by topic over a quarter, for the streamgraph demo. */
export const TICKETS_BY_TOPIC = [
	{ week: "Jul 7", billing: 42, bugs: 61, onboarding: 28, account: 19, feature: 14 },
	{ week: "Jul 14", billing: 45, bugs: 58, onboarding: 33, account: 21, feature: 16 },
	{ week: "Jul 21", billing: 51, bugs: 72, onboarding: 36, account: 18, feature: 19 },
	{ week: "Jul 28", billing: 48, bugs: 88, onboarding: 41, account: 22, feature: 17 },
	{ week: "Aug 4", billing: 44, bugs: 96, onboarding: 47, account: 24, feature: 21 },
	{ week: "Aug 11", billing: 39, bugs: 81, onboarding: 52, account: 23, feature: 26 },
	{ week: "Aug 18", billing: 41, bugs: 67, onboarding: 49, account: 26, feature: 31 },
	{ week: "Aug 25", billing: 47, bugs: 59, onboarding: 44, account: 29, feature: 35 },
	{ week: "Sep 1", billing: 56, bugs: 54, onboarding: 38, account: 27, feature: 38 },
	{ week: "Sep 8", billing: 62, bugs: 49, onboarding: 35, account: 25, feature: 42 },
	{ week: "Sep 15", billing: 58, bugs: 52, onboarding: 31, account: 24, feature: 39 },
	{ week: "Sep 22", billing: 53, bugs: 47, onboarding: 29, account: 22, feature: 36 },
];

export const TICKETS_CONFIG = {
	bugs: { label: "Bugs", color: "var(--chart-1)" },
	billing: { label: "Billing", color: "var(--chart-2)" },
	onboarding: { label: "Onboarding", color: "var(--chart-3)" },
	account: { label: "Account", color: "var(--chart-4)" },
	feature: { label: "Feature requests", color: "var(--chart-5)" },
};
