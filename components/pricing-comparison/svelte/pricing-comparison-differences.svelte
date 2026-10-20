<script lang="ts">
import Switch from "../../switch/svelte/switch.svelte";
import { pricingComparisonState } from "./context";

let { class: classProp }: { class?: string } = $props();

const ctx = pricingComparisonState("PricingComparisonDifferences");
</script>

<!-- The "differences only" switch: rows that read the same on every plan fold away. -->
<Switch
	size="sm"
	class={classProp}
	label={ctx.labels.differencesOnly}
	bind:checked={() => ctx.differencesOnly, ctx.setDifferencesOnly}
/>
