import { getContext, hasContext, setContext } from "svelte";
import type { FilterGroup, FilterValue } from "../filters";
import type { filterMenu } from "../variants";

export interface FilterMenuState {
	readonly groups: FilterGroup[];
	readonly value: FilterValue;
	readonly open: string[];
	readonly styles: ReturnType<typeof filterMenu>;
	setValue(next: FilterValue): void;
	setOpen(next: string[]): void;
}

const KEY = Symbol("filter-menu");

/** The root's state behind getters, so every part reads the latest value. */
export const setFilterMenu = (state: FilterMenuState) => setContext(KEY, state);
export function filterMenuState(part: string): FilterMenuState {
	if (!hasContext(KEY)) throw new Error(`${part} must be used inside <FilterMenu>`);
	return getContext<FilterMenuState>(KEY);
}
