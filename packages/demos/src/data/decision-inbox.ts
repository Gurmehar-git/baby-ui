export type SampleDecision = {
	id: string;
	title: string;
	detail?: string;
	primary: { label: string; value: string };
	secondary: { label: string; value: string };
};

export const DECISION_INBOX_DECISIONS: SampleDecision[] = [
	{
		id: "refund",
		title: "Refund order #4821?",
		detail: "The customer says the parcel never arrived; tracking stops in Leipzig.",
		primary: { label: "Refund", value: "Refunded" },
		secondary: { label: "Decline", value: "Declined" },
	},
	{
		id: "slot",
		title: "Move the design review to Thursday?",
		detail: "Two of five reviewers are out on Wednesday.",
		primary: { label: "Move it", value: "Moved to Thursday" },
		secondary: { label: "Keep", value: "Kept on Wednesday" },
	},
	{
		id: "send",
		title: "Send the renewal reminder to 214 customers?",
		detail: "Drafted from last quarter's template, personalised by plan.",
		primary: { label: "Send", value: "Sent" },
		secondary: { label: "Hold", value: "On hold" },
	},
	{
		id: "seats",
		title: "Add 3 seats for the support team?",
		detail: "Billed at $12 per seat per month from today.",
		primary: { label: "Add seats", value: "Seats added" },
		secondary: { label: "Not now", value: "Skipped" },
	},
];

/** The last decision starts folded to one line. */
export const DECISION_INBOX_COLLAPSED = ["seats"];
