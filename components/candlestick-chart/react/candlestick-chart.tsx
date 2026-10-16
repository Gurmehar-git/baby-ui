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
} from "react";
import { useChart } from "../../chart/react/chart";
import {
	type ActivePoint,
	announceRows,
	type ChartPhase,
	type ChartStatus,
	type Datum,
	DEFAULT_MARGIN,
	hoverThrottle,
	type Margin,
	nearestIndex,
	type TooltipRow,
	toDate,
} from "../../chart/react/core";
import {
	ActivePointProvider,
	CartesianProvider,
	ChartFrame,
	type TickScale,
	useActivePoint,
} from "../../chart/react/frame";
import { EASE_OUT, prefersReducedMotion, Spring, tween } from "../../chart/react/motion";
import {
	type PlotContextValue,
	PlotProvider,
	useActiveIndex,
	useAnimatedDomain,
	useChartPhase,
	usePlot,
} from "../../chart/react/time-series";
import {
	CANDLE_CONCEAL,
	CANDLE_FADE,
	CANDLE_SPRING,
	candleColor,
	candleGeometry,
	candleStagger,
	ohlcDomain,
	readOhlc,
} from "./geometry";
import { CANDLE_BODY, type CandlestickSize, candlestick } from "./variants";

interface CandleRootValue {
	advance: (event: "done") => void;
}

const CandleRootContext = createContext<CandleRootValue>({ advance: () => {} });

export interface CandlestickLabels {
	open: string;
	high: string;
	low: string;
	close: string;
}

const DEFAULT_LABELS: CandlestickLabels = {
	open: "Open",
	high: "High",
	low: "Low",
	close: "Close",
};

export interface CandlestickChartProps {
	/** Rows with a date under xKey and numeric open, high, low and close. */
	data: Datum[];
	xKey?: string;
	/** Header of the date column in the screen-reader table. */
	xLabel?: string;
	/** Row names in the tooltip and table. */
	labels?: Partial<CandlestickLabels>;
	/** Config keys whose colour and legend toggle drive rising and falling candles. */
	upKey?: string;
	downKey?: string;
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

export function CandlestickChart({
	data,
	xKey = "date",
	xLabel = "Date",
	labels: labelsProp,
	upKey = "up",
	downKey = "down",
	margin,
	status = "ready",
	animate = true,
	activeIndex: activeIndexProp,
	defaultActiveIndex = null,
	onActiveIndexChange,
	roleDescription = "candlestick chart",
	className,
	children,
}: CandlestickChartProps) {
	const chart = useChart();
	const { format } = chart;
	const labels = { ...DEFAULT_LABELS, ...labelsProp };
	const target = useMemo(() => ohlcDomain(data), [data]);
	const { phase, advance } = useChartPhase(status, animate);
	const domain = useAnimatedDomain(target, phase, status, animate, advance);
	const { activeIndex, instant, setActive } = useActiveIndex(
		activeIndexProp,
		defaultActiveIndex,
		onActiveIndexChange,
	);
	const interactive = phase === "ready" && data.length > 0;

	const title = (datum: Datum) => format.title(toDate(datum[xKey]));
	const rows = (datum: Datum): TooltipRow[] => {
		const ohlc = readOhlc(datum);
		if (!ohlc) return [];
		const color = candleColor(
			ohlc.close >= ohlc.open ? upKey : downKey,
			ohlc.close >= ohlc.open,
		);
		return (["open", "high", "low", "close"] as const).map((key) => ({
			key,
			label: labels[key],
			color,
			value: ohlc[key],
		}));
	};
	const activeDatum = activeIndex !== null && interactive ? data[activeIndex] : undefined;
	const announcement =
		activeDatum && instant
			? announceRows(title(activeDatum), rows(activeDatum), format.number)
			: "";
	const closes = data.map((d) => readOhlc(d)?.close).filter((v) => v !== undefined);
	const summary =
		chart.description ??
		(data.length
			? `${data.length} ${roleDescription} points from ${title(data[0] as Datum)} to ${title(
					data.at(-1) as Datum,
				)}. ${labels.close} ${format.number(closes[0] ?? 0)} to ${format.number(closes.at(-1) ?? 0)}.`
			: "");

	return (
		<ChartFrame
			roleDescription={roleDescription}
			summary={summary}
			table={{
				columns: [xLabel, labels.open, labels.high, labels.low, labels.close],
				rows: data.map((datum) => {
					const ohlc = readOhlc(datum);
					return {
						header: title(datum),
						cells: ohlc
							? [ohlc.open, ohlc.high, ohlc.low, ohlc.close].map((v) => format.number(v))
							: [],
					};
				}),
			}}
			count={data.length}
			activeIndex={activeIndex}
			onActiveChange={setActive}
			interactive={interactive}
			announcement={announcement}
			phase={phase}
			className={className}
		>
			{(frame) => (
				<CandlestickPlot
					frame={frame}
					data={data}
					xKey={xKey}
					marginProp={margin}
					domain={domain}
					phase={phase}
					animate={animate}
					advance={advance}
					activeIndex={activeIndex}
					instant={instant}
					interactive={interactive}
					setActive={setActive}
					title={title}
					rows={rows}
				>
					{children}
				</CandlestickPlot>
			)}
		</ChartFrame>
	);
}

const NO_SERIES: never[] = [];

function CandlestickPlot({
	frame,
	data,
	xKey,
	marginProp,
	domain,
	phase,
	animate,
	advance,
	activeIndex,
	instant,
	interactive,
	setActive,
	title,
	rows,
	children,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	data: Datum[];
	xKey: string;
	marginProp?: Partial<Margin>;
	domain: [number, number];
	phase: ChartPhase;
	animate: boolean;
	advance: (event: "done") => void;
	activeIndex: number | null;
	instant: boolean;
	interactive: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
	title: (datum: Datum) => string;
	rows: (datum: Datum) => TooltipRow[];
	children?: ReactNode;
}) {
	const { format } = useChart();
	const clipId = `${useId().replace(/:/g, "")}-candles`;
	const margin = useMemo(() => ({ ...DEFAULT_MARGIN, ...marginProp }), [marginProp]);
	const innerWidth = Math.max(0, frame.width - margin.left - margin.right);
	const innerHeight = Math.max(0, frame.height - margin.top - margin.bottom);
	const slot = innerWidth / Math.max(1, data.length);

	const xScale = useMemo(() => {
		const [min = 0, max = min] = extent(data, (d) => toDate(d[xKey]).getTime());
		return scaleTime()
			.domain([min, max])
			.range([slot / 2, innerWidth - slot / 2]);
	}, [data, xKey, innerWidth, slot]);
	const yScale = useMemo(
		() => scaleLinear().domain(domain).range([innerHeight, 0]),
		[domain, innerHeight],
	);
	const x = useCallback((d: Datum) => xScale(toDate(d[xKey])), [xScale, xKey]);
	const labels = useMemo(
		() => data.map((d) => format.tick(toDate(d[xKey]))),
		[data, xKey, format],
	);

	const hover = useMemo(() => hoverThrottle(), []);
	const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
		if (!interactive) return;
		const bounds = event.currentTarget.getBoundingClientRect();
		const time = xScale.invert(event.clientX - bounds.left - margin.left).getTime();
		const index = nearestIndex(data, xKey, time);
		hover.move(index, (next) => {
			if (next !== activeIndex) setActive(next, false);
		});
	};
	const onPointerLeave = () => {
		hover.cancel();
		if (activeIndex !== null) setActive(null, false);
	};

