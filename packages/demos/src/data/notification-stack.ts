import type { NotificationPatternName } from "../../../../components/notification-stack/variants";

export type SampleNotice = {
	id: string;
	badge: string;
	title: string;
	text: string;
	pattern: NotificationPatternName;
	action?: { label: string; href: string; external?: boolean };
};

export const NOTIFICATION_STACK_NOTICES: SampleNotice[] = [
	{
		id: "sso",
		badge: "New",
		title: "Single sign-on is here",
		text: "Connect Okta, Microsoft Entra or Google Workspace and manage seats from one place.",
		pattern: "orbit",
		action: { label: "Set it up", href: "#sso" },
	},
	{
		id: "limit",
		badge: "Notice",
		title: "You've used 80% of your runs",
		text: "Runs reset on November 1. Upgrade to keep agents running past the limit.",
		pattern: "grid",
		action: { label: "See plans", href: "#plans" },
	},
	{
		id: "changelog",
		badge: "Update",
		title: "Faster exports",
		text: "CSV and PDF exports now finish in seconds, even for large workspaces.",
		pattern: "rays",
		action: {
			label: "Read the changelog",
			href: "https://example.com/changelog",
			external: true,
		},
	},
];
