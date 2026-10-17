<script lang="ts">
import type { ChartStatus, Datum } from "../../chart/core";
import ChartFrame from "../../chart/svelte/chart-frame.svelte";
import { useChart } from "../../chart/svelte/context";
import {
	buildCalendar,
	type HeatmapCell,
	type HeatmapPhase,
	type HeatmapWeekStart,
	heatmapNext,
	localeWeekStart,
} from "../calendar";
import type { HeatmapShape } from "../variants";
import HeatmapPlot from "./heatmap-plot.svelte";

let {
	data,
	dateKey = "date",
	valueKey = "value",
	thresholds,
	shape = "rounded",
	patterns = false,
	weekStart = "auto",
	gap = 3,
	locale,
	status = "ready",
	valueLabel = "Value",
	formatLabel,
	animate = true,
	activeIndex = $bindable(null),
	onActiveIndexChange,
	roleDescription = "calendar heatmap",
	tableHeaders = ["Date", "Value"],
	class: className,
}: {
	data: Datum[];
	dateKey?: string;
	valueKey?: string;
	/** Four cut points for levels 1 to 4; defaults to quarters of the max. */
	thresholds?: readonly number[];
	shape?: HeatmapShape;
	/** Pattern per level, so levels read without colour. */
	patterns?: boolean;
	weekStart?: HeatmapWeekStart;
	/** Gap between cells in pixels. */
	gap?: number;
	/** Locale for month, weekday and date labels; pass the same one as ChartContainer. */
	locale?: string;
	status?: ChartStatus;
	/** Tooltip row label; defaults to "Value". */
	valueLabel?: string;
	/** Replaces the tooltip row, e.g. `(v) => \`${v} commits\``. */
	formatLabel?: (value: number, date: Date) => string;
	animate?: boolean;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	roleDescription?: string;
	/** Screen-reader table headers: date, value. */
	tableHeaders?: [string, string];
	class?: string;
} = $props();

const chart = useChart();
const firstDay = $derived(
	weekStart === "sunday" ? 0 : weekStart === "monday" ? 1 : localeWeekStart(locale),
);
const calendar = $derived(
	buildCalendar(data, { dateKey, valueKey, weekStart: firstDay, thresholds }),
);
const dateFormat = $derived(new Intl.DateTimeFormat(locale, { dateStyle: "full" }));
let instant = $state(false);
function setActive(index: number | null, fromKeyboard: boolean) {
	instant = fromKeyboard;
	activeIndex = index;
	onActiveIndexChange?.(index);
}
// svelte-ignore state_referenced_locally
let phase = $state<HeatmapPhase>(
	status === "loading" ? "loading" : animate ? "revealing" : "ready",
);
// svelte-ignore state_referenced_locally
let prevStatus = status;
$effect(() => {
	const next = status;
	if (next === prevStatus) return;
	prevStatus = next;
	phase = heatmapNext(phase, next === "ready" ? "status-ready" : "status-loading");
});
const interactive = $derived(phase === "ready" && calendar.cells.length > 0);
const active = $derived(
	interactive && activeIndex !== null ? calendar.cells[activeIndex] : undefined,
);
const rowFor = (cell: HeatmapCell) =>
	formatLabel
		? { label: formatLabel(cell.value, cell.date), value: null }
		: { label: valueLabel, value: cell.value };
const spoken = (cell: HeatmapCell) => {
	const row = rowFor(cell);
	return row.value === null
		? row.label
		: `${row.label} ${chart.format.number(row.value)}`;
};
const peak = $derived(
	calendar.cells.reduce<HeatmapCell | undefined>(
		(best, c) => (!best || c.value > best.value ? c : best),
		undefined,
	),
);
const total = $derived(calendar.cells.reduce((sum, c) => sum + c.value, 0));
const summary = $derived(
	chart.description ??
		(peak
			? `${calendar.cells.length} days from ${dateFormat.format(calendar.cells[0]?.date ?? peak.date)} to ${dateFormat.format(calendar.cells.at(-1)?.date ?? peak.date)}, total ${chart.format.number(total)}. Highest: ${dateFormat.format(peak.date)}, ${chart.format.number(peak.value)}.`
			: "No data."),
);
const table = $derived({
	columns: tableHeaders,
	rows: calendar.cells.map((c) => ({
		header: dateFormat.format(c.date),
		cells: [chart.format.number(c.value)],
	})),
});
</script>

<ChartFrame
	{roleDescription}
	{summary}
	{table}
	count={calendar.cells.length}
	{activeIndex}
	onActiveChange={setActive}
	{interactive}
	announcement={active && instant ? `${dateFormat.format(active.date)}: ${spoken(active)}` : ""}
	class={className}
>
	{#snippet children(frame)}
		<HeatmapPlot
			{frame}
			cells={calendar.cells}
			weeks={calendar.weeks}
			months={calendar.months}
			weekdays={calendar.weekdays}
			{shape}
			{patterns}
			{gap}
			{locale}
			{phase}
			onPhaseDone={() => (phase = heatmapNext(phase, "done"))}
			{animate}
			activeIndex={interactive ? activeIndex : null}
			{instant}
			{setActive}
			title={(cell) => dateFormat.format(cell.date)}
			{rowFor}
		/>
	{/snippet}
</ChartFrame>
