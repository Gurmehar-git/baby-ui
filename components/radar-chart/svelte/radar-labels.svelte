<svelte:options namespace="svg" />

<script lang="ts">
import { useRadar } from "./context";
import { enterSpring, enterTween } from "./enter.svelte";
import { angleAt, RADAR_SPRING, RADAR_TIMING } from "./geometry";
import { radar } from "./variants";

let {
	offset = 20,
	class: className,
}: {
	/** Distance past the outer ring, in px. */
	offset?: number;
	class?: string;
} = $props();

const ctx = useRadar();
const labelClass = radar().label();
</script>

<g data-slot="radar-labels" class={className}>
	{#each ctx.metrics as metric, i (metric.key)}
		<g
			{@attach enterSpring(RADAR_SPRING.axis, 0, ctx.animate, (node, p) => {
				const angle = angleAt(i, ctx.metrics.length);
				const r = ctx.radius + offset;
				node.style.transform = `translate(${r * Math.cos(angle) * p}px, ${r * Math.sin(angle) * p}px)`;
			})}
		>
			<text
				{@attach enterTween(
					RADAR_TIMING.labelFade,
					ctx.levels * RADAR_TIMING.gridStagger * 0.5 + i * RADAR_TIMING.labelStagger,
					ctx.animate,
					(node, p) => {
						node.style.opacity = String(p);
					},
				)}
				text-anchor="middle"
				dominant-baseline="middle"
				class={labelClass}
			>
				{metric.label}
			</text>
		</g>
	{/each}
</g>
