<script lang="ts">
import type { Snippet } from "svelte";
import Area from "../../area-chart/svelte/area.svelte";
import AreaChart from "../../area-chart/svelte/area-chart.svelte";
import Badge from "../../badge/svelte/badge.svelte";
import Card from "../../card/svelte/card.svelte";
import CardAction from "../../card/svelte/card-action.svelte";
import CardContent from "../../card/svelte/card-content.svelte";
import CardDescription from "../../card/svelte/card-description.svelte";
import CardHeader from "../../card/svelte/card-header.svelte";
import CardTitle from "../../card/svelte/card-title.svelte";
import { type ChartStatus, type Datum, toDate } from "../../chart/core";
import ChartContainer from "../../chart/svelte/chart-container.svelte";
import { cn } from "../../lib/cn";
import Line from "../../line-chart/svelte/line.svelte";
import LineChart from "../../line-chart/svelte/line-chart.svelte";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import ToggleGroup from "../../toggle-group/svelte/toggle-group.svelte";
import ToggleGroupItem from "../../toggle-group/svelte/toggle-group-item.svelte";
import { type OverviewCardChart, type OverviewCardSize, overviewCard } from "../variants";

let {
	title,
	description,
	data,
	dataKey,
	xKey = "date",
	value,
	label,
	trend,
	chart = "area",
	size = "default",
	color = "var(--chart-1)",
	periods,
	period = $bindable(periods?.[0]?.value),
	onPeriodChange,
	locale,
	formatValue,
	formatLabel,
	status = "ready",
	activeIndex = $bindable(null),
	onActiveIndexChange,
	class: className,
	children,
}: {
	title: string;
	description?: string;
	data: Datum[];
	dataKey: string;
	xKey?: string;
	/** Headline at rest, e.g. the period total. */
	value: number;
	/** Caption under the headline at rest, e.g. "This month". */
	label: string;
	/** Change over the whole period, in percent. */
	trend: number;
	chart?: OverviewCardChart;
	size?: OverviewCardSize;
	/** Series colour; defaults to the first chart slot. */
	color?: string;
	/** Period switcher options; omit to hide the toggle entirely. */
	periods?: { value: string; label: string }[];
	period?: string;
	onPeriodChange?: (period: string) => void;
	locale?: string;
	formatValue?: (value: number) => string;
	/** Caption for a hovered point. Defaults to the point's short date. */
	formatLabel?: (date: Date) => string;
	status?: ChartStatus;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	class?: string;
	children?: Snippet;
} = $props();

const number = $derived(
	formatValue ?? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format,
);
const day = $derived(new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }));
const percent = $derived(
	new Intl.NumberFormat(locale, {
		style: "percent",
		maximumFractionDigits: 1,
		signDisplay: "exceptZero",
	}),
);
const datum = $derived(activeIndex !== null ? data[activeIndex] : undefined);
const shownValue = $derived.by(() => {
	const hovered = datum?.[dataKey];
	return typeof hovered === "number" ? hovered : value;
});
const shownLabel = $derived(
	datum ? (formatLabel ?? ((d: Date) => day.format(d)))(toDate(datum[xKey])) : label,
);
const up = $derived(trend >= 0);
const styles = $derived(overviewCard({ size, chart }));
const config = $derived({ [dataKey]: { label: title, color } });
const margin = { top: 8, right: 0, bottom: 0, left: 0 };

function setActive(index: number | null) {
	activeIndex = index;
	onActiveIndexChange?.(index);
}

function setPeriod(next: string) {
	period = next;
	onPeriodChange?.(next);
}
</script>

<Card data-slot="overview-card" class={cn(styles.root(), className)}>
	<CardHeader class={styles.header()}>
		<div>
			<CardTitle class={styles.title()}>{title}</CardTitle>
			{#if description}
				<CardDescription class={styles.description()}>{description}</CardDescription>
			{/if}
		</div>
		{#if periods && periods.length > 0}
			<CardAction>
				<ToggleGroup
					type="single"
					size="sm"
					bind:value={() => period ?? "", (v) => setPeriod(v as string)}
					label="{title} period"
				>
					{#each periods as p (p.value)}
						<ToggleGroupItem value={p.value}>{p.label}</ToggleGroupItem>
					{/each}
				</ToggleGroup>
			</CardAction>
		{/if}
	</CardHeader>
	<CardContent class={styles.body()}>
		<div class={styles.headline()}>
			<RollingDigits variant="count" value={shownValue} format={number} size="lg" durationMs={400} startOnView={false} class="font-bold text-foreground" />
			<span class={styles.label()}>{shownLabel}</span>
			<Badge variant={up ? "success" : "destructive"} size="sm">
				<svg aria-hidden="true" viewBox="0 0 12 12" class="size-3" fill="none">
					<path
						d={up ? "M3 9 9 3M4.5 3H9v4.5" : "M3 3l6 6M9 4.5V9H4.5"}
						stroke="currentColor"
						stroke-width={1.5}
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				{percent.format(trend / 100)}
			</Badge>
		</div>
		<div class={styles.chart()}>
			<ChartContainer {config} {title} aspect="auto" {locale}>
				{#if chart === "line"}
					<LineChart {data} {xKey} {margin} {status} bind:activeIndex={() => activeIndex, setActive}>
						<Line {dataKey} curve="monotone" strokeWidth={2} />
						{@render children?.()}
					</LineChart>
				{:else}
					<AreaChart {data} {xKey} {margin} {status} bind:activeIndex={() => activeIndex, setActive}>
						<Area {dataKey} curve="monotone" fillOpacity={0.35} />
						{@render children?.()}
					</AreaChart>
				{/if}
			</ChartContainer>
		</div>
	</CardContent>
</Card>
