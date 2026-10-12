"use client";

import { ChartContainer, TreemapChart } from "@baby-ui/react";

const data = {
	id: "all",
	label: "Storage",
	children: [
		{ id: "photos", label: "Photos", value: 48 },
		{ id: "video", label: "Video", value: 31 },
		{ id: "docs", label: "Documents", value: 12 },
	],
};

export function Example() {
	return (
		<ChartContainer config={{}} title="Storage by type">
			<TreemapChart data={data} />
		</ChartContainer>
	);
}
