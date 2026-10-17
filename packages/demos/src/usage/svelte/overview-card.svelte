<script lang="ts">
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
} from "@baby-ui/svelte";

const data = [
	{ date: new Date("2026-01-15"), revenue: 2100 },
	{ date: new Date("2026-01-16"), revenue: 2340 },
	{ date: new Date("2026-01-17"), revenue: 2050 },
	{ date: new Date("2026-01-18"), revenue: 2510 },
];

let period = $state("7d");

const usd = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
}).format;
</script>

<OverviewCard
	name="Total revenue"
	{data}
	dataKey="revenue"
	value={9000}
	label="7D"
	trend={19.5}
	formatValue={usd}
>
	<OverviewCardHeader>
		<OverviewCardTitle>Total revenue</OverviewCardTitle>
		<OverviewCardPeriods bind:value={period}>
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
