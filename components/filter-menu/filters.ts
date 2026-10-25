export type FilterOption = { id: string; label: string };
export type FilterGroup = {
	id: string;
	label: string;
	options: FilterOption[];
	/** Put before the option on its chip, e.g. "Score: " gives "Score: 80 to 90". */
	chipPrefix?: string;
};
/** Picked option ids, by group id. */
export type FilterValue = Record<string, string[]>;

/** The picked options in group order, as chips. */
export function filterChips(groups: FilterGroup[], value: FilterValue) {
	return groups.flatMap((group) =>
		group.options
			.filter((option) => value[group.id]?.includes(option.id))
			.map((option) => ({
				group: group.id,
				option: option.id,
				label: `${group.chipPrefix ?? ""}${option.label}`,
			})),
	);
}

export function toggleFilter(
	value: FilterValue,
	group: string,
	option: string,
	on: boolean,
) {
	const current = value[group] ?? [];
	const next = on
		? [...new Set([...current, option])]
		: current.filter((o) => o !== option);
	return { ...value, [group]: next };
}
