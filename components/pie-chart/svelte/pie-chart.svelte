<script lang="ts">
import type { Datum } from "../../chart/core";
import ChartFrame from "../../chart/svelte/chart-frame.svelte";
import { useChart } from "../../chart/svelte/context";
import { type PieSlice, pieRows, pieSlices } from "../geometry";
import type { PieHover, PieVariant } from "../variants";
import PiePlot from "./pie-plot.svelte";

let {
	data,
	dataKey = "value",
	nameKey = "name",
	variant = "donut",
	hover = "translate",
	hoverOffset = 10,
	padAngle = 0.02,
	cornerRadius = 4,
	labels = true,
	centerLabel = "Total",
	tableHeaders = ["Name", "Value", "Share"],
	animate = true,
	activeIndex = $bindable(null),
	onActiveIndexChange,
	roleDescription = "pie chart",
	class: className,
}: {
	data: Datum[];
	/** Key holding each row's value. */
	dataKey?: string;
	/** Key holding each row's name; matches `config` keys for labels, colours and the legend. */
	nameKey?: string;
	variant?: PieVariant;
	hover?: PieHover;
	/** Pixels a hovered slice moves out, or grows by. */
	hoverOffset?: number;
	padAngle?: number;
	cornerRadius?: number;
	/** Percentage labels on slices wide enough to hold them. */
	labels?: boolean;
	/** Donut caption when no slice is active. */
	centerLabel?: string;
	/** Screen-reader table headers: name, value, share. */
	tableHeaders?: [string, string, string];
	animate?: boolean;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	roleDescription?: string;
	class?: string;
} = $props();

const chart = useChart();
const rows = $derived(
	pieRows(data, dataKey, nameKey, chart.config).filter(
		(row) => !chart.hidden.has(row.key),
	),
);
const slices = $derived(pieSlices(rows, padAngle));
const total = $derived(rows.reduce((sum, row) => sum + row.value, 0));
const share = $derived((value: number) =>
	chart.format.percent(total > 0 ? value / total : 0),
);
let instant = $state(false);
function setActive(index: number | null, fromKeyboard: boolean) {
	instant = fromKeyboard;
	activeIndex = index;
	onActiveIndexChange?.(index);
}
const active = $derived(activeIndex !== null ? slices[activeIndex] : undefined);
const largest = $derived(
	slices.reduce<PieSlice | undefined>(
		(best, s) => (!best || s.value > best.value ? s : best),
		undefined,
	),
);
const summary = $derived(
	chart.description ??
		(largest
			? `${slices.length} slices totalling ${chart.format.number(total)}. Largest: ${largest.label}, ${share(largest.value)}.`
			: "No data."),
);
const table = $derived({
	columns: tableHeaders,
	rows: slices.map((s) => ({
		header: s.label,
		cells: [chart.format.number(s.value), share(s.value)],
	})),
});
const announcement = $derived(
	active && instant
		? `${active.label}: ${chart.format.number(active.value)}, ${share(active.value)}`
		: "",
);
</script>

<ChartFrame
	{roleDescription}
	{summary}
	{table}
	count={slices.length}
	{activeIndex}
	onActiveChange={setActive}
	interactive={slices.length > 0}
	{announcement}
	class={className}
>
	{#snippet children(frame)}
		<PiePlot
			{frame}
			{slices}
			{total}
			{share}
			{variant}
			{hover}
			{hoverOffset}
			{cornerRadius}
			{labels}
			{centerLabel}
			{animate}
			{activeIndex}
			{instant}
			{setActive}
		/>
	{/snippet}
</ChartFrame>
