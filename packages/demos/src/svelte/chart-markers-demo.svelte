<script lang="ts">
import {
	CartesianGrid,
	ChartContainer,
	ChartMarkers,
	ChartMarkerTooltip,
	ChartTooltip,
	ChartTooltipContent,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { EVENTS } from "../data/events";
import { controlProps } from "../data/preview-props";
import { VISITORS, VISITORS_CONFIG } from "../data/visitors";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ChartMarkers>>(props));

const markers = EVENTS.map((event, i) =>
	i === 0
		? {
				...event,
				href: "https://github.com/kanakkholwal/baby-ui",
				target: "_blank" as const,
			}
		: event,
);
</script>

<div class="w-full max-w-3xl pt-6">
	<ChartContainer config={VISITORS_CONFIG} title="Daily visitors with release notes">
		<LineChart data={VISITORS} margin={{ top: 32 }}>
			<CartesianGrid />
			<YAxis />
			<XAxis />
			<Line dataKey="desktop" />
			<ChartMarkers
				items={markers}
				size={p.size ?? "default"}
				appearance={p.appearance ?? "solid"}
				showLines={props.showLines !== false}
			/>
			<ChartTooltip>
				{#snippet content()}
					<ChartTooltipContent />
					<ChartMarkerTooltip items={markers} />
				{/snippet}
			</ChartTooltip>
		</LineChart>
	</ChartContainer>
</div>
