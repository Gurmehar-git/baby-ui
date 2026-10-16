"use client";

import {
	createContext,
	useCallback,
	useContext,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { stackBase, stackMax } from "../../area-chart/react/geometry";
import { useChart } from "../../chart/react/chart";
import { type ChartPhase, type Datum, seriesColor, toDate } from "../../chart/react/core";
import { useActivePoint } from "../../chart/react/frame";
import {
	CHART_DURATION,
	CHART_EASE,
	type Playback,
	tween,
} from "../../chart/react/motion";
import {
	TimeSeriesChart,
	type TimeSeriesChartProps,
	useExtentRegistry,
	usePlot,
} from "../../chart/react/time-series";
import { cn } from "../../lib/react/cn";
import {
	localProgress,
	seriesBarDelay,
	seriesBarOffset,
	seriesBarWidth,
} from "./geometry";
import { type SeriesBarVariant, seriesBar } from "./variants";

interface BarLayoutValue {
	keys: string[];
	register: (key: string) => () => void;
	size?: number;
	maxSize?: number;
	gap: number;
	stacked: boolean;
}

const BarLayoutContext = createContext<BarLayoutValue>({
	keys: [],
	register: () => () => {},
	gap: 4,
	stacked: false,
});

export interface ComposedChartProps extends TimeSeriesChartProps {
	/** Fixed bar width in px. */
	barSize?: number;
	maxBarSize?: number;
	/** Gap between grouped bars in px. */
	barGap?: number;
	/** Stack SeriesBar segments in render order; lines and areas stay unstacked. */
	stacked?: boolean;
	/** Announced after the chart's name, e.g. "composed chart". */
	roleDescription?: string;
}

export function ComposedChart({
	barSize,
	maxBarSize,
	barGap = 4,
	stacked = false,
	roleDescription = "composed chart",
	...props
}: ComposedChartProps) {
	const [keys, setKeys] = useState<string[]>([]);
	const register = useCallback((key: string) => {
		setKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
		return () => setKeys((prev) => prev.filter((k) => k !== key));
	}, []);
	const value = useMemo(
		() => ({ keys, register, size: barSize, maxSize: maxBarSize, gap: barGap, stacked }),
		[keys, register, barSize, maxBarSize, barGap, stacked],
	);
	return (
		<BarLayoutContext.Provider value={value}>
			<TimeSeriesChart roleDescription={roleDescription} {...props} />
		</BarLayoutContext.Provider>
	);
}

export interface SeriesBarProps {
	dataKey: string;
	/** Defaults to the series colour from the chart config, `var(--color-<dataKey>)`. */
	color?: string;
	variant?: SeriesBarVariant;
	/** Corner radius of the bar's top in px. */
	radius?: number;
	className?: string;
}

type Segment = { base: number; top: number };
type Motion = { from: Map<string, Segment>; kind: "enter" | "update" | "exit" };

const EMPTY = new Map<string, Segment>();

/** Bars grow from the baseline staggered, retween on data changes and mirror on conceal. */
function useBarMotion(targets: Map<string, Segment>, order: string[], phase: ChartPhase) {
	const { animate } = usePlot();
	const [clock, setClock] = useState(1);
	const motion = useRef<Motion>({ from: EMPTY, kind: "enter" });
	const shown = useRef<Map<string, Segment>>(EMPTY);
	const total = CHART_DURATION.enter * 1.4;
	const signature = [...targets].map(([k, s]) => `${k}:${s.base}:${s.top}`).join(",");
	const prevSignature = useRef(signature);
	const prevPhase = useRef<ChartPhase | null>(null);
	const playback = useRef<Playback | null>(null);
	useLayoutEffect(
		() => () => {
			playback.current?.stop();
			// A remount (StrictMode, keyed parents) must replay the growth, not resume a stopped one.
			prevPhase.current = null;
		},
		[],
	);

	// A phase change without a new motion must not cancel the growth still running.
	useLayoutEffect(() => {
		const phaseChanged = prevPhase.current !== phase;
		const dataChanged = prevSignature.current !== signature;
		prevPhase.current = phase;
		prevSignature.current = signature;
		let kind: Motion["kind"] | null = null;
		if (phaseChanged && phase === "revealing") kind = "enter";
		else if (phaseChanged && phase === "concealing") kind = "exit";
		else if (dataChanged && phase === "ready") kind = "update";
		if (!kind) return;
		motion.current = { from: kind === "enter" ? EMPTY : shown.current, kind };
		playback.current?.stop();
		if (!animate) {
			setClock(1);
			return;
		}
		setClock(0);
		playback.current = tween({
			duration: kind === "update" ? CHART_DURATION.update : total,
			ease: (t) => t,
			onUpdate: setClock,
		});
	}, [phase, signature, animate, total]);

	const { kind, from } = motion.current;
	const count = order.length;
	const segments = new Map<string, Segment>();
	order.forEach((key, i) => {
		const target = targets.get(key);
		if (!target) return;
		const start = from.get(key) ?? { base: target.base, top: target.base };
		const end = kind === "exit" ? { base: start.base, top: start.base } : target;
		const p =
			kind === "update"
				? CHART_EASE(clock)
				: localProgress(
						clock * total,
						seriesBarDelay(i, count, CHART_DURATION.enter),
						CHART_DURATION.enter,
						CHART_EASE,
					);
		segments.set(key, {
			base: start.base + (end.base - start.base) * p,
			top: start.top + (end.top - start.top) * p,
		});
	});
	if (phase === "loading" || phase === "gridTweenLoading") segments.clear();
	shown.current = segments;
	return segments;
}

export function SeriesBar({
	dataKey,
	color: colorProp,
	variant = "solid",
	radius = 3,
	className,
}: SeriesBarProps) {
	const { register, data, x, xKey, yScale, innerWidth, phase } = usePlot();
	const layout = useContext(BarLayoutContext);
	const registerExtent = useExtentRegistry();
	const { active } = useActivePoint();
	const { hidden, highlighted } = useChart();
	const uid = useId().replace(/:/g, "");
	const color = colorProp ?? seriesColor(dataKey);

	useLayoutEffect(() => register({ key: dataKey, color }), [register, dataKey, color]);
	useLayoutEffect(() => layout.register(dataKey), [layout.register, dataKey]);

	const visible = layout.keys.filter((k) => !hidden.has(k));
	const index = Math.max(0, visible.indexOf(dataKey));
	const below = layout.stacked ? visible.slice(0, index) : [];
	// biome-ignore lint/correctness/useExhaustiveDependencies: below.join("|") is a content key, so equal data does not recompute; below left out on purpose, the listed values decide when it runs.
	const stackTop = useMemo(
		() => (layout.stacked && !hidden.has(dataKey) ? stackMax(data, dataKey, below) : 0),
		[layout.stacked, hidden, data, dataKey, below.join("|")],
	);
	useLayoutEffect(() => {
		if (!stackTop) return;
		return registerExtent(`${uid}-stack`, { y: [0, stackTop] });
	}, [registerExtent, uid, stackTop]);

	const width = seriesBarWidth({
		innerWidth,
		count: data.length,
		groups: layout.stacked ? 1 : Math.max(1, visible.length),
		size: layout.size,
		maxSize: layout.maxSize,
		gap: layout.gap,
	});
	const offset = seriesBarOffset({
		index,
		groups: visible.length,
		width,
		gap: layout.gap,
		stacked: layout.stacked,
	});

	const keyOf = (datum: Datum, i: number) => String(toDate(datum[xKey]).getTime() || i);
	const order = data.map(keyOf);
	// biome-ignore lint/correctness/useExhaustiveDependencies: below.join("|") is a content key, so equal data does not recompute; below, keyOf left out on purpose, the listed values decide when it runs.
	const targets = useMemo(() => {
		const map = new Map<string, Segment>();
		data.forEach((datum, i) => {
			const value = datum[dataKey];
			if (typeof value !== "number" || hidden.has(dataKey)) return;
			const base = stackBase(datum, below);
			map.set(keyOf(datum, i), { base, top: base + value });
		});
		return map;
	}, [data, dataKey, hidden, below.join("|")]);
	const segments = useBarMotion(targets, order, phase);
	const dimmedByLegend = highlighted !== null && highlighted !== dataKey;

	return (
		<g data-slot="chart-series-bar" data-series={dataKey} data-variant={variant}>
			{data.map((datum, i) => {
				const segment = segments.get(order[i] ?? "");
				if (!segment) return null;
				const y0 = yScale(segment.base);
				const y1 = yScale(segment.top);
				const height = Math.abs(y0 - y1);
				const dimmed = (active !== null && active.index !== i) || dimmedByLegend;
				return (
					<rect
						key={order[i]}
						data-index={i}
						x={x(datum) + offset}
						y={Math.min(y0, y1)}
						width={width}
						height={height}
						rx={Math.min(radius, width / 2, height / 2)}
						fill={color}
						stroke={variant === "outline" ? color : undefined}
						className={cn(seriesBar({ variant }), className)}
						style={{ opacity: dimmed ? 0.3 : 1 }}
					/>
				);
			})}
		</g>
	);
}
