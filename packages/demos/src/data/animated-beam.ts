const mark = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

/** The app at the centre, then the services it syncs with. */
export const INTEGRATION_NODES = [
	{ id: "app", label: "Your app", src: "/logo.svg" },
	{ id: "slack", label: "Slack", src: mark("slack") },
	{ id: "github", label: "GitHub", src: mark("github") },
	{ id: "linear", label: "Linear", src: mark("linear") },
	{ id: "notion", label: "Notion", src: mark("notion") },
	{ id: "stripe", label: "Stripe", src: mark("stripe") },
	{ id: "figma", label: "Figma", src: mark("figma") },
	{ id: "postgres", label: "PostgreSQL", src: mark("postgresql") },
];

/** Every service feeds the app; Stripe and PostgreSQL also receive, so their pulses run back. */
export const INTEGRATION_BEAMS = INTEGRATION_NODES.slice(1).map((node, i) => ({
	from: node.id,
	to: "app",
	delay: i * 450,
	duration: 3200 + (i % 3) * 400,
	reverse: node.id === "stripe" || node.id === "postgres",
}));
