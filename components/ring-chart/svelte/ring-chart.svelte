<script lang="ts">
import type { Datum } from "../../chart/core";
import ChartFrame from "../../chart/svelte/chart-frame.svelte";
import { useChart } from "../../chart/svelte/context";
import { type RingRow, ringRows } from "../geometry";
import type { RingCap } from "../variants";
import RingPlot from "./ring-plot.svelte";

let {
	data,
	dataKey = "value",
	maxKey = "max",
	nameKey = "name",
	cap = "round",
	track = true,
	strokeWidth = 12,
	gap = 6,
	baseInnerRadius = 60,
	centerLabel = "Total",
	tableHeaders = ["Name", "Value", "Maximum", "Progress"],
	animate = true,
	activeIndex = $bindable(null),
	onActiveIndexChange,
	roleDescription = "ring chart",
	class: className,
}: {
	data: Datum[];
	/** Key holding each ring's value. */
	dataKey?: string;
	/** Key holding each ring's maximum; missing or non-positive maxima count as 100. */
	maxKey?: string;
	/** Key holding each ring's name; matches `config` keys for labels, colours and the legend. */
	nameKey?: string;
	cap?: RingCap;
	/** Unfilled remainder of each ring, drawn in the border colour. */
	track?: boolean;
	strokeWidth?: number;
	gap?: number;
	/** Radius of the innermost ring before the chart scales to fit. */
	baseInnerRadius?: number;
	/** Centre caption when no ring is active. */
	centerLabel?: string;
	/** Screen-reader table headers: name, value, maximum, progress. */
	tableHeaders?: [string, string, string, string];
	animate?: boolean;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	roleDescription?: string;
	class?: string;
} = $props();

const chart = useChart();
const rows = $derived(
	ringRows(data, dataKey, maxKey, nameKey, chart.config).filter(
		(row) => !chart.hidden.has(row.key),
	),
);
const progress = $derived((row: RingRow) => chart.format.percent(row.value / row.max));
let instant = $state(false);
function setActive(index: number | null, fromKeyboard: boolean) {
	instant = fromKeyboard;
	activeIndex = index;
	onActiveIndexChange?.(index);
}
const active = $derived(activeIndex !== null ? rows[activeIndex] : undefined);
const summary = $derived(
	chart.description ??
		(rows.length
			? `${rows.length} rings. ${rows.map((r) => `${r.label} ${progress(r)}`).join(", ")}.`
			: "No data."),
);
const table = $derived({
	columns: tableHeaders,
	rows: rows.map((r) => ({
		header: r.label,
		cells: [chart.format.number(r.value), chart.format.number(r.max), progress(r)],
	})),
});
const announcement = $derived(
	active && instant
		? `${active.label}: ${chart.format.number(active.value)} of ${chart.format.number(active.max)}, ${progress(active)}`
		: "",
);
</script>

<ChartFrame
	{roleDescription}
	{summary}
	{table}
	count={rows.length}
	{activeIndex}
	onActiveChange={setActive}
	interactive={rows.length > 0}
	{announcement}
	class={className}
>
	{#snippet children(frame)}
		<RingPlot
			{frame}
			{rows}
			{progress}
			{cap}
			{track}
			{strokeWidth}
			{gap}
			{baseInnerRadius}
			{centerLabel}
			{animate}
			{activeIndex}
			{instant}
			{setActive}
		/>
	{/snippet}
</ChartFrame>
