/** Annual revenue by region, country and plan, in thousands, with year-over-year growth in percent. */
export const REVENUE_TREE = {
	id: "all",
	label: "Revenue",
	children: [
		{
			id: "na",
			label: "North America",
			children: [
				{
					id: "us",
					label: "United States",
					children: [
						{ id: "us-team", label: "Team", value: 1840, color: 18 },
						{ id: "us-pro", label: "Pro", value: 1210, color: 9 },
						{ id: "us-ent", label: "Enterprise", value: 2380, color: 24 },
					],
				},
				{
					id: "ca",
					label: "Canada",
					children: [
						{ id: "ca-team", label: "Team", value: 410, color: 12 },
						{ id: "ca-pro", label: "Pro", value: 260, color: 4 },
					],
				},
			],
		},
		{
			id: "eu",
			label: "Europe",
			children: [
				{
					id: "de",
					label: "Germany",
					children: [
						{ id: "de-team", label: "Team", value: 720, color: 15 },
						{ id: "de-ent", label: "Enterprise", value: 940, color: 21 },
					],
				},
				{
					id: "uk",
					label: "United Kingdom",
					children: [
						{ id: "uk-team", label: "Team", value: 610, color: -3 },
						{ id: "uk-pro", label: "Pro", value: 380, color: 2 },
					],
				},
				{
					id: "fr",
					label: "France",
					children: [{ id: "fr-team", label: "Team", value: 420, color: 7 }],
				},
			],
		},
		{
			id: "apac",
			label: "Asia Pacific",
			children: [
				{
					id: "jp",
					label: "Japan",
					children: [
						{ id: "jp-team", label: "Team", value: 530, color: 28 },
						{ id: "jp-ent", label: "Enterprise", value: 690, color: 33 },
					],
				},
				{
					id: "au",
					label: "Australia",
					children: [{ id: "au-team", label: "Team", value: 310, color: 11 }],
				},
				{
					id: "in",
					label: "India",
					children: [{ id: "in-pro", label: "Pro", value: 280, color: 41 }],
				},
			],
		},
	],
};
