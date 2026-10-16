<script lang="ts">
import Empty from "../../empty/svelte/empty.svelte";
import EmptyDescription from "../../empty/svelte/empty-description.svelte";
import EmptyHeader from "../../empty/svelte/empty-header.svelte";
import EmptyTitle from "../../empty/svelte/empty-title.svelte";
import { cn } from "../../lib/svelte/cn";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import ToggleGroup from "../../toggle-group/svelte/toggle-group.svelte";
import ToggleGroupItem from "../../toggle-group/svelte/toggle-group-item.svelte";
import {
	combineTotals,
	formatChange,
	formatCompact,
	formatDayTick,
	formatWeekday,
	NPM_STATS_LABELS,
	type NpmPackage,
	type NpmStatsLabels,
	npmFacts,
	rangeTrend,
	trailingSum,
} from "./core";
import NpmDownloadsChart from "./downloads-chart.svelte";
import NpmPackageBreakdown from "./package-breakdown.svelte";
import TrendBadge from "./trend-badge.svelte";
import {
	NPM_STATS_LAYOUT,
	type NpmStatsRange,
	type NpmStatsVariant,
	npmStats,
} from "./variants";

let {
	packages,
	locale,
	labels: labelsProp,
	variant = "default",
	range = $bindable("30d"),
	onRangeChange,
	class: classProp,
}: {
	packages: NpmPackage[];
	locale?: string;
	labels?: Partial<NpmStatsLabels>;
	variant?: NpmStatsVariant;
	/** Bindable window the hero, facts, chart and packages show. */
	range?: NpmStatsRange;
	onRangeChange?: (range: NpmStatsRange) => void;
	class?: string;
} = $props();

const styles = $derived(npmStats({ variant }));
const layout = $derived(NPM_STATS_LAYOUT[variant]);
const labels = $derived({ ...NPM_STATS_LABELS, ...labelsProp });
const totals = $derived(combineTotals(packages));
const rows = $derived(range === "30d" ? totals.last30Days : totals.last90Days);
const periodTotal = $derived(rows.reduce((sum, row) => sum + row.total, 0));
const unit = $derived(range === "30d" ? labels.chartLast30 : labels.chartLast90);
const trend = $derived(
	rangeTrend(
		rows.map((row) => row.total),
		range,
	),
);
const facts = $derived(npmFacts(packages, range));
const compact = (value: number) => formatCompact(value, locale);

function setRange(next: string | string[]) {
	if (next !== "30d" && next !== "90d") return;
	range = next;
	onRangeChange?.(next);
}
</script>

{#snippet figure(value: number, className: string)}
	{#if layout.animate}
		<RollingDigits variant="count" {value} format={compact} durationMs={900} size="default" class={cn("font-bold text-foreground", className)} />
	{:else}
		<span class={className}>{compact(value)}</span>
	{/if}
{/snippet}

<!-- npm downloads: the range total and its trend, the facts behind it, the chart and the packages. -->
<div
	data-slot="npm-stats"
	data-variant={variant}
	data-range={range}
	class={cn(styles.root(), classProp)}
>
	{#if packages.length === 0}
		<Empty variant="outline" size="sm" role="status">
			<EmptyHeader>
				<EmptyTitle>{labels.emptyTitle}</EmptyTitle>
				<EmptyDescription>{labels.emptyDescription}</EmptyDescription>
			</EmptyHeader>
		</Empty>
	{:else}
		<header class={styles.head()}>
			<div class="min-w-0">
				<p class={styles.eyebrow()}>{labels.eyebrow}</p>
				<p class={styles.hero()}>
					{@render figure(periodTotal, styles.heroValue())}
					<span class={styles.heroUnit()}>{unit}</span>
				</p>
				<p class={styles.trendRow()}>
					<TrendBadge change={trend} {locale} newLabel={labels.newLabel} class={styles.trend()} />
					<span class={styles.compare()}>
						{range === "30d" ? labels.compare30 : labels.compare90}
					</span>
				</p>
			</div>
			<ToggleGroup
				type="single"
				value={range}
				onValueChange={setRange}
				label={labels.rangeLabel}
				size="sm"
			>
				<ToggleGroupItem value="30d">{labels.range30}</ToggleGroupItem>
				<ToggleGroupItem value="90d">{labels.range90}</ToggleGroupItem>
			</ToggleGroup>
		</header>

		<dl class={styles.facts()}>
			<div class={styles.fact()}>
				<dt class={styles.factLabel()}>{labels.dailyAverage}</dt>
				<dd class={styles.factValue()}>{compact(facts.dailyAverage)}</dd>
			</div>
			<div class={styles.fact()}>
				<dt class={styles.factLabel()}>{range === "30d" ? labels.peakDay : labels.peakWeek}</dt>
				<dd class={styles.factValue()}>
					{#if facts.peak}
						{compact(facts.peak.value)}
						<span class={styles.factNote()}>{formatDayTick(facts.peak.date, locale)}</span>
					{:else}
						–
					{/if}
				</dd>
			</div>
			<div class={styles.fact()}>
				<dt class={styles.factLabel()}>{labels.busiestWeekday}</dt>
				<dd class={styles.factValue()}>
					{#if facts.weekday}
						{formatWeekday(facts.weekday.day, locale)}
						<span class={styles.factNote()}>
							{labels.overAverage(formatChange(facts.weekday.lift, locale))}
						</span>
					{:else}
						–
					{/if}
				</dd>
			</div>
			<div class={styles.fact()}>
				<dt class={styles.factLabel()}>{labels.fastestGrowing}</dt>
				<dd class={styles.factValue()}>
					{#if facts.leader}
						<span class="font-mono">{facts.leader.name}</span>
						<span class={styles.factNote()}>{formatChange(facts.leader.ratio, locale)}</span>
					{:else}
						–
					{/if}
				</dd>
			</div>
		</dl>

		<NpmDownloadsChart
			data={rows}
			title="{labels.eyebrow} {unit}"
			{locale}
			fillOpacity={variant === "minimal" ? 0 : 0.22}
			grid={layout.grid}
			class={styles.chart()}
		/>

		<dl class={styles.counts()}>
			<div class={styles.count()}>
				<dt class={styles.countLabel()}>{labels.allTime}</dt>
				<dd class="order-first">{@render figure(totals.allTime, styles.countValue())}</dd>
			</div>
			<div class={styles.count()}>
				<dt class={styles.countLabel()}>{labels.last7Days}</dt>
				<dd class="order-first">
					{@render figure(trailingSum(totals.last30Days, 7), styles.countValue())}
				</dd>
			</div>
			<div class={styles.count()}>
				<dt class={styles.countLabel()}>{labels.packages}</dt>
				<dd class="order-first"><span class={styles.countValue()}>{packages.length}</span></dd>
			</div>
		</dl>

		{#if layout.packages}
			<section class={styles.footer()}>
				<h3 class={styles.sectionTitle()}>{labels.breakdownHeading}</h3>
				<NpmPackageBreakdown {packages} {range} {variant} {locale} {labels} />
			</section>
		{/if}
	{/if}
</div>
