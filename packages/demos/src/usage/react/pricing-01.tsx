"use client";

import {
	Pricing01,
	Pricing01Header,
	Pricing01Heading,
	Pricing01Periods,
	Pricing01Plan,
	Pricing01PlanAction,
	Pricing01PlanBadge,
	Pricing01PlanContent,
	Pricing01PlanFeature,
	Pricing01PlanFeatures,
	Pricing01PlanFooter,
	Pricing01PlanHeader,
	Pricing01PlanName,
	Pricing01PlanPrice,
	Pricing01Plans,
	Pricing01Title,
} from "@baby-ui/react";
import { useState } from "react";

const periods = [
	{ value: "monthly", label: "Monthly", cadence: "/month" },
	{ value: "yearly", label: "Yearly", cadence: "/year" },
];

export function Example() {
	const [period, setPeriod] = useState("monthly");

	return (
		<Pricing01 periods={periods} period={period} onPeriodChange={setPeriod}>
			<Pricing01Header>
				<Pricing01Heading>
					<Pricing01Title>Pricing</Pricing01Title>
				</Pricing01Heading>
				<Pricing01Periods />
			</Pricing01Header>
			<Pricing01Plans>
				<Pricing01Plan>
					<Pricing01PlanHeader>
						<Pricing01PlanName>Hobby</Pricing01PlanName>
						<Pricing01PlanPrice prices={{ monthly: "$0", yearly: "$0" }} />
					</Pricing01PlanHeader>
					<Pricing01PlanContent>
						<Pricing01PlanFeatures>
							<Pricing01PlanFeature>1 project</Pricing01PlanFeature>
						</Pricing01PlanFeatures>
					</Pricing01PlanContent>
					<Pricing01PlanFooter>
						<Pricing01PlanAction href="/signup">Choose Hobby</Pricing01PlanAction>
					</Pricing01PlanFooter>
				</Pricing01Plan>
				<Pricing01Plan featured note="Most teams start here.">
					<Pricing01PlanHeader>
						<Pricing01PlanName>Pro</Pricing01PlanName>
						<Pricing01PlanBadge>Popular</Pricing01PlanBadge>
						<Pricing01PlanPrice prices={{ monthly: "$20", yearly: "$192" }} />
					</Pricing01PlanHeader>
					<Pricing01PlanContent>
						<Pricing01PlanFeatures>
							<Pricing01PlanFeature>Unlimited projects</Pricing01PlanFeature>
						</Pricing01PlanFeatures>
					</Pricing01PlanContent>
					<Pricing01PlanFooter>
						<Pricing01PlanAction href="/signup?plan=pro">Choose Pro</Pricing01PlanAction>
					</Pricing01PlanFooter>
				</Pricing01Plan>
			</Pricing01Plans>
		</Pricing01>
	);
}
