"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Area, AreaChart } from "../../area-chart/react/area-chart";
import { Badge } from "../../badge/react/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../card/react/card";
import { type ChartStatus, type Datum, toDate } from "../../chart/core";
import { ChartContainer } from "../../chart/react/chart";
import { cn } from "../../lib/cn";
import { Line, LineChart } from "../../line-chart/react/line-chart";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import { Skeleton } from "../../skeleton/react/skeleton";
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
} from "../variants";

export type { StatCardChartKind, StatCardPositive, StatCardSize, StatCardStatus };

type StatCardState = {
	name: string;
	data: Datum[];
	dataKey: string;
	xKey: string;
	value: number;
	label: string;
	trend: number;
	comparisonLabel?: string;
	positive: StatCardPositive;
	chart: StatCardChartKind;
	color: string;
	locale?: string;
	status: StatCardStatus;
	activeIndex: number | null;
	setActive: (index: number | null) => void;
	number: (value: number) => string;
	formatLabel: (date: Date) => string;
	styles: ReturnType<typeof statCard>;
};

const StatCardContext = createContext<StatCardState | null>(null);

function useStatCard() {
	const state = useContext(StatCardContext);
	if (!state) throw new Error("StatCard parts must be rendered inside a StatCard.");
	return state;
}

export interface StatCardProps extends Omit<ComponentProps<typeof Card>, "children"> {
	/** What the metric is: the chart's accessible name and the live announcement's lead. */
	name: string;
	/** Rows behind the chart; leave empty with `chart="none"`. */
	data?: Datum[];
	dataKey?: string;
	xKey?: string;
	/** Headline at rest, e.g. the period average. */
	value: number;
	/** Caption under the headline at rest, e.g. "Avg". */
	label: string;
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
	/** "loading" skeletons the figures; "empty" and "error" show StatCardEmpty or StatCardError. */
	status?: StatCardStatus;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	children?: ReactNode;
}

/**
 * A metric card from parts: StatCardHeader with StatCardTitle and StatCardTrend, then
 * StatCardContent with StatCardValue and StatCardChart. Hovering the chart drives the headline.
 */
export function StatCard({
	name,
	data = [],
	dataKey = "value",
	xKey = "date",
	value,
	label,
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
	activeIndex: activeIndexProp,
	onActiveIndexChange,
	className,
	children,
	...props
}: StatCardProps) {
	const [internal, setInternal] = useState<number | null>(null);
	const activeIndex = activeIndexProp !== undefined ? activeIndexProp : internal;
	const number = useMemo(
		() =>
			formatValue ?? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format,
		[formatValue, locale],
	);
	const month = useMemo(
		() => new Intl.DateTimeFormat(locale, { month: "short" }),
		[locale],
	);
	const styles = statCard({ size, chart, status, positive });
	const state: StatCardState = {
		name,
		data,
		dataKey,
		xKey,
		value,
		label,
		trend,
		comparisonLabel,
		positive,
		chart,
		color,
		locale,
		status,
		activeIndex,
		setActive: (index) => {
			if (activeIndexProp === undefined) setInternal(index);
			onActiveIndexChange?.(index);
		},
		number,
		formatLabel: formatLabel ?? ((d: Date) => month.format(d)),
		styles,
	};
	return (
		<StatCardContext.Provider value={state}>
			<Card data-slot="stat-card" className={cn(styles.root(), className)} {...props}>
				{children}
			</Card>
		</StatCardContext.Provider>
	);
}

export function StatCardHeader({
	className,
	...props
}: ComponentProps<typeof CardHeader>) {
	const { styles } = useStatCard();
	return <CardHeader className={cn(styles.header(), className)} {...props} />;
}

export function StatCardTitle({ className, ...props }: ComponentProps<typeof CardTitle>) {
	const { styles } = useStatCard();
	return <CardTitle className={cn(styles.title(), className)} {...props} />;
}

/** The trend badge; follows the hovered point, with a sentence for screen readers. */
export function StatCardTrend({ className }: { className?: string }) {
	const {
		data,
		dataKey,
		trend,
		positive,
		comparisonLabel,
		status,
		activeIndex,
		locale,
		styles,
	} = useStatCard();
	const percent = useMemo(
		() =>
			new Intl.NumberFormat(locale, {
				style: "percent",
				maximumFractionDigits: 1,
				signDisplay: "exceptZero",
			}),
		[locale],
	);
	const shown =
		(activeIndex !== null ? periodTrend(data, activeIndex, dataKey) : null) ?? trend;
	return (
		<CardAction className={className}>
			{status === "loading" ? (
				<Skeleton className="h-5 w-14 rounded-full" />
			) : status === "ready" ? (
				<Badge variant={trendTone(shown, positive)} size="sm" className="tabular-nums">
					<svg aria-hidden="true" viewBox="0 0 12 12" className="size-3" fill="none">
						<path
							d={trendPath(shown)}
							stroke="currentColor"
							strokeWidth={1.5}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<span aria-hidden="true">{percent.format(shown / 100)}</span>
					<span className={styles.srOnly()}>
						{trendSentence(shown, percent.format(Math.abs(shown) / 100), comparisonLabel)}
					</span>
				</Badge>
			) : null}
		</CardAction>
	);
}

