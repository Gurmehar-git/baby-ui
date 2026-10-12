<script lang="ts">
import { Button, ChartContainer, SlopeChart } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import {
	CONVERSION_BY_CHANNEL,
	CONVERSION_CONFIG,
	CONVERSION_NEXT,
} from "../data/conversion";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof SlopeChart>>(props));
let later = $state(false);
</script>

<div class="grid w-full max-w-2xl gap-3">
	<ChartContainer config={CONVERSION_CONFIG} title="Conversion rate by channel" aspect="video">
		<SlopeChart
			data={later ? CONVERSION_NEXT : CONVERSION_BY_CHANNEL}
			startLabel={later ? "Q2" : "Q1"}
			endLabel={later ? "Q3" : "Q2"}
			highlightKey="email"
			variant={p.variant}
		/>
	</ChartContainer>
	<Button variant="outline" size="sm" class="justify-self-start" onclick={() => (later = !later)}
		>{later ? "Show Q1 to Q2" : "Show Q2 to Q3"}</Button
	>
</div>
