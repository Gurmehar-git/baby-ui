<svelte:options namespace="svg" />

<script lang="ts">
import { useActivePoint, useChart, usePlot } from "../../chart/svelte/context";
import { toDate } from "../../chart/svelte/core";
import ChartMarkerLayer from "./chart-marker-layer.svelte";
import { dayKey, GUIDE_TRANSITION, groupMarkers, MARKER_OFFSET } from "./geometry";
import type { ChartMarker } from "./types";
import {
	type ChartMarkerAppearance,
	type ChartMarkerSize,
	chartMarkers,
	MARKER_PX,
} from "./variants";

let {
	items,
	size = "default",
	appearance = "solid",
	showLines = true,
	groupLabel,
}: {
	items: ChartMarker[];
	size?: ChartMarkerSize;
	appearance?: ChartMarkerAppearance;
	/** Dashed guide from each marker down to the plot floor. */
	showLines?: boolean;
	/** Accessible name for a stacked group; defaults to a count and the date. */
	groupLabel?: (count: number, date: Date) => string;
} = $props();

const plot = usePlot();
const pointer = useActivePoint();
const chart = useChart();
let hoveredKey = $state<string | null>(null);
const groups = $derived(groupMarkers(items));
const styles = $derived(chartMarkers({ size, appearance }));
const px = $derived(MARKER_PX[size]);
const activeKey = $derived(
	pointer.active ? dayKey(toDate(pointer.active.datum[plot.xKey])) : null,
);
const label = $derived(
	groupLabel ??
		((count: number, date: Date) => `${count} events, ${chart.format.title(date)}`),
);
const visible = $derived(plot.phase === "ready");
const placed = $derived(
	groups
		.map((group) => ({ group, x: plot.xScale(group.date) }))
		.filter(({ x }) => x >= 0 && x <= plot.innerWidth),
);
function guideOpacity(key: string) {
	if (!visible) return 0;
	if (hoveredKey === key) return 1;
	return activeKey === key ? 0 : 0.6;
}
</script>

{#if showLines}
	<g data-slot="chart-marker-guides">
		{#each placed as { group, x } (group.key)}
			<line
				class={styles.guide()}
				x1={x}
				x2={x}
				y1={MARKER_OFFSET + px / 2 + 4}
				y2={plot.innerHeight}
				style:stroke-opacity={guideOpacity(group.key)}
				style:transition={GUIDE_TRANSITION}
			/>
		{/each}
	</g>
{/if}
{#if plot.plotEl}
	<ChartMarkerLayer
		target={plot.plotEl}
		{placed}
		marginLeft={plot.margin.left}
		top={plot.margin.top + MARKER_OFFSET}
		{visible}
		animate={plot.animate}
		{size}
		{appearance}
		groupLabel={label}
		onHoverChange={(key) => (hoveredKey = key)}
	/>
{/if}
