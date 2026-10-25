"use client";

import {
	FilterMenu,
	FilterMenuChips,
	FilterMenuClear,
	FilterMenuGroups,
	FilterMenuHeader,
	FilterMenuTitle,
	type FilterValue,
} from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { FILTER_MENU_GROUPS, FILTER_MENU_VALUE } from "../data/filter-menu";
import { controlProps } from "../data/preview-props";

export function FilterMenuDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof FilterMenu>>(props);
	const [filters, setFilters] = useState<FilterValue>(FILTER_MENU_VALUE);
	return (
		<FilterMenu
			groups={FILTER_MENU_GROUPS}
			variant={p.variant}
			value={filters}
			onValueChange={setFilters}
		>
			<FilterMenuHeader>
				<FilterMenuTitle>Filters</FilterMenuTitle>
				<FilterMenuClear />
			</FilterMenuHeader>
			<FilterMenuChips />
			<FilterMenuGroups />
		</FilterMenu>
	);
}
