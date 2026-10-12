<script lang="ts">
import { Button, ChartContainer, ChartLegend, WaffleChart } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { ENERGY_MIX_2015, ENERGY_MIX_2024, ENERGY_MIX_CONFIG } from "../data/energy-mix";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof WaffleChart>>(props));
let recent = $state(true);
</script>

<div class="grid w-full max-w-sm gap-3">
	<ChartContainer config={ENERGY_MIX_CONFIG} title="Electricity generation, {recent ? 2024 : 2015}" aspect="square">
		<WaffleChart data={recent ? ENERGY_MIX_2024 : ENERGY_MIX_2015} variant={p.variant ?? "mixed"} />
		<ChartLegend />
	</ChartContainer>
	<Button variant="outline" size="sm" class="justify-self-center" onclick={() => (recent = !recent)}
		>Show {recent ? 2015 : 2024}</Button
	>
</div>
