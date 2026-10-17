<script lang="ts">
import type { Snippet } from "svelte";
import Area from "../../area-chart/svelte/area.svelte";
import AreaChart from "../../area-chart/svelte/area-chart.svelte";
import ChartContainer from "../../chart/svelte/chart-container.svelte";
import { cn } from "../../lib/cn";
import Line from "../../line-chart/svelte/line.svelte";
import LineChart from "../../line-chart/svelte/line-chart.svelte";
import { overviewCardState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();
const card = overviewCardState();

const config = $derived({ [card.dataKey]: { label: card.name, color: card.color } });
const margin = { top: 8, right: 0, bottom: 0, left: 0 };
</script>

<!-- The series chart; hovering a point drives the headline. Extra chart layers go inside. -->
<div data-slot="overview-card-chart" class={cn(card.styles.chart(), classProp)}>
	<ChartContainer {config} title={card.name} aspect="auto" locale={card.locale}>
		{#if card.chart === "line"}
			<LineChart
				data={card.data}
				xKey={card.xKey}
				{margin}
				status={card.status}
				bind:activeIndex={() => card.activeIndex, card.setActive}
			>
				<Line dataKey={card.dataKey} curve="monotone" strokeWidth={2} />
				{@render children?.()}
			</LineChart>
		{:else}
			<AreaChart
				data={card.data}
				xKey={card.xKey}
				{margin}
				status={card.status}
				bind:activeIndex={() => card.activeIndex, card.setActive}
			>
				<Area dataKey={card.dataKey} curve="monotone" fillOpacity={0.35} />
				{@render children?.()}
			</AreaChart>
		{/if}
	</ChartContainer>
</div>
