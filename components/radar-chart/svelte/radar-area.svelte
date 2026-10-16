<svelte:options namespace="svg" />

<script lang="ts">
import { useActivePoint, useChart } from "../../chart/svelte/context";
import { CHART_DURATION, CHART_EASE, Spring, tween } from "../../chart/svelte/motion";
import { cn } from "../../lib/svelte/cn";
import { useRadar } from "./context";
import {
	markerPath,
	polygonPath,
	RADAR_SPRING,
	RADAR_TIMING,
	seriesColor,
	seriesDash,
	seriesKey,
	seriesPoints,
} from "./geometry";
import { radar } from "./variants";

let {
	index,
	showPoints = true,
	class: className,
}: {
	index: number;
	/** Point markers, one shape per series so series differ without colour. */
	showPoints?: boolean;
	class?: string;
} = $props();

const ctx = useRadar();
const pointer = useActivePoint();
// svelte-ignore state_referenced_locally
let progress = $state(ctx.animate ? 0 : 1);
// svelte-ignore state_referenced_locally
let visible = $state(!ctx.animate);
let group = $state<SVGGElement | null>(null);

$effect(() => {
	const frame = requestAnimationFrame(() => {
		visible = true;
	});
	return () => cancelAnimationFrame(frame);
});
$effect(() => {
	if (!ctx.animate) return;
	const delay =
		ctx.levels * RADAR_TIMING.gridStagger +
		RADAR_TIMING.areaBase +
		index * RADAR_TIMING.areaStagger;
	const playback = tween({
		duration: CHART_DURATION.enter,
		delay: delay * 1000,
		ease: CHART_EASE,
		onUpdate: (p) => {
			progress = p;
		},
	});
	return () => playback.stop();
});

const scale = new Spring(1, RADAR_SPRING.hover, (v) => {
	if (group) group.style.transform = `scale(${v})`;
});
const isActive = $derived(pointer.active?.index === index);
const isOther = $derived(pointer.active !== null && !isActive);
$effect(() => {
	const target = isActive ? 1.05 : 1;
	if (pointer.instant) scale.jump(target);
	else scale.set(target);
});
$effect(() => () => scale.stop());

const series = $derived(ctx.data[index]);
const points = $derived(
	series ? seriesPoints(series, ctx.metrics, ctx.radius, ctx.max, progress) : [],
);
const color = $derived(series ? seriesColor(series, index) : "currentColor");
const chart = useChart();
const isHidden = $derived(series ? chart.hidden.has(seriesKey(series)) : false);
const styles = $derived(radar({ variant: ctx.variant }));
</script>

{#if series}
	<g
		data-slot="radar-area"
		data-series={index}
		class={cn(styles.area(), className)}
		style:color
		style:opacity={visible && !isHidden ? (isOther ? 0.3 : 1) : 0}
		style:pointer-events={isHidden ? "none" : undefined}
		style:filter={isActive ? `drop-shadow(0 0 12px ${color})` : undefined}
		onpointerenter={() => ctx.setActive(index, false)}
		role="presentation"
	>
		<g bind:this={group} style:transform-origin="0 0">
			<path
				d={polygonPath(points)}
				class={styles.shape()}
				stroke="currentColor"
				stroke-dasharray={seriesDash(index) || undefined}
				style:fill-opacity={isActive ? 0.35 : 0.15}
				style:stroke-width={isActive ? 3 : 2}
			/>
			{#if showPoints}
				{#each points as p, i (ctx.metrics[i]?.key ?? i)}
					<path
						d={markerPath(index, 4)}
						class={styles.marker()}
						fill="currentColor"
						stroke-width={2}
						style:transform="translate({p.x}px, {p.y}px) scale({isActive ? 1.5 : 1})"
					/>
				{/each}
			{/if}
		</g>
	</g>
{/if}
