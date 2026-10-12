"use client";

import {
	CartesianGrid,
	type ChartConfig,
	ChartContainer,
	ChartMarkers,
	ChartMarkerTooltip,
	ChartTooltip,
	ChartTooltipContent,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from "@baby-ui/react";
import type { ComponentProps } from "react";
import { EVENTS } from "../data/events";
import { controlProps } from "../data/preview-props";
import { VISITORS, VISITORS_CONFIG } from "../data/visitors";

type Props = Record<string, unknown>;

const config = VISITORS_CONFIG satisfies ChartConfig;
const markers = EVENTS.map((event, i) =>
	i === 0
		? {
				...event,
				href: "https://github.com/kanakkholwal/baby-ui",
				target: "_blank" as const,
			}
		: event,
);

export function ChartMarkersDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ChartMarkers>>(props);
	return (
		<div className="w-full max-w-3xl pt-6">
			<ChartContainer config={config} title="Daily visitors with release notes">
				<LineChart data={VISITORS} margin={{ top: 32 }}>
					<CartesianGrid />
					<YAxis />
					<XAxis />
					<Line dataKey="desktop" />
					<ChartMarkers
						items={markers}
						size={p.size ?? "default"}
						appearance={p.appearance ?? "solid"}
						showLines={p.showLines ?? true}
					/>
					<ChartTooltip
						content={
							<>
								<ChartTooltipContent />
								<ChartMarkerTooltip items={markers} />
							</>
						}
					/>
				</LineChart>
			</ChartContainer>
		</div>
	);
}
