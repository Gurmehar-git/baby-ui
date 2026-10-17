"use client";

import { extent } from "d3-array";
import { scaleLinear, scaleTime } from "d3-scale";
import {
	type CSSProperties,
	createContext,
	type PointerEvent,
	type ReactNode,
	useCallback,
	useContext,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	type ActivePoint,
	announceRows,
	type ChartPhase,
	type ChartStatus,
	type Datum,
	DEFAULT_MARGIN,
	type Domain,
	type Margin,
	type SeriesConfig,
	seriesColor,
	summarize,
	type TooltipRow,
	toDate,
} from "../../chart/core";
import {
	CHART_DURATION,
	CHART_EASE,
	prefersReducedMotion,
	tween,
} from "../../chart/motion";
import { useChart } from "../../chart/react/chart";
import {
	ActivePointProvider,
	CartesianProvider,
	ChartFrame,
	type TickScale,
	useActivePoint,
} from "../../chart/react/frame";
import {
	type PlotContextValue,
	PlotProvider,
	useActiveIndex,
	useAnimatedDomain,
	useChartPhase,
	usePlot,
	useSeriesRegistry,
} from "../../chart/react/time-series";
import {
	enterDelay,
	nearestPoint,
	POINT_BLUR,
	POINT_CONCEAL,
	POINT_ENTER,
	scatterDomain,
	shapePath,
} from "../geometry";
import {
	SCATTER_RADIUS,
	SCATTER_SHAPES,
	type ScatterShape,
	type ScatterSize,
	scatterPoint,
} from "../variants";

interface ScatterRootValue {
	/** Series under the pointer; null when the keyboard selects a whole row. */
	activeKey: string | null;
	shapeFor: (key: string) => ScatterShape;
	registerEnter: (id: string, el: SVGGElement, delay: number) => () => void;
}

const ScatterRootContext = createContext<ScatterRootValue>({
	activeKey: null,
	shapeFor: () => "circle",
	registerEnter: () => () => {},
});

export interface ScatterChartProps {
	/** Rows with a date under xKey and one number per series. */
	data: Datum[];
	xKey?: string;
	/** Header of the date column in the screen-reader table. */
	xLabel?: string;
	margin?: Partial<Margin>;
	status?: ChartStatus;
	animate?: boolean;
	activeIndex?: number | null;
	defaultActiveIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	roleDescription?: string;
	className?: string;
	children?: ReactNode;
}

