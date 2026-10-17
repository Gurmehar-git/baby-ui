"use client";

import {
	OverviewCard,
	OverviewCardChart,
	OverviewCardContent,
	OverviewCardHeader,
	OverviewCardPeriod,
	OverviewCardPeriods,
	OverviewCardTitle,
	OverviewCardTrend,
	OverviewCardValue,
} from "@baby-ui/react";
import { useState } from "react";

const data = [
	{ date: new Date("2026-01-15"), revenue: 2100 },
	{ date: new Date("2026-01-16"), revenue: 2340 },
	{ date: new Date("2026-01-17"), revenue: 2050 },
	{ date: new Date("2026-01-18"), revenue: 2510 },
];

const usd = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
}).format;

export function Example() {
	const [period, setPeriod] = useState("7d");

	return (
		<OverviewCard
			name="Total revenue"
			data={data}
			dataKey="revenue"
			value={9000}
			label="7D"
			trend={19.5}
			formatValue={usd}
		>
			<OverviewCardHeader>
				<OverviewCardTitle>Total revenue</OverviewCardTitle>
				<OverviewCardPeriods value={period} onValueChange={setPeriod}>
					<OverviewCardPeriod value="7d">7D</OverviewCardPeriod>
					<OverviewCardPeriod value="30d">30D</OverviewCardPeriod>
				</OverviewCardPeriods>
			</OverviewCardHeader>
			<OverviewCardContent>
				<OverviewCardValue>
					<OverviewCardTrend />
				</OverviewCardValue>
				<OverviewCardChart />
			</OverviewCardContent>
		</OverviewCard>
	);
}
