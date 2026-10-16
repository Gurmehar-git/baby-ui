<script lang="ts">
import { portal, useActivePoint, usePlot } from "../../chart/svelte/context";
import { follow } from "../../chart/svelte/follow.svelte";
import { CHART_SPRING, Spring } from "../../chart/svelte/motion";
import { chartTooltip } from "../../chart/svelte/variants";

let { target, format }: { target: HTMLElement; format: (ms: number) => string } =
	$props();

const plot = usePlot();
const pointer = useActivePoint();
let pill = $state<HTMLDivElement | null>(null);
const left = new Spring(0, CHART_SPRING.tooltip, (v) => {
	if (pill) pill.style.left = `${v}px`;
});
follow(
	left,
	() => (pill && pointer.active ? pointer.active.x + plot.margin.left : null),
	() => pointer.instant,
);
</script>

{#if pointer.active}
	{@const active = pointer.active}
	<div
		{@attach portal(target)}
		bind:this={pill}
		data-slot="chart-live-pill"
		aria-hidden="true"
		class="-translate-x-1/2 absolute bottom-1 z-20"
	>
		<div class={chartTooltip().pill()}>
			<span class="whitespace-nowrap tabular-nums">
				{format(plot.xScale.invert(active.x).getTime())}
			</span>
		</div>
	</div>
{/if}
