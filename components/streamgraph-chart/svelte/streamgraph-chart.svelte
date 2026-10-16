<script lang="ts">
import ChartFrame from "../../chart/svelte/chart-frame.svelte";
import { useChart } from "../../chart/svelte/context";
import type { Datum } from "../../chart/svelte/core";
import { streamLayers } from "./stream";
import StreamPlot from "./stream-plot.svelte";
import type { StreamgraphVariant } from "./variants";

let {
	data,
	xKey,
	variant = "wiggle",
	directLabels = true,
	animate = true,
	activeIndex = $bindable(null),
	onActiveIndexChange,
	roleDescription = "streamgraph",
	class: className,
}: {
	data: Datum[];
	/** Key holding each row's label, shown on the axis and in the tooltip. */
	xKey: string;
	/** Stack offset: a flowing `wiggle`, a centred `silhouette`, or a flat `zero` baseline. */
	variant?: StreamgraphVariant;
	/** Names each layer inside its widest stretch when it is thick enough. */
	directLabels?: boolean;
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
const keys = $derived(Object.keys(chart.config));
const label = (key: string) => {
	const entry = chart.config[key]?.label;
	return typeof entry === "string" ? entry : key;
};
const layers = $derived(streamLayers(data, keys, chart.hidden, variant));
const at = (index: number, key: string) => {
	const raw = data[index]?.[key];
	return typeof raw === "number" ? raw : 0;
};
const visible = $derived(keys.filter((key) => !chart.hidden.has(key)));
const total = (index: number) => visible.reduce((sum, key) => sum + at(index, key), 0);
const describe = (index: number) =>
	`${String(data[index]?.[xKey] ?? "")}: ${visible.map((key) => `${label(key)} ${chart.format.number(at(index, key))}`).join(", ")}`;
const summary = $derived(
	chart.description ??
		(data.length
			? `${visible.length} layers over ${data.length} points, from ${String(data[0]?.[xKey] ?? "")} to ${String(data[data.length - 1]?.[xKey] ?? "")}.`
			: "No data."),
);
const table = $derived({
	columns: [xKey, ...visible.map(label), "Total"],
	rows: data.map((datum, index) => ({
		header: String(datum[xKey] ?? ""),
		cells: [
			...visible.map((key) => chart.format.number(at(index, key))),
			chart.format.number(total(index)),
		],
	})),
});
const announcement = $derived(
	activeIndex !== null && instant ? describe(activeIndex) : "",
);
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
	class={className}
>
	{#snippet children(frame)}
		<StreamPlot
			{frame}
			{data}
			{xKey}
			{layers}
			{label}
			{at}
			{variant}
			{directLabels}
			{animate}
			{activeIndex}
			{instant}
			{setActive}
		/>
	{/snippet}
</ChartFrame>