export function ScatterChart({
	data,
	xKey = "date",
	xLabel = "Date",
	margin,
	status = "ready",
	animate = true,
	activeIndex: activeIndexProp,
	defaultActiveIndex = null,
	onActiveIndexChange,
	roleDescription = "scatter chart",
	className,
	children,
}: ScatterChartProps) {
	const chart = useChart();
	const { format, hidden, config } = chart;
	const { registered, series, register } = useSeriesRegistry(hidden);
	const seriesKeys = series.map((s) => s.key).join("|");
	const target = useMemo(
		() => scatterDomain(data, seriesKeys ? seriesKeys.split("|") : []),
		[data, seriesKeys],
	);
	const { phase, advance } = useChartPhase(status, animate);
	const domain = useAnimatedDomain(target, phase, status, animate, advance);
	const { activeIndex, instant, setActive } = useActiveIndex(
		activeIndexProp,
		defaultActiveIndex,
		onActiveIndexChange,
	);
	const [activeKey, setActiveKey] = useState<string | null>(null);
	const interactive = phase === "ready" && data.length > 0;

	const seriesLabel = (key: string) => {
		const label = config[key]?.label;
		return typeof label === "string" ? label : key;
	};
	const title = (datum: Datum) => format.title(toDate(datum[xKey]));
	const rows = (datum: Datum): TooltipRow[] =>
		series
			.filter((s) => activeKey === null || s.key === activeKey)
			.map((s) => {
				const value = datum[s.key];
				return {
					key: s.key,
					label: seriesLabel(s.key),
					color: s.color,
					value: typeof value === "number" ? value : null,
				};
			});
	const activeDatum = activeIndex !== null && interactive ? data[activeIndex] : undefined;
	const announcement =
		activeDatum && instant
			? announceRows(title(activeDatum), rows(activeDatum), format.number)
			: "";

	const onActiveChange = (index: number | null, fromKeyboard: boolean) => {
		if (fromKeyboard) setActiveKey(null);
		setActive(index, fromKeyboard);
	};
	const shapeFor = useCallback(
		(key: string) => {
			const index = registered.findIndex((s) => s.key === key);
			return SCATTER_SHAPES[Math.max(0, index) % SCATTER_SHAPES.length] ?? "circle";
		},
		[registered],
	);

	return (
		<ChartFrame
			roleDescription={roleDescription}
			summary={
				chart.description ??
				summarize({
					data,
					xKey,
					series: series.map((s) => ({ key: s.key, label: seriesLabel(s.key) })),
					format,
				})
			}
			table={{
				columns: [xLabel, ...series.map((s) => seriesLabel(s.key))],
				rows: data.map((datum) => ({
					header: title(datum),
					cells: series.map((s) => {
						const value = datum[s.key];
						return typeof value === "number" ? format.number(value) : "";
					}),
				})),
			}}
			count={data.length}
			activeIndex={activeIndex}
			onActiveChange={onActiveChange}
			interactive={interactive}
			announcement={announcement}
			phase={phase}
			className={className}
		>
			{(frame) => (
				<ScatterPlot
					frame={frame}
					data={data}
					xKey={xKey}
					marginProp={margin}
					domain={domain}
					series={series}
					register={register}
					phase={phase}
					animate={animate}
					advance={advance}
					activeIndex={activeIndex}
					activeKey={activeKey}
					instant={instant}
					interactive={interactive}
					onHit={(index, key) => {
						setActiveKey(key);
						if (index !== activeIndex) setActive(index, false);
					}}
					shapeFor={shapeFor}
					title={title}
					rows={rows}
				>
					{children}
				</ScatterPlot>
			)}
		</ChartFrame>
	);
}

