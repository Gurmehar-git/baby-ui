<script lang="ts">
import { ComparisonTable } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import {
	PLAN_COLUMNS,
	PLAN_SECTIONS,
	PRODUCT_COLUMNS,
	PRODUCT_SECTIONS,
} from "../data/comparison";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ComparisonTable>>(props));
const plans = $derived(props.sample !== "products");
</script>

{#key plans}
	<ComparisonTable
		variant={p.variant}
		title={plans ? "Room for the way you work" : "How Relay compares"}
		description={plans ? "Switch billing to see what you would pay." : "The same work, fewer tools."}
		columns={plans ? PLAN_COLUMNS : PRODUCT_COLUMNS}
		sections={plans ? PLAN_SECTIONS : PRODUCT_SECTIONS}
		footnote="Prices in USD per seat."
		locale="en-US"
	/>
{/key}