export function StatCardContent({
	className,
	...props
}: ComponentProps<typeof CardContent>) {
	const { styles } = useStatCard();
	return <CardContent className={cn(styles.body(), className)} {...props} />;
}

/** The headline and its caption: the resting value, or the hovered point's. */
export function StatCardValue({ className }: { className?: string }) {
	const {
		name,
		data,
		dataKey,
		xKey,
		value,
		label,
		status,
		activeIndex,
		number,
		formatLabel,
		styles,
	} = useStatCard();
	// The headline counts only when `value` itself changes; hovering the chart swaps instantly.
	const [settled, setSettled] = useState(value);
	useEffect(() => {
		const id = setTimeout(() => setSettled(value), 450);
		return () => clearTimeout(id);
	}, [value]);
	// Announce a new resting value, not the first render and not every hovered point.
	const [announced, setAnnounced] = useState("");
	const first = useRef(true);
	useEffect(() => {
		if (first.current) {
			first.current = false;
			return;
		}
		setAnnounced(`${name} ${number(value)}`);
	}, [value, name, number]);

	if (status === "empty" || status === "error") return null;
	if (status === "loading")
		return (
			<div
				data-slot="stat-card-value"
				className={cn(styles.headline(), className)}
				aria-busy="true"
			>
				<Skeleton className="h-7 w-28" />
				<Skeleton className="h-3 w-20" />
			</div>
		);
	const datum = activeIndex !== null ? data[activeIndex] : undefined;
	const hovered = datum?.[dataKey];
	return (
		<div data-slot="stat-card-value" className={cn(styles.headline(), className)}>
			<RollingDigits
				variant="count"
				value={typeof hovered === "number" ? hovered : value}
				format={number}
				size="sm"
				durationMs={activeIndex === null && value !== settled ? 400 : 0}
				startOnView={false}
				className="font-bold text-foreground"
			/>
			<span className={styles.label()}>
				{datum ? formatLabel(toDate(datum[xKey])) : label}
			</span>
			<span className={styles.srOnly()} aria-live="polite">
				{announced}
			</span>
		</div>
	);
}

/** A context line under the headline; hidden while empty or failed. */
export function StatCardDescription({ className, ...props }: ComponentProps<"p">) {
	const { status, styles } = useStatCard();
	if (status === "empty" || status === "error") return null;
	return (
		<p
			data-slot="stat-card-description"
			className={cn(styles.description(), className)}
			{...props}
		/>
	);
}

/** Shown only while `status` is "empty". */
export function StatCardEmpty({ className, ...props }: ComponentProps<"p">) {
	const { status, styles } = useStatCard();
	if (status !== "empty") return null;
	return (
		<p
			data-slot="stat-card-empty"
			className={cn(styles.message(), className)}
			{...props}
		/>
	);
}

/** Shown only while `status` is "error"; put a retry Button inside. */
export function StatCardError({ className, ...props }: ComponentProps<"div">) {
	const { status, styles } = useStatCard();
	if (status !== "error") return null;
	return (
		<div
			data-slot="stat-card-error"
			role="alert"
			className={cn(styles.message(), className)}
			{...props}
		/>
	);
}

/** The series chart; hovering a point drives the value and trend. Extra chart layers go inside. */
export function StatCardChart({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	const {
		name,
		data,
		dataKey,
		xKey,
		chart,
		color,
		locale,
		status,
		activeIndex,
		setActive,
		number,
		styles,
	} = useStatCard();
	const month = useMemo(
		() => new Intl.DateTimeFormat(locale, { month: "short" }),
		[locale],
	);
	if (chart === "none") return null;
	const margin = { top: 4, right: 0, bottom: 0, left: 0 };
	const chartStatus: ChartStatus = status === "loading" ? "loading" : "ready";
	const shared = {
		data,
		xKey,
		margin,
		status: chartStatus,
		activeIndex,
		onActiveIndexChange: setActive,
	};
	return (
		<div data-slot="stat-card-chart" className={cn(styles.chart(), className)}>
			<ChartContainer
				config={{ [dataKey]: { label: name, color } }}
				title={name}
				description={statSummary({
					data,
					dataKey,
					xKey,
					formatValue: number,
					formatDate: (v) => month.format(toDate(v)),
				})}
				aspect="auto"
				locale={locale}
			>
				{chart === "line" ? (
					<LineChart {...shared}>
						<Line dataKey={dataKey} curve="monotone" strokeWidth={2} />
						{children}
					</LineChart>
				) : (
					<AreaChart {...shared}>
						<Area dataKey={dataKey} curve="monotone" fillOpacity={0.45} />
						{children}
					</AreaChart>
				)}
			</ChartContainer>
		</div>
	);
}
