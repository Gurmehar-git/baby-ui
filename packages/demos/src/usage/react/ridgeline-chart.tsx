"use client";

import { ChartContainer, RidgelineChart } from "@baby-ui/react";

const series = [
	{ id: "eu", label: "Europe", values: [120, 135, 128, 142, 150, 131, 126] },
	{ id: "us", label: "US East", values: [98, 104, 110, 101, 96, 108, 115] },
	{ id: "ap", label: "Singapore", values: [180, 172, 195, 188, 176, 201, 190] },
];

export function Example() {
	return (
		<ChartContainer config={{}} title="Response time by region">
			<RidgelineChart series={series} unit=" ms" />
		</ChartContainer>
	);
}
