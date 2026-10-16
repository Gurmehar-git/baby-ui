<script lang="ts">
import ChartFrame from "../../chart/svelte/chart-frame.svelte";
import { useChart } from "../../chart/svelte/context";
import type { Margin } from "../../chart/svelte/core";
import {
	type LaidLink,
	layoutSankey,
	SANKEY_MARGIN,
	SANKEY_TEXT,
	type SankeyData,
	type SankeyText,
} from "./layout";
import SankeyPlot from "./sankey-plot.svelte";
import type { SankeyLinkColor, SankeyOrientation } from "./variants";

let {
	data,
	orientation = "horizontal",
	linkColor = "gradient",
	nodeWidth = 16,
	nodePadding = 24,
	labels = true,
	margin,
	text: textProp,
	animate = true,
	activeIndex = $bindable(null),
	onActiveIndexChange,
	roleDescription = "sankey diagram",
	class: className,
}: {
	data: SankeyData;
	orientation?: SankeyOrientation;
	linkColor?: SankeyLinkColor;
	nodeWidth?: number;
	nodePadding?: number;
	/** Node names and values beside each node. */
	labels?: boolean;
	margin?: Partial<Margin>;
	text?: Partial<SankeyText>;
	animate?: boolean;
	/** Index of the highlighted link. */
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	roleDescription?: string;
	class?: string;
} = $props();

const chart = useChart();
const text = $derived({ ...SANKEY_TEXT, ...textProp });
let instant = $state(false);
function setActive(index: number | null, fromKeyboard: boolean) {
	instant = fromKeyboard;
	activeIndex = index;
	onActiveIndexChange?.(index);
}
// Table and summary read the unscaled graph, so they do not wait for layout.
const flows = $derived(
	layoutSankey(data, {
		width: 1000,
		height: 600,
		nodeWidth,
		nodePadding,
		flow: "horizontal",
	}),
);
const name = (index: number) => data.nodes[index]?.name ?? "";
const largest = $derived(
	flows.links.reduce<LaidLink | undefined>(
		(best, l) => (!best || l.value > best.value ? l : best),
		undefined,
	),
);
const active = $derived(activeIndex !== null ? flows.links[activeIndex] : undefined);
const summary = $derived(
	chart.description ??
		(largest
			? `${data.nodes.length} nodes and ${flows.links.length} flows. Largest flow: ${name(largest.source)} to ${name(largest.target)}, ${chart.format.number(largest.value)}.`
			: "No data."),
);
const table = $derived({
	columns: text.headers,
	rows: flows.links.map((l) => ({
		header: name(l.source),
		cells: [name(l.target), chart.format.number(l.value), chart.format.percent(l.share)],
	})),
});
const announcement = $derived(
	active && instant
		? `${name(active.source)} to ${name(active.target)}: ${chart.format.number(active.value)}, ${chart.format.percent(active.share)}`
		: "",
);
</script>

<ChartFrame
	{roleDescription}
	{summary}
	{table}
	count={flows.links.length}
	{activeIndex}
	onActiveChange={setActive}
	interactive={flows.links.length > 0}
	{announcement}
	class={className}
>
	{#snippet children(frame)}
		<SankeyPlot
			{frame}
			{data}
			{orientation}
			{linkColor}
			{nodeWidth}
			{nodePadding}
			{labels}
			margin={{ ...SANKEY_MARGIN[orientation], ...margin }}
			{text}
			{animate}
			{activeIndex}
			{instant}
			{setActive}
		/>
	{/snippet}
</ChartFrame>
