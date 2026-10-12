"use client";

import { useMemo, useState } from "react";
import { Badge } from "../badge/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../card/card";
import { ChartContainer } from "../chart/chart";
import { ChoroplethChart } from "../choropleth-chart/choropleth-chart";
import {
	featureKey,
	featureLabel,
	type GeoCollection,
} from "../choropleth-chart/geometry";
import type { ChoroplethProjection } from "../choropleth-chart/variants";
import { cn } from "../lib/cn";
import { RollingDigits } from "../rolling-digits/rolling-digits";
import { type StatCardMapSize, statCardMap } from "./variants";

export type { StatCardMapSize };

export interface StatCardMapProps {
	title: string;
	/** Boundaries to draw; bring your own FeatureCollection. */
	geo: GeoCollection;
	/** Value per feature key. */
	values: Record<string, number>;
	/** Optional change per feature key, in percent; the card trend shows when absent. */
	trends?: Record<string, number>;
	/** Headline at rest, e.g. the total. */
	value: number;
	label: string;
	/** Change over the whole period, in percent. */
	trend: number;
	keyProp?: string;
	labelProp?: string;
	projection?: ChoroplethProjection;
	size?: StatCardMapSize;
	locale?: string;
	formatValue?: (value: number) => string;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	className?: string;
}

/** The map stat card: the headline follows the active region, over a sequential choropleth. */
export function StatCardMap({
	title,
	geo,
	values,
	trends,
	value,
	label,
	trend,
	keyProp = "name",
	labelProp = "name",
	projection = "equalEarth",
	size = "default",
	locale,
	formatValue,
	activeIndex: activeIndexProp,
	onActiveIndexChange,
	className,
}: StatCardMapProps) {
	const [internal, setInternal] = useState<number | null>(null);
	const activeIndex = activeIndexProp !== undefined ? activeIndexProp : internal;
	const setActive = (index: number | null) => {
		if (activeIndexProp === undefined) setInternal(index);
		onActiveIndexChange?.(index);
	};
	const number = useMemo(
		() =>
			formatValue ?? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format,
		[formatValue, locale],
	);
	const percent = useMemo(
		() =>
			new Intl.NumberFormat(locale, {
				style: "percent",
				maximumFractionDigits: 1,
				signDisplay: "exceptZero",
			}),
		[locale],
	);
	// Same ordering ChoroplethChart walks, so the active index names the same region.
	const entries = useMemo(() => {
		const out: { key: string; label: string; value: number }[] = [];
		for (const feature of geo.features) {
			const key = featureKey(feature, keyProp);
			const v = values[key];
			if (typeof v === "number" && Number.isFinite(v))
				out.push({ key, label: featureLabel(feature, labelProp, key), value: v });
		}
		return out.sort((a, b) => a.label.localeCompare(b.label));
	}, [geo, values, keyProp, labelProp]);

	const entry = activeIndex !== null ? entries[activeIndex] : undefined;
	const shownTrend = (entry ? trends?.[entry.key] : undefined) ?? trend;
	const up = shownTrend >= 0;
	const styles = statCardMap({ size });

	return (
		<Card data-slot="stat-card-map" className={cn(styles.root(), className)}>
			<CardHeader className={styles.header()}>
				<div className={styles.headline()}>
					<CardTitle className={styles.title()}>{title}</CardTitle>
					<RollingDigits
						variant="count"
						value={entry?.value ?? value}
						format={number}
						size="sm"
						durationMs={400}
						startOnView={false}
						className="font-bold text-foreground"
					/>
					<span className={styles.label()}>{entry?.label ?? label}</span>
				</div>
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
						{percent.format(shownTrend / 100)}
					</Badge>
				</CardAction>
			</CardHeader>
			<CardContent className={styles.body()}>
				<ChartContainer config={{}} title={title} aspect="auto" locale={locale}>
					<ChoroplethChart
						data={geo}
						values={values}
						keyProp={keyProp}
						labelProp={labelProp}
						projection={projection}
						legend={false}
						activeIndex={activeIndex}
						onActiveIndexChange={setActive}
					/>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
