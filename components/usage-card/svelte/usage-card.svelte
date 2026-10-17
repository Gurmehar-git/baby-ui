<script lang="ts">
import Badge from "../../badge/svelte/badge.svelte";
import Card from "../../card/svelte/card.svelte";
import CardAction from "../../card/svelte/card-action.svelte";
import CardContent from "../../card/svelte/card-content.svelte";
import CardDescription from "../../card/svelte/card-description.svelte";
import CardHeader from "../../card/svelte/card-header.svelte";
import CardTitle from "../../card/svelte/card-title.svelte";
import type { Datum } from "../../chart/core";
import ChartContainer from "../../chart/svelte/chart-container.svelte";
import ChartLegendContent from "../../chart/svelte/chart-legend-content.svelte";
import type { ChartConfig } from "../../chart/svelte/context";
import { cn } from "../../lib/cn";
import RingChart from "../../ring-chart/svelte/ring-chart.svelte";
import type { RingCap } from "../../ring-chart/variants";
import { meterLayout, meterNumber, meterTone } from "../meter";
import { type UsageCardLayout, usageCard } from "../variants";
import UsageMeter from "./usage-meter.svelte";

let {
	title,
	description,
	data,
	config,
	dataKey = "value",
	maxKey = "max",
	nameKey = "name",
	layout = "side",
	cap = "round",
	centerLabel,
	limit,
	unit = "",
	decimals = 1,
	warnAt = 0.9,
	freeLabel = "Free",
	overLabel = "Over limit",
	locale,
	activeIndex = $bindable(null),
	onActiveIndexChange,
	class: className,
}: {
	title: string;
	description?: string;
	data: Datum[];
	/** Label and colour per ring, keyed by `nameKey`. */
	config: ChartConfig;
	/** Key holding each ring's value. */
	dataKey?: string;
	/** Key holding each ring's maximum; missing or non-positive maxima count as 100. */
	maxKey?: string;
	/** Key holding each ring's name; matches `config` keys. */
	nameKey?: string;
	layout?: UsageCardLayout;
	cap?: RingCap;
	centerLabel?: string;
	/** Meter layout: the plan allowance every row shares, in the rows' unit. */
	limit?: number;
	/** Meter layout: unit after each amount, e.g. "GB". */
	unit?: string;
	/** Meter layout: digits after the decimal point. */
	decimals?: number;
	/** Meter layout: share of the limit at which the badge warns it is almost full. */
	warnAt?: number;
	freeLabel?: string;
	overLabel?: string;
	locale?: string;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	class?: string;
} = $props();

const styles = $derived(usageCard({ layout }));
const uid = $props.id();
const chartId = `usage-${uid}`;
const segments = $derived(
	data.map((row) => {
		const value = row[dataKey];
		return {
			key: String(row[nameKey] ?? ""),
			value: typeof value === "number" ? value : 0,
		};
	}),
);
const meterLimit = $derived(limit ?? segments.reduce((sum, s) => sum + s.value, 0));
const meter = $derived(meterLayout(segments, meterLimit, warnAt));
const amount = (value: number) =>
	`${meterNumber(value, decimals, locale)}${unit ? ` ${unit}` : ""}`;
const badge = $derived(
	meter.status === "over"
		? `${amount(meter.over)} over`
		: meter.status === "near"
			? "Almost full"
			: `${amount(meter.free)} free`,
);

function setActive(index: number | null) {
	activeIndex = index;
	onActiveIndexChange?.(index);
}
</script>

<Card data-slot="usage-card" class={cn(styles.root(), className)}>
	<CardHeader class={styles.header()}>
		<CardTitle class={styles.title()}>{title}</CardTitle>
		{#if description}
			<CardDescription class={styles.description()}>{description}</CardDescription>
		{/if}
		{#if layout === "meter"}
			<CardAction>
				<Badge variant={meterTone[meter.status]} size="sm" class="tabular-nums">{badge}</Badge>
			</CardAction>
		{/if}
	</CardHeader>
	<CardContent class={styles.body()}>
		{#if layout === "meter"}
			<UsageMeter
				id={chartId}
				{title}
				{config}
				layout={meter}
				limit={meterLimit}
				{unit}
				{decimals}
				{freeLabel}
				{overLabel}
				{locale}
				{activeIndex}
				onActiveIndexChange={setActive}
				{styles}
			/>
		{:else}
		<ChartContainer {config} {title} aspect="auto" {locale} class={styles.chart()}>
			<RingChart
				{data}
				{dataKey}
				{maxKey}
				{nameKey}
				{cap}
				{centerLabel}
				bind:activeIndex={() => activeIndex, setActive}
				class={styles.plot()}
			/>
			<ChartLegendContent align="start" class={styles.legend()} />
		</ChartContainer>
		{/if}
	</CardContent>
</Card>
