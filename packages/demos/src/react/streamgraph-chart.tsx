"use client";

import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	StreamgraphChart,
} from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";
import { TICKETS_BY_TOPIC, TICKETS_CONFIG } from "../data/tickets";

type Props = Record<string, unknown>;

const config = TICKETS_CONFIG satisfies ChartConfig;

export function StreamgraphChartDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof StreamgraphChart>>(props);
	return (
		<div className="w-full max-w-3xl">
			<ChartContainer config={config} title="Support tickets by topic" aspect="video">
				<ChartLegend />
				<StreamgraphChart
					data={TICKETS_BY_TOPIC}
					xKey="week"
					variant={p.variant}
					directLabels={p.directLabels}
				/>
			</ChartContainer>
		</div>
	);
}
