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
import { useState } from "react";

const groups = [
	{
		id: "status",
		label: "Status",
		options: [
			{ id: "open", label: "Open" },
			{ id: "closed", label: "Closed" },
		],
	},
	{
		id: "owner",
		label: "Owner",
		options: [
			{ id: "me", label: "Me" },
			{ id: "team", label: "My team" },
		],
	},
];

export function Example() {
	const [filters, setFilters] = useState<FilterValue>({});
	return (
		<FilterMenu groups={groups} value={filters} onValueChange={setFilters}>
			<FilterMenuHeader>
				<FilterMenuTitle>Filters</FilterMenuTitle>
				<FilterMenuClear />
			</FilterMenuHeader>
			<FilterMenuChips />
			<FilterMenuGroups />
		</FilterMenu>
	);
}
