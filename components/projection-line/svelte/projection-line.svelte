<svelte:options namespace="svg" />

<script lang="ts">
import { untrack } from "svelte";
import { seriesVisibleInPhase } from "../../chart/core";
import { usePlot } from "../../chart/svelte/context";
import { useExtentRegistry } from "../../chart/svelte/time-series-chart.svelte";
import {
	bezierPath,
	type ProjectionPoint,
	projectionExtent,
	visibleEndX,
} from "../geometry";
import {
	type ProjectionLineCurve,
	type ProjectionLineVariant,
	projectionLine,
} from "../variants";

let {
	data,
	variant = "dashed",
	curve = "linear",
	stroke = "var(--chart-3)",
	gradientEnd = "var(--chart-5)",
	strokeWidth = 2,
	endMarker = true,
	endRadius = 5,
	class: className,
}: {
	/** Anchor plus horizon, e.g. from `buildProjection`; the chart widens to fit it. */
	data: ProjectionPoint[];
	variant?: ProjectionLineVariant;
	curve?: ProjectionLineCurve;
	stroke?: string;
	/** End colour when `variant` is gradient. */
	gradientEnd?: string;
	strokeWidth?: number;
	endMarker?: boolean;
	endRadius?: number;
	class?: string;
} = $props();

const plot = usePlot();
const register = useExtentRegistry();
const uid = $props.id();
const id = `${uid}-projection`;
const extent = $derived(projectionExtent(data));

$effect(() => {
	const next = extent;
	if (!next) return;
	return untrack(() => register(id, next));
});

const start = $derived(data[0]);
const end = $derived(data.at(-1));
const geometry = $derived.by(() => {
	if (!(start && end) || data.length < 2) return null;
	const x0 = plot.xScale(start.date);
	const y0 = plot.yScale(start.value);
	const x1 = visibleEndX(
		plot.xScale(end.date),
		plot.innerWidth,
		endMarker ? endRadius : 0,
		strokeWidth,
	);
	const y1 = plot.yScale(end.value);
	return {
		x0,
		y0,
		x1,
		y1,
		d: curve === "bezier" ? bezierPath(x0, y0, x1, y1) : `M${x0},${y0}L${x1},${y1}`,
	};
});
const drawn = $derived(seriesVisibleInPhase(plot.phase));
const styles = $derived(projectionLine({ variant, curve }));
const color = $derived(variant === "gradient" ? `url(#${id}-g)` : stroke);
</script>

{#if geometry}
	<g data-slot="chart-projection" class={className}>
		{#if variant === "gradient"}
			<defs>
				<linearGradient
					id="{id}-g"
					gradientUnits="userSpaceOnUse"
					x1={geometry.x0}
					x2={geometry.x1}
					y1={geometry.y0}
					y2={geometry.y1}
				>
					<stop offset="0%" stop-color={stroke} />
					<stop offset="100%" stop-color={gradientEnd} />
				</linearGradient>
			</defs>
		{/if}
		<g clip-path="url(#{plot.clipId})">
			<path
				d={geometry.d}
				class={styles.line()}
				stroke={drawn ? color : "transparent"}
				stroke-width={strokeWidth}
			/>
		</g>
		{#if endMarker}
			<circle
				data-slot="chart-projection-end"
				cx={geometry.x1}
				cy={geometry.y1}
				r={endRadius * 0.85}
				fill={variant === "gradient" ? gradientEnd : stroke}
				class={styles.marker()}
				style:opacity={plot.phase === "ready" ? 1 : 0}
			/>
		{/if}
	</g>
{/if}
