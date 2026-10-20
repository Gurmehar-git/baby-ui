import type {
	ComparisonGroup,
	ComparisonPlan,
} from "../../../../components/pricing-comparison/pricing-comparison-core";

export const COMPARISON_PLANS: ComparisonPlan[] = [
	{ id: "solo", name: "Solo" },
	{ id: "team", name: "Team", highlighted: true },
	{ id: "enterprise", name: "Enterprise" },
];

export const COMPARISON_GROUPS: ComparisonGroup[] = [
	{
		label: "Components",
		rows: [
			{
				feature: "Pro components and blocks",
				values: { solo: true, team: true, enterprise: true },
			},
			{
				feature: "Svelte and React ports",
				values: { solo: true, team: true, enterprise: true },
			},
			{
				feature: "Early access releases",
				hint: "New blocks a month before general release",
				values: { solo: false, team: true, enterprise: true },
			},
		],
	},
	{
		label: "Licence",
		rows: [
			{ feature: "Seats", values: { solo: "1", team: "5", enterprise: "Unlimited" } },
			{
				feature: "Commercial projects",
				values: { solo: "Unlimited", team: "Unlimited", enterprise: "Unlimited" },
			},
			{
				feature: "Shared registry token",
				values: { solo: false, team: true, enterprise: true },
			},
			{
				feature: "Invoice billing",
				hint: "Purchase orders and net 30 terms",
				values: { solo: false, team: false, enterprise: true },
			},
		],
	},
	{
		label: "Support",
		rows: [
			{
				feature: "Community forum",
				values: { solo: true, team: true, enterprise: true },
			},
			{
				feature: "Issue triage",
				values: { solo: "Standard", team: "Priority", enterprise: "Priority" },
			},
			{
				feature: "Dedicated channel",
				values: { solo: false, team: false, enterprise: true },
			},
		],
	},
];
