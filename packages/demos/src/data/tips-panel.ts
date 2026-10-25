export type SampleTip = {
	id: string;
	title: string;
	description: string;
	action: string;
	doneLabel?: string;
	primary?: boolean;
};

export const TIPS_PANEL_TIPS: SampleTip[] = [
	{
		id: "invite",
		title: "Invite your team",
		description: "Work on projects together and keep feedback in one place.",
		action: "Invite",
		doneLabel: "Invited",
	},
	{
		id: "search",
		title: "Quick search",
		description: "Press Ctrl K to jump to any page, project or setting.",
		action: "Try it",
	},
	{
		id: "digest",
		title: "Weekly digest",
		description: "A short summary of what changed, every Monday morning.",
		action: "Turn on",
		doneLabel: "On",
	},
	{
		id: "slack",
		title: "Connect Slack",
		description: "Post an update to a channel when something needs attention.",
		action: "Connect",
		doneLabel: "Connected",
	},
	{
		id: "mobile",
		title: "Mobile app",
		description: "Check activity and approve requests while you're away.",
		action: "Get the app",
	},
	{
		id: "pro",
		title: "Ready for Pro?",
		description: "Unlimited projects, priority support and advanced analytics.",
		action: "Upgrade",
		primary: true,
		doneLabel: "Upgraded",
	},
];
