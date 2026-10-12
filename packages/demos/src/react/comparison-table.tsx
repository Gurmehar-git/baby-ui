"use client";

import { ComparisonTable } from "@baby-ui/react";
import type { ComponentProps } from "react";
import {
	PLAN_COLUMNS,
	PLAN_SECTIONS,
	PRODUCT_COLUMNS,
	PRODUCT_SECTIONS,
} from "../data/comparison";
import { controlProps } from "../data/preview-props";

export function ComparisonTableDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof ComparisonTable>>(props);
	const plans = props.sample !== "products";
	return (
		<ComparisonTable
			key={plans ? "plans" : "products"}
			variant={p.variant}
			title={plans ? "Room for the way you work" : "How Relay compares"}
			description={
				plans
					? "Switch billing to see what you would pay."
					: "The same work, fewer tools."
			}
			columns={plans ? PLAN_COLUMNS : PRODUCT_COLUMNS}
			sections={plans ? PLAN_SECTIONS : PRODUCT_SECTIONS}
			footnote="Prices in USD per seat."
			locale="en-US"
		/>
	);
}
