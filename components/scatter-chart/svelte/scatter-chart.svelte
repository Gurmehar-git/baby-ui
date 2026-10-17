<script lang="ts">
import type { Snippet } from "svelte";
import {
	announceRows,
	type ChartStatus,
	type Datum,
	type Margin,
	type SeriesConfig,
	summarize,
	type TooltipRow,
	toDate,
} from "../../chart/core";
import ChartFrame from "../../chart/svelte/chart-frame.svelte";
import { useChart } from "../../chart/svelte/context";
import {
	createAnimatedDomain,
	createChartPhase,
	createSeriesRegistry,
} from "../../chart/svelte/lifecycle.svelte";
import { scatterDomain } from "../geometry";
import { SCATTER_SHAPES } from "../variants";
import ScatterPlot from "./scatter-plot.svelte";

let {
	data,
	xKey = "date",
	xLabel = "Date",
	margin,
	status = "ready",
	animate = true,
	activeIndex = $bindable(null),
	onActiveIndexChange,
	roleDescription = "scatter chart",
	class: className,
	children: content,
}: {
	/** Rows with a date under xKey and one number per series. */
	data: Datum[];
	xKey?: string;
	/** Header of the date column in the screen-reader table. */
	xLabel?: string;
	margin?: Partial<Margin>;
	status?: ChartStatus;
	animate?: boolean;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	roleDescription?: string;
	class?: string;
	children?: Snippet;
} = $props();

const chart = useChart();
const registry = createSeriesRegistry(() => chart.hidden);
let order = $state<string[]>([]);
function register(next: SeriesConfig) {
	if (!order.includes(next.key)) order = [...order, next.key];
	return registry.register(next);
}
const seriesKeys = $derived(registry.series.map((s) => s.key).join("|"));
const target = $derived(scatterDomain(data, seriesKeys ? seriesKeys.split("|") : []));
const lifecycle = createChartPhase(
	() => status,
	() => animate,
);
// svelte-ignore state_referenced_locally
const domain = createAnimatedDomain({
	target: () => target,
	phase: () => lifecycle.phase,
	loading: status === "loading",
	animate: () => animate,
	advance: lifecycle.advance,
});
let instant = $state(false);
let activeKey = $state<string | null>(null);
const interactive = $derived(lifecycle.phase === "ready" && data.length > 0);

function setActive(index: number | null, fromKeyboard: boolean) {
	instant = fromKeyboard;
	activeIndex = index;
	onActiveIndexChange?.(index);
}
function onActiveChange(index: number | null, fromKeyboard: boolean) {
	if (fromKeyboard) activeKey = null;
	setActive(index, fromKeyboard);
}
function onHit(index: number | null, key: string | null) {
	activeKey = key;
	if (index !== activeIndex) setActive(index, false);
}
function shapeFor(key: string) {
	const index = order.indexOf(key);
	return SCATTER_SHAPES[Math.max(0, index) % SCATTER_SHAPES.length] ?? "circle";
}

function seriesLabel(key: string) {
	const label = chart.config[key]?.label;
	return typeof label === "string" ? label : key;
}
const title = (datum: Datum) => chart.format.title(toDate(datum[xKey]));
const rows = (datum: Datum): TooltipRow[] =>
	registry.series
		.filter((s) => activeKey === null || s.key === activeKey)
		.map((s) => {
			const value = datum[s.key];
			return {
				key: s.key,
				label: seriesLabel(s.key),
				color: s.color,
				value: typeof value === "number" ? value : null,
			};
		});
const activeDatum = $derived(
	activeIndex !== null && interactive ? data[activeIndex] : undefined,
);
const announcement = $derived(
	activeDatum && instant
		? announceRows(title(activeDatum), rows(activeDatum), chart.format.number)
		: "",
);
const summary = $derived(
	chart.description ??
		summarize({
			data,
			xKey,
			series: registry.series.map((s) => ({ key: s.key, label: seriesLabel(s.key) })),
			format: chart.format,
		}),
);
const table = $derived({
	columns: [xLabel, ...registry.series.map((s) => seriesLabel(s.key))],
	rows: data.map((datum) => ({
		header: title(datum),
		cells: registry.series.map((s) => {
			const value = datum[s.key];
			return typeof value === "number" ? chart.format.number(value) : "";
		}),
	})),
});
</script>

<ChartFrame
	{roleDescription}
	{summary}
	{table}
	count={data.length}
	{activeIndex}
	{onActiveChange}
	{interactive}
	{announcement}
	phase={lifecycle.phase}
	class={className}
>
	{#snippet children(frame)}
		<ScatterPlot
			{frame}
			{data}
			{xKey}
			{margin}
			domain={domain.value}
			series={registry.series}
			{register}
			phase={lifecycle.phase}
			{animate}
			advance={lifecycle.advance}
			{activeIndex}
			{activeKey}
			{instant}
			{interactive}
			{onHit}
			{shapeFor}
			{title}
			{rows}
		>
			{@render content?.()}
		</ScatterPlot>
	{/snippet}
</ChartFrame>
