<script lang="ts">
import {
	CartesianGrid,
	ChartContainer,
	ChartLegend,
	ChartTooltip,
	Scatter,
	ScatterChart,
	XAxis,
	YAxis,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { READINGS, READINGS_CONFIG } from "../data/prices";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Scatter>>(props));
const pChart = $derived(controlProps<ComponentProps<typeof ScatterChart>>(props));

const size = $derived(p.size ?? "default");
const shape = $derived(props.shape && props.shape !== "auto" ? p.shape : undefined);
</script>

<div class="w-full max-w-3xl">
	<ChartContainer config={READINGS_CONFIG} title="Sensor readings">
		<ScatterChart data={READINGS} status={pChart.status ?? "ready"}>
			<CartesianGrid />
			<YAxis />
			<XAxis />
			<Scatter dataKey="north" {size} {shape} />
			<Scatter dataKey="south" {size} {shape} />
			<Scatter dataKey="east" {size} {shape} />
			<ChartTooltip dots={false} />
		</ScatterChart>
		<ChartLegend />
	</ChartContainer>
</div>
