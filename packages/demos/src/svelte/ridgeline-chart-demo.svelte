<script lang="ts">
import { Button, ChartContainer, RidgelineChart } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { dailyHighs } from "../data/temperatures";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof RidgelineChart>>(props));
const YEAR_A = dailyHighs(7);
const YEAR_B = dailyHighs(19, 1.8);
let later = $state(false);
</script>

<div class="grid w-full max-w-2xl gap-3">
	<ChartContainer config={{}} title="Daily highs, {later ? 2025 : 2015}" aspect="video">
		<RidgelineChart series={later ? YEAR_B : YEAR_A} unit="°C" variant={p.variant} />
	</ChartContainer>
	<Button variant="outline" size="sm" class="justify-self-start" onclick={() => (later = !later)}
		>Show {later ? 2015 : 2025}</Button
	>
</div>
