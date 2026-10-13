import type { ContactOffice } from "../../../ui-react/src/contact-section/contact";

/** Sample offices for the contact section demo, spread across time zones. */
export const CONTACT_OFFICES: ContactOffice[] = [
	{
		city: "San Francisco",
		timeZone: "America/Los_Angeles",
		address: ["548 Market St", "San Francisco, CA 94104"],
		email: "sf@example.com",
	},
	{
		city: "London",
		timeZone: "Europe/London",
		address: ["20 Farringdon Rd", "London EC1M 3HE"],
		email: "london@example.com",
	},
	{
		city: "Berlin",
		timeZone: "Europe/Berlin",
		address: ["Rosenthaler Str. 40", "10178 Berlin"],
	},
	{
		city: "Singapore",
		timeZone: "Asia/Singapore",
		address: ["1 Raffles Place", "Singapore 048616"],
		hours: [10, 19],
	},
];

export const CONTACT_CHANNELS = [
	{ value: "sales", label: "Sales", meta: "Replies within a few hours" },
	{ value: "support", label: "Support", meta: "Around the clock" },
	{ value: "press", label: "Press", meta: "Within two days" },
];

export const CONTACT_DETAILS: Record<string, { lead: string; email: string }> = {
	sales: { lead: "Plans, pricing and volume seats.", email: "sales@example.com" },
	support: {
		lead: "Bugs, billing questions and account help.",
		email: "help@example.com",
	},
	press: { lead: "Interviews, logos and product shots.", email: "press@example.com" },
};
