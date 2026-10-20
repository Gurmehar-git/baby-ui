"use client";

import {
	type ComparisonGroup,
	type ComparisonPlan,
	PricingComparison,
	PricingComparisonDifferences,
	PricingComparisonEmpty,
	PricingComparisonMobile,
	PricingComparisonTable,
	PricingComparisonToolbar,
} from "@baby-ui/react";
import { useState } from "react";

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

export function Compare() {
	const [differencesOnly, setDifferencesOnly] = useState(false);

	return (
		<div className="[--pricing-comparison-top:3.5rem]">
			<PricingComparison
				plans={plans}
				groups={groups}
				differencesOnly={differencesOnly}
				onDifferencesOnlyChange={setDifferencesOnly}
			>
				<PricingComparisonToolbar>
					<PricingComparisonDifferences />
				</PricingComparisonToolbar>
				<PricingComparisonTable />
				<PricingComparisonMobile />
				<PricingComparisonEmpty />
			</PricingComparison>
		</div>
	);
}
