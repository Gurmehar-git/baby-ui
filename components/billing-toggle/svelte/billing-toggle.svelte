<script lang="ts" module>
export type BillingToggleOption = {
	value: string;
	label: string;
	/** A short note beside the label, e.g. "Save 20%". */
	badge?: string;
};
</script>

<script lang="ts">
import Badge from "../../badge/svelte/badge.svelte";
import ToggleGroup from "../../toggle-group/svelte/toggle-group.svelte";
import ToggleGroupItem from "../../toggle-group/svelte/toggle-group-item.svelte";
import type { ToggleGroupSize, ToggleGroupVariant } from "../../toggle-group/svelte/variants";
import { billingToggle } from "./variants";

let {
	value = $bindable(""),
	onValueChange,
	options = [
		{ value: "monthly", label: "Monthly" },
		{ value: "yearly", label: "Yearly" },
	],
	label = "Billing period",
	variant = "default",
	size = "default",
	class: classProp,
}: {
	/** Bindable. */
	value?: string;
	onValueChange?: (value: string) => void;
	options?: BillingToggleOption[];
	/** Accessible name of the group. */
	label?: string;
	variant?: ToggleGroupVariant;
	size?: ToggleGroupSize;
	class?: string;
} = $props();

const s = billingToggle();
// A single-select group can be pressed off; billing always has a period.
function pick(next: string | string[]) {
	if (typeof next !== "string" || !next) return;
	value = next;
	onValueChange?.(next);
}
</script>

<ToggleGroup
	type="single"
	{label}
	bind:value={() => value, pick}
	{variant}
	{size}
	data-slot="billing-toggle"
	class={classProp}
>
	{#each options as option (option.value)}
		<ToggleGroupItem value={option.value} class={s.item()}>
			{option.label}
			{#if option.badge}<Badge variant="success" size="sm" class={s.badge()}>{option.badge}</Badge>{/if}
		</ToggleGroupItem>
	{/each}
</ToggleGroup>
