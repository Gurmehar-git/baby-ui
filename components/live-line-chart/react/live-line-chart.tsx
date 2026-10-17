"use client";

import { scaleLinear, scaleTime } from "d3-scale";
import {
	createContext,
	type PointerEvent,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import type {
	ActivePoint,
	Datum,
	Margin,
	SeriesConfig,
	TooltipRow,
} from "../../chart/core";
import { prefersReducedMotion } from "../../chart/motion";
import { useChart } from "../../chart/react/chart";
import {
	ActivePointProvider,
	CartesianProvider,
	ChartFrame,
	type TickScale,
} from "../../chart/react/frame";
import {
	type PlotContextValue,
	PlotProvider,
	useActiveIndex,
	useSeriesRegistry,
} from "../../chart/react/time-series";
import {
	interpolateAt,
	type LiveFrame,
	type LivePoint,
	liveRecords,
	nearestPointIndex,
	nextFrame,
	settled,
	smoothingFactor,
	targetRange,
} from "../live";

/** Commits the animation loop to React at most every 32ms (about 30fps). */
const COMMIT_MS = 32;
const DEFAULT_LIVE_MARGIN: Margin = { top: 24, right: 72, bottom: 32, left: 48 };

export interface LiveContextValue {
	frame: LiveFrame;
	/** Whether the scroll loop is running: false when paused and settled, offscreen or hidden. */
	running: boolean;
	paused: boolean;
	/** Ms between the live tip and the queued point the stroke fades into. */
	queueMs: number;
	formatTime: (ms: number) => string;
	scrubbing: boolean;
}

const LiveContext = createContext<LiveContextValue | null>(null);

export function useLive(): LiveContextValue {
	const context = useContext(LiveContext);
	if (!context)
		throw new Error("Live chart parts must be rendered inside <LiveLineChart />");
	return context;
}

export interface LiveLineChartProps {
	/** Stream of samples, oldest first; `time` is unix seconds. */
	data: LivePoint[];
	/** Latest value; the line eases toward it. */
	value: number;
	/** Key the value is exposed under to series, tooltip and legend. */
	dataKey?: string;
	/** Visible window in seconds. */
	window?: number;
	/** X-axis tick count; one tick is also the fade-out lead past the live tip. */
	numXTicks?: number;
	/** Leading gap after `now`, in x-tick units. */
	nowOffsetUnits?: number;
	/** Tight y padding (3%) instead of 15%. */
	exaggerate?: boolean;
	/** Fraction eased per 60fps frame, applied by elapsed time so any frame rate matches. */
	lerpSpeed?: number;
	/** Freezes the scroll; the value still settles. */
	paused?: boolean;
	margin?: Partial<Margin>;
	activeIndex?: number | null;
	defaultActiveIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	/** Formats wall-clock ms for the axis, pill, tooltip and table. */
	formatTime?: (ms: number) => string;
	/** Header of the time column in the screen-reader table. */
	timeLabel?: string;
	roleDescription?: string;
	className?: string;
	children?: ReactNode;
}

const defaultTimeFormat = new Intl.DateTimeFormat(undefined, {
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
});
const defaultFormatTime = (ms: number) => defaultTimeFormat.format(ms);

export function LiveLineChart({
	data,
	value,
	dataKey = "value",
	window: windowSecs = 30,
	numXTicks = 5,
	nowOffsetUnits = 0,
	exaggerate = false,
	lerpSpeed = 0.08,
	paused = false,
	margin,
	activeIndex: activeIndexProp,
	defaultActiveIndex = null,
	onActiveIndexChange,
	formatTime = defaultFormatTime,
	timeLabel = "Time",
	roleDescription = "live line chart",
	className,
	children,
}: LiveLineChartProps) {
	const chart = useChart();
	const { format, hidden, config } = chart;
	const { series, register } = useSeriesRegistry(hidden);
	const { activeIndex, instant, setActive } = useActiveIndex(
		activeIndexProp,
		defaultActiveIndex,
		onActiveIndexChange,
	);

	const latest = data.at(-1)?.time ?? 0;
	const visibleStart = useMemo(() => {
		const from = latest - windowSecs;
		const index = data.findIndex((p) => p.time >= from);
		return index === -1 ? data.length : index;
	}, [data, latest, windowSecs]);
	const visible = useMemo(() => data.slice(visibleStart), [data, visibleStart]);

	const seriesLabel = (key: string) => {
		const label = config[key]?.label;
		return typeof label === "string" ? label : key;
	};
	const label = seriesLabel(dataKey);
	const values = visible.map((p) => p.value);
	const summary =
		chart.description ??
		(visible.length
			? `Live. Latest ${label} ${format.number(value)} at ${formatTime(latest * 1000)}. ${visible.length} samples in the last ${windowSecs} seconds, from ${format.number(Math.min(...values))} to ${format.number(Math.max(...values))}.`
			: "Live. Waiting for data.");
	const table = {
		columns: [timeLabel, label],
		rows: visible.map((p) => ({
			header: formatTime(p.time * 1000),
			cells: [format.number(p.value)],
		})),
	};
	const frameIndex =
		activeIndex !== null && activeIndex >= visibleStart
			? activeIndex - visibleStart
			: null;
	const activePoint = activeIndex !== null ? data[activeIndex] : undefined;
	const announcement =
		activePoint && instant
			? `${formatTime(activePoint.time * 1000)}: ${label} ${format.number(activePoint.value)}`
			: "";

	return (
		<ChartFrame
			roleDescription={roleDescription}
			summary={summary}
			table={table}
			count={visible.length}
			activeIndex={frameIndex}
			onActiveChange={(index, fromKeyboard) =>
				setActive(index === null ? null : index + visibleStart, fromKeyboard)
			}
			interactive={visible.length > 0}
			announcement={announcement}
			phase="ready"
			className={className}
		>
			{(frame) => (
				<LivePlot
					frame={frame}
					data={data}
					value={value}
					dataKey={dataKey}
					windowMs={windowSecs * 1000}
					numXTicks={numXTicks}
					nowOffsetUnits={nowOffsetUnits}
					exaggerate={exaggerate}
					lerpSpeed={lerpSpeed}
					paused={paused}
					marginProp={margin}
					series={series}
					register={register}
					activeIndex={activeIndex}
					instant={instant}
					setActive={setActive}
					formatTime={formatTime}
					seriesLabel={seriesLabel}
				>
					{children}
				</LivePlot>
			)}
		</ChartFrame>
	);
}

/** True while the element is on screen and the tab is visible; the loop idles otherwise. */
function useOnScreen(el: HTMLElement | null) {
	const [intersecting, setIntersecting] = useState(true);
	const [tabVisible, setTabVisible] = useState(
		typeof document === "undefined" || document.visibilityState !== "hidden",
	);
	useEffect(() => {
		if (!el || typeof IntersectionObserver === "undefined") return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry?.isIntersecting ?? true),
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [el]);
	useEffect(() => {
		const onChange = () => setTabVisible(document.visibilityState !== "hidden");
		document.addEventListener("visibilitychange", onChange);
		return () => document.removeEventListener("visibilitychange", onChange);
	}, []);
	return intersecting && tabVisible;
}

function LivePlot({
	frame: box,
	data,
	value,
	dataKey,
	windowMs,
	numXTicks,
	nowOffsetUnits,
	exaggerate,
	lerpSpeed,
	paused,
	marginProp,
	series,
	register,
	activeIndex,
	instant,
	setActive,
	formatTime,
	seriesLabel,
	children,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	data: LivePoint[];
	value: number;
	dataKey: string;
	windowMs: number;
	numXTicks: number;
	nowOffsetUnits: number;
	exaggerate: boolean;
	lerpSpeed: number;
	paused: boolean;
	marginProp?: Partial<Margin>;
	series: SeriesConfig[];
	register: (series: SeriesConfig) => () => void;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
	formatTime: (ms: number) => string;
	seriesLabel: (key: string) => string;
	children?: ReactNode;
}) {
	const clipId = `${useId().replace(/:/g, "")}-live`;
	// biome-ignore lint/correctness/useExhaustiveDependencies: marginProp left out on purpose, the listed values decide when it runs.
	const margin = useMemo(
		() => ({ ...DEFAULT_LIVE_MARGIN, ...marginProp }),
		[marginProp?.top, marginProp?.right, marginProp?.bottom, marginProp?.left],
	);
	const innerWidth = Math.max(0, box.width - margin.left - margin.right);
	const innerHeight = Math.max(0, box.height - margin.top - margin.bottom);
	const queueMs = windowMs / Math.max(1, numXTicks - 1);
	const leadingMs = nowOffsetUnits * queueMs;

	const target = useMemo(
		() => targetRange(data, value, exaggerate),
		[data, value, exaggerate],
	);
	const initial = (): LiveFrame => ({
		now: Date.now(),
		yMin: target.yMin,
		yMax: target.yMax,
		displayValue: value,
	});
	const anim = useRef<LiveFrame | null>(null);
	if (!anim.current) anim.current = initial();
	const [frame, setFrame] = useState<LiveFrame>(anim.current);
	const onScreen = useOnScreen(box.el);
	const [running, setRunning] = useState(true);
	const targetRef = useRef(target);
	targetRef.current = target;
	const valueRef = useRef(value);
	valueRef.current = value;
	// Carries the clock across restarts on new data, so slow frames lose no easing time.
	const lastTick = useRef<number | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: target, value.
	useEffect(() => {
		if (!onScreen) {
			lastTick.current = null;
			setRunning(false);
			return;
		}
		const reduced = prefersReducedMotion();
		let raf = 0;
		let lastCommit = 0;
		setRunning(true);
		const tick = (time: number) => {
			const prev = anim.current as LiveFrame;
			const factor = reduced
				? 1
				: smoothingFactor(time - (lastTick.current ?? time), lerpSpeed);
			lastTick.current = time;
			const next = nextFrame(
				prev,
				targetRef.current,
				valueRef.current,
				factor,
				paused ? prev.now : Date.now(),
			);
			anim.current = next;
			const idle = paused && settled(next, targetRef.current, valueRef.current);
			if (idle || time - lastCommit >= COMMIT_MS) {
				lastCommit = time;
				setFrame(next);
			}
			if (idle) {
				lastTick.current = null;
				setRunning(false);
				return;
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [onScreen, paused, target, value, lerpSpeed]);

	const end = frame.now + leadingMs;
	const xScale = useMemo(
		() =>
			scaleTime()
				.domain([end - windowMs, end])
				.range([0, innerWidth]),
		[end, windowMs, innerWidth],
	);
	const yScale = useMemo(
		() => scaleLinear().domain([frame.yMin, frame.yMax]).nice().range([innerHeight, 0]),
		[frame.yMin, frame.yMax, innerHeight],
	);
	const records = useMemo(
		() => liveRecords(data, frame, end - windowMs, queueMs, dataKey),
		[data, frame, end, windowMs, queueMs, dataKey],
	);
	const x = useCallback(
		(d: Datum) => xScale(d.date instanceof Date ? d.date : new Date(d.date as number)),
		[xScale],
	);
	const labels = useMemo(
		() => records.map((d) => formatTime((d.date as Date).getTime())),
		[records, formatTime],
	);

	const [cursorX, setCursorX] = useState<number | null>(null);
	const pending = useRef<{ x: number; raf: number } | null>(null);
	const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
		const bounds = event.currentTarget.getBoundingClientRect();
		const px = event.clientX - bounds.left - margin.left;
		const next = px >= 0 && px <= innerWidth ? px : null;
		if (pending.current) {
			pending.current.x = next ?? -1;
			return;
		}
		const raf = requestAnimationFrame(() => {
			const value = pending.current?.x ?? -1;
			pending.current = null;
			setCursorX(value < 0 ? null : value);
		});
		pending.current = { x: next ?? -1, raf };
	};
	const onPointerLeave = () => {
		if (pending.current) cancelAnimationFrame(pending.current.raf);
		pending.current = null;
		setCursorX(null);
		if (activeIndex !== null) setActive(null, false);
	};

	const scrubTime = cursorX === null ? null : xScale.invert(cursorX).getTime() / 1000;
	const scrubIndex = scrubTime === null ? null : nearestPointIndex(data, scrubTime);
	// biome-ignore lint/correctness/useExhaustiveDependencies: activeIndex, setActive left out on purpose, the listed values decide when it runs.
	useEffect(() => {
		if (scrubIndex !== null && scrubIndex !== activeIndex) setActive(scrubIndex, false);
	}, [scrubIndex]);

	const active = useMemo<ActivePoint | null>(() => {
		if (scrubTime !== null && cursorX !== null) {
			const points = [
				...data,
				{ time: frame.now / 1000, value: frame.displayValue },
				{ time: (frame.now + queueMs) / 1000, value: frame.displayValue },
			];
			const v = interpolateAt(points, scrubTime);
			if (v === null) return null;
			return {
				index: scrubIndex ?? 0,
				datum: { date: new Date(scrubTime * 1000), [dataKey]: v },
				x: cursorX,
				y: { [dataKey]: yScale(v) },
			};
		}
		if (activeIndex === null) return null;
		const point = data[activeIndex];
		if (!point) return null;
		const datum = { date: new Date(point.time * 1000), [dataKey]: point.value };
		return {
			index: activeIndex,
			datum,
			x: x(datum),
			y: { [dataKey]: yScale(point.value) },
		};
	}, [
		scrubTime,
		cursorX,
		scrubIndex,
		activeIndex,
		data,
		frame,
		queueMs,
		dataKey,
		yScale,
		x,
	]);

	const title = useCallback(
		(datum: Datum) => formatTime((datum.date as Date).getTime()),
		[formatTime],
	);
	const rows = useCallback(
		(datum: Datum): TooltipRow[] =>
			series.map((s) => {
				const v = datum[s.key];
				return {
					key: s.key,
					label: seriesLabel(s.key),
					color: s.color,
					value: typeof v === "number" ? v : null,
				};
			}),
		[series, seriesLabel],
	);

	const plot = useMemo<PlotContextValue>(
		() => ({
			width: box.width,
			height: box.height,
			innerWidth,
			innerHeight,
			margin,
			rowScale: yScale as unknown as TickScale,
			columnScale: xScale as unknown as TickScale,
			phase: "ready",
			animate: true,
			clipId,
			plotEl: box.el,
			data: records,
			xKey: "date",
			xScale,
			yScale,
			x,
			labels,
			series,
			register,
		}),
		[
			box,
			innerWidth,
			innerHeight,
			margin,
			yScale,
			xScale,
			clipId,
			records,
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
	const live = useMemo<LiveContextValue>(
		() => ({ frame, running, paused, queueMs, formatTime, scrubbing: active !== null }),
		[frame, running, paused, queueMs, formatTime, active],
	);

	return (
		<PlotProvider value={plot}>
			<CartesianProvider value={plot}>
				<ActivePointProvider value={activeValue}>
					<LiveContext.Provider value={live}>
						<svg
							aria-hidden="true"
							width={box.width}
							height={box.height}
							data-running={running ? "" : undefined}
							className="absolute inset-0 block overflow-visible"
							style={{ cursor: "crosshair" }}
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
					</LiveContext.Provider>
				</ActivePointProvider>
			</CartesianProvider>
		</PlotProvider>
	);
}
