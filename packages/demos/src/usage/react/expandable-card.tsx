"use client";

import { ExpandableCard } from "@baby-ui/react";

export function Example() {
	return (
		<ExpandableCard
			title="Order #1042"
			description="Shipped · arrives Friday"
			width={320}
			expandedWidth={420}
		>
			Tracking, items and the delivery address go here.
		</ExpandableCard>
	);
}
