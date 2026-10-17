<script lang="ts">
import type { Snippet } from "svelte";
import type { Datum } from "../../chart/core";
import ChartFrame from "../../chart/svelte/chart-frame.svelte";
import { useChart } from "../../chart/svelte/context";
import { cn } from "../../lib/cn";
import { niceMax, type RadarMetric, type RadarSeries, seriesColor } from "../geometry";
import type { RadarGridShape, RadarVariant } from "../variants";
import RadarPlot from "./radar-plot.svelte";

let {
	data,
	metrics,
	max,
	levels = 5,
	margin = 48,
	grid = "polygon",
	variant = "filled",
	animate = true,
	activeIndex = $bindable(null),
	onActiveIndexChange,
	seriesLabel = "Series",
	roleDescription = "radar chart",
	class: className,
	children: content,
}: {
	data: RadarSeries[];
	metrics: RadarMetric[];
	/** Value at the outer ring. Defaults to a nice ceiling over the data. */
	max?: number;
	levels?: number;
	/** Room around the rings for metric labels, in px. */
	margin?: number;
	grid?: RadarGridShape;
	variant?: RadarVariant;
	animate?: boolean;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	/** Header of the series column in the screen-reader table. */
	seriesLabel?: string;
	/** Announced after the chart's name. */
	roleDescription?: string;
	class?: string;
	children?: Snippet;
} = $props();

const chart = useChart();
let instant = $state(false);
const resolvedMax = $derived(max ?? niceMax(data, metrics));
const value = (s: RadarSeries, key: string) => s.values[key] ?? 0;

function setActive(index: number | null, fromKeyboard: boolean) {
	instant = fromKeyboard;
	activeIndex = index;
	onActiveIndexChange?.(index);
}

const title = (datum: Datum) => data.find((s) => s.values === datum)?.label ?? "";
const rows = (datum: Datum) => {
	const index = data.findIndex((s) => s.values === datum);
	const s = data[index];
	return metrics.map((m) => ({
		key: m.key,
		label: m.label,
		color: s ? seriesColor(s, index) : "currentColor",
		value: s ? value(s, m.key) : null,
	}));
};
const activeSeries = $derived(activeIndex !== null ? data[activeIndex] : undefined);
function describe(s: RadarSeries) {
	const ranked = [...metrics].sort((a, b) => value(s, b.key) - value(s, a.key));
	const top = ranked[0];
	const low = ranked.at(-1);
	return top && low
		? `${s.label}: highest ${top.label} ${chart.format.number(value(s, top.key))}, lowest ${low.label} ${chart.format.number(value(s, low.key))}.`
		: `${s.label}.`;
}
const summary = $derived(
	chart.description ??
		`${data.length} series across ${metrics.length} metrics. ${data.map(describe).join(" ")}`,
);
const announcement = $derived(
	activeSeries && instant
		? `${activeSeries.label}: ${metrics
				.map((m) => `${m.label} ${chart.format.number(value(activeSeries, m.key))}`)
				.join(", ")}`
		: "",
);
const table = $derived({
	columns: [seriesLabel, ...metrics.map((m) => m.label)],
	rows: data.map((s) => ({
		header: s.label,
		cells: metrics.map((m) => chart.format.number(value(s, m.key))),
	})),
});
</script>

<ChartFrame
	{roleDescription}
	{summary}
	{table}
	count={data.length}
	{activeIndex}
	onActiveChange={setActive}
	interactive={data.length > 0}
	{announcement}
	class={cn("aspect-square", className)}
>
	{#snippet children(frame)}
		<RadarPlot
			{frame}
			{data}
			{metrics}
			{margin}
			{levels}
			max={resolvedMax}
			{grid}
			{variant}
			{animate}
			{activeIndex}
			{instant}
			{setActive}
			{title}
			{rows}
		>
			{@render content?.()}
		</RadarPlot>
	{/snippet}
</ChartFrame>
