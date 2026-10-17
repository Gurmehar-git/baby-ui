<svelte:options namespace="svg" />

<script lang="ts">
import type { Snippet } from "svelte";
import ChartTooltipContent from "../../chart/svelte/chart-tooltip-content.svelte";
import ChartTooltipPanel from "../../chart/svelte/chart-tooltip-panel.svelte";
import { useActivePoint } from "../../chart/svelte/context";
import { seriesPoints } from "../geometry";
import { useRadar } from "./context";

let { content, class: className }: { content?: Snippet; class?: string } = $props();

const ctx = useRadar();
const pointer = useActivePoint();
const anchor = $derived.by(() => {
	const series = pointer.active ? ctx.data[pointer.active.index] : undefined;
	if (!series) return null;
	const points = seriesPoints(series, ctx.metrics, ctx.radius, ctx.max);
	const right = points.reduce((a, b) => (b.x > a.x ? b : a), points[0] ?? { x: 0, y: 0 });
	return { x: ctx.center.x + right.x, y: ctx.center.y + right.y };
});
</script>

{#if ctx.frame.el}
	<ChartTooltipPanel
		target={ctx.frame.el}
		{anchor}
		instant={pointer.instant}
		bounds={{ width: ctx.frame.width, height: ctx.frame.height }}
		class={className}
	>
		{#if content}
			{@render content()}
		{:else}
			<ChartTooltipContent />
		{/if}
	</ChartTooltipPanel>
{/if}
