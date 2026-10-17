<script lang="ts">
import type { Snippet } from "svelte";
import {
	announceRows,
	type ChartStatus,
	type Datum,
	type Margin,
	type TooltipRow,
	toDate,
} from "../../chart/core";
import ChartFrame from "../../chart/svelte/chart-frame.svelte";
import { useChart } from "../../chart/svelte/context";
import {
	createAnimatedDomain,
	createChartPhase,
} from "../../chart/svelte/lifecycle.svelte";
import { candleColor, ohlcDomain, readOhlc } from "../geometry";
import CandlestickPlot from "./candlestick-plot.svelte";
import { type CandlestickLabels, DEFAULT_LABELS } from "./context";

let {
	data,
	xKey = "date",
	xLabel = "Date",
	labels: labelsProp,
	upKey = "up",
	downKey = "down",
	margin,
	status = "ready",
	animate = true,
	activeIndex = $bindable(null),
	onActiveIndexChange,
	roleDescription = "candlestick chart",
	class: className,
	children: content,
}: {
	/** Rows with a date under xKey and numeric open, high, low and close. */
	data: Datum[];
	xKey?: string;
	/** Header of the date column in the screen-reader table. */
	xLabel?: string;
	/** Row names in the tooltip and table. */
	labels?: Partial<CandlestickLabels>;
	/** Config keys whose colour and legend toggle drive rising and falling candles. */
	upKey?: string;
	downKey?: string;
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
const labels = $derived({ ...DEFAULT_LABELS, ...labelsProp });
const target = $derived(ohlcDomain(data));
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
const interactive = $derived(lifecycle.phase === "ready" && data.length > 0);

function setActive(index: number | null, fromKeyboard: boolean) {
	instant = fromKeyboard;
	activeIndex = index;
	onActiveIndexChange?.(index);
}

const title = (datum: Datum) => chart.format.title(toDate(datum[xKey]));
const rows = (datum: Datum): TooltipRow[] => {
	const ohlc = readOhlc(datum);
	if (!ohlc) return [];
	const up = ohlc.close >= ohlc.open;
	const color = candleColor(up ? upKey : downKey, up);
	return (["open", "high", "low", "close"] as const).map((key) => ({
		key,
		label: labels[key],
		color,
		value: ohlc[key],
	}));
};
const activeDatum = $derived(
	activeIndex !== null && interactive ? data[activeIndex] : undefined,
);
const announcement = $derived(
	activeDatum && instant
		? announceRows(title(activeDatum), rows(activeDatum), chart.format.number)
		: "",
);
const summary = $derived.by(() => {
	if (chart.description) return chart.description;
	if (!data.length) return "";
	const closes = data.map((d) => readOhlc(d)?.close).filter((v) => v !== undefined);
	return `${data.length} ${roleDescription} points from ${title(data[0] as Datum)} to ${title(
		data.at(-1) as Datum,
	)}. ${labels.close} ${chart.format.number(closes[0] ?? 0)} to ${chart.format.number(closes.at(-1) ?? 0)}.`;
});
const table = $derived({
	columns: [xLabel, labels.open, labels.high, labels.low, labels.close],
	rows: data.map((datum) => {
		const ohlc = readOhlc(datum);
		return {
			header: title(datum),
			cells: ohlc
				? [ohlc.open, ohlc.high, ohlc.low, ohlc.close].map((v) => chart.format.number(v))
				: [],
		};
	}),
});
</script>

<ChartFrame
	{roleDescription}
	{summary}
	{table}
	count={data.length}
	{activeIndex}
	onActiveChange={setActive}
	{interactive}
	{announcement}
	phase={lifecycle.phase}
	class={className}
>
	{#snippet children(frame)}
		<CandlestickPlot
			{frame}
			{data}
			{xKey}
			{margin}
			domain={domain.value}
			phase={lifecycle.phase}
			{animate}
			advance={lifecycle.advance}
			{activeIndex}
			{instant}
			{interactive}
			{setActive}
			{title}
			{rows}
		>
			{@render content?.()}
		</CandlestickPlot>
	{/snippet}
</ChartFrame>
