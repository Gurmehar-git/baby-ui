<script lang="ts">
import {
	type ComparisonGroup,
	type ComparisonPlan,
	PricingComparison,
	PricingComparisonDifferences,
	PricingComparisonEmpty,
	PricingComparisonMobile,
	PricingComparisonTable,
	PricingComparisonToolbar,
} from "@baby-ui/svelte";

const plans: ComparisonPlan[] = [
	{ id: "solo", name: "Solo" },
	{ id: "team", name: "Team", highlighted: true },
];

const groups: ComparisonGroup[] = [
	{
		label: "Licence",
		rows: [
			{ feature: "Seats", values: { solo: "1", team: "5" } },
			{ feature: "Commercial use", values: { solo: true, team: true } },
			{
				feature: "Shared token",
				hint: "One token for the whole team",
				values: { team: true },
			},
		],
	},
];

let differencesOnly = $state(false);
</script>

<div class="[--pricing-comparison-top:3.5rem]">
	<PricingComparison {plans} {groups} bind:differencesOnly>
		<PricingComparisonToolbar>
			<PricingComparisonDifferences />
		</PricingComparisonToolbar>
		<PricingComparisonTable />
		<PricingComparisonMobile />
		<PricingComparisonEmpty />
	</PricingComparison>
</div>
