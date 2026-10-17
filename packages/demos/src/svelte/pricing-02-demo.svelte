<script lang="ts">
import {
	Pricing02,
	Pricing02Aside,
	Pricing02Description,
	Pricing02Eyebrow,
	Pricing02Footnotes,
	Pricing02Header,
	Pricing02Heading,
	Pricing02Periods,
	Pricing02Plan,
	Pricing02PlanAction,
	Pricing02PlanDescription,
	Pricing02PlanFeature,
	Pricing02PlanFeatures,
	Pricing02PlanList,
	Pricing02PlanListLabel,
	Pricing02PlanName,
	Pricing02PlanPanel,
	Pricing02PlanPrice,
	Pricing02Plans,
	Pricing02Title,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { PRICING_PERIODS, PRICING_PLANS_02 } from "../data/pricing";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Pricing02>>(props));

let period = $state("monthly");
let chosen = $state<string | null>(null);
</script>

<div class="flex w-full flex-col gap-2">
	<Pricing02 periods={PRICING_PERIODS} bind:period variant={p.variant ?? "soft"}>
		<Pricing02Header>
			<Pricing02Heading>
				<Pricing02Eyebrow>Simple pricing</Pricing02Eyebrow>
				<Pricing02Title>{"Start small.\nKeep room to grow."}</Pricing02Title>
			</Pricing02Heading>
			<Pricing02Aside>
				<Pricing02Description>
					Straightforward plans with every essential included. Upgrade, downgrade, or cancel
					whenever you like.
				</Pricing02Description>
				<Pricing02Periods />
			</Pricing02Aside>
		</Pricing02Header>
		<Pricing02Plans>
			{#each PRICING_PLANS_02 as plan (plan.id)}
				<Pricing02Plan featured={plan.featured}>
					<Pricing02PlanPanel>
						<Pricing02PlanName>{plan.name}</Pricing02PlanName>
						<Pricing02PlanDescription>{plan.description}</Pricing02PlanDescription>
						<Pricing02PlanPrice prices={plan.prices} />
						<Pricing02PlanAction onclick={() => (chosen = `${plan.id}, ${period}`)}>
							{plan.cta ?? `Choose ${plan.name}`}
						</Pricing02PlanAction>
					</Pricing02PlanPanel>
					<Pricing02PlanList>
						{#if plan.featuresLabel}
							<Pricing02PlanListLabel>{plan.featuresLabel}</Pricing02PlanListLabel>
						{/if}
						<Pricing02PlanFeatures>
							{#each plan.features as feature (feature)}
								<Pricing02PlanFeature>{feature}</Pricing02PlanFeature>
							{/each}
						</Pricing02PlanFeatures>
					</Pricing02PlanList>
				</Pricing02Plan>
			{/each}
		</Pricing02Plans>
		<Pricing02Footnotes>
			<p>No credit card required for Starter.</p>
			<p>Prices exclude applicable taxes.</p>
		</Pricing02Footnotes>
	</Pricing02>
	<p aria-live="polite" class="text-center text-muted-foreground text-xs">
		{chosen ? `Chose ${chosen}` : ""}
	</p>
</div>
