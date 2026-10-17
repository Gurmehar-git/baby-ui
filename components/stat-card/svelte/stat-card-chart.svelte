<script lang="ts">
import type { Snippet } from "svelte";
import Area from "../../area-chart/svelte/area.svelte";
import AreaChart from "../../area-chart/svelte/area-chart.svelte";
import { type ChartStatus, toDate } from "../../chart/core";
import ChartContainer from "../../chart/svelte/chart-container.svelte";
import { cn } from "../../lib/cn";
import Line from "../../line-chart/svelte/line.svelte";
import LineChart from "../../line-chart/svelte/line-chart.svelte";
import { statSummary } from "../variants";
import { statCardState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();
const card = statCardState();

const month = $derived(new Intl.DateTimeFormat(card.locale, { month: "short" }));
const chartStatus = $derived<ChartStatus>(
	card.status === "loading" ? "loading" : "ready",
);
const config = $derived({ [card.dataKey]: { label: card.name, color: card.color } });
const summary = $derived(
	statSummary({
		data: card.data,
		dataKey: card.dataKey,
		xKey: card.xKey,
		formatValue: card.number,
		formatDate: (v) => month.format(toDate(v)),
	}),
);
const margin = { top: 4, right: 0, bottom: 0, left: 0 };
</script>

<!-- The series chart; hovering a point drives the value and trend. Extra chart layers go inside. -->
{#if card.chart !== "none"}
	<div data-slot="stat-card-chart" class={cn(card.styles.chart(), classProp)}>
		<ChartContainer {config} title={card.name} description={summary} aspect="auto" locale={card.locale}>
			{#if card.chart === "line"}
				<LineChart
					data={card.data}
					xKey={card.xKey}
					{margin}
					status={chartStatus}
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
					status={chartStatus}
					bind:activeIndex={() => card.activeIndex, card.setActive}
				>
					<Area dataKey={card.dataKey} curve="monotone" fillOpacity={0.45} />
					{@render children?.()}
				</AreaChart>
			{/if}
		</ChartContainer>
	</div>
{/if}
