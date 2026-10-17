<script lang="ts">
import {
	Pricing01,
	Pricing01Aside,
	Pricing01Description,
	Pricing01Eyebrow,
	Pricing01Header,
	Pricing01Heading,
	Pricing01Periods,
	Pricing01Plan,
	Pricing01PlanAction,
	Pricing01PlanBadge,
	Pricing01PlanContent,
	Pricing01PlanDescription,
	Pricing01PlanFeature,
	Pricing01PlanFeatures,
	Pricing01PlanFooter,
	Pricing01PlanHeader,
	Pricing01PlanName,
	Pricing01PlanPrice,
	Pricing01Plans,
	Pricing01Title,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { PRICING_PERIODS, PRICING_PLANS_01 } from "../data/pricing";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Pricing01>>(props));

let period = $state("monthly");
let chosen = $state<string | null>(null);
</script>

<div class="flex w-full flex-col gap-2">
	<Pricing01 periods={PRICING_PERIODS} bind:period variant={p.variant ?? "default"}>
		<Pricing01Header>
			<Pricing01Heading>
				<Pricing01Eyebrow>Pricing</Pricing01Eyebrow>
				<Pricing01Title>A plan for every stage.</Pricing01Title>
			</Pricing01Heading>
			<Pricing01Aside>
				<Pricing01Description>
					Start for free, then move up when your work needs more room. Every plan includes the
					essentials to ship something great.
				</Pricing01Description>
				<Pricing01Periods />
			</Pricing01Aside>
		</Pricing01Header>
		<Pricing01Plans>
			{#each PRICING_PLANS_01 as plan (plan.id)}
				<Pricing01Plan featured={plan.featured} note={plan.note}>
					<Pricing01PlanHeader>
						<Pricing01PlanName>{plan.name}</Pricing01PlanName>
						{#if plan.badge}
							<Pricing01PlanBadge>{plan.badge}</Pricing01PlanBadge>
						{/if}
						<Pricing01PlanPrice prices={plan.prices} />
					</Pricing01PlanHeader>
					<Pricing01PlanContent>
						<Pricing01PlanDescription>{plan.description}</Pricing01PlanDescription>
						<Pricing01PlanFeatures>
							{#each plan.features as feature (feature)}
								<Pricing01PlanFeature>{feature}</Pricing01PlanFeature>
							{/each}
						</Pricing01PlanFeatures>
					</Pricing01PlanContent>
					<Pricing01PlanFooter>
						<Pricing01PlanAction onclick={() => (chosen = `${plan.id}, ${period}`)}>
							Choose {plan.name}
						</Pricing01PlanAction>
					</Pricing01PlanFooter>
				</Pricing01Plan>
			{/each}
		</Pricing01Plans>
	</Pricing01>
	<p aria-live="polite" class="text-center text-muted-foreground text-xs">
		{chosen ? `Chose ${chosen}` : ""}
	</p>
</div>
