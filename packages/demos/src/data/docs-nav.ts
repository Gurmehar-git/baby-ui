/** Sample docs tree for the docs-nav demos; real apps pass their own routes. */
export const DOCS_SECTIONS = [
	{
		id: "overview",
		label: "Overview",
		href: "#overview",
	},
	{
		id: "start",
		label: "Getting started",
		items: [
			{ href: "#introduction", label: "Introduction" },
			{ href: "#installation", label: "Installation" },
			{ href: "#theming", label: "Theming" },
		],
	},
	{
		id: "components",
		label: "Components",
		count: 5,
		items: [
			{ href: "#button", label: "Button" },
			{ href: "#card", label: "Card" },
			{ href: "#dialog", label: "Dialog" },
			{ href: "#tabs", label: "Tabs", badge: "beta" },
			{ href: "#tooltip", label: "Tooltip" },
		],
	},
];
