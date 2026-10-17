"use client";

import {
	ScoreCard,
	ScoreCardContent,
	ScoreCardGauge,
	ScoreCardHeader,
	ScoreCardTitle,
	ScoreCardTrend,
} from "@baby-ui/react";

export function Example() {
	return (
		<ScoreCard>
			<ScoreCardHeader>
				<ScoreCardTitle>Performance</ScoreCardTitle>
				<ScoreCardTrend value={4} />
			</ScoreCardHeader>
			<ScoreCardContent>
				<ScoreCardGauge value={87} label="Performance" />
			</ScoreCardContent>
		</ScoreCard>
	);
}
