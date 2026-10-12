"use client";

import { ExpandingSearch, type ExpandingSearchItem } from "@baby-ui/react";

export function Example({
	items,
	open,
}: {
	items: ExpandingSearchItem[];
	open: (item: ExpandingSearchItem) => void;
}) {
	return (
		<ExpandingSearch label="Search projects and docs" items={items} onSelect={open} />
	);
}
