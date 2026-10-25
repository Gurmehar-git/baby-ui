"use client";

import {
	ChangeSummary,
	ChangeSummaryChange,
	ChangeSummaryHeader,
	ChangeSummaryItem,
	ChangeSummaryLabel,
	ChangeSummaryList,
	ChangeSummaryPeriod,
	ChangeSummaryTitle,
} from "@baby-ui/react";
import type { ComponentProps } from "react";
import { CHANGE_SUMMARY_CHANGES } from "../data/change-summary";
import { controlProps } from "../data/preview-props";

export function ChangeSummaryDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof ChangeSummary>>(props);
	return (
		<ChangeSummary variant={p.variant}>
			<ChangeSummaryHeader>
				<ChangeSummaryTitle>What's changed</ChangeSummaryTitle>
				<ChangeSummaryPeriod>This week</ChangeSummaryPeriod>
			</ChangeSummaryHeader>
			<ChangeSummaryList>
				{CHANGE_SUMMARY_CHANGES.map((c) => (
					<ChangeSummaryItem key={c.label} tone={c.tone} direction={c.direction}>
						<ChangeSummaryLabel>{c.label}</ChangeSummaryLabel>
						<ChangeSummaryChange>{c.change}</ChangeSummaryChange>
					</ChangeSummaryItem>
				))}
			</ChangeSummaryList>
		</ChangeSummary>
	);
}
