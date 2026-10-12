/** Electricity generation share by source, for the waffle demo; two years to morph between. */
export const ENERGY_MIX_2015 = [
	{ name: "coal", value: 39 },
	{ name: "gas", value: 23 },
	{ name: "renewables", value: 23 },
	{ name: "nuclear", value: 11 },
	{ name: "other", value: 4 },
];

export const ENERGY_MIX_2024 = [
	{ name: "coal", value: 34 },
	{ name: "gas", value: 22 },
	{ name: "renewables", value: 32 },
	{ name: "nuclear", value: 9 },
	{ name: "other", value: 3 },
];

export const ENERGY_MIX_CONFIG = {
	coal: { label: "Coal", color: "var(--chart-1)" },
	gas: { label: "Gas", color: "var(--chart-2)" },
	renewables: { label: "Renewables", color: "var(--chart-3)" },
	nuclear: { label: "Nuclear", color: "var(--chart-4)" },
	other: { label: "Other", color: "var(--chart-5)" },
};
