import type { FilterGroup } from "../../../../components/filter-menu/filters";

export const FILTER_MENU_GROUPS: FilterGroup[] = [
	{
		id: "status",
		label: "Status",
		options: [
			{ id: "new", label: "New" },
			{ id: "contacted", label: "Contacted" },
			{ id: "qualified", label: "Qualified" },
			{ id: "lost", label: "Lost" },
		],
	},
	{
		id: "score",
		label: "Lead score",
		chipPrefix: "Score: ",
		options: [
			{ id: "90", label: "90 and up" },
			{ id: "70", label: "70 to 89" },
			{ id: "50", label: "50 to 69" },
		],
	},
	{
		id: "region",
		label: "Region",
		options: [
			{ id: "na", label: "North America" },
			{ id: "eu", label: "Europe" },
			{ id: "apac", label: "Asia Pacific" },
		],
	},
	{
		id: "source",
		label: "Source",
		options: [
			{ id: "inbound", label: "Inbound" },
			{ id: "referral", label: "Referral" },
			{ id: "event", label: "Event" },
		],
	},
];

export const FILTER_MENU_VALUE = { status: ["qualified"], score: ["90"] };
