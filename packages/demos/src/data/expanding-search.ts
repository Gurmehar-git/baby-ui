/** A small workspace to search: projects, docs and people. */
export const WORKSPACE_ITEMS = [
	{
		id: "p-atlas",
		title: "Atlas redesign",
		meta: "Project · updated 2h ago",
		group: "Projects",
		keywords: ["website"],
	},
	{
		id: "p-billing",
		title: "Billing migration",
		meta: "Project · 12 open tasks",
		group: "Projects",
	},
	{
		id: "p-onboarding",
		title: "Onboarding flow",
		meta: "Project · shipped",
		group: "Projects",
	},
	{ id: "d-roadmap", title: "Q4 roadmap", meta: "Doc · Product", group: "Docs" },
	{
		id: "d-handbook",
		title: "Engineering handbook",
		meta: "Doc · 48 pages",
		group: "Docs",
		keywords: ["guide"],
	},
	{ id: "d-brand", title: "Brand guidelines", meta: "Doc · Design", group: "Docs" },
	{ id: "u-mira", title: "Mira Okafor", meta: "Design lead", group: "People" },
	{ id: "u-jonas", title: "Jonas Berg", meta: "Platform engineer", group: "People" },
];

export const WORKSPACE_RECENT = WORKSPACE_ITEMS.filter(
	(item) => item.id === "d-roadmap" || item.id === "p-atlas",
);
