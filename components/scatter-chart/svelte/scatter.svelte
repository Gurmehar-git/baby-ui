<svelte:options namespace="svg" />

<script lang="ts">
import { untrack } from "svelte";
import { seriesColor } from "../../chart/core";
import { useActivePoint, useChart, usePlot } from "../../chart/svelte/context";
import { enterDelay, shapePath } from "../geometry";
import {
	SCATTER_RADIUS,
	type ScatterShape,
	type ScatterSize,
	scatterPoint,
} from "../variants";
import { useScatterRoot } from "./context";

let {
	dataKey,
	fill,
	size = "default",
	shape,
	class: className,
}: {
	dataKey: string;
	/** Defaults to the series colour from the chart config, `var(--color-<dataKey>)`. */
	fill?: string;
	size?: ScatterSize;
	/** Overrides the shape assigned by series order. */
	shape?: ScatterShape;
	class?: string;
} = $props();

const plot = usePlot();
const root = useScatterRoot();
const pointer = useActivePoint();
const chart = useChart();
const color = $derived(fill ?? seriesColor(dataKey));
const radius = $derived(SCATTER_RADIUS[size]);
const resolvedShape = $derived(shape ?? root.shapeFor(dataKey));
const d = $derived(shapePath(resolvedShape, radius));
const shown = $derived(plot.phase === "ready" || plot.phase === "concealing");

$effect(() => {
	const next = { key: dataKey, color };
	return untrack(() => plot.register(next));
});

function enter(id: string, delay: number) {
	return (el: SVGGElement) => root.registerEnter(id, el, delay);
}
</script>

<g
	data-slot="chart-scatter"
	data-series={dataKey}
	clip-path="url(#{plot.clipId})"
	class={className}
	style:opacity={chart.hidden.has(dataKey) ? 0 : 1}
>
	{#each plot.data as datum, index (index)}
		{@const value = datum[dataKey]}
		{#if typeof value === "number" && Number.isFinite(value)}
			{@const px = plot.x(datum)}
			{@const py = plot.yScale(value)}
			{@const isActive =
				pointer.active !== null &&
				pointer.active.index === index &&
				(root.activeKey === null || root.activeKey === dataKey)}
			{@const dimmed =
				(pointer.active !== null && !isActive) ||
				(chart.highlighted !== null && chart.highlighted !== dataKey)}
			{@const styles = scatterPoint({ size, shape: resolvedShape, dimmed })}
			<g class={styles.point()}>
				<g
					{@attach enter(`${dataKey}-${index}`, enterDelay(px, radius, plot.innerWidth))}
					transform="translate({px},{py})"
					style:opacity={shown ? undefined : 0}
				>
					<path
						{d}
						data-active={isActive ? "" : undefined}
						class={styles.mark()}
						style:--point={color}
					/>
				</g>
			</g>
		{/if}
	{/each}
</g>
