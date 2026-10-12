const MIN = 60_000;

type DemoEvent = {
	id: string;
	ago: number;
	actor?: string;
	title: string;
	meta?: string;
	detail?: string;
	tone?: "success" | "destructive";
	icon?: "rocket" | "alert" | "check";
};

/** Project history for the timeline demo; `ago` is minutes before the demo's clock. */
export const TIMELINE_EVENTS: DemoEvent[] = [
	{
		id: "e1",
		ago: 4,
		actor: "Ada Park",
		title: "merged Checkout redesign into main",
		meta: "#482",
		detail: "12 files changed, 3 reviewers approved.",
	},
	{
		id: "e2",
		ago: 18,
		title: "Production deploy succeeded",
		meta: "v2.14.0 in 3m 12s",
		tone: "success",
		icon: "rocket",
	},
	{
		id: "e3",
		ago: 52,
		actor: "Marcus Webb",
		title: "commented on Pricing page copy",
		detail: "Can we say “per seat” in the headline so it matches the invoice?",
	},
	{
		id: "e4",
		ago: 140,
		title: "Preview build failed",
		meta: "Type error in billing.ts",
		tone: "destructive",
		icon: "alert",
	},
	{
		id: "e5",
		ago: 60 * 26,
		actor: "Priya Nair",
		title: "opened Onboarding checklist",
		meta: "#479",
	},
	{ id: "e6", ago: 60 * 29, actor: "Jonas Berg", title: "rotated the API signing key" },
	{
		id: "e7",
		ago: 60 * 50,
		title: "Weekly backup completed",
		tone: "success",
		icon: "check",
	},
];

export const TIMELINE_NEXT = [
	{ actor: "Lena Ortiz", title: "resolved Refund request", meta: "Ticket 1182" },
	{ actor: "Theo Laurent", title: "shared Q3 retention report" },
	{ actor: "Ada Park", title: "requested review on Search filters", meta: "#486" },
];

export const timelineAt = (now: number, ago: number) => now - ago * MIN;
