<svelte:options namespace="svg" />

<script lang="ts">
import { useChart } from "../../chart/svelte/context";
import { CHART_DURATION, CHART_EASE } from "../../chart/svelte/motion";
import { useRadar } from "./context";
import { enterSpring, enterTween } from "./enter.svelte";
import { RADAR_SPRING, RADAR_TIMING, ringPath } from "./geometry";
import { radar } from "./variants";

let {
	showLevels = true,
	class: className,
}: {
	/** Print each ring's value beside the first axis. */
	showLevels?: boolean;
	class?: string;
} = $props();

const chart = useChart();
const ctx = useRadar();
const ringClass = $derived(radar({ grid: ctx.grid }).ring());
const levelClass = radar().level();
</script>

<g data-slot="radar-grid" class={className}>
	{#each Array.from({ length: ctx.levels }, (_, i) => i) as i (i)}
		<path
			{@attach enterSpring(RADAR_SPRING.grid, i * RADAR_TIMING.gridStagger, ctx.animate, (node, p) => {
				node.style.transform = `scale(${0.9 + 0.1 * p})`;
				node.style.opacity = String(Math.min(1, Math.max(0, p)));
			})}
			d={ringPath(ctx.grid, ctx.metrics.length, ((i + 1) * ctx.radius) / ctx.levels)}
			class={ringClass}
			style:transform-origin="0 0"
		/>
	{/each}
	{#if showLevels}
		{#each Array.from({ length: ctx.levels }, (_, i) => i) as i (i)}
			<text
				{@attach enterTween(
					CHART_DURATION.enter,
					ctx.levels * RADAR_TIMING.gridStagger * 0.5 + i * RADAR_TIMING.levelLabelStep,
					ctx.animate,
					(node, p) => {
						node.style.opacity = String(p);
					},
					CHART_EASE,
				)}
				x={4}
				y={-((i + 1) * ctx.radius) / ctx.levels}
				dominant-baseline="middle"
				class={levelClass}
			>
				{chart.format.compact(((i + 1) * ctx.max) / ctx.levels)}
			</text>
		{/each}
	{/if}
</g>
