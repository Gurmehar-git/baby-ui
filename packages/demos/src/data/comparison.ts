import type { ComparisonColumn, ComparisonSection } from "@baby-ui/svelte";

/** Sample plans for the comparison table demo, priced per seat. */
export const PLAN_COLUMNS: ComparisonColumn[] = [
	{
		id: "team",
		name: "Team",
		caption: "For smaller teams",
		price: { monthly: 13, yearly: 10 },
		action: { label: "Select Team" },
	},
	{
		id: "studio",
		name: "Studio",
		caption: "For work across teams",
		price: { monthly: 27, yearly: 22 },
		highlight: true,
		action: { label: "Select Studio" },
	},
];

export const PLAN_SECTIONS: ComparisonSection[] = [
	{
		id: "work",
		title: "Work",
		rows: [
			{
				id: "projects",
				feature: "Active projects",
				values: { team: "Unlimited", studio: "Unlimited" },
			},
			{
				id: "workspaces",
				feature: "Shared workspaces",
				values: { team: "1 workspace", studio: "Unlimited" },
			},
			{
				id: "guests",
				feature: "Guest reviewers",
				values: { team: "5 per project", studio: "Unlimited" },
			},
			{
				id: "history",
				feature: "Version history",
				values: { team: "30 days", studio: "Unlimited" },
			},
		],
	},
	{
		id: "control",
		title: "Control",
		rows: [
			{
				id: "approvals",
				feature: "Approval flows",
				values: { team: false, studio: true },
			},
			{ id: "roles", feature: "Custom roles", values: { team: false, studio: true } },
			{ id: "exports", feature: "Source exports", values: { team: true, studio: true } },
			{
				id: "support",
				feature: "Support",
				values: { team: "Email", studio: "Priority email" },
			},
		],
	},
];

/** Sample products for the comparison table demo; competitors are generic categories. */
export const PRODUCT_COLUMNS: ComparisonColumn[] = [
	{
		id: "relay",
		name: "Relay",
		caption: "$10 per seat",
		highlight: true,
		action: { label: "Start free", href: "#start" },
	},
	{ id: "suite", name: "Legacy suite", caption: "$24 per seat" },
	{ id: "sheets", name: "Spreadsheets", caption: "Free" },
	{ id: "point", name: "Point tools", caption: "$16 per seat" },
];

export const PRODUCT_SECTIONS: ComparisonSection[] = [
	{
		id: "planning",
		title: "Planning",
		rows: [
			{
				id: "projects",
				feature: "Projects",
				values: {
					relay: "Unlimited",
					suite: "Up to 50",
					sheets: "Unlimited",
					point: "Up to 10",
				},
			},
			{
				id: "roadmaps",
				feature: "Timelines and roadmaps",
				values: {
					relay: true,
					suite: true,
					sheets: false,
					point: { value: "partial", note: "Timeline only" },
				},
			},
			{
				id: "dependencies",
				feature: "Dependencies",
				hint: "Blocked work moves when its blocker does",
				values: { relay: true, suite: true, sheets: false, point: false },
			},
		],
	},
	{
		id: "security",
		title: "Security",
		rows: [
			{
				id: "sso",
				feature: "Single sign-on",
				values: { relay: true, suite: true, sheets: false, point: "partial" },
			},
			{
				id: "audit",
				feature: "Audit log",
				values: { relay: true, suite: true, sheets: false, point: false },
			},
			{
				id: "export",
				feature: "Data export",
				values: { relay: true, suite: true, sheets: true, point: true },
			},
		],
	},
];
