<script lang="ts">
import type { Snippet } from "svelte";
import type { Margin } from "../../chart/core";
import ChartFrame from "../../chart/svelte/chart-frame.svelte";
import { useChart } from "../../chart/svelte/context";
import { createSeriesRegistry } from "../../chart/svelte/lifecycle.svelte";
import type { LivePoint } from "../live";
import { defaultFormatTime } from "./context";
import LivePlot from "./live-plot.svelte";

let {
	data,
	value,
	dataKey = "value",
	window: windowSecs = 30,
	numXTicks = 5,
	nowOffsetUnits = 0,
	exaggerate = false,
	lerpSpeed = 0.08,
	paused = false,
	margin,
	activeIndex = $bindable(null),
	onActiveIndexChange,
	formatTime = defaultFormatTime,
	timeLabel = "Time",
	roleDescription = "live line chart",
	class: className,
	children: content,
}: {
	/** Stream of samples, oldest first; `time` is unix seconds. */
	data: LivePoint[];
	/** Latest value; the line eases toward it. */
	value: number;
	/** Key the value is exposed under to series, tooltip and legend. */
	dataKey?: string;
	/** Visible window in seconds. */
	window?: number;
	/** X-axis tick count; one tick is also the fade-out lead past the live tip. */
	numXTicks?: number;
	/** Leading gap after `now`, in x-tick units. */
	nowOffsetUnits?: number;
	/** Tight y padding (3%) instead of 15%. */
	exaggerate?: boolean;
	/** Fraction eased per 60fps frame, applied by elapsed time so any frame rate matches. */
	lerpSpeed?: number;
	/** Freezes the scroll; the value still settles. */
	paused?: boolean;
	margin?: Partial<Margin>;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	/** Formats wall-clock ms for the axis, pill, tooltip and table. */
	formatTime?: (ms: number) => string;
	/** Header of the time column in the screen-reader table. */
	timeLabel?: string;
	roleDescription?: string;
	class?: string;
	children?: Snippet;
} = $props();

const chart = useChart();
const registry = createSeriesRegistry(() => chart.hidden);
let instant = $state(false);

function setActive(index: number | null, fromKeyboard: boolean) {
	instant = fromKeyboard;
	activeIndex = index;
	onActiveIndexChange?.(index);
}

const latest = $derived(data.at(-1)?.time ?? 0);
const visibleStart = $derived.by(() => {
	const from = latest - windowSecs;
	const index = data.findIndex((p) => p.time >= from);
	return index === -1 ? data.length : index;
});
const visible = $derived(data.slice(visibleStart));

function seriesLabel(key: string) {
	const label = chart.config[key]?.label;
	return typeof label === "string" ? label : key;
}
const label = $derived(seriesLabel(dataKey));
const summary = $derived.by(() => {
	if (chart.description) return chart.description;
	if (!visible.length) return "Live. Waiting for data.";
	const values = visible.map((p) => p.value);
	return `Live. Latest ${label} ${chart.format.number(value)} at ${formatTime(latest * 1000)}. ${visible.length} samples in the last ${windowSecs} seconds, from ${chart.format.number(Math.min(...values))} to ${chart.format.number(Math.max(...values))}.`;
});
const table = $derived({
	columns: [timeLabel, label],
	rows: visible.map((p) => ({
		header: formatTime(p.time * 1000),
		cells: [chart.format.number(p.value)],
	})),
});
const frameIndex = $derived(
	activeIndex !== null && activeIndex >= visibleStart ? activeIndex - visibleStart : null,
);
const activePoint = $derived(activeIndex !== null ? data[activeIndex] : undefined);
const announcement = $derived(
	activePoint && instant
		? `${formatTime(activePoint.time * 1000)}: ${label} ${chart.format.number(activePoint.value)}`
		: "",
);
</script>

<ChartFrame
	{roleDescription}
	{summary}
	{table}
	count={visible.length}
	activeIndex={frameIndex}
	onActiveChange={(index, fromKeyboard) =>
		setActive(index === null ? null : index + visibleStart, fromKeyboard)}
	interactive={visible.length > 0}
	{announcement}
	phase="ready"
	class={className}
>
	{#snippet children(frame)}
		<LivePlot
			{frame}
			{data}
			{value}
			{dataKey}
			windowMs={windowSecs * 1000}
			{numXTicks}
			{nowOffsetUnits}
			{exaggerate}
			{lerpSpeed}
			{paused}
			{margin}
			series={registry.series}
			register={registry.register}
			{activeIndex}
			{instant}
			{setActive}
			{formatTime}
			{seriesLabel}
		>
			{@render content?.()}
		</LivePlot>
	{/snippet}
</ChartFrame>
