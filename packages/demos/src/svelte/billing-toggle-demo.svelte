<script lang="ts">
import { BillingPrice, BillingToggle } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof BillingToggle>>(props));
const OPTIONS = [
	{ value: "monthly", label: "Monthly" },
	{ value: "yearly", label: "Yearly", badge: "Save 20%" },
];
let period = $state("monthly");
const yearly = $derived(period === "yearly");
</script>

<div class="flex flex-col items-center gap-6">
	<BillingToggle bind:value={period} options={OPTIONS} variant={p.variant} size={p.size} />
	<BillingPrice amount={yearly ? 19 : 24} was={yearly ? 24 : undefined} period={yearly ? "per month, billed yearly" : "per month"} />
</div>
