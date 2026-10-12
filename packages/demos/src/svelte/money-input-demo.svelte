<script lang="ts">
import { formatMoney, MoneyInput } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof MoneyInput>>(props));
let amount = $state<number | null>(2500);
let currency = $state("USD");
</script>

<div class="flex w-full max-w-xs flex-col gap-2">
	<MoneyInput
		label={p.label || "Amount"}
		bind:value={amount}
		bind:currency
		currencies={["USD", "EUR", "GBP", "JPY"]}
		min={100}
		max={1_000_000}
		quickAdd={[10, 50, 100]}
		variant={p.variant}
		size={p.size}
	/>
	<p class="h-4 text-muted-foreground text-xs tabular-nums">
		{amount === null ? "Empty" : `${amount} minor units, ${formatMoney(amount, currency)}`}
	</p>
</div>
