<script lang="ts">
import Badge from "../badge/badge.svelte";
import Card from "../card/card.svelte";
import CardAction from "../card/card-action.svelte";
import CardContent from "../card/card-content.svelte";
import CardHeader from "../card/card-header.svelte";
import CardTitle from "../card/card-title.svelte";
import ChartContainer from "../chart/chart-container.svelte";
import ChoroplethChart from "../choropleth-chart/choropleth-chart.svelte";
import {
	featureKey,
	featureLabel,
	type GeoCollection,
} from "../choropleth-chart/geometry";
import type { ChoroplethProjection } from "../choropleth-chart/variants";
import { cn } from "../lib/cn";
import RollingDigits from "../rolling-digits/rolling-digits.svelte";
import { type StatCardMapSize, statCardMap } from "./variants";

let {
	title,
	geo,
	values,
	trends,
	value,
	label,
	trend,
	keyProp = "name",
	labelProp = "name",
	projection = "equalEarth",
	size = "default",
	locale,
	formatValue,
	activeIndex = $bindable(null),
	onActiveIndexChange,
	class: className,
}: {
	title: string;
	/** Boundaries to draw; bring your own FeatureCollection. */
	geo: GeoCollection;
	/** Value per feature key. */
	values: Record<string, number>;
	/** Optional change per feature key, in percent; the card trend shows when absent. */
	trends?: Record<string, number>;
	/** Headline at rest, e.g. the total. */
	value: number;
	label: string;
	/** Change over the whole period, in percent. */
	trend: number;
	keyProp?: string;
	labelProp?: string;
	projection?: ChoroplethProjection;
	size?: StatCardMapSize;
	locale?: string;
	formatValue?: (value: number) => string;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	class?: string;
} = $props();

const number = $derived(
	formatValue ?? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format,
);
const percent = $derived(
	new Intl.NumberFormat(locale, {
		style: "percent",
		maximumFractionDigits: 1,
		signDisplay: "exceptZero",
	}),
);
// Same ordering ChoroplethChart walks, so the active index names the same region.
const entries = $derived.by(() => {
	const out: { key: string; label: string; value: number }[] = [];
	for (const feature of geo.features) {
		const key = featureKey(feature, keyProp);
		const v = values[key];
		if (typeof v === "number" && Number.isFinite(v))
			out.push({ key, label: featureLabel(feature, labelProp, key), value: v });
	}
	return out.sort((a, b) => a.label.localeCompare(b.label));
});
const entry = $derived(activeIndex !== null ? entries[activeIndex] : undefined);
const shownTrend = $derived((entry ? trends?.[entry.key] : undefined) ?? trend);
const up = $derived(shownTrend >= 0);
const styles = $derived(statCardMap({ size }));

function setActive(index: number | null) {
	activeIndex = index;
	onActiveIndexChange?.(index);
}
</script>

<Card data-slot="stat-card-map" class={cn(styles.root(), className)}>
	<CardHeader class={styles.header()}>
		<div class={styles.headline()}>
			<CardTitle class={styles.title()}>{title}</CardTitle>
			<RollingDigits
				variant="count"
				value={entry?.value ?? value}
				format={number}
				size="sm"
				durationMs={400}
				startOnView={false}
				class="font-bold text-foreground"
			/>
			<span class={styles.label()}>{entry?.label ?? label}</span>
		</div>
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
				{percent.format(shownTrend / 100)}
			</Badge>
		</CardAction>
	</CardHeader>
	<CardContent class={styles.body()}>
		<ChartContainer config={{}} {title} aspect="auto" {locale}>
			<ChoroplethChart
				data={geo}
				{values}
				{keyProp}
				{labelProp}
				{projection}
				legend={false}
				bind:activeIndex={() => activeIndex, setActive}
			/>
		</ChartContainer>
	</CardContent>
</Card>
