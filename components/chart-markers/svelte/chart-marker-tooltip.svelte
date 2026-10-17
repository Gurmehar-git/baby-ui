<script lang="ts">
import { toDate } from "../../chart/core";
import { useActivePoint, usePlot } from "../../chart/svelte/context";
import { cn } from "../../lib/cn";
import { dayKey } from "../geometry";
import { chartMarkers } from "../variants";
import type { ChartMarker } from "./types";

let {
	items,
	max = 2,
	moreLabel = (hidden: number) => `+${hidden} more`,
	class: className,
}: {
	items: ChartMarker[];
	/** How many markers to list before collapsing into a count. */
	max?: number;
	moreLabel?: (hidden: number) => string;
	class?: string;
} = $props();

const pointer = useActivePoint();
const plot = usePlot();
const styles = chartMarkers();
const matches = $derived.by(() => {
	const active = pointer.active;
	if (!active) return [];
	const key = dayKey(toDate(active.datum[plot.xKey]));
	return items.filter((m) => dayKey(m.date) === key);
});
</script>

{#if matches.length}
	<div data-slot="chart-marker-tooltip" class={cn(styles.tooltip(), className)}>
		{#each matches.slice(0, max) as marker (marker.title)}
			<div class={styles.tooltipRow()}>
				<span
					aria-hidden="true"
					class="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border border-border-strong bg-card text-xs"
					style:background={marker.color}
				>
					{#if marker.icon}
						{@render marker.icon()}
					{:else}
						{marker.title.slice(0, 1).toUpperCase()}
					{/if}
				</span>
				<div class="min-w-0">
					<div class={styles.tooltipTitle()}>{marker.title}</div>
					{#if marker.description}
						<div class={styles.tooltipText()}>{marker.description}</div>
					{/if}
				</div>
			</div>
		{/each}
		{#if matches.length > max}
			<div class={styles.tooltipText()}>{moreLabel(matches.length - max)}</div>
		{/if}
	</div>
{/if}
