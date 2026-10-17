"use client";

import {
	ScoreCard,
	ScoreCardContent,
	ScoreCardDescription,
	ScoreCardGauge,
	ScoreCardHeader,
	ScoreCardTitle,
	ScoreCardTrend,
} from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function ScoreCardDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ScoreCard>>(props);
	const gauge = controlProps<ComponentProps<typeof ScoreCardGauge>>(props);
	return (
		<div className="w-full max-w-xs">
			<ScoreCard size={p.size ?? "default"}>
				<ScoreCardHeader>
					<ScoreCardTitle>Performance</ScoreCardTitle>
					<ScoreCardDescription>Lighthouse, last deploy</ScoreCardDescription>
					<ScoreCardTrend value={4} />
				</ScoreCardHeader>
				<ScoreCardContent>
					<ScoreCardGauge
						value={87}
						min={Number(props.min ?? 0)}
						max={Number(props.max ?? 100)}
						label="Performance"
						tone={gauge.tone ?? "primary"}
						layout={gauge.layout ?? "arc"}
					/>
				</ScoreCardContent>
			</ScoreCard>
		</div>
	);
}
