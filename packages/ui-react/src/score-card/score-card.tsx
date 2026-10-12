"use client";

import { Badge } from "../badge/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../card/card";
import { GaugeChart } from "../gauge-chart/gauge-chart";
import type { GaugeChartLayout, GaugeChartTone } from "../gauge-chart/variants";
import { cn } from "../lib/cn";
import { type ScoreCardSize, scoreCard } from "./variants";

export type { ScoreCardSize };

export interface ScoreCardProps {
	title: string;
	description?: string;
	value: number;
	min?: number;
	max?: number;
	/** Gauge's own caption under the value; defaults to `title`. */
	label?: string;
	/** Change since the last reading, in points; omit to hide the badge. */
	trend?: number;
	tone?: GaugeChartTone;
	layout?: GaugeChartLayout;
	size?: ScoreCardSize;
	locale?: string;
	format?: (value: number) => string;
	animate?: boolean;
	className?: string;
}

/** A single headline metric on a dial: health scores, performance grades, NPS, uptime. */
export function ScoreCard({
	title,
	description,
	value,
	min = 0,
	max = 100,
	label,
	trend,
	tone = "primary",
	layout = "arc",
	size = "default",
	locale,
	format,
	animate = true,
	className,
}: ScoreCardProps) {
	const styles = scoreCard({ size });
	const up = (trend ?? 0) >= 0;

	return (
		<Card data-slot="score-card" className={cn(styles.root(), className)}>
			<CardHeader className={styles.header()}>
				<div>
					<CardTitle className={styles.title()}>{title}</CardTitle>
					{description ? (
						<CardDescription className={styles.description()}>
							{description}
						</CardDescription>
					) : null}
				</div>
				{trend !== undefined ? (
					<CardAction>
						<Badge variant={up ? "success" : "destructive"} size="sm">
							<svg aria-hidden="true" viewBox="0 0 12 12" className="size-3" fill="none">
								<path
									d={up ? "M3 9 9 3M4.5 3H9v4.5" : "M3 3l6 6M9 4.5V9H4.5"}
									stroke="currentColor"
									strokeWidth={1.5}
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							{up ? "+" : ""}
							{trend}
						</Badge>
					</CardAction>
				) : null}
			</CardHeader>
			<CardContent className={styles.body()}>
				<div className={styles.gauge()}>
					<GaugeChart
						value={value}
						min={min}
						max={max}
						label={label ?? title}
						tone={tone}
						layout={layout}
						format={format}
						locale={locale}
						animate={animate}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
