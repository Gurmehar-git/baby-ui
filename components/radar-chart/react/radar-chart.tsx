"use client";

import {
	type CSSProperties,
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import type { ActivePoint, Datum } from "../../chart/core";
import {
	CHART_DURATION,
	CHART_EASE,
	EASE_OUT,
	prefersReducedMotion,
	Spring,
	type SpringConfig,
	tween,
} from "../../chart/motion";
import { useChart } from "../../chart/react/chart";
import { ActivePointProvider, ChartFrame, useActivePoint } from "../../chart/react/frame";
import { useActiveIndex } from "../../chart/react/time-series";
import { ChartTooltipContent, ChartTooltipPanel } from "../../chart/react/tooltip";
import { cn } from "../../lib/cn";
import {
	markerPath,
	niceMax,
	type Point,
	polygonPath,
	RADAR_SPRING,
	RADAR_TIMING,
	type RadarMetric,
	type RadarSeries,
	ringPath,
	seriesColor,
	seriesDash,
	seriesKey,
	seriesPoints,
} from "../geometry";
import { type RadarGridShape, type RadarVariant, radar } from "../variants";

export type { RadarMetric, RadarSeries };

interface RadarContextValue {
	data: RadarSeries[];
	metrics: RadarMetric[];
	radius: number;
	levels: number;
	max: number;
	grid: RadarGridShape;
	variant: RadarVariant;
	animate: boolean;
	center: Point;
	frame: { width: number; height: number; el: HTMLDivElement | null };
	setActive: (index: number | null, fromKeyboard: boolean) => void;
}

const RadarContext = createContext<RadarContextValue | null>(null);

function useRadar(): RadarContextValue {
	const context = useContext(RadarContext);
	if (!context) throw new Error("Radar parts must be rendered inside <RadarChart />");
	return context;
}

/** A 0 to 1 spring that starts after `delay` seconds; reduced motion lands at once. */
function useEnterSpring(
	config: SpringConfig,
	delay: number,
	animate: boolean,
	apply: (p: number) => void,
) {
	const applyRef = useRef(apply);
	applyRef.current = apply;
	const last = useRef(animate ? 0 : 1);
	useLayoutEffect(() => applyRef.current(last.current));
	useLayoutEffect(() => {
		const spring = new Spring(0, config, (v) => {
			last.current = v;
			applyRef.current(v);
		});
		if (!animate || prefersReducedMotion()) {
			spring.jump(1);
			return;
		}
		spring.jump(0);
		const timer = setTimeout(() => spring.set(1), delay * 1000);
		return () => {
			clearTimeout(timer);
			spring.stop();
		};
	}, [config, delay, animate]);
}

/** A 0 to 1 tween that starts after `delay` seconds. */
function useEnterTween(
	duration: number,
	delay: number,
	animate: boolean,
	apply: (p: number) => void,
	ease = EASE_OUT,
) {
	const applyRef = useRef(apply);
	applyRef.current = apply;
	const last = useRef(animate ? 0 : 1);
	useLayoutEffect(() => applyRef.current(last.current));
	useLayoutEffect(() => {
		if (!animate) {
			applyRef.current(1);
			return;
		}
		applyRef.current(0);
		const playback = tween({
			duration,
			delay: delay * 1000,
			ease,
			onUpdate: (p) => {
				last.current = p;
				applyRef.current(p);
			},
		});
		return () => playback.stop();
	}, [duration, delay, animate, ease]);
}

export interface RadarChartProps {
	data: RadarSeries[];
	metrics: RadarMetric[];
	/** Value at the outer ring. Defaults to a nice ceiling over the data. */
	max?: number;
	levels?: number;
	/** Room around the rings for metric labels, in px. */
	margin?: number;
	grid?: RadarGridShape;
	variant?: RadarVariant;
	animate?: boolean;
	activeIndex?: number | null;
	defaultActiveIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	/** Header of the series column in the screen-reader table. */
	seriesLabel?: string;
	/** Announced after the chart's name. */
	roleDescription?: string;
	className?: string;
	children?: ReactNode;
}

export function RadarChart({
	data,
	metrics,
	max: maxProp,
	levels = 5,
	margin = 48,
	grid = "polygon",
	variant = "filled",
	animate = true,
	activeIndex: activeIndexProp,
	defaultActiveIndex = null,
	onActiveIndexChange,
	seriesLabel = "Series",
	roleDescription = "radar chart",
	className,
	children,
}: RadarChartProps) {
	const { format, description } = useChart();
	const { activeIndex, instant, setActive } = useActiveIndex(
		activeIndexProp,
		defaultActiveIndex,
		onActiveIndexChange,
	);
	const max = maxProp ?? niceMax(data, metrics);
	const value = (s: RadarSeries, key: string) => s.values[key] ?? 0;
	const seriesOf = (datum: Datum) => data.find((s) => s.values === datum);
	const title = (datum: Datum) => seriesOf(datum)?.label ?? "";
	const rows = (datum: Datum) => {
		const index = data.findIndex((s) => s.values === datum);
		const s = data[index];
		return metrics.map((m) => ({
			key: m.key,
			label: m.label,
			color: s ? seriesColor(s, index) : "currentColor",
			value: s ? value(s, m.key) : null,
		}));
	};
	const activeSeries = activeIndex !== null ? data[activeIndex] : undefined;
	const describe = (s: RadarSeries) => {
		const ranked = [...metrics].sort((a, b) => value(s, b.key) - value(s, a.key));
		const top = ranked[0];
		const low = ranked.at(-1);
		return top && low
			? `${s.label}: highest ${top.label} ${format.number(value(s, top.key))}, lowest ${low.label} ${format.number(value(s, low.key))}.`
			: `${s.label}.`;
	};
	const summary =
		description ??
		`${data.length} series across ${metrics.length} metrics. ${data.map(describe).join(" ")}`;
	const announcement =
		activeSeries && instant
			? `${activeSeries.label}: ${metrics
					.map((m) => `${m.label} ${format.number(value(activeSeries, m.key))}`)
					.join(", ")}`
			: "";

	return (
		<ChartFrame
			roleDescription={roleDescription}
			summary={summary}
			table={{
				columns: [seriesLabel, ...metrics.map((m) => m.label)],
				rows: data.map((s) => ({
					header: s.label,
					cells: metrics.map((m) => format.number(value(s, m.key))),
				})),
			}}
			count={data.length}
			activeIndex={activeIndex}
			onActiveChange={setActive}
			interactive={data.length > 0}
			announcement={announcement}
			className={cn("aspect-square", className)}
		>
			{(frame) => {
				const size = Math.min(frame.width, frame.height);
				const radius = Math.max(0, size / 2 - margin);
				const context: RadarContextValue = {
					data,
					metrics,
					radius,
					levels,
					max,
					grid,
					variant,
					animate,
					center: { x: frame.width / 2, y: frame.height / 2 },
					frame,
					setActive,
				};
				const active: ActivePoint | null =
					activeSeries && activeIndex !== null
						? {
								index: activeIndex,
								datum: activeSeries.values,
								x: frame.width / 2,
								y: {},
							}
						: null;
				return (
					<RadarContext.Provider value={context}>
						<ActivePointProvider value={{ active, instant, title, rows }}>
							<svg
								aria-hidden="true"
								width={frame.width}
								height={frame.height}
								className="absolute inset-0 block overflow-visible"
								onPointerLeave={() => activeIndex !== null && setActive(null, false)}
							>
								<g transform={`translate(${frame.width / 2},${frame.height / 2})`}>
									{children}
								</g>
							</svg>
						</ActivePointProvider>
					</RadarContext.Provider>
				);
			}}
		</ChartFrame>
	);
}

export interface RadarGridProps {
	/** Print each ring's value beside the first axis. */
	showLevels?: boolean;
	className?: string;
}

function RadarRing({ index }: { index: number }) {
	const { metrics, radius, levels, grid, animate } = useRadar();
	const ref = useRef<SVGPathElement>(null);
	useEnterSpring(RADAR_SPRING.grid, index * RADAR_TIMING.gridStagger, animate, (p) => {
		const node = ref.current;
		if (!node) return;
		node.style.transform = `scale(${0.9 + 0.1 * p})`;
		node.style.opacity = String(Math.min(1, Math.max(0, p)));
	});
	return (
		<path
			ref={ref}
			d={ringPath(grid, metrics.length, ((index + 1) * radius) / levels)}
			className={radar({ grid }).ring()}
			style={{ transformOrigin: "0 0" }}
		/>
	);
}

function RadarLevel({ index }: { index: number }) {
	const { radius, levels, max, animate } = useRadar();
	const { format } = useChart();
	const ref = useRef<SVGTextElement>(null);
	const delay =
		levels * RADAR_TIMING.gridStagger * 0.5 + index * RADAR_TIMING.levelLabelStep;
	useEnterTween(
		CHART_DURATION.enter,
		delay,
		animate,
		(p) => {
			if (ref.current) ref.current.style.opacity = String(p);
		},
		CHART_EASE,
	);
	return (
		<text
			ref={ref}
			x={4}
			y={-((index + 1) * radius) / levels}
			dominantBaseline="middle"
			className={radar().level()}
		>
			{format.compact(((index + 1) * max) / levels)}
		</text>
	);
}

export function RadarGrid({ showLevels = true, className }: RadarGridProps) {
	const { levels } = useRadar();
	return (
		<g data-slot="radar-grid" className={className}>
			{Array.from({ length: levels }, (_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: generated from a count, so position is the identity.
				<RadarRing key={`ring-${i}`} index={i} />
			))}
			{showLevels
				? Array.from({ length: levels }, (_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: generated from a count, so position is the identity.
						<RadarLevel key={`level-${i}`} index={i} />
					))
				: null}
		</g>
	);
}

function RadarSpoke({ index }: { index: number }) {
	const { metrics, radius, animate } = useRadar();
	const ref = useRef<SVGLineElement>(null);
	const angle = (index * Math.PI * 2) / metrics.length - Math.PI / 2;
	useEnterSpring(RADAR_SPRING.axis, index * RADAR_TIMING.axisStagger, animate, (p) => {
		ref.current?.setAttribute("x2", String(radius * Math.cos(angle) * p));
		ref.current?.setAttribute("y2", String(radius * Math.sin(angle) * p));
	});
	return <line ref={ref} x1={0} y1={0} className={radar().axis()} />;
}

export function RadarAxis({ className }: { className?: string }) {
	const { metrics } = useRadar();
	return (
		<g data-slot="radar-axis" className={className}>
			{metrics.map((m, i) => (
				<RadarSpoke key={m.key} index={i} />
			))}
		</g>
	);
}

function RadarLabel({ index, offset }: { index: number; offset: number }) {
	const { metrics, radius, levels, animate } = useRadar();
	const ref = useRef<SVGGElement>(null);
	const angle = (index * Math.PI * 2) / metrics.length - Math.PI / 2;
	const r = radius + offset;
	useEnterSpring(RADAR_SPRING.axis, 0, animate, (p) => {
		if (ref.current)
			ref.current.style.transform = `translate(${r * Math.cos(angle) * p}px, ${r * Math.sin(angle) * p}px)`;
	});
	useEnterTween(
		RADAR_TIMING.labelFade,
		levels * RADAR_TIMING.gridStagger * 0.5 + index * RADAR_TIMING.labelStagger,
		animate,
		(p) => {
			if (ref.current) ref.current.style.opacity = String(p);
		},
	);
	return (
		<g ref={ref}>
			<text textAnchor="middle" dominantBaseline="middle" className={radar().label()}>
				{metrics[index]?.label}
			</text>
		</g>
	);
}

export function RadarLabels({
	offset = 20,
	className,
}: {
	/** Distance past the outer ring, in px. */
	offset?: number;
	className?: string;
}) {
	const { metrics } = useRadar();
	return (
		<g data-slot="radar-labels" className={className}>
			{metrics.map((m, i) => (
				<RadarLabel key={m.key} index={i} offset={offset} />
			))}
		</g>
	);
}

export interface RadarAreaProps {
	index: number;
	/** Point markers, one shape per series so series differ without colour. */
	showPoints?: boolean;
	className?: string;
}

export function RadarArea({ index, showPoints = true, className }: RadarAreaProps) {
	const { data, metrics, radius, levels, max, variant, animate, setActive } = useRadar();
	const { active, instant } = useActivePoint();
	const { hidden } = useChart();
	const groupRef = useRef<SVGGElement>(null);
	const scaleRef = useRef<Spring | null>(null);
	const [progress, setProgress] = useState(animate ? 0 : 1);
	const [visible, setVisible] = useState(!animate);
	const series = data[index];
	const delay =
		levels * RADAR_TIMING.gridStagger +
		RADAR_TIMING.areaBase +
		index * RADAR_TIMING.areaStagger;

	useEnterTween(CHART_DURATION.enter, delay, animate, setProgress, CHART_EASE);
	useEffect(() => {
		const frame = requestAnimationFrame(() => setVisible(true));
		return () => cancelAnimationFrame(frame);
	}, []);

	const isActive = active?.index === index;
	const isOther = active !== null && !isActive;
	useLayoutEffect(() => {
		if (!scaleRef.current)
			scaleRef.current = new Spring(1, RADAR_SPRING.hover, (v) => {
				if (groupRef.current) groupRef.current.style.transform = `scale(${v})`;
			});
		const target = isActive ? 1.05 : 1;
		if (instant) scaleRef.current.jump(target);
		else scaleRef.current.set(target);
	}, [isActive, instant]);
	useEffect(() => () => scaleRef.current?.stop(), []);

	const points = useMemo(
		() => (series ? seriesPoints(series, metrics, radius, max, progress) : []),
		[series, metrics, radius, max, progress],
	);
	if (!series) return null;
	const color = seriesColor(series, index);
	const isHidden = hidden.has(seriesKey(series));
	const styles = radar({ variant });
	return (
		<g
			data-slot="radar-area"
			data-series={index}
			className={cn(styles.area(), className)}
			style={
				{
					color,
					opacity: visible && !isHidden ? (isOther ? 0.3 : 1) : 0,
					pointerEvents: isHidden ? "none" : undefined,
					filter: isActive ? `drop-shadow(0 0 12px ${color})` : undefined,
				} as CSSProperties
			}
			onPointerEnter={() => setActive(index, false)}
		>
			<g ref={groupRef} style={{ transformOrigin: "0 0" }}>
				<path
					d={polygonPath(points)}
					className={styles.shape()}
					stroke="currentColor"
					strokeDasharray={seriesDash(index) || undefined}
					style={{ fillOpacity: isActive ? 0.35 : 0.15, strokeWidth: isActive ? 3 : 2 }}
				/>
				{showPoints
					? points.map((p, i) => (
							<path
								key={metrics[i]?.key ?? i}
								d={markerPath(index, 4)}
								className={styles.marker()}
								fill="currentColor"
								strokeWidth={2}
								style={{
									transform: `translate(${p.x}px, ${p.y}px) scale(${isActive ? 1.5 : 1})`,
								}}
							/>
						))
					: null}
			</g>
		</g>
	);
}

/** Panel beside the active series' rightmost vertex, reusing the chart tooltip. */
export function RadarTooltip({
	content,
	className,
}: {
	content?: ReactNode;
	className?: string;
}) {
	const { data, metrics, radius, max, center, frame } = useRadar();
	const { active, instant } = useActivePoint();
	const series = active ? data[active.index] : undefined;
	let anchor: Point | null = null;
	if (series) {
		const points = seriesPoints(series, metrics, radius, max);
		const right = points.reduce(
			(a, b) => (b.x > a.x ? b : a),
			points[0] ?? { x: 0, y: 0 },
		);
		anchor = { x: center.x + right.x, y: center.y + right.y };
	}
	if (!frame.el) return null;
	return createPortal(
		<ChartTooltipPanel
			anchor={anchor}
			instant={instant}
			bounds={{ width: frame.width, height: frame.height }}
			className={className}
		>
			{content ?? <ChartTooltipContent />}
		</ChartTooltipPanel>,
		frame.el,
	);
}
