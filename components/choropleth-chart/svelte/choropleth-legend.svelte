<script lang="ts">
import { useChart } from "../../chart/svelte/context";
import { cn } from "../../lib/svelte/cn";
import { scaleFill } from "./geometry";
import { choroplethChart } from "./variants";

let { values, noData }: { values: Record<string, number>; noData: string } = $props();

const chart = useChart();
const styles = choroplethChart();
const known = $derived(Object.values(values).filter((v) => Number.isFinite(v)));
const steps = [0, 1, 2, 3, 4];
</script>

{#if known.length}
	<div data-slot="choropleth-legend" class={styles.legend()}>
		<div class={styles.scale()}>
			<span>{chart.format.compact(Math.min(...known))}</span>
			{#each steps as step (step)}
				<span aria-hidden="true" class={styles.swatch()} style:background={scaleFill(step)}></span>
			{/each}
			<span>{chart.format.compact(Math.max(...known))}</span>
		</div>
		<div class={styles.scale()}>
			<span aria-hidden="true" class={cn(styles.swatch(), "border border-border bg-muted")}></span>
			<span>{noData}</span>
		</div>
	</div>
{/if}
