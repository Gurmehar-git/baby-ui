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
import { type ComponentProps, useState } from "react";
import { REVENUE_BY_PERIOD, REVENUE_PERIODS } from "../data/overview";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const currency = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
}).format;

export function OverviewCardDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof OverviewCard>>(props);
	const [period, setPeriod] = useState("30d");
	const reading = REVENUE_BY_PERIOD[period as keyof typeof REVENUE_BY_PERIOD];

	return (
		<div className="w-full max-w-lg">
			<OverviewCard
				name="Total revenue"
				data={reading.data}
				dataKey="revenue"
				value={reading.total}
				label={REVENUE_PERIODS.find((p) => p.value === period)?.label ?? ""}
				trend={reading.trend}
				chart={p.chart ?? "area"}
				size={p.size ?? "default"}
				formatValue={currency}
			>
				<OverviewCardHeader>
					<OverviewCardTitle>Total revenue</OverviewCardTitle>
					<OverviewCardPeriods value={period} onValueChange={setPeriod}>
						{REVENUE_PERIODS.map((option) => (
							<OverviewCardPeriod key={option.value} value={option.value}>
								{option.label}
							</OverviewCardPeriod>
						))}
					</OverviewCardPeriods>
				</OverviewCardHeader>
				<OverviewCardContent>
					<OverviewCardValue>
						<OverviewCardTrend />
					</OverviewCardValue>
					<OverviewCardChart />
				</OverviewCardContent>
			</OverviewCard>
		</div>
	);
}