	const active = useMemo<ActivePoint | null>(() => {
		if (activeIndex === null || !interactive) return null;
		const datum = data[activeIndex];
		const ohlc = datum ? readOhlc(datum) : null;
		if (!datum || !ohlc) return null;
		return { index: activeIndex, datum, x: x(datum), y: { close: yScale(ohlc.close) } };
	}, [activeIndex, interactive, data, x, yScale]);

	const register = useCallback(() => () => {}, []);
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
			series: NO_SERIES,
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
			register,
		],
	);
	const activeValue = useMemo(
		() => ({ active, instant, title, rows }),
		[active, instant, title, rows],
	);
	const root = useMemo(() => ({ advance }), [advance]);

	return (
		<PlotProvider value={plot}>
			<CartesianProvider value={plot}>
				<ActivePointProvider value={activeValue}>
					<CandleRootContext.Provider value={root}>
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
									<rect x={-8} y={-8} width={innerWidth + 16} height={innerHeight + 16} />
								</clipPath>
							</defs>
							<g transform={`translate(${margin.left},${margin.top})`}>
								<rect width={innerWidth} height={innerHeight} fill="transparent" />
								{children}
							</g>
						</svg>
					</CandleRootContext.Provider>
				</ActivePointProvider>
			</CartesianProvider>
		</PlotProvider>
	);
}

export interface CandlestickProps {
	size?: CandlestickSize;
	/** Config keys for rising and falling candles; match the chart's `upKey` and `downKey`. */
	upKey?: string;
	downKey?: string;
	/** Opacity of candles other than the active one. */
	dimOpacity?: number;
	className?: string;
}

const scaleAbout = (cy: number, s: number) =>
	`translate(0 ${cy}) scale(1 ${s}) translate(0 ${-cy})`;

