"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Area, AreaChart } from "../area-chart/area-chart";
import { Badge } from "../badge/badge";
import { Button } from "../button/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../card/card";
import { ChartContainer } from "../chart/chart";
import { type ChartStatus, type Datum, toDate } from "../chart/core";
import { cn } from "../lib/cn";
import { Line, LineChart } from "../line-chart/line-chart";
import { RollingDigits } from "../rolling-digits/rolling-digits";
import { Skeleton } from "../skeleton/skeleton";
import {
	periodTrend,
	type StatCardChartKind,
	type StatCardPositive,
	type StatCardSize,
	type StatCardStatus,
	statCard,
	statSummary,
	trendPath,
	trendSentence,
	trendTone,
} from "./variants";

export type { StatCardChartKind, StatCardPositive, StatCardSize, StatCardStatus };

export interface StatCardProps {
	/** Card heading; also the chart's accessible name. */
	title: string;
	/** Rows behind the chart; leave empty with `chart="none"`. */
	data?: Datum[];
	dataKey?: string;
	xKey?: string;
	/** Headline at rest, e.g. the period average. */
	value: number;
	/** Caption under the headline at rest, e.g. "Avg". */
	label: string;
	/** Context line under the headline, e.g. "Across all paid plans". */
	description?: string;
	/** Change over the whole period, in percent. */
	trend: number;
	/** What the trend compares against, read after it, e.g. "vs last month". */
	comparisonLabel?: string;
	/** Which direction is good news; "down" for churn, latency or cost. */
	positive?: StatCardPositive;
	chart?: StatCardChartKind;
	size?: StatCardSize;
	/** Series colour; defaults to the first chart slot. */
	color?: string;
	locale?: string;
	formatValue?: (value: number) => string;
	/** Caption for a hovered row. Defaults to the row's short month. */
	formatLabel?: (date: Date) => string;
	/** "empty" and "error" swap the chart for a message; "loading" skeletons the figures. */
	status?: StatCardStatus;
	emptyMessage?: string;
	errorMessage?: string;
	/** Shows a retry button in the error state. */
	onRetry?: () => void;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	className?: string;
	children?: ReactNode;
}

/** The stat card: the headline, caption and trend follow whichever point the chart has active. */
export function StatCard({
	title,
	data = [],
	dataKey = "value",
	xKey = "date",
	value,
	label,
	description,
	trend,
	comparisonLabel,
	positive = "up",
	chart = "area",
	size = "default",
	color = "var(--chart-1)",
	locale,
	formatValue,
	formatLabel,
	status = "ready",
	emptyMessage = "No data yet",
	errorMessage = "Couldn't load this metric.",
	onRetry,
	activeIndex: activeIndexProp,
	onActiveIndexChange,
	className,
	children,
}: StatCardProps) {
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
	const month = useMemo(
		() => new Intl.DateTimeFormat(locale, { month: "short" }),
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
		? (formatLabel ?? ((d: Date) => month.format(d)))(toDate(datum[xKey]))
		: label;
	const shownTrend =
		(datum ? periodTrend(data, activeIndex ?? 0, dataKey) : null) ?? trend;
	const magnitude = percent.format(Math.abs(shownTrend) / 100);
	const styles = statCard({ size, chart, status, positive });
	const config = { [dataKey]: { label: title, color } };
	const margin = { top: 4, right: 0, bottom: 0, left: 0 };
	const chartStatus: ChartStatus = status === "loading" ? "loading" : "ready";
	const summary = statSummary({
		data,
		dataKey,
		xKey,
		formatValue: number,
		formatDate: (v) => month.format(toDate(v)),
	});

	// The headline counts only when `value` itself changes; hovering the chart swaps instantly.
	const [settled, setSettled] = useState(value);
	useEffect(() => {
		const id = setTimeout(() => setSettled(value), 450);
		return () => clearTimeout(id);
	}, [value]);
	const counterMs = activeIndex === null && value !== settled ? 400 : 0;

	// Announce a new resting value, not the first render and not every hovered point.
	const [announced, setAnnounced] = useState("");
	const first = useRef(true);
	useEffect(() => {
		if (first.current) {
			first.current = false;
			return;
		}
		setAnnounced(`${title} ${number(value)}`);
	}, [value, title, number]);

	return (
		<Card data-slot="stat-card" className={cn(styles.root(), className)}>
			<CardHeader className={styles.header()}>
				<CardTitle className={styles.title()}>{title}</CardTitle>
				<CardAction>
					{status === "loading" ? (
						<Skeleton className="h-5 w-14 rounded-full" />
					) : status === "ready" ? (
						<Badge
							variant={trendTone(shownTrend, positive)}
							size="sm"
							className="tabular-nums"
						>
							<svg aria-hidden="true" viewBox="0 0 12 12" className="size-3" fill="none">
								<path
									d={trendPath(shownTrend)}
									stroke="currentColor"
									strokeWidth={1.5}
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span aria-hidden="true">{percent.format(shownTrend / 100)}</span>
							<span className={styles.srOnly()}>
								{trendSentence(shownTrend, magnitude, comparisonLabel)}
							</span>
						</Badge>
					) : null}
				</CardAction>
			</CardHeader>
			<CardContent className={styles.body()}>
				{status === "loading" ? (
					<div className={styles.headline()} aria-busy="true">
						<Skeleton className="h-7 w-28" />
						<Skeleton className="h-3 w-20" />
					</div>
				) : status === "empty" ? (
					<p className={styles.message()}>{emptyMessage}</p>
				) : status === "error" ? (
					<div className={styles.message()} role="alert">
						<p>{errorMessage}</p>
						{onRetry ? (
							<Button size="sm" variant="outline" onClick={onRetry}>
								Retry
							</Button>
						) : null}
					</div>
				) : (
					<div className={styles.headline()}>
						<RollingDigits
							variant="count"
							value={shownValue}
							format={number}
							size="sm"
							durationMs={counterMs}
							startOnView={false}
							className="font-bold text-foreground"
						/>
						<span className={styles.label()}>{shownLabel}</span>
						<span className={styles.srOnly()} aria-live="polite">
							{announced}
						</span>
					</div>
				)}
				{description && status !== "empty" && status !== "error" ? (
					<p className={styles.description()}>{description}</p>
				) : null}
				{chart === "none" ? null : (
					<div className={styles.chart()}>
						<ChartContainer
							config={config}
							title={title}
							description={summary}
							aspect="auto"
							locale={locale}
						>
							{chart === "line" ? (
								<LineChart
									data={data}
									xKey={xKey}
									margin={margin}
									status={chartStatus}
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
									status={chartStatus}
									activeIndex={activeIndex}
									onActiveIndexChange={setActive}
								>
									<Area dataKey={dataKey} curve="monotone" fillOpacity={0.45} />
									{children}
								</AreaChart>
							)}
						</ChartContainer>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
