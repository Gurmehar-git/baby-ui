"use client";

import { type ComponentProps, createContext, useContext } from "react";
import { Badge } from "../../badge/react/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../card/react/card";
import { GaugeChart } from "../../gauge-chart/react/gauge-chart";
import { cn } from "../../lib/cn";
import { type ScoreCardSize, scoreCard } from "../variants";

export type { ScoreCardSize };

const ScoreCardContext = createContext<ReturnType<typeof scoreCard> | null>(null);

function useScoreCard() {
	const styles = useContext(ScoreCardContext);
	if (!styles) throw new Error("ScoreCard parts must be rendered inside a ScoreCard.");
	return styles;
}

export interface ScoreCardProps extends ComponentProps<typeof Card> {
	size?: ScoreCardSize;
}

/**
 * A headline metric on a dial: ScoreCardHeader with ScoreCardTitle, ScoreCardDescription and
 * ScoreCardTrend, then ScoreCardContent with ScoreCardGauge.
 */
export function ScoreCard({ size = "default", className, ...props }: ScoreCardProps) {
	const styles = scoreCard({ size });
	return (
		<ScoreCardContext.Provider value={styles}>
			<Card data-slot="score-card" className={cn(styles.root(), className)} {...props} />
		</ScoreCardContext.Provider>
	);
}

export function ScoreCardHeader({
	className,
	...props
}: ComponentProps<typeof CardHeader>) {
	return <CardHeader className={cn(useScoreCard().header(), className)} {...props} />;
}

export function ScoreCardTitle({
	className,
	...props
}: ComponentProps<typeof CardTitle>) {
	return <CardTitle className={cn(useScoreCard().title(), className)} {...props} />;
}

export function ScoreCardDescription({
	className,
	...props
}: ComponentProps<typeof CardDescription>) {
	return (
		<CardDescription className={cn(useScoreCard().description(), className)} {...props} />
	);
}

export interface ScoreCardTrendProps {
	/** Change since the last reading, in points. */
	value: number;
	className?: string;
}

/** A signed badge for the change since the last reading. */
export function ScoreCardTrend({ value, className }: ScoreCardTrendProps) {
	const up = value >= 0;
	return (
		<CardAction className={className}>
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
				{value}
			</Badge>
		</CardAction>
	);
}

export function ScoreCardContent({
	className,
	...props
}: ComponentProps<typeof CardContent>) {
	return <CardContent className={cn(useScoreCard().body(), className)} {...props} />;
}

/** The dial; takes every GaugeChart prop and sizes itself from ScoreCard's `size`. */
export function ScoreCardGauge({
	className,
	...props
}: ComponentProps<typeof GaugeChart>) {
	return (
		<div data-slot="score-card-gauge" className={cn(useScoreCard().gauge(), className)}>
			<GaugeChart {...props} />
		</div>
	);
}
