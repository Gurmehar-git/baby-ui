<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import { AREA_H, AREA_W, sparklinePath } from "./sparkline";
import {
	type OgStatsMetricsMode,
	type OgStatsMetricsTone,
	type OgStatsMetricsTrend,
	ogStatsMetrics,
} from "./variants";

let {
	headline,
	stats,
	site,
	logo,
	period,
	sparkline,
	mode = "light",
	tone = "neutral",
	class: className,
}: {
	headline: string;
	/** First entry is the hero number; the next two print as one plain line; extras are dropped. */
	stats: { label: string; value: string; delta?: string; trend?: OgStatsMetricsTrend }[];
	site?: string;
	logo?: string;
	/** Pre-formatted, e.g. "Q3 2026". */
	period?: string;
	/** Raw values drawn as the soft area shape behind the card. */
	sparkline?: number[];
	mode?: OgStatsMetricsMode;
	tone?: OgStatsMetricsTone;
	class?: string;
} = $props();

const UP = "M12 5l8 12h-16z";
const DOWN = "M12 19l8 -12h-16z";
const SEP = "  ·  ";

const s = $derived(ogStatsMetrics({ mode, tone }));
const spark = $derived(sparkline ? sparklinePath(sparkline) : null);
const hero = $derived(stats[0]);
const secondary = $derived(
	stats
		.slice(1, 3)
		.map((stat) => `${stat.value} ${stat.label}`)
		.join(SEP),
);
</script>

<div data-slot="og-stats-metrics" class={cn(s.root(), className)}>
	{#if spark}
		<svg
			aria-hidden="true"
			width={AREA_W}
			height={AREA_H}
			viewBox="0 0 {AREA_W} {AREA_H}"
			fill="none"
			class={s.area()}
		>
			<polygon points={spark.area} fill="currentColor" fill-opacity="0.12" />
			<polyline
				points={spark.line}
				stroke="currentColor"
				stroke-opacity="0.4"
				stroke-width="5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{/if}
	{#if site || logo || period}
		<div class={s.header()}>
			<div class={s.brand()}>
				{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
				{#if site}<span class={s.site()}>{site}</span>{/if}
			</div>
			{#if period}<span class={s.period()}>{period}</span>{/if}
		</div>
	{/if}
	<div class={s.body()}>
		{#if hero}
			<span class={s.label()}>{hero.label}</span>
			<div class={s.hero()}>
				<span class={s.value()}>{hero.value}</span>
				{#if hero.delta}
					<span class={s.delta({ trend: hero.trend ?? "up" })}>
						<svg
							aria-hidden="true"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="currentColor"
							class={s.deltaIcon()}
						>
							<path d={hero.trend === "down" ? DOWN : UP} />
						</svg>
						<span class={s.deltaText()}>{hero.delta}</span>
					</span>
				{/if}
			</div>
		{/if}
		<h1 class={s.headline()}>{headline}</h1>
		{#if secondary}<span class={s.secondary()}>{secondary}</span>{/if}
	</div>
</div>
