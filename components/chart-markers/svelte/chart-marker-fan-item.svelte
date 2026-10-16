<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import ChartMarkerDisc from "./chart-marker-disc.svelte";
import { FAN_STAGGER, fanPosition, MARKER_SPRING, popStyle } from "./geometry";
import { assign, type ChartMarker, spring } from "./types";
import type { chartMarkers } from "./variants";

let {
	marker,
	index,
	total,
	open,
	styles,
}: {
	marker: ChartMarker;
	index: number;
	total: number;
	open: boolean;
	styles: ReturnType<typeof chartMarkers>;
} = $props();

let el = $state<HTMLDivElement | null>(null);
const pos = $derived(fanPosition(index, total));
const motion = spring(MARKER_SPRING.fan, (v) => assign(el, popStyle(v, pos.x, pos.y)));
$effect(() => {
	const target = open ? 1 : 0;
	const timer = setTimeout(() => motion.set(target), index * FAN_STAGGER);
	return () => clearTimeout(timer);
});
$effect(() => () => motion.stop());
</script>

<div
	bind:this={el}
	data-slot="chart-marker-fan-item"
	class={cn(styles.fanItem(), "size-full", open && "pointer-events-auto")}
	style:opacity="0"
>
	<ChartMarkerDisc {marker} label={marker.title} class={styles.disc()} tabindex={open ? 0 : -1} />
</div>
