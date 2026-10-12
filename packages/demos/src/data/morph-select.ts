/** Time zones grouped by region, with their UTC offsets. */
export const TIME_ZONES = [
	{
		label: "Americas",
		options: [
			{ value: "america/los_angeles", label: "Los Angeles", meta: "UTC−8" },
			{ value: "america/denver", label: "Denver", meta: "UTC−7" },
			{ value: "america/chicago", label: "Chicago", meta: "UTC−6" },
			{ value: "america/new_york", label: "New York", meta: "UTC−5" },
			{ value: "america/sao_paulo", label: "São Paulo", meta: "UTC−3" },
		],
	},
	{
		label: "Europe and Africa",
		options: [
			{ value: "europe/london", label: "London", meta: "UTC+0" },
			{ value: "europe/zurich", label: "Zurich", meta: "UTC+1" },
			{ value: "africa/cairo", label: "Cairo", meta: "UTC+2" },
		],
	},
	{
		label: "Asia and Pacific",
		options: [
			{ value: "asia/kolkata", label: "Kolkata", meta: "UTC+5:30" },
			{ value: "asia/singapore", label: "Singapore", meta: "UTC+8" },
			{ value: "asia/tokyo", label: "Tokyo", meta: "UTC+9" },
			{ value: "australia/sydney", label: "Sydney", meta: "UTC+10" },
		],
	},
];
