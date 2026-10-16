<script lang="ts">
import Badge from "../../badge/svelte/badge.svelte";
import { Bar, BarChart, BarTooltip, BarXAxis, BarYAxis } from "../../bar-chart/svelte";
import {
	CartesianGrid,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	XAxis,
	YAxis,
} from "../../chart/svelte";
import Empty from "../../empty/svelte/empty.svelte";
import EmptyDescription from "../../empty/svelte/empty-description.svelte";
import EmptyHeader from "../../empty/svelte/empty-header.svelte";
import EmptyTitle from "../../empty/svelte/empty-title.svelte";
import { cn } from "../../lib/svelte/cn";
import { Line, LineChart } from "../../line-chart/svelte";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import Tabs from "../../tabs/svelte/tabs.svelte";
import TabsContent from "../../tabs/svelte/tabs-content.svelte";
import TabsList from "../../tabs/svelte/tabs-list.svelte";
import TabsTrigger from "../../tabs/svelte/tabs-trigger.svelte";
import {
	averagePerDay,
	bestDay,
	currentStars,
	firstStarDate,
	formatChange,
	formatCompact,
	formatDate,
	gainSeries,
	lastStarDate,
	recentGain,
	STAR_HISTORY_LABELS,
	type StarHistoryData,
	type StarHistoryLabels,
	starMilestones,
} from "./core";
import {
	STAR_HISTORY_LAYOUT,
	type StarHistoryMode,
	type StarHistoryVariant,
	starHistory,
} from "./variants";

let {
	history,
	locale,
	variant = "default",
	mode = $bindable("cumulative"),
	onModeChange,
	labels: labelsProp,
	class: classProp,
}: {
	history: StarHistoryData;
	locale?: string;
	variant?: StarHistoryVariant;
	/** Bindable: the running total, or stars gained per bucket. */
	mode?: StarHistoryMode;
	onModeChange?: (mode: StarHistoryMode) => void;
	labels?: Partial<StarHistoryLabels>;
	class?: string;
} = $props();

const SHORT_DATE: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
const FULL_DATE: Intl.DateTimeFormatOptions = {
	month: "short",
	day: "numeric",
	year: "numeric",
};

const labels = $derived({ ...STAR_HISTORY_LABELS, ...labelsProp });
const styles = $derived(starHistory({ variant }));
const layout = $derived(STAR_HISTORY_LAYOUT[variant]);
const data = $derived(history.data);
const total = $derived(currentStars(data));
const recent = $derived(recentGain(data));
const best = $derived(bestDay(data));
const milestones = $derived(starMilestones(data));
const first = $derived(firstStarDate(data));
const lastStar = $derived(lastStarDate(data));
const lineRows = $derived(data.map((row) => ({ date: row.date, stars: row.stars })));
const gains = $derived(gainSeries(data));
const gainLabel = $derived(
	gains.unit === "week" ? labels.seriesPerWeek : labels.seriesPerDay,
);
// Week labels carry the year: a multi-year span would repeat "Dec 1".
const gainRows = $derived(
	gains.rows.map((row) => ({
		label: formatDate(
			row.date,
			locale,
			gains.unit === "week"
				? { month: "short", day: "numeric", year: "2-digit" }
				: SHORT_DATE,
		),
		gained: row.stars,
	})),
);
const trendVariant = $derived(
	recent.ratio === null || recent.ratio === 0
		? "secondary"
		: recent.ratio > 0
			? "success"
			: "destructive",
);
const trendPath = $derived(
	trendVariant === "success"
		? "M6 9.5v-7M3 5.5l3-3 3 3"
		: trendVariant === "destructive"
			? "M6 2.5v7M3 6.5l3 3 3-3"
			: "M2.5 6h7",
);
const compact = (value: number) => formatCompact(value, locale);

function setMode(next: string) {
	if (next !== "cumulative" && next !== "daily") return;
	mode = next;
	onModeChange?.(next);
}

function monthTick(value: unknown): string {
	return value instanceof Date
		? formatDate(value, locale, { month: "short", year: "2-digit" })
		: "";
}

function fullDate(value: unknown): string {
	return value instanceof Date ? formatDate(value, locale, FULL_DATE) : "";
}
</script>

<!-- GitHub stars: the total and its trend, milestones, and the running total or the gain per bucket. -->
<div
	data-slot="star-history"
	data-variant={variant}
	data-mode={mode}
	class={cn(styles.root(), classProp)}
