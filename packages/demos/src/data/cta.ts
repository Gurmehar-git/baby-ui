import { avatar } from "./media";

/** Sample copy for the call-to-action demos, one set per variant. */
export const CTA_COPY = {
	centered: {
		title: "Start building in minutes",
		description:
			"Set up a workspace, invite your team and ship the first project this week. Free for 14 days.",
		primaryAction: { label: "Start free trial", href: "#start" },
		secondaryAction: { label: "Talk to sales", href: "#sales" },
		note: "No credit card required",
	},
	split: {
		title: "Your team, set up before lunch",
		description:
			"Import your projects, bring everyone in and keep working the way you already do.",
		primaryAction: { label: "Create a workspace", href: "#create" },
		secondaryAction: { label: "Book a demo", href: "#demo" },
		points: [
			"Import from any tracker in one step",
			"Single sign-on and audit logs included",
			"Cancel anytime from settings",
		],
	},
	banner: {
		title: "Workflows are here",
		description: "Automate handoffs between teams with no code.",
		primaryAction: { label: "See how it works", href: "#workflows" },
	},
};

export const CTA_FACES = [12, 32, 47, 5].map((index) => ({ src: avatar(index) }));

export const CTA_SETUP = {
	workspace: "Northwind",
	steps: ["Create workspace", "Import 214 issues", "Invite 4 teammates"],
};
