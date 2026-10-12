<script lang="ts">
import { untrack } from "svelte";
import ChartFrame from "../chart/chart-frame.svelte";
import { useChart } from "../chart/context";
import type { Datum } from "../chart/core";
import {
	allocateCells,
	emptyCells,
	reassignCells,
	type WaffleRow,
	waffleRows,
} from "./geometry";
import type { WaffleVariant } from "./variants";
import WafflePlot from "./waffle-plot.svelte";

let {
	data,
	dataKey = "value",
	nameKey = "name",
	rows: gridRows = 10,
	columns = 10,
	variant = "mixed",
	tableHeaders = ["Name", "Value", "Share", "Cells"],
	animate = true,
	activeIndex = $bindable(null),
	onActiveIndexChange,
	roleDescription = "waffle chart",
	class: className,
}: {
	data: Datum[];
	/** Key holding each row's value. */
	dataKey?: string;
	/** Key holding each row's name; matches `config` keys for labels, colours and the legend. */
	nameKey?: string;
	/** Grid rows; rows times columns cells make the whole, so 10 by 10 is one cell per percent. */
	rows?: number;
	columns?: number;
	/** Cell shape; `mixed` cycles square, round and framed so neighbours differ without colour. */
	variant?: WaffleVariant;
	/** Screen-reader table headers: name, value, share, cells. */
	tableHeaders?: [string, string, string, string];
	animate?: boolean;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	roleDescription?: string;
	class?: string;
} = $props();

const chart = useChart();
let instant = $state(false);
function setActive(index: number | null, fromKeyboard: boolean) {
	instant = fromKeyboard;
	activeIndex = index;
	onActiveIndexChange?.(index);
}
const rows = $derived(
	waffleRows(data, dataKey, nameKey, chart.config).filter(
		(row) => !chart.hidden.has(row.key),
	),
);
const count = $derived(Math.max(1, gridRows * columns));
const counts = $derived(allocateCells(rows, count));
const signature = $derived(
	`${count}|${rows.map((row) => `${row.key}:${row.value}`).join(",")}`,
);
let cells = $state(untrack(() => reassignCells(emptyCells(count), rows, counts)));
let seen = untrack(() => signature);
$effect.pre(() => {
	if (signature === seen) return;
	seen = signature;
	untrack(() => {
		const base = Array.from(
			{ length: count },
			(_, id) => cells[id] ?? { id, key: null, slot: id },
		);
		cells = reassignCells(base, rows, counts);
	});
});
const total = $derived(rows.reduce((sum, row) => sum + row.value, 0));
const share = (value: number) => chart.format.percent(total > 0 ? value / total : 0);
const active = $derived(activeIndex !== null ? rows[activeIndex] : undefined);
const largest = $derived(
	rows.reduce<WaffleRow | undefined>(
		(best, row) => (!best || row.value > best.value ? row : best),
		undefined,
	),
);
const summary = $derived(
	chart.description ??
		(largest
			? `${rows.length} parts of ${count} cells. Largest: ${largest.label}, ${share(largest.value)}.`
			: "No data."),
);
const table = $derived({
	columns: tableHeaders,
	rows: rows.map((row, index) => ({
		header: row.label,
		cells: [chart.format.number(row.value), share(row.value), String(counts[index] ?? 0)],
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
	count={rows.length}
	{activeIndex}
	onActiveChange={setActive}
	interactive={rows.length > 0}
	{announcement}
	class={className}
>
	{#snippet children(frame)}
		<WafflePlot
			{frame}
			{rows}
			{counts}
			{cells}
			{gridRows}
			{columns}
			{variant}
			{animate}
			{share}
			{activeIndex}
			{instant}
			{setActive}
		/>
	{/snippet}
</ChartFrame>
