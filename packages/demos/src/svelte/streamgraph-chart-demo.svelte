<script lang="ts">
import { ChartContainer, ChartLegend, StreamgraphChart } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { TICKETS_BY_TOPIC, TICKETS_CONFIG } from "../data/tickets";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof StreamgraphChart>>(props));
</script>

<div class="w-full max-w-3xl">
	<ChartContainer config={TICKETS_CONFIG} title="Support tickets by topic" aspect="video">
		<ChartLegend />
		<StreamgraphChart data={TICKETS_BY_TOPIC} xKey="week" variant={p.variant} directLabels={p.directLabels} />
	</ChartContainer>
</div>
