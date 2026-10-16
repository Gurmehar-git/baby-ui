<script lang="ts">
import ChartFrame from "../../chart/svelte/chart-frame.svelte";
import { useChart } from "../../chart/svelte/context";
import type { Datum } from "../../chart/svelte/core";
import { type SlopeItem, slopeItems } from "./geometry";
import SlopePlot from "./slope-plot.svelte";
import type { SlopeVariant } from "./variants";

let {
	data,
	nameKey = "name",
	startKey = "start",
	endKey = "end",
	startLabel,
	endLabel,
	highlightKey = null,
	variant = "default",
	tableHeaders,
	animate = true,
	activeIndex = $bindable(null),
	onActiveIndexChange,
	roleDescription = "slope chart",
	class: className,
}: {
	data: Datum[];
	/** Key holding each row's name; matches `config` keys for labels and colours. */
	nameKey?: string;
	startKey?: string;
	endKey?: string;
	/** Heading of the first column, such as "Q1". */
	startLabel: string;
	/** Heading of the second column, such as "Q2". */
	endLabel: string;
	/** The item drawn in its config colour while the rest stay neutral; others all take their colour without it. */
	highlightKey?: string | null;
	/** `minimal` drops the label leaders and rank movement. */
	variant?: SlopeVariant;
	/** Screen-reader table headers: item, start, end, change, rank. */
	tableHeaders?: [string, string, string, string, string];
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
const items = $derived(
	slopeItems(data, nameKey, startKey, endKey, (key) => {
		const label = chart.config[key]?.label;
		return typeof label === "string" ? label : key;
	}),
);
const byEnd = $derived([...items].sort((a, b) => b.end - a.end));
const active = $derived(activeIndex !== null ? byEnd[activeIndex] : undefined);
const change = (item: SlopeItem) =>
	`${item.end >= item.start ? "+" : "−"}${chart.format.number(Math.abs(item.end - item.start))}`;
const summary = $derived(
	chart.description ??
		(items.length
			? `${startLabel} to ${endLabel}. ${byEnd.map((item) => `${item.label} ${chart.format.number(item.start)} to ${chart.format.number(item.end)}`).join(", ")}.`
			: "No data."),
);
const table = $derived({
	columns: tableHeaders ?? ["Item", startLabel, endLabel, "Change", "Rank"],
	rows: byEnd.map((item, rank) => ({
		header: item.label,
		cells: [
			chart.format.number(item.start),
			chart.format.number(item.end),
			change(item),
			`${[...items].sort((a, b) => b.start - a.start).indexOf(item) + 1} to ${rank + 1}`,
		],
	})),
});
const announcement = $derived(
	active && instant
		? `${active.label}, ${startLabel} ${chart.format.number(active.start)}, ${endLabel} ${chart.format.number(active.end)}, ${change(active)}`
		: "",
);
</script>

<ChartFrame
	{roleDescription}
	{summary}
	{table}
	count={byEnd.length}
	{activeIndex}
	onActiveChange={setActive}
	interactive={items.length > 0}
	{announcement}
	class={className}
>
	{#snippet children(frame)}
		<SlopePlot
			{frame}
			{items}
			{byEnd}
			{startLabel}
			{endLabel}
			{highlightKey}
			{variant}
			{animate}
			{change}
			{activeIndex}
			{instant}
			{setActive}
		/>
	{/snippet}
</ChartFrame>