>
	<Tabs bind:value={() => mode, setMode} variant="segment" size="sm">
		<header class={styles.head()}>
			<div class="min-w-0">
				<p class={styles.repo()}>
					<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class={styles.repoIcon()}>
						<path d="m12 2.5 2.9 6 6.6.8-4.9 4.5 1.3 6.6L12 17.2l-5.9 3.2 1.3-6.6-4.9-4.5 6.6-.8Z" />
					</svg>
					<span class={styles.repoName()} title={history.repo}>{history.repo}</span>
				</p>
				<p class={styles.hero()}>
					{#if layout.animate}
						<RollingDigits variant="count" value={total} format={compact} durationMs={900} size="default" class={cn("font-bold text-foreground", styles.heroValue())} />
					{:else}
						<span class={styles.heroValue()}>{compact(total)}</span>
					{/if}
					<span class={styles.heroUnit()}>{labels.subhead}</span>
				</p>
				{#if data.length > 0}
					<p class={styles.trendRow()}>
						<Badge size="sm" variant={trendVariant} class={styles.trend()}>
							<svg
								viewBox="0 0 12 12"
								fill="none"
								stroke="currentColor"
								stroke-width="1.75"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<path d={trendPath} />
							</svg>
							{recent.ratio === null ? labels.newLabel : formatChange(recent.ratio, locale)}
						</Badge>
						<span class={styles.compare()}>{labels.compare}</span>
					</p>
				{/if}
			</div>
			{#if data.length > 0}
				<TabsList aria-label={labels.modeLabel}>
					<TabsTrigger value="cumulative">{labels.modeCumulative}</TabsTrigger>
					<TabsTrigger value="daily">{labels.modeDaily}</TabsTrigger>
				</TabsList>
			{/if}
		</header>

		{#if data.length === 0}
			<div class={styles.chart()}>
				<Empty variant="outline" size="sm" role="status">
					<EmptyHeader>
						<EmptyTitle>{labels.emptyTitle}</EmptyTitle>
						<EmptyDescription>{labels.emptyDescription}</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</div>
		{:else}
			<dl class={styles.facts()}>
				<div class={styles.fact()}>
					<dt class={styles.factLabel()}>{labels.recent}</dt>
					<dd class={styles.factValue()}>+{compact(recent.current)}</dd>
				</div>
				<div class={styles.fact()}>
					<dt class={styles.factLabel()}>{labels.bestDay}</dt>
					<dd class={styles.factValue()}>
						{#if best}
							+{compact(best.stars)}
							<span class={styles.factNote()}>{formatDate(best.date, locale, FULL_DATE)}</span>
						{:else}
							–
						{/if}
					</dd>
				</div>
				<div class={styles.fact()}>
					<dt class={styles.factLabel()}>{labels.milestone}</dt>
					<dd class={styles.factValue()}>
						{#if milestones.reached}
							{compact(milestones.reached.value)}
							<span class={styles.factNote()}>
								{formatDate(milestones.reached.date, locale, FULL_DATE)}
							</span>
						{:else}
							–
						{/if}
					</dd>
				</div>
				<div class={styles.fact()}>
					<dt class={styles.factLabel()}>{labels.nextMilestone}</dt>
					<dd class={styles.factValue()}>
						{#if milestones.next}
							{compact(milestones.next.value)}
							{#if milestones.next.days !== null}
								<span class={styles.factNote()}>{labels.eta(milestones.next.days)}</span>
							{/if}
						{:else}
							–
						{/if}
					</dd>
				</div>
			</dl>

			<div class={styles.chart()}>
				<!-- Only the shown chart mounts, so each replays its reveal on switch. -->
				<TabsContent value="cumulative" class={styles.panel()}>
					{#if mode === "cumulative"}
						<ChartContainer
							config={{ stars: { label: labels.seriesCumulative, color: "var(--chart-1)" } }}
							title="{history.repo}: {labels.seriesCumulative.toLowerCase()}"
							{locale}
							aspect="wide"
						>
							<LineChart data={lineRows} xKey="date">
								{#if layout.grid}
									<CartesianGrid />
								{/if}
								<YAxis tickFormatter={(value) => formatCompact(Number(value), locale)} />
								<XAxis tickFormatter={monthTick} />
								<!-- Monotone: a spline would invent bumps in a count that only rises. -->
								<Line dataKey="stars" curve="monotone" terminalMarker strokeWidth={2} />
								<ChartTooltip>
									{#snippet content()}
										<ChartTooltipContent>
											{#snippet formatter({ value })}
												{formatCompact(value, locale)}
											{/snippet}
											{#snippet labelFormatter({ datum })}
												{fullDate((datum as { date?: unknown }).date)}
											{/snippet}
										</ChartTooltipContent>
									{/snippet}
								</ChartTooltip>
							</LineChart>
						</ChartContainer>
					{/if}
				</TabsContent>
				<TabsContent value="daily" class={styles.panel()}>
					{#if mode === "daily"}
						<ChartContainer
							config={{ gained: { label: gainLabel, color: "var(--chart-1)" } }}
							title="{history.repo}: {gainLabel.toLowerCase()}"
							{locale}
							aspect="wide"
						>
							<!-- BarChart's own axes and tooltip: the time-scale parts need a line plot. -->
							<BarChart data={gainRows} xKey="label">
								{#if layout.grid}
									<CartesianGrid />
								{/if}
								<Bar dataKey="gained" />
								<BarXAxis maxLabels={8} />
								<BarYAxis tickFormatter={(value) => formatCompact(value, locale)} />
								<BarTooltip>
									{#snippet content()}
										<ChartTooltipContent>
											{#snippet formatter({ value })}
												{formatCompact(value, locale)}
											{/snippet}
										</ChartTooltipContent>
									{/snippet}
								</BarTooltip>
							</BarChart>
						</ChartContainer>
					{/if}
				</TabsContent>
			</div>
		{/if}
	</Tabs>

	{#if data.length > 0}
		<dl class={styles.counts()}>
			<div class={styles.count()}>
				<dt class={styles.countLabel()}>{labels.firstStar}</dt>
				<dd class={cn("order-first", styles.countValue())}>
					{first ? formatDate(first, locale, FULL_DATE) : "–"}
				</dd>
			</div>
			<div class={styles.count()}>
				<dt class={styles.countLabel()}>{labels.avgPerDay}</dt>
				<dd class={cn("order-first", styles.countValue())}>{compact(averagePerDay(data))}</dd>
			</div>
			<div class={styles.count()}>
				<dt class={styles.countLabel()}>{labels.lastStar}</dt>
				<dd class={cn("order-first", styles.countValue())}>
					{lastStar ? formatDate(lastStar, locale, SHORT_DATE) : "–"}
				</dd>
			</div>
		</dl>
	{/if}
</div>
