<script lang="ts">
import { type Snippet, untrack } from "svelte";
import Area from "../../area-chart/svelte/area.svelte";
import AreaChart from "../../area-chart/svelte/area-chart.svelte";
import Badge from "../../badge/svelte/badge.svelte";
import Button from "../../button/svelte/button.svelte";
import Card from "../../card/svelte/card.svelte";
import CardAction from "../../card/svelte/card-action.svelte";
import CardContent from "../../card/svelte/card-content.svelte";
import CardHeader from "../../card/svelte/card-header.svelte";
import CardTitle from "../../card/svelte/card-title.svelte";
import ChartContainer from "../../chart/svelte/chart-container.svelte";
import { type ChartStatus, type Datum, toDate } from "../../chart/svelte/core";
import { cn } from "../../lib/svelte/cn";
import Line from "../../line-chart/svelte/line.svelte";
import LineChart from "../../line-chart/svelte/line-chart.svelte";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import Skeleton from "../../skeleton/svelte/skeleton.svelte";
import {
	periodTrend,
	type StatCardChartKind,
	type StatCardPositive,
	type StatCardSize,
	type StatCardStatus,
	statCard,
	statSummary,
	trendPath,
	trendSentence,
	trendTone,
} from "./variants";

let {
	title,
	data = [],
	dataKey = "value",
	xKey = "date",
	value,
	label,
	description,
	trend,
	comparisonLabel,
	positive = "up",
	chart = "area",
	size = "default",
	color = "var(--chart-1)",
	locale,
	formatValue,
	formatLabel,
	status = "ready",
	emptyMessage = "No data yet",
	errorMessage = "Couldn't load this metric.",
	onRetry,
	activeIndex = $bindable(null),
	onActiveIndexChange,
	class: className,
	children,
}: {
	/** Card heading; also the chart's accessible name. */
	title: string;
	/** Rows behind the chart; leave empty with `chart="none"`. */
	data?: Datum[];
	dataKey?: string;
	xKey?: string;
	/** Headline at rest, e.g. the period average. */
	value: number;
	/** Caption under the headline at rest, e.g. "Avg". */
	label: string;
	/** Context line under the headline, e.g. "Across all paid plans". */
	description?: string;
	/** Change over the whole period, in percent. */
	trend: number;
	/** What the trend compares against, read after it, e.g. "vs last month". */
	comparisonLabel?: string;
	/** Which direction is good news; "down" for churn, latency or cost. */
	positive?: StatCardPositive;
	chart?: StatCardChartKind;
	size?: StatCardSize;
	/** Series colour; defaults to the first chart slot. */
	color?: string;
	locale?: string;
	formatValue?: (value: number) => string;
	/** Caption for a hovered row. Defaults to the row's short month. */
	formatLabel?: (date: Date) => string;
	/** "empty" and "error" swap the chart for a message; "loading" skeletons the figures. */
	status?: StatCardStatus;
	emptyMessage?: string;
	errorMessage?: string;
	/** Shows a retry button in the error state. */
	onRetry?: () => void;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	class?: string;
	children?: Snippet;
} = $props();

const number = $derived(
	formatValue ?? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format,
);
const month = $derived(new Intl.DateTimeFormat(locale, { month: "short" }));
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
	datum ? (formatLabel ?? ((d: Date) => month.format(d)))(toDate(datum[xKey])) : label,
);
const shownTrend = $derived(
	(datum ? periodTrend(data, activeIndex ?? 0, dataKey) : null) ?? trend,
);
const magnitude = $derived(percent.format(Math.abs(shownTrend) / 100));
const styles = $derived(statCard({ size, chart, status, positive }));
const chartStatus = $derived<ChartStatus>(status === "loading" ? "loading" : "ready");
const summary = $derived(
	statSummary({
		data,
		dataKey,
		xKey,
		formatValue: number,
		formatDate: (v) => month.format(toDate(v)),
	}),
);

// The headline counts only when `value` itself changes; hovering the chart swaps instantly.
let settled = $state(untrack(() => value));
$effect(() => {
	const next = value;
	const id = setTimeout(() => (settled = next), 450);
	return () => clearTimeout(id);
});
const counterMs = $derived(activeIndex === null && value !== settled ? 400 : 0);

// Announce a new resting value, not the first render and not every hovered point.
let announced = $state("");
let first = true;
$effect(() => {
	const text = `${title} ${number(value)}`;
	if (first) {
		first = false;
		return;
	}
	announced = text;
});
const config = $derived({ [dataKey]: { label: title, color } });
const margin = { top: 4, right: 0, bottom: 0, left: 0 };

function setActive(index: number | null) {
	activeIndex = index;
	onActiveIndexChange?.(index);
}
</script>

<Card data-slot="stat-card" class={cn(styles.root(), className)}>
	<CardHeader class={styles.header()}>
		<CardTitle class={styles.title()}>{title}</CardTitle>
		<CardAction>
			{#if status === "loading"}
				<Skeleton class="h-5 w-14 rounded-full" />
			{:else if status === "ready"}
				<Badge variant={trendTone(shownTrend, positive)} size="sm" class="tabular-nums">
					<svg aria-hidden="true" viewBox="0 0 12 12" class="size-3" fill="none">
						<path
							d={trendPath(shownTrend)}
							stroke="currentColor"
							stroke-width={1.5}
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<span aria-hidden="true">{percent.format(shownTrend / 100)}</span>
					<span class={styles.srOnly()}>{trendSentence(shownTrend, magnitude, comparisonLabel)}</span>
				</Badge>
			{/if}
		</CardAction>
	</CardHeader>
	<CardContent class={styles.body()}>
		{#if status === "loading"}
			<div class={styles.headline()} aria-busy="true">
				<Skeleton class="h-7 w-28" />
				<Skeleton class="h-3 w-20" />
			</div>
		{:else if status === "empty"}
			<p class={styles.message()}>{emptyMessage}</p>
		{:else if status === "error"}
			<div class={styles.message()} role="alert">
				<p>{errorMessage}</p>
				{#if onRetry}
					<Button size="sm" variant="outline" onclick={onRetry}>Retry</Button>
				{/if}
			</div>
		{:else}
			<div class={styles.headline()}>
				<RollingDigits
					variant="count"
					value={shownValue}
					format={number}
					size="sm"
					durationMs={counterMs}
					startOnView={false}
					class="font-bold text-foreground"
				/>
				<span class={styles.label()}>{shownLabel}</span>
				<span class={styles.srOnly()} aria-live="polite">{announced}</span>
			</div>
		{/if}
		{#if description && status !== "empty" && status !== "error"}
			<p class={styles.description()}>{description}</p>
		{/if}
		{#if chart !== "none"}
		<div class={styles.chart()}>
			<ChartContainer {config} {title} description={summary} aspect="auto" {locale}>
				{#if chart === "line"}
					<LineChart
						{data}
						{xKey}
						{margin}
						status={chartStatus}
						bind:activeIndex={() => activeIndex, setActive}
					>
						<Line {dataKey} curve="monotone" strokeWidth={2} />
						{@render children?.()}
					</LineChart>
				{:else}
					<AreaChart
						{data}
						{xKey}
						{margin}
						status={chartStatus}
						bind:activeIndex={() => activeIndex, setActive}
					>
						<Area {dataKey} curve="monotone" fillOpacity={0.45} />
						{@render children?.()}
					</AreaChart>
				{/if}
			</ChartContainer>
		</div>
		{/if}
	</CardContent>
</Card>
