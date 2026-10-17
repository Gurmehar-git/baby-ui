<svelte:options namespace="svg" />

<script lang="ts">
import { fitTickCount } from "../../chart/core";
import { useActivePoint, usePlot } from "../../chart/svelte/context";
import { cn } from "../../lib/cn";
import { crosshairFade } from "../live";
import { liveAxis } from "../variants";
import { useLive } from "./context";
import LiveTimePill from "./live-time-pill.svelte";

let {
	numTicks = 5,
	formatTime,
	pill = true,
	class: className,
}: {
	numTicks?: number;
	/** Formats wall-clock ms; defaults to the chart's `formatTime`. */
	formatTime?: (ms: number) => string;
	/** Time pill that follows the crosshair. */
	pill?: boolean;
	class?: string;
} = $props();

const plot = usePlot();
const live = useLive();
const pointer = useActivePoint();
const styles = liveAxis();
const fmt = $derived(formatTime ?? live.formatTime);
const range = $derived(plot.xScale.domain().map((d) => d.getTime()) as [number, number]);
/** Room for one "11:22:49 pm" time label plus breathing space. */
const TIME_LABEL_GAP = 72;
const count = $derived(fitTickCount(numTicks, plot.innerWidth, TIME_LABEL_GAP));
</script>

<g data-slot="chart-live-x-axis" class={className}>
	{#each { length: count }, i (i)}
		{@const px = (i / (count - 1)) * plot.innerWidth}
		<text
			class={cn(styles.tick(), styles.timeLabel())}
			x={px}
			y={plot.innerHeight + plot.margin.bottom - 12}
			text-anchor="middle"
			style:opacity={crosshairFade(px, pointer.active ? pointer.active.x : null)}
		>
			{fmt(range[0] + ((range[1] - range[0]) * i) / (count - 1))}
		</text>
	{/each}
</g>
{#if pill && plot.plotEl}
	<LiveTimePill target={plot.plotEl} format={fmt} />
{/if}
