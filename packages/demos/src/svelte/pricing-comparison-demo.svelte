<script lang="ts">
import {
	PricingComparison,
	type PricingComparisonDensity,
	PricingComparisonDifferences,
	PricingComparisonEmpty,
	PricingComparisonMobile,
	PricingComparisonTable,
	PricingComparisonToolbar,
} from "@baby-ui/svelte";
import { COMPARISON_GROUPS, COMPARISON_PLANS } from "../data/pricing-comparison";

let { props = {} }: { props?: Record<string, unknown> } = $props();

let differencesOnly = $state(false);
let collapsedGroups = $state<string[]>([]);

// Controls panel values win when they change, then the switch takes over again.
$effect(() => {
	if (typeof props.differencesOnly === "boolean") differencesOnly = props.differencesOnly;
});
</script>

<div class="w-full max-w-4xl">
	<PricingComparison
		plans={COMPARISON_PLANS}
		groups={COMPARISON_GROUPS}
		bind:differencesOnly
		bind:collapsedGroups
		density={(props.density as PricingComparisonDensity) ?? "comfortable"}
	>
		<PricingComparisonToolbar>
			<PricingComparisonDifferences />
		</PricingComparisonToolbar>
		<PricingComparisonTable />
		<PricingComparisonMobile />
		<PricingComparisonEmpty />
	</PricingComparison>
</div>
