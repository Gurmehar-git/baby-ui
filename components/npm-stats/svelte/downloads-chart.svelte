<script lang="ts">
import { Area, AreaChart } from "../../area-chart/svelte";
import {
	CartesianGrid,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	XAxis,
	YAxis,
} from "../../chart/svelte";
import { formatCompact, formatDayTick, isWeekLabel, weekToDate } from "../core";

let {
	data,
	label = "Downloads",
	title = label,
	locale,
	fillOpacity = 0.24,
	grid = true,
	class: classProp,
}: {
	/** Pre-aggregated rows (`{ date, total }`): daily `YYYY-MM-DD` or weekly `'YYWww`. */
	data: Array<{ date: string; total: number }>;
	/** Series name in the tooltip. */
	label?: string;
	/** Accessible name of the chart, e.g. `Downloads in the last 30 days`. */
	title?: string;
	locale?: string;
	/** Area fill under the line; `0` draws the line alone. */
	fillOpacity?: number;
	grid?: boolean;
	class?: string;
} = $props();

const weekly = $derived(data[0] ? isWeekLabel(data[0].date) : false);
const rows = $derived(
	data.map((row) => ({ date: weekToDate(row.date), total: row.total })),
);
const config = $derived({ total: { label, color: "var(--chart-1)" } });

function dateLabel(value: unknown): string {
	return value instanceof Date ? formatDayTick(value, locale) : "";
}
</script>

<!-- One total line: per-package lines would need a legend the package list already is. -->
<ChartContainer {config} {title} {locale} aspect="wide" class={classProp}>
	<AreaChart data={rows} xKey="date">
		{#if grid}
			<CartesianGrid />
		{/if}
		<YAxis tickFormatter={(value) => formatCompact(Number(value), locale)} />
		<XAxis tickFormatter={dateLabel} />
		<!-- Monotone never overshoots between points, so a quiet weekend can't dip below zero. -->
		<Area dataKey="total" variant="gradient" curve="monotone" line {fillOpacity} />
		<ChartTooltip>
			{#snippet content()}
				<ChartTooltipContent>
					{#snippet formatter({ value })}
						{formatCompact(value, locale)}
					{/snippet}
					{#snippet labelFormatter({ datum })}
						{(weekly ? "Week of " : "") + dateLabel((datum as { date?: unknown }).date)}
					{/snippet}
				</ChartTooltipContent>
			{/snippet}
		</ChartTooltip>
	</AreaChart>
</ChartContainer>