function ScatterPlot({
	frame,
	data,
	xKey,
	marginProp,
	domain,
	series,
	register,
	phase,
	animate,
	advance,
	activeIndex,
	activeKey,
	instant,
	interactive,
	onHit,
	shapeFor,
	title,
	rows,
	children,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	data: Datum[];
	xKey: string;
	marginProp?: Partial<Margin>;
	domain: Domain;
	series: SeriesConfig[];
	register: (series: SeriesConfig) => () => void;
	phase: ChartPhase;
	animate: boolean;
	advance: (event: "done") => void;
	activeIndex: number | null;
	activeKey: string | null;
	instant: boolean;
	interactive: boolean;
	onHit: (index: number | null, key: string | null) => void;
	shapeFor: (key: string) => ScatterShape;
	title: (datum: Datum) => string;
	rows: (datum: Datum) => TooltipRow[];
	children?: ReactNode;
}) {
	const { format } = useChart();
	const clipId = `${useId().replace(/:/g, "")}-scatter`;
	const margin = useMemo(() => ({ ...DEFAULT_MARGIN, ...marginProp }), [marginProp]);
	const innerWidth = Math.max(0, frame.width - margin.left - margin.right);
	const innerHeight = Math.max(0, frame.height - margin.top - margin.bottom);

	const xScale = useMemo(() => {
		const [min = 0, max = min] = extent(data, (d) => toDate(d[xKey]).getTime());
		return scaleTime().domain([min, max]).range([0, innerWidth]);
	}, [data, xKey, innerWidth]);
	const yScale = useMemo(
		() => scaleLinear().domain(domain).range([innerHeight, 0]),
		[domain, innerHeight],
	);
	const x = useCallback((d: Datum) => xScale(toDate(d[xKey])), [xScale, xKey]);
	const labels = useMemo(
		() => data.map((d) => format.tick(toDate(d[xKey]))),
		[data, xKey, format],
	);

	const enters = useRef(new Map<string, { el: SVGGElement; delay: number }>());
	const registerEnter = useCallback((id: string, el: SVGGElement, delay: number) => {
		enters.current.set(id, { el, delay });
		return () => {
			if (enters.current.get(id)?.el === el) enters.current.delete(id);
		};
	}, []);

	const hasSize = innerWidth > 0;
	useLayoutEffect(() => {
		if ((phase !== "revealing" && phase !== "concealing") || !hasSize) return;
		const points = [...enters.current.values()];
		const reduced = !animate || prefersReducedMotion();
		const paint = (el: SVGGElement, p: number) => {
			el.style.opacity = String(p);
			el.style.filter = p >= 1 ? "" : `blur(${(1 - p) * POINT_BLUR}px)`;
		};
		if (phase === "concealing") {
			const playback = tween({
				duration: reduced ? 0 : POINT_CONCEAL,
				onUpdate: (p) => {
					for (const point of points) paint(point.el, 1 - p);
				},
				onComplete: () => advance("done"),
			});
			return () => playback.stop();
		}
		if (reduced) {
			for (const point of points) paint(point.el, 1);
			advance("done");
			return;
		}
		const total = CHART_DURATION.enter + POINT_ENTER;
		let live = points;
		const clock = tween({
			duration: total,
			ease: (t) => t,
			onUpdate: (p) => {
				// Points attach during the same flush, so the first frame picks up late arrivals.
				if (live.length === 0) live = [...enters.current.values()];
				const elapsed = p * total;
				for (const point of live) {
					const local = Math.min(1, Math.max(0, (elapsed - point.delay) / POINT_ENTER));
					paint(point.el, CHART_EASE(local));
				}
			},
			onComplete: () => {
				for (const point of live) point.el.style.opacity = "";
				advance("done");
			},
		});
		return () => clock.stop();
	}, [phase, hasSize, animate, advance]);

	const pending = useRef<number | null>(null);
	const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
		if (!interactive) return;
		const bounds = event.currentTarget.getBoundingClientRect();
		const px = event.clientX - bounds.left - margin.left;
		const py = event.clientY - bounds.top - margin.top;
		if (pending.current !== null) cancelAnimationFrame(pending.current);
		pending.current = requestAnimationFrame(() => {
			pending.current = null;
			const hit = nearestPoint(
				data,
				series.map((s) => s.key),
				px,
				py,
				x,
				(v) => yScale(v),
			);
			if (hit) onHit(hit.index, hit.key);
		});
	};
	const onPointerLeave = () => {
		if (pending.current !== null) cancelAnimationFrame(pending.current);
		pending.current = null;
		if (activeIndex !== null) onHit(null, null);
	};

	const active = useMemo<ActivePoint | null>(() => {
		if (activeIndex === null || !interactive) return null;
		const datum = data[activeIndex];
		if (!datum) return null;
		const y: Record<string, number> = {};
		for (const s of series) {
			if (activeKey !== null && s.key !== activeKey) continue;
			const value = datum[s.key];
			if (typeof value === "number") y[s.key] = yScale(value);
		}
		return { index: activeIndex, datum, x: x(datum), y };
	}, [activeIndex, activeKey, interactive, data, series, yScale, x]);

	const plot = useMemo<PlotContextValue>(
		() => ({
			width: frame.width,
			height: frame.height,
			innerWidth,
			innerHeight,
			margin,
			rowScale: yScale as unknown as TickScale,
			columnScale: xScale as unknown as TickScale,
			phase,
			animate,
			clipId,
			plotEl: frame.el,
			data,
			xKey,
			xScale,
			yScale,
			x,
			labels,
			series,
			register,
		}),
		[
			frame,
			innerWidth,
			innerHeight,
			margin,
			yScale,
			xScale,
			phase,
			animate,
			clipId,
			data,
			xKey,
			x,
			labels,
			series,
			register,
		],
	);
	const activeValue = useMemo(
		() => ({ active, instant, title, rows }),
		[active, instant, title, rows],
	);
	const root = useMemo(
		() => ({ activeKey, shapeFor, registerEnter }),
		[activeKey, shapeFor, registerEnter],
	);

	return (
		<PlotProvider value={plot}>
			<CartesianProvider value={plot}>
				<ActivePointProvider value={activeValue}>
					<ScatterRootContext.Provider value={root}>
						<svg
							aria-hidden="true"
							width={frame.width}
							height={frame.height}
							className="absolute inset-0 block overflow-visible"
							style={{ cursor: interactive ? "crosshair" : undefined }}
							onPointerMove={onPointerMove}
							onPointerLeave={onPointerLeave}
						>
							<defs>
								<clipPath id={clipId}>
									<rect
										x={-12}
										y={-12}
										width={innerWidth + 24}
										height={innerHeight + 24}
									/>
								</clipPath>
							</defs>
							<g transform={`translate(${margin.left},${margin.top})`}>
								<rect width={innerWidth} height={innerHeight} fill="transparent" />
								{children}
							</g>
						</svg>
					</ScatterRootContext.Provider>
				</ActivePointProvider>
			</CartesianProvider>
		</PlotProvider>
	);
}

