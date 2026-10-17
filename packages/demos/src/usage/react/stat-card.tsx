"use client";

import {
	StatCard,
	StatCardChart,
	StatCardContent,
	StatCardHeader,
	StatCardTitle,
	StatCardTrend,
	StatCardValue,
} from "@baby-ui/react";

const data = [
	{ date: new Date("2026-01-15"), revenue: 48200 },
	{ date: new Date("2026-02-15"), revenue: 51900 },
	{ date: new Date("2026-03-15"), revenue: 50400 },
	{ date: new Date("2026-04-15"), revenue: 57300 },
];

const usd = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
}).format;

export function Example() {
	return (
		<StatCard
			name="Total revenue"
			data={data}
			dataKey="revenue"
			value={51950}
			label="Monthly average"
			trend={18.9}
			comparisonLabel="vs last quarter"
			formatValue={usd}
		>
			<StatCardHeader>
				<StatCardTitle>Total revenue</StatCardTitle>
				<StatCardTrend />
			</StatCardHeader>
			<StatCardContent>
				<StatCardValue />
				<StatCardChart />
			</StatCardContent>
		</StatCard>
	);
}
