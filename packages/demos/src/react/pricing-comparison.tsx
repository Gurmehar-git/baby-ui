"use client";

import {
	PricingComparison,
	type PricingComparisonDensity,
	PricingComparisonDifferences,
	PricingComparisonEmpty,
	PricingComparisonMobile,
	PricingComparisonTable,
	PricingComparisonToolbar,
} from "@baby-ui/react";
import { useEffect, useState } from "react";
import { COMPARISON_GROUPS, COMPARISON_PLANS } from "../data/pricing-comparison";

type Props = Record<string, unknown>;

export function PricingComparisonDemo({ props }: { props: Props }) {
	const [differencesOnly, setDifferencesOnly] = useState(false);
	const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);

	// Controls panel values win when they change, then the switch takes over again.
	useEffect(() => {
		if (typeof props.differencesOnly === "boolean")
			setDifferencesOnly(props.differencesOnly);
	}, [props.differencesOnly]);

	return (
		<div className="w-full max-w-4xl">
			<PricingComparison
				plans={COMPARISON_PLANS}
				groups={COMPARISON_GROUPS}
				differencesOnly={differencesOnly}
				onDifferencesOnlyChange={setDifferencesOnly}
				collapsedGroups={collapsedGroups}
				onCollapsedGroupsChange={setCollapsedGroups}
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
	);
}
