<script lang="ts">
import ToggleGroup from "../../toggle-group/svelte/toggle-group.svelte";
import ToggleGroupItem from "../../toggle-group/svelte/toggle-group-item.svelte";
import { pricing01State } from "./context";

let { label = "Billing period", class: classProp }: { label?: string; class?: string } =
	$props();
const pricing = pricing01State();
</script>

<!-- The billing period toggle; renders nothing with fewer than two periods. -->
{#if pricing.periods.length > 1}
	<ToggleGroup
		data-slot="pricing-01-periods"
		type="single"
		size="sm"
		bind:value={() => pricing.current?.value ?? "", pricing.setPeriod}
		{label}
		class={classProp}
	>
		{#each pricing.periods as p (p.value)}
			<ToggleGroupItem value={p.value}>{p.label}</ToggleGroupItem>
		{/each}
	</ToggleGroup>
{/if}
