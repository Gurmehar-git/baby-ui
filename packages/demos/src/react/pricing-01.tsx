"use client";

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
} from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";
import { PRICING_PERIODS, PRICING_PLANS_01 } from "../data/pricing";

type Props = Record<string, unknown>;

export function Pricing01Demo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Pricing01>>(props);
	const [period, setPeriod] = useState("monthly");
	const [chosen, setChosen] = useState<string | null>(null);

	return (
		<div className="flex w-full flex-col gap-2">
			<Pricing01
				periods={PRICING_PERIODS}
				period={period}
				onPeriodChange={setPeriod}
				variant={p.variant ?? "default"}
			>
				<Pricing01Header>
					<Pricing01Heading>
						<Pricing01Eyebrow>Pricing</Pricing01Eyebrow>
						<Pricing01Title>A plan for every stage.</Pricing01Title>
					</Pricing01Heading>
					<Pricing01Aside>
						<Pricing01Description>
							Start for free, then move up when your work needs more room. Every plan
							includes the essentials to ship something great.
						</Pricing01Description>
						<Pricing01Periods />
					</Pricing01Aside>
				</Pricing01Header>
				<Pricing01Plans>
					{PRICING_PLANS_01.map((plan) => (
						<Pricing01Plan key={plan.id} featured={plan.featured} note={plan.note}>
							<Pricing01PlanHeader>
								<Pricing01PlanName>{plan.name}</Pricing01PlanName>
								{plan.badge ? (
									<Pricing01PlanBadge>{plan.badge}</Pricing01PlanBadge>
								) : null}
								<Pricing01PlanPrice prices={plan.prices} />
							</Pricing01PlanHeader>
							<Pricing01PlanContent>
								<Pricing01PlanDescription>{plan.description}</Pricing01PlanDescription>
								<Pricing01PlanFeatures>
									{plan.features.map((feature) => (
										<Pricing01PlanFeature key={feature}>{feature}</Pricing01PlanFeature>
									))}
								</Pricing01PlanFeatures>
							</Pricing01PlanContent>
							<Pricing01PlanFooter>
								<Pricing01PlanAction onClick={() => setChosen(`${plan.id}, ${period}`)}>
									Choose {plan.name}
								</Pricing01PlanAction>
							</Pricing01PlanFooter>
						</Pricing01Plan>
					))}
				</Pricing01Plans>
			</Pricing01>
			<p aria-live="polite" className="text-center text-muted-foreground text-xs">
				{chosen ? `Chose ${chosen}` : null}
			</p>
		</div>
	);
}
