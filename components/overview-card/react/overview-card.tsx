"use client";

import { type ReactNode, useMemo, useState } from "react";
import { Area, AreaChart } from "../../area-chart/react/area-chart";
import { Badge } from "../../badge/react/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../card/react/card";
import { ChartContainer } from "../../chart/react/chart";
import { type ChartStatus, type Datum, toDate } from "../../chart/react/core";
import { cn } from "../../lib/react/cn";
import { Line, LineChart } from "../../line-chart/react/line-chart";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import { ToggleGroup, ToggleGroupItem } from "../../toggle-group/react/toggle-group";
import { type OverviewCardChart, type OverviewCardSize, overviewCard } from "./variants";

export type { OverviewCardChart, OverviewCardSize };

export interface OverviewCardPeriod {
	value: string;
	label: string;
}

export interface OverviewCardProps {
	title: string;
	description?: string;
	data: Datum[];
	dataKey: string;
	xKey?: string;
	/** Headline at rest, e.g. the period total. */
	value: number;
	/** Caption under the headline at rest, e.g. "This month". */
	label: string;
	/** Change over the whole period, in percent. */
	trend: number;
	chart?: OverviewCardChart;
	size?: OverviewCardSize;
	/** Series colour; defaults to the first chart slot. */
	color?: string;
	/** Period switcher options; omit to hide the toggle entirely. */
	periods?: OverviewCardPeriod[];
	period?: string;
	defaultPeriod?: string;
	onPeriodChange?: (period: string) => void;
	locale?: string;
	formatValue?: (value: number) => string;
	/** Caption for a hovered point. Defaults to the point's short date. */
	formatLabel?: (date: Date) => string;
	status?: ChartStatus;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	className?: string;
	children?: ReactNode;
}

/** A bigger sibling of StatCard: a period switcher up top, the chart is the main event. */
export function OverviewCard({
	title,
	description,
	data,
	dataKey,
	xKey = "date",
	value,
	label,
	trend,
	chart = "area",
	size = "default",
	color = "var(--chart-1)",
	periods,
	period: periodProp,
	defaultPeriod,
	onPeriodChange,
	locale,
	formatValue,
	formatLabel,
	status = "ready",
	activeIndex: activeIndexProp,
	onActiveIndexChange,
	className,
	children,
}: OverviewCardProps) {
	const [internal, setInternal] = useState<number | null>(null);
	const activeIndex = activeIndexProp !== undefined ? activeIndexProp : internal;
	const setActive = (index: number | null) => {
		if (activeIndexProp === undefined) setInternal(index);
		onActiveIndexChange?.(index);
	};
	const [internalPeriod, setInternalPeriod] = useState(
		defaultPeriod ?? periods?.[0]?.value,
	);
	const period = periodProp !== undefined ? periodProp : internalPeriod;
	const setPeriod = (next: string) => {
		if (periodProp === undefined) setInternalPeriod(next);
		onPeriodChange?.(next);
	};
	const number = useMemo(
		() =>
			formatValue ?? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format,
		[formatValue, locale],
	);
	const day = useMemo(
		() => new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }),
		[locale],
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

	const datum = activeIndex !== null ? data[activeIndex] : undefined;
	const hovered = datum?.[dataKey];
	const shownValue = typeof hovered === "number" ? hovered : value;
	const shownLabel = datum
		? (formatLabel ?? ((d: Date) => day.format(d)))(toDate(datum[xKey]))
		: label;
	const up = trend >= 0;
	const styles = overviewCard({ size, chart });
	const config = { [dataKey]: { label: title, color } };
	const margin = { top: 8, right: 0, bottom: 0, left: 0 };

	return (
		<Card data-slot="overview-card" className={cn(styles.root(), className)}>
			<CardHeader className={styles.header()}>
				<div>
					<CardTitle className={styles.title()}>{title}</CardTitle>
					{description ? (
						<CardDescription className={styles.description()}>
							{description}
						</CardDescription>
					) : null}
				</div>
				{periods && periods.length > 0 ? (
					<CardAction>
						<ToggleGroup
							type="single"
							size="sm"
							value={period ?? ""}
							onValueChange={(next) => setPeriod(next as string)}
							label={`${title} period`}
						>
							{periods.map((p) => (
								<ToggleGroupItem key={p.value} value={p.value}>
									{p.label}
								</ToggleGroupItem>
							))}
						</ToggleGroup>
					</CardAction>
				) : null}
			</CardHeader>
			<CardContent className={styles.body()}>
				<div className={styles.headline()}>
					<RollingDigits
						variant="count"
						value={shownValue}
						format={number}
						size="lg"
						durationMs={400}
						startOnView={false}
						className="font-bold text-foreground"
					/>
					<span className={styles.label()}>{shownLabel}</span>
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
						{percent.format(trend / 100)}
					</Badge>
				</div>
				<div className={styles.chart()}>
					<ChartContainer config={config} title={title} aspect="auto" locale={locale}>
						{chart === "line" ? (
							<LineChart
								data={data}
								xKey={xKey}
								margin={margin}
								status={status}
								activeIndex={activeIndex}
								onActiveIndexChange={setActive}
							>
								<Line dataKey={dataKey} curve="monotone" strokeWidth={2} />
								{children}
							</LineChart>
						) : (
							<AreaChart
								data={data}
								xKey={xKey}
								margin={margin}
								status={status}
								activeIndex={activeIndex}
								onActiveIndexChange={setActive}
							>
								<Area dataKey={dataKey} curve="monotone" fillOpacity={0.35} />
								{children}
							</AreaChart>
						)}
					</ChartContainer>
				</div>
			</CardContent>
		</Card>
	);
}