export interface ScatterProps {
	dataKey: string;
	/** Defaults to the series colour from the chart config, `var(--color-<dataKey>)`. */
	fill?: string;
	size?: ScatterSize;
	/** Overrides the shape assigned by series order. */
	shape?: ScatterShape;
	className?: string;
}

export function Scatter({
	dataKey,
	fill,
	size = "default",
	shape,
	className,
}: ScatterProps) {
	const { register, data, x, yScale, innerWidth, phase, clipId } = usePlot();
	const { activeKey, shapeFor, registerEnter } = useContext(ScatterRootContext);
	const { active } = useActivePoint();
	const { hidden, highlighted } = useChart();
	const color = fill ?? seriesColor(dataKey);
	const radius = SCATTER_RADIUS[size];
	const resolvedShape = shape ?? shapeFor(dataKey);
	const d = shapePath(resolvedShape, radius);

	useLayoutEffect(() => register({ key: dataKey, color }), [register, dataKey, color]);

	const isHidden = hidden.has(dataKey);
	const shown = phase === "ready" || phase === "concealing";
	return (
		<g
			data-slot="chart-scatter"
			data-series={dataKey}
			clipPath={`url(#${clipId})`}
			className={className}
			style={{ opacity: isHidden ? 0 : 1 } as CSSProperties}
		>
			{data.map((datum, index) => {
				const value = datum[dataKey];
				if (typeof value !== "number" || !Number.isFinite(value)) return null;
				const px = x(datum);
				const py = yScale(value);
				const isActive =
					active !== null &&
					active.index === index &&
					(activeKey === null || activeKey === dataKey);
				const dimmed =
					(active !== null && !isActive) ||
					(highlighted !== null && highlighted !== dataKey);
				const styles = scatterPoint({ size, shape: resolvedShape, dimmed });
				return (
					// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
					<g key={index} className={styles.point()}>
						<g
							ref={(el) => {
								if (!el) return;
								return registerEnter(
									`${dataKey}-${index}`,
									el,
									enterDelay(px, radius, innerWidth),
								);
							}}
							transform={`translate(${px},${py})`}
							style={{ opacity: shown ? undefined : 0 }}
						>
							<path
								d={d}
								data-active={isActive ? "" : undefined}
								className={styles.mark()}
								style={{ "--point": color } as CSSProperties}
							/>
						</g>
					</g>
				);
			})}
		</g>
	);
}
