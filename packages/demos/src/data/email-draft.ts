export type DraftContact = { name: string; email: string };

export const EMAIL_DRAFT_CONTACTS: DraftContact[] = [
	{ name: "Jonas Weber", email: "jonas@northwind.io" },
	{ name: "Lena Hart", email: "lena@northwind.io" },
	{ name: "Finance team", email: "billing@northwind.io" },
];

const first = (c: DraftContact) => c.name.split(" ")[0];

export const EMAIL_DRAFT_TONES: {
	value: string;
	label: string;
	text: (c: DraftContact) => string;
}[] = [
	{
		value: "friendly",
		label: "Friendly",
		text: (c) =>
			`Hi ${first(c)}, a heads-up that your Growth plan renews on October 9 for $8,900 a year. If you'd like to add seats or switch to monthly billing, you can review the quote here:`,
	},
	{
		value: "short",
		label: "Short",
		text: (c) =>
			`Hi ${first(c)}, your Growth plan renews on October 9 ($8,900/year). Quote for changes:`,
	},
	{
		value: "formal",
		label: "Formal",
		text: (c) =>
			`Dear ${c.name}, this is a reminder that your Growth subscription is scheduled to renew on October 9 at $8,900 per year. Should you wish to adjust seats or billing, please review the attached quote:`,
	},
];
