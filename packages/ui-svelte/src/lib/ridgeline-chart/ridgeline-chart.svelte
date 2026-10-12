<script lang="ts">
import ChartFrame from "../chart/chart-frame.svelte";
import { useChart } from "../chart/context";
import { type RidgelineSeries, ridgeModel } from "./density";
import RidgelinePlot from "./ridgeline-plot.svelte";
import type { RidgelineVariant } from "./variants";

let {
	series,
	domain,
	bandwidth,
	overlap = 2.4,
	unit = "",
	variant = "tint",
	tableHeaders = ["Series", "Median", "Middle half", "Count"],
	animate = true,
	activeIndex = $bindable(null),
	onActiveIndexChange,
	roleDescription = "ridgeline chart",
	class: className,
}: {
	/** One ridge per series, drawn top to bottom. */
	series: RidgelineSeries[];
	/** Value range of the axis; defaults to the data with a little room. */
	domain?: [number, number];
	/** Kernel width in value units; defaults to Silverman's rule per series. */
	bandwidth?: number;
	/** How far a ridge may rise into the rows above, in row heights. */
	overlap?: number;
	/** Unit after each value, such as "°C". */
	unit?: string;
	/** `tint` shades ridges by median; `series` uses each id's config colour. */
	variant?: RidgelineVariant;
	/** Screen-reader table headers: series, median, middle half, count. */
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
const model = $derived(ridgeModel(series, domain, bandwidth));
const value = (v: number) => `${chart.format.number(v)}${unit}`;
function describe(index: number) {
	const shape = model.shapes[index];
	if (!shape) return "";
	const { stats } = shape;
	return `${shape.label}: median ${value(stats.median)}, middle half ${value(stats.q1)} to ${value(stats.q3)}, ${stats.n} values`;
}
const summary = $derived(
	chart.description ??
		(model.shapes.length
			? model.shapes.map((_, index) => describe(index)).join(". ")
			: "No data."),
);
const table = $derived({
	columns: tableHeaders,
	rows: model.shapes.map((shape) => ({
		header: shape.label,
		cells: [
			value(shape.stats.median),
			`${value(shape.stats.q1)} to ${value(shape.stats.q3)}`,
			String(shape.stats.n),
		],
	})),
});
const announcement = $derived(
	instant && activeIndex !== null ? describe(activeIndex) : "",
);
</script>

<ChartFrame
	{roleDescription}
	{summary}
	{table}
	count={model.shapes.length}
	{activeIndex}
	onActiveChange={setActive}
	interactive={model.shapes.length > 0}
	{announcement}
	class={className}
>
	{#snippet children(frame)}
		<RidgelinePlot {frame} {model} {overlap} {value} {variant} {animate} {activeIndex} {instant} {setActive} />
	{/snippet}
</ChartFrame>
