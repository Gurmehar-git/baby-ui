"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useContext,
	useMemo,
	useState,
} from "react";
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
import { type ChartStatus, type Datum, toDate } from "../../chart/core";
import { ChartContainer } from "../../chart/react/chart";
import { cn } from "../../lib/cn";
import { Line, LineChart } from "../../line-chart/react/line-chart";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import { ToggleGroup, ToggleGroupItem } from "../../toggle-group/react/toggle-group";
import {
	type OverviewCardChartKind,
	type OverviewCardSize,
	overviewCard,
} from "../variants";

export type { OverviewCardChartKind, OverviewCardSize };

type OverviewCardState = {
	name: string;
	data: Datum[];
	dataKey: string;
	xKey: string;
	value: number;
	label: string;
	trend: number;
	chart: OverviewCardChartKind;
	color: string;
	locale?: string;
	status: ChartStatus;
	activeIndex: number | null;
	setActive: (index: number | null) => void;
	number: (value: number) => string;
	formatLabel: (date: Date) => string;
	styles: ReturnType<typeof overviewCard>;
};

const OverviewCardContext = createContext<OverviewCardState | null>(null);

function useOverviewCard() {
	const state = useContext(OverviewCardContext);
	if (!state)
		throw new Error("OverviewCard parts must be rendered inside an OverviewCard.");
	return state;
}

export interface OverviewCardProps extends Omit<ComponentProps<typeof Card>, "children"> {
	/** What the metric is: the chart's accessible name and the period switcher's lead. */
	name: string;
	data: Datum[];
	dataKey: string;
	xKey?: string;
	/** Headline at rest, e.g. the period total. */
	value: number;
	/** Caption under the headline at rest, e.g. "This month". */
	label: string;
	/** Change over the whole period, in percent. */
	trend: number;
	chart?: OverviewCardChartKind;
	size?: OverviewCardSize;
	/** Series colour; defaults to the first chart slot. */
	color?: string;
	locale?: string;
	formatValue?: (value: number) => string;
	/** Caption for a hovered point. Defaults to the point's short date. */
	formatLabel?: (date: Date) => string;
	status?: ChartStatus;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	children?: ReactNode;
}

/**
 * A chart-first metric card from parts: OverviewCardHeader with a title and OverviewCardPeriods,
 * then OverviewCardContent with OverviewCardValue and OverviewCardChart.
 */
export function OverviewCard({
	name,
	data,
	dataKey,
	xKey = "date",
	value,
	label,
	trend,
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
}: OverviewCardProps) {
	const [internal, setInternal] = useState<number | null>(null);
	const activeIndex = activeIndexProp !== undefined ? activeIndexProp : internal;
	const number = useMemo(
		() =>
			formatValue ?? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format,
		[formatValue, locale],
	);
	const day = useMemo(
		() => new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }),
		[locale],
	);
	const styles = overviewCard({ size, chart });
	const state: OverviewCardState = {
		name,
		data,
		dataKey,
		xKey,
		value,
		label,
		trend,
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
		formatLabel: formatLabel ?? ((d: Date) => day.format(d)),
		styles,
	};
	return (
		<OverviewCardContext.Provider value={state}>
			<Card data-slot="overview-card" className={cn(styles.root(), className)} {...props}>
				{children}
			</Card>
		</OverviewCardContext.Provider>
	);
}

export function OverviewCardHeader({
	className,
	...props
}: ComponentProps<typeof CardHeader>) {
	const { styles } = useOverviewCard();
	return <CardHeader className={cn(styles.header(), className)} {...props} />;
}

export function OverviewCardTitle({
	className,
	...props
}: ComponentProps<typeof CardTitle>) {
	const { styles } = useOverviewCard();
	return <CardTitle className={cn(styles.title(), className)} {...props} />;
}

export function OverviewCardDescription({
	className,
	...props
}: ComponentProps<typeof CardDescription>) {
	const { styles } = useOverviewCard();
	return <CardDescription className={cn(styles.description(), className)} {...props} />;
}

export interface OverviewCardPeriodsProps {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	/** Accessible name; defaults to "<name> period". */
	label?: string;
	className?: string;
	children?: ReactNode;
}

/** The period switcher in the header; holds OverviewCardPeriod items. */
export function OverviewCardPeriods({
	value,
	defaultValue = "",
	onValueChange,
	label,
	className,
	children,
}: OverviewCardPeriodsProps) {
	const { name } = useOverviewCard();
	const [internal, setInternal] = useState(defaultValue);
	return (
		<CardAction className={className}>
			<ToggleGroup
				type="single"
				size="sm"
				value={value ?? internal}
				onValueChange={(next) => {
					if (typeof next !== "string") return;
					if (value === undefined) setInternal(next);
					onValueChange?.(next);
				}}
				label={label ?? `${name} period`}
			>
				{children}
			</ToggleGroup>
		</CardAction>
	);
}

export function OverviewCardPeriod(props: ComponentProps<typeof ToggleGroupItem>) {
	return <ToggleGroupItem {...props} />;
}

export function OverviewCardContent({
	className,
	...props
}: ComponentProps<typeof CardContent>) {
	const { styles } = useOverviewCard();
	return <CardContent className={cn(styles.body(), className)} {...props} />;
}

/** The headline and its caption, the resting value or the hovered point's; OverviewCardTrend goes inside. */
export function OverviewCardValue({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	const { data, dataKey, xKey, value, label, activeIndex, number, formatLabel, styles } =
		useOverviewCard();
	const datum = activeIndex !== null ? data[activeIndex] : undefined;
	const hovered = datum?.[dataKey];
	return (
		<div data-slot="overview-card-value" className={cn(styles.headline(), className)}>
			<RollingDigits
				variant="count"
				value={typeof hovered === "number" ? hovered : value}
				format={number}
				size="lg"
				durationMs={400}
				startOnView={false}
				className="font-bold text-foreground"
			/>
			<span className={styles.label()}>
				{datum ? formatLabel(toDate(datum[xKey])) : label}
			</span>
			{children}
		</div>
	);
}

/** A signed badge for the change over the whole period. */
export function OverviewCardTrend({ className }: { className?: string }) {
	const { trend, locale } = useOverviewCard();
	const percent = useMemo(
		() =>
			new Intl.NumberFormat(locale, {
				style: "percent",
				maximumFractionDigits: 1,
				signDisplay: "exceptZero",
			}),
		[locale],
	);
	const up = trend >= 0;
	return (
		<Badge variant={up ? "success" : "destructive"} size="sm" className={className}>
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
	);
}

/** The series chart; hovering a point drives the headline. Extra chart layers go inside. */
export function OverviewCardChart({
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
		styles,
	} = useOverviewCard();
	const shared = {
		data,
		xKey,
		margin: { top: 8, right: 0, bottom: 0, left: 0 },
		status,
		activeIndex,
		onActiveIndexChange: setActive,
	};
	return (
		<div data-slot="overview-card-chart" className={cn(styles.chart(), className)}>
			<ChartContainer
				config={{ [dataKey]: { label: name, color } }}
				title={name}
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
						<Area dataKey={dataKey} curve="monotone" fillOpacity={0.35} />
						{children}
					</AreaChart>
				)}
			</ChartContainer>
		</div>
	);
}
