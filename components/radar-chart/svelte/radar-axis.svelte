<svelte:options namespace="svg" />

<script lang="ts">
import { useRadar } from "./context";
import { enterSpring } from "./enter.svelte";
import { angleAt, RADAR_SPRING, RADAR_TIMING } from "./geometry";
import { radar } from "./variants";

let { class: className }: { class?: string } = $props();

const ctx = useRadar();
const axisClass = radar().axis();
</script>

<g data-slot="radar-axis" class={className}>
	{#each ctx.metrics as metric, i (metric.key)}
		<line
			{@attach enterSpring(RADAR_SPRING.axis, i * RADAR_TIMING.axisStagger, ctx.animate, (node, p) => {
				const angle = angleAt(i, ctx.metrics.length);
				node.setAttribute("x2", String(ctx.radius * Math.cos(angle) * p));
				node.setAttribute("y2", String(ctx.radius * Math.sin(angle) * p));
			})}
			x1={0}
			y1={0}
			class={axisClass}
		/>
	{/each}
</g>
