<script lang="ts">
import ChartFrame from "../../chart/svelte/chart-frame.svelte";
import { useChart } from "../../chart/svelte/context";
import type { FunnelStage } from "../geometry";
import type {
	FunnelEdges,
	FunnelLabelLayout,
	FunnelOrientation,
	FunnelPattern,
} from "../variants";
import FunnelPlot from "./funnel-plot.svelte";

let {
	data,
	orientation = "horizontal",
	edges = "curved",
	labelLayout = "spread",
	pattern = "none",
	layers = 3,
	gap = 4,
	grid = false,
	showValues = true,
	showPercentage = true,
	showLabels = true,
	animate = true,
	activeIndex = $bindable(null),
	onActiveIndexChange,
	tableHeaders = ["Stage", "Value", "Of first", "Of previous"],
	roleDescription = "funnel chart",
	class: className,
}: {
	data: FunnelStage[];
	orientation?: FunnelOrientation;
	edges?: FunnelEdges;
	labelLayout?: FunnelLabelLayout;
	/** Texture over each stage's innermost ring, a non-colour cue. */
	pattern?: FunnelPattern;
	/** Halo rings per stage; the innermost is the stage's solid colour. */
	layers?: number;
	/** Pixels between stages. */
	gap?: number;
	/** Alternate background bands and rules between stages. */
	grid?: boolean;
	showValues?: boolean;
	showPercentage?: boolean;
	showLabels?: boolean;
	animate?: boolean;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	/** Screen-reader table headers: stage, value, share of first, share of previous. */
	tableHeaders?: [string, string, string, string];
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
const first = $derived(data[0]?.value ?? 0);
const value = (stage: FunnelStage) =>
	stage.displayValue ?? chart.format.number(stage.value);
const ratio = (v: number, of: number) => chart.format.percent(of > 0 ? v / of : 0);
const active = $derived(activeIndex !== null ? data[activeIndex] : undefined);
const summary = $derived.by(() => {
	if (chart.description) return chart.description;
	const head = data[0];
	const last = data.at(-1);
	if (!head || !last) return "No data.";
	return `${data.length} stages from ${head.label}, ${value(head)}, to ${last.label}, ${value(last)}: ${ratio(last.value, first)} carried through.`;
});
const table = $derived({
	columns: tableHeaders,
	rows: data.map((stage, index) => ({
		header: stage.label,
		cells: [
			value(stage),
			ratio(stage.value, first),
			ratio(stage.value, data[index - 1]?.value ?? stage.value),
		],
	})),
});
const announcement = $derived(
	active && instant
		? `${active.label}: ${value(active)}, ${ratio(active.value, first)} of ${data[0]?.label ?? ""}`
		: "",
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
		<FunnelPlot
			{frame}
			{data}
			{orientation}
			{edges}
			{labelLayout}
			{pattern}
			{layers}
			{gap}
			{grid}
			{showValues}
			{showPercentage}
			{showLabels}
			{animate}
			{activeIndex}
			{instant}
			{setActive}
		/>
	{/snippet}
</ChartFrame>
