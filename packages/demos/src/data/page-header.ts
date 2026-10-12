import { avatar } from "./media";

/** Sample project page for the page header demos. */
export const PAGE_HEADER = {
	title: "Checkout redesign",
	description:
		"Saved cards, a single review step and a staged rollout starting October 14.",
	breadcrumbs: [
		{ label: "Northline", href: "#" },
		{ label: "Projects", href: "#" },
		{ label: "Checkout redesign" },
	],
	status: { label: "On track", variant: "success" as const },
	avatars: [5, 12, 23, 33, 44].map((index) => ({ src: avatar(index) })),
	tabs: [
		{ value: "overview", label: "Overview" },
		{ value: "issues", label: "Issues", count: 9 },
		{ value: "updates", label: "Updates", count: 4 },
		{ value: "files", label: "Files", count: 8 },
	],
};

const lines = (prefix: string) =>
	Array.from({ length: 10 }, (_, index) => `${prefix} ${index + 1}`);

export const PAGE_PANELS = [
	{ value: "overview", lines: lines("Milestone note") },
	{ value: "issues", lines: lines("Open issue") },
	{ value: "updates", lines: lines("Status update") },
	{ value: "files", lines: lines("Shared file") },
];
