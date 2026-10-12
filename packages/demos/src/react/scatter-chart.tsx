"use client";

import {
	CartesianGrid,
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartTooltip,
	Scatter,
	ScatterChart,
	XAxis,
	YAxis,
} from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";
import { READINGS, READINGS_CONFIG } from "../data/prices";

type Props = Record<string, unknown>;

const config = READINGS_CONFIG satisfies ChartConfig;

export function ScatterChartDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Scatter>>(props);
	const pChart = controlProps<ComponentProps<typeof ScatterChart>>(props);
	const size = p.size ?? "default";
	const shape = props.shape && props.shape !== "auto" ? p.shape : undefined;
	return (
		<div className="w-full max-w-3xl">
			<ChartContainer config={config} title="Sensor readings">
				<ScatterChart data={READINGS} status={pChart.status ?? "ready"}>
					<CartesianGrid />
					<YAxis />
					<XAxis />
					<Scatter dataKey="north" size={size} shape={shape} />
					<Scatter dataKey="south" size={size} shape={shape} />
					<Scatter dataKey="east" size={size} shape={shape} />
					<ChartTooltip dots={false} />
				</ScatterChart>
				<ChartLegend />
			</ChartContainer>
		</div>
	);
}
