import type { NotificationItem } from "@baby-ui/svelte";

/** An inbox for the notification-center demo. */
export const NOTIFICATIONS: NotificationItem[] = [
	{
		id: "n1",
		title: "Ada Park mentioned you",
		description: "“Can you check the hero copy before Friday?”",
		time: "2m",
		actor: { name: "Ada Park" },
	},
	{
		id: "n2",
		title: "Deploy finished",
		description: "Production is running v2.14.0.",
		time: "18m",
		tone: "success",
	},
	{
		id: "n3",
		title: "Usage at 90%",
		description: "You have used 9 of 10 seats on the Team plan.",
		time: "1h",
		tone: "warning",
	},
	{
		id: "n4",
		title: "Marcus Webb shared a file",
		description: "Q3 retention report.pdf",
		time: "3h",
		read: true,
		actor: { name: "Marcus Webb" },
	},
	{
		id: "n5",
		title: "New comment on Pricing page",
		time: "Yesterday",
		read: true,
		tone: "info",
	},
];
