"use client";

import { ChartContainer, WaffleChart } from "@baby-ui/react";

const data = [
	{ name: "done", value: 62 },
	{ name: "todo", value: 38 },
];
const config = {
	done: { label: "Done", color: "var(--chart-1)" },
	todo: { label: "To do", color: "var(--chart-2)" },
};

export function Example() {
	return (
		<ChartContainer config={config} title="Sprint progress" aspect="square">
			<WaffleChart data={data} />
		</ChartContainer>
	);
}
