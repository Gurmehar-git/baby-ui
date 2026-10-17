"use client";

import { useId, useState } from "react";
import { Badge } from "../../badge/react/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../card/react/card";
import type { Datum } from "../../chart/core";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
} from "../../chart/react/chart";
import { cn } from "../../lib/cn";
import { RingChart } from "../../ring-chart/react/ring-chart";
import type { RingCap } from "../../ring-chart/variants";
import { meterLayout, meterNumber, meterTone } from "../meter";
import { type UsageCardLayout, usageCard } from "../variants";
import { UsageMeter } from "./usage-meter";

export type { UsageCardLayout };

export interface UsageCardProps {
	title: string;
	description?: string;
	data: Datum[];
	/** Label and colour per ring, keyed by `nameKey`. */
	config: ChartConfig;
	/** Key holding each ring's value. */
	dataKey?: string;
	/** Key holding each ring's maximum; missing or non-positive maxima count as 100. */
	maxKey?: string;
	/** Key holding each ring's name; matches `config` keys. */
	nameKey?: string;
	layout?: UsageCardLayout;
	cap?: RingCap;
	centerLabel?: string;
	/** Meter layout: the plan allowance every row shares, in the rows' unit. */
	limit?: number;
	/** Meter layout: unit after each amount, e.g. "GB". */
	unit?: string;
	/** Meter layout: digits after the decimal point. */
	decimals?: number;
	/** Meter layout: share of the limit at which the badge warns it is almost full. */
	warnAt?: number;
	freeLabel?: string;
	overLabel?: string;
	locale?: string;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	className?: string;
}

/** A settings-page usage panel: one ring per metric (storage, seats, calls, ...) with a legend. */
export function UsageCard({
	title,
	description,
	data,
	config,
	dataKey = "value",
	maxKey = "max",
	nameKey = "name",
	layout = "side",
	cap = "round",
	centerLabel,
	limit,
	unit = "",
	decimals = 1,
	warnAt = 0.9,
	freeLabel = "Free",
	overLabel = "Over limit",
	locale,
	activeIndex,
	onActiveIndexChange,
	className,
}: UsageCardProps) {
	const styles = usageCard({ layout });
	const chartId = `usage-${useId().replace(/:/g, "")}`;
	const [internal, setInternal] = useState<number | null>(null);
	const segments = data.map((row) => ({
		key: String(row[nameKey] ?? ""),
		value: typeof row[dataKey] === "number" ? row[dataKey] : 0,
	}));
	const meterLimit = limit ?? segments.reduce((sum, s) => sum + s.value, 0);
	const meter = meterLayout(segments, meterLimit, warnAt);
	const amount = (value: number) =>
		`${meterNumber(value, decimals, locale)}${unit ? ` ${unit}` : ""}`;
	const badge =
		meter.status === "over"
			? `${amount(meter.over)} over`
			: meter.status === "near"
				? "Almost full"
				: `${amount(meter.free)} free`;

	return (
		<Card data-slot="usage-card" className={cn(styles.root(), className)}>
			<CardHeader className={styles.header()}>
				<CardTitle className={styles.title()}>{title}</CardTitle>
				{description ? (
					<CardDescription className={styles.description()}>
						{description}
					</CardDescription>
				) : null}
				{layout === "meter" ? (
					<CardAction>
						<Badge variant={meterTone[meter.status]} size="sm" className="tabular-nums">
							{badge}
						</Badge>
					</CardAction>
				) : null}
			</CardHeader>
			<CardContent className={styles.body()}>
				{layout === "meter" ? (
					<UsageMeter
						id={chartId}
						title={title}
						config={config}
						layout={meter}
						limit={meterLimit}
						unit={unit}
						decimals={decimals}
						freeLabel={freeLabel}
						overLabel={overLabel}
						locale={locale}
						activeIndex={activeIndex !== undefined ? activeIndex : internal}
						onActiveIndexChange={(index) => {
							if (activeIndex === undefined) setInternal(index);
							onActiveIndexChange?.(index);
						}}
						styles={styles}
					/>
				) : (
					<ChartContainer
						config={config}
						title={title}
						aspect="auto"
						locale={locale}
						className={styles.chart()}
					>
						<RingChart
							data={data}
							dataKey={dataKey}
							maxKey={maxKey}
							nameKey={nameKey}
							cap={cap}
							centerLabel={centerLabel}
							activeIndex={activeIndex}
							onActiveIndexChange={onActiveIndexChange}
							className={styles.plot()}
						/>
						<ChartLegend
							content={<ChartLegendContent align="start" className={styles.legend()} />}
						/>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