export function Candlestick({
	size = "regular",
	upKey = "up",
	downKey = "down",
	dimOpacity = 0.4,
	className,
}: CandlestickProps) {
	const { data, x, yScale, innerWidth, phase, animate, clipId } = usePlot();
	const { advance } = useContext(CandleRootContext);
	const { hidden, highlighted } = useChart();
	const { active } = useActivePoint();
	const slot = innerWidth / Math.max(1, data.length);
	const bodyWidth = Math.max(1, slot * CANDLE_BODY[size]);
	const geometry = useMemo(
		() => candleGeometry(data, x, (v) => yScale(v)),
		[data, x, yScale],
	);

	const enterRefs = useRef<(SVGGElement | null)[]>([]);
	const wickRefs = useRef<(SVGPathElement | null)[]>([]);
	const bodyRefs = useRef<(SVGRectElement | null)[]>([]);
	const geometryRef = useRef(geometry);
	geometryRef.current = geometry;
	const hasSize = innerWidth > 0;

	useLayoutEffect(() => {
		if ((phase !== "revealing" && phase !== "concealing") || !hasSize) return;
		const candles = geometryRef.current;
		const groups = enterRefs.current;
		const reduced = !animate || prefersReducedMotion();
		if (phase === "concealing") {
			const playback = tween({
				duration: reduced ? 0 : CANDLE_CONCEAL,
				onUpdate: (p) => {
					for (const g of groups) if (g) g.style.opacity = String(1 - p);
				},
				onComplete: () => advance("done"),
			});
			return () => playback.stop();
		}
		const count = candles.length;
		if (count === 0 || reduced) {
			advance("done");
			return;
		}
		const stagger = candleStagger(count);
		const total = (count - 1) * stagger + CANDLE_FADE;
		const started: boolean[] = [];
		let settled = 0;
		let clockDone = false;
		const finish = () => {
			if (!clockDone || settled < count) return;
			candles.forEach((_, i) => {
				wickRefs.current[i]?.removeAttribute("transform");
				bodyRefs.current[i]?.removeAttribute("transform");
				const g = groups[i];
				if (g) g.style.opacity = "";
			});
			advance("done");
		};
		const springs = candles.map((candle, i) => {
			const wickMid = (candle.wickTop + candle.wickBottom) / 2;
			const bodyMid = candle.bodyTop + candle.bodyHeight / 2;
			let done = false;
			return new Spring(0, CANDLE_SPRING, (s) => {
				wickRefs.current[i]?.setAttribute("transform", scaleAbout(wickMid, s));
				bodyRefs.current[i]?.setAttribute("transform", scaleAbout(bodyMid, s));
				if (s === 1 && !done) {
					done = true;
					settled++;
					finish();
				}
			});
		});
		candles.forEach((candle, i) => {
			const g = groups[i];
			if (g) g.style.opacity = "0";
			const wickMid = (candle.wickTop + candle.wickBottom) / 2;
			const bodyMid = candle.bodyTop + candle.bodyHeight / 2;
			wickRefs.current[i]?.setAttribute("transform", scaleAbout(wickMid, 0));
			bodyRefs.current[i]?.setAttribute("transform", scaleAbout(bodyMid, 0));
		});
		const clock = tween({
			duration: total,
			ease: (t) => t,
			onUpdate: (p) => {
				const elapsed = p * total;
				for (let i = 0; i < count; i++) {
					const local = elapsed - i * stagger;
					if (local < 0) continue;
					if (!started[i]) {
						started[i] = true;
						springs[i]?.set(1);
					}
					const g = groups[i];
					if (g) g.style.opacity = String(EASE_OUT(Math.min(1, local / CANDLE_FADE)));
				}
			},
			onComplete: () => {
				clockDone = true;
				finish();
			},
		});
		return () => {
			clock.stop();
			for (const spring of springs) spring.stop();
		};
	}, [phase, hasSize, animate, advance]);

	const visible = phase === "ready" || phase === "revealing" || phase === "concealing";
	return (
		<g data-slot="chart-candlestick" clipPath={`url(#${clipId})`} className={className}>
			{geometry.map((candle, i) => {
				const key = candle.up ? upKey : downKey;
				const styles = candlestick({ size, direction: candle.up ? "up" : "down" });
				const dimmed =
					hidden.has(key) ||
					(active !== null && active.index !== candle.index) ||
					(highlighted !== null && highlighted !== key);
				const left = candle.x - bodyWidth / 2;
				return (
					<g
						key={candle.index}
						data-direction={candle.up ? "up" : "down"}
						data-active={active?.index === candle.index ? "" : undefined}
						className={styles.candle()}
						style={
							{
								"--candle": candleColor(key, candle.up),
								opacity: hidden.has(key) ? 0 : dimmed ? dimOpacity : 1,
							} as CSSProperties
						}
					>
						<g
							ref={(el) => {
								enterRefs.current[i] = el;
							}}
							style={{ opacity: visible ? 1 : 0 }}
						>
							<path
								ref={(el) => {
									wickRefs.current[i] = el;
								}}
								className={styles.wick()}
								d={`M${candle.x},${candle.wickTop}V${candle.bodyTop}M${candle.x},${
									candle.bodyTop + candle.bodyHeight
								}V${candle.wickBottom}`}
							/>
							<rect
								ref={(el) => {
									bodyRefs.current[i] = el;
								}}
								className={styles.body()}
								x={left}
								y={candle.bodyTop}
								width={bodyWidth}
								height={candle.bodyHeight}
								rx={1}
							/>
						</g>
					</g>
				);
			})}
		</g>
	);
}
