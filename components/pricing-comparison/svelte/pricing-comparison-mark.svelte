<script lang="ts">
import { type ComparisonValue, comparisonValueText } from "../pricing-comparison-core";
import { pricingComparisonState } from "./context";

let { value }: { value: ComparisonValue } = $props();

const ctx = pricingComparisonState("PricingComparisonMark");
</script>

{#if typeof value === "string"}
	{value}
{:else}
	<svg class={value ? ctx.styles.check() : ctx.styles.cross()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		<path d={value ? "M5 12l5 5l10 -10" : "M18 6l-12 12M6 6l12 12"} />
	</svg>
	<span class="sr-only">{comparisonValueText(value, ctx.labels)}</span>
{/if}
