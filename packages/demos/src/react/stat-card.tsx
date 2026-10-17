"use client";

import {
	Button,
	StatCard,
	StatCardChart,
	StatCardContent,
	StatCardDescription,
	StatCardEmpty,
	StatCardError,
	StatCardHeader,
	StatCardTitle,
	StatCardTrend,
	StatCardValue,
} from "@baby-ui/react";
import type { ComponentProps } from "react";
import { STAT_CARD } from "../data/demo-samples";
import { controlProps } from "../data/preview-props";
import { DemoFrame } from "./demo-frame";

export function StatCardDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof StatCard>>(props);
	const { title, description, ...sample } = STAT_CARD;
	return (
		<DemoFrame size="sm">
			<StatCard
				{...sample}
				name={title}
				positive={p.positive}
				status={p.status}
				chart={p.chart}
				size={p.size}
			>
				<StatCardHeader>
					<StatCardTitle>{title}</StatCardTitle>
					<StatCardTrend />
				</StatCardHeader>
				<StatCardContent>
					<StatCardValue />
					<StatCardDescription>{description}</StatCardDescription>
					<StatCardEmpty>No data yet</StatCardEmpty>
					<StatCardError>
						<p>Couldn't load this metric.</p>
						<Button size="sm" variant="outline">
							Retry
						</Button>
					</StatCardError>
					<StatCardChart />
				</StatCardContent>
			</StatCard>
		</DemoFrame>
	);
}
