<script lang="ts">
import { NumberInput } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof NumberInput>>(props));

const size = $derived(p.size ?? "default");
let seats = $state<number | null>(5);
let budget = $state<number | null>(1200);
</script>

<div class="flex w-full max-w-60 flex-col gap-5">
	<NumberInput
		label="Seats"
		bind:value={seats}
		min={1}
		max={50}
		variant={p.variant ?? "default"}
		{size}
		suffix={p.suffix || undefined}
		disabled={p.disabled ?? false}
		limitHint={p.limitHint ?? true}
	/>
	<NumberInput
		label="Monthly budget"
		bind:value={budget}
		min={0}
		step={50}
		largeStep={500}
		formatOptions={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
		variant={p.variant ?? "default"}
		{size}
		disabled={p.disabled ?? false}
	/>
</div>
