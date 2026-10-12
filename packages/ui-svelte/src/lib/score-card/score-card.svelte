<script lang="ts">
import Badge from "../badge/badge.svelte";
import Card from "../card/card.svelte";
import CardAction from "../card/card-action.svelte";
import CardContent from "../card/card-content.svelte";
import CardDescription from "../card/card-description.svelte";
import CardHeader from "../card/card-header.svelte";
import CardTitle from "../card/card-title.svelte";
import GaugeChart from "../gauge-chart/gauge-chart.svelte";
import type { GaugeChartLayout, GaugeChartTone } from "../gauge-chart/variants";
import { cn } from "../lib/cn";
import { type ScoreCardSize, scoreCard } from "./variants";

let {
	title,
	description,
	value,
	min = 0,
	max = 100,
	label,
	trend,
	tone = "primary",
	layout = "arc",
	size = "default",
	locale,
	format,
	animate = true,
	class: className,
}: {
	title: string;
	description?: string;
	value: number;
	min?: number;
	max?: number;
	/** Gauge's own caption under the value; defaults to `title`. */
	label?: string;
	/** Change since the last reading, in points; omit to hide the badge. */
	trend?: number;
	tone?: GaugeChartTone;
	layout?: GaugeChartLayout;
	size?: ScoreCardSize;
	locale?: string;
	format?: (value: number) => string;
	animate?: boolean;
	class?: string;
} = $props();

const styles = $derived(scoreCard({ size }));
const up = $derived((trend ?? 0) >= 0);
</script>

<Card data-slot="score-card" class={cn(styles.root(), className)}>
	<CardHeader class={styles.header()}>
		<div>
			<CardTitle class={styles.title()}>{title}</CardTitle>
			{#if description}
				<CardDescription class={styles.description()}>{description}</CardDescription>
			{/if}
		</div>
		{#if trend !== undefined}
			<CardAction>
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
					{up ? "+" : ""}{trend}
				</Badge>
			</CardAction>
		{/if}
	</CardHeader>
	<CardContent class={styles.body()}>
		<div class={styles.gauge()}>
			<GaugeChart
				{value}
				{min}
				{max}
				label={label ?? title}
				{tone}
				{layout}
				{format}
				{locale}
				{animate}
			/>
		</div>
	</CardContent>
</Card>
