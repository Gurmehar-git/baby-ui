<script lang="ts">
import {
	Pricing02,
	Pricing02Header,
	Pricing02Heading,
	Pricing02Periods,
	Pricing02Plan,
	Pricing02PlanAction,
	Pricing02PlanFeature,
	Pricing02PlanFeatures,
	Pricing02PlanList,
	Pricing02PlanName,
	Pricing02PlanPanel,
	Pricing02PlanPrice,
	Pricing02Plans,
	Pricing02Title,
} from "@baby-ui/svelte";

const periods = [
	{ value: "monthly", label: "Monthly", cadence: "/ month" },
	{ value: "yearly", label: "Yearly", cadence: "/ year" },
];

let period = $state("monthly");
</script>

<Pricing02 {periods} bind:period>
	<Pricing02Header>
		<Pricing02Heading>
			<Pricing02Title>Pricing</Pricing02Title>
		</Pricing02Heading>
		<Pricing02Periods />
	</Pricing02Header>
	<Pricing02Plans>
		<Pricing02Plan featured>
			<Pricing02PlanPanel>
				<Pricing02PlanName>Team</Pricing02PlanName>
				<Pricing02PlanPrice prices={{ monthly: "$24", yearly: "$240" }} />
				<Pricing02PlanAction href="/signup?plan=team">Choose Team</Pricing02PlanAction>
			</Pricing02PlanPanel>
			<Pricing02PlanList>
				<Pricing02PlanFeatures>
					<Pricing02PlanFeature>Unlimited projects</Pricing02PlanFeature>
				</Pricing02PlanFeatures>
			</Pricing02PlanList>
		</Pricing02Plan>
	</Pricing02Plans>
</Pricing02>
