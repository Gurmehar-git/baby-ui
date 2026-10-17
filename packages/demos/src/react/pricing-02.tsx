"use client";

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
} from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";
import { PRICING_PERIODS, PRICING_PLANS_02 } from "../data/pricing";

type Props = Record<string, unknown>;

export function Pricing02Demo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Pricing02>>(props);
	const [period, setPeriod] = useState("monthly");
	const [chosen, setChosen] = useState<string | null>(null);

	return (
		<div className="flex w-full flex-col gap-2">
			<Pricing02
				periods={PRICING_PERIODS}
				period={period}
				onPeriodChange={setPeriod}
				variant={p.variant ?? "soft"}
			>
				<Pricing02Header>
					<Pricing02Heading>
						<Pricing02Eyebrow>Simple pricing</Pricing02Eyebrow>
						<Pricing02Title>{"Start small.\nKeep room to grow."}</Pricing02Title>
					</Pricing02Heading>
					<Pricing02Aside>
						<Pricing02Description>
							Straightforward plans with every essential included. Upgrade, downgrade, or
							cancel whenever you like.
						</Pricing02Description>
						<Pricing02Periods />
					</Pricing02Aside>
				</Pricing02Header>
				<Pricing02Plans>
					{PRICING_PLANS_02.map((plan) => (
						<Pricing02Plan key={plan.id} featured={plan.featured}>
							<Pricing02PlanPanel>
								<Pricing02PlanName>{plan.name}</Pricing02PlanName>
								<Pricing02PlanDescription>{plan.description}</Pricing02PlanDescription>
								<Pricing02PlanPrice prices={plan.prices} />
								<Pricing02PlanAction onClick={() => setChosen(`${plan.id}, ${period}`)}>
									{plan.cta ?? `Choose ${plan.name}`}
								</Pricing02PlanAction>
							</Pricing02PlanPanel>
							<Pricing02PlanList>
								{plan.featuresLabel ? (
									<Pricing02PlanListLabel>{plan.featuresLabel}</Pricing02PlanListLabel>
								) : null}
								<Pricing02PlanFeatures>
									{plan.features.map((feature) => (
										<Pricing02PlanFeature key={feature}>{feature}</Pricing02PlanFeature>
									))}
								</Pricing02PlanFeatures>
							</Pricing02PlanList>
						</Pricing02Plan>
					))}
				</Pricing02Plans>
				<Pricing02Footnotes>
					<p>No credit card required for Starter.</p>
					<p>Prices exclude applicable taxes.</p>
				</Pricing02Footnotes>
			</Pricing02>
			<p aria-live="polite" className="text-center text-muted-foreground text-xs">
				{chosen ? `Chose ${chosen}` : null}
			</p>
		</div>
	);
}
