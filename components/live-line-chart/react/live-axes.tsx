"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { fitTickCount } from "../../chart/core";
import { CHART_SPRING, Spring, type SpringConfig } from "../../chart/motion";
import { useChart } from "../../chart/react/chart";
import { useActivePoint } from "../../chart/react/frame";
import { usePlot } from "../../chart/react/time-series";
import { chartTooltip } from "../../chart/variants";
import { cn } from "../../lib/cn";
import { crosshairFade, edgeOpacity, niceInterval, tickValues } from "../live";
import { type LiveAxisPosition, liveAxis } from "../variants";
import { useLive } from "./live-line-chart";

/** The y-tick spring, for both position and the enter/exit fade. */
const TICK_SPRING: SpringConfig = { stiffness: 180, damping: 24 };
const TICK_EXIT_MS = 450;
/** Room for one "11:22:49 pm" time label plus breathing space. */
const TIME_LABEL_GAP = 72;

function useSpringValue(config: SpringConfig, apply: (value: number) => void) {
	const applyRef = useRef(apply);
	applyRef.current = apply;
	const ref = useRef<Spring | null>(null);
	if (!ref.current) ref.current = new Spring(0, config, (v) => applyRef.current(v));
	useLayoutEffect(() => () => ref.current?.stop(), []);
	return ref.current;
}

export interface LiveXAxisProps {
	numTicks?: number;
	/** Formats wall-clock ms; defaults to the chart's `formatTime`. */
	formatTime?: (ms: number) => string;
	/** Time pill that follows the crosshair. */
	pill?: boolean;
	className?: string;
}

export function LiveXAxis({
	numTicks = 5,
	formatTime,
	pill = true,
	className,
}: LiveXAxisProps) {
	const { xScale, innerWidth, innerHeight, margin, plotEl, width } = usePlot();
	const live = useLive();
	const { active, instant } = useActivePoint();
	const styles = liveAxis();
	const fmt = formatTime ?? live.formatTime;
	const [start, end] = xScale.domain().map((d) => d.getTime()) as [number, number];
	const count = fitTickCount(numTicks, innerWidth, TIME_LABEL_GAP);
	const pillRef = useRef<HTMLDivElement>(null);
	const pillX = useSpringValue(CHART_SPRING.tooltip, (v) => {
		if (pillRef.current) pillRef.current.style.left = `${v}px`;
	});
	const anchor = active ? active.x + margin.left : null;
	const shown = useRef(false);
	useLayoutEffect(() => {
		if (anchor === null) {
			shown.current = false;
			return;
		}
		if (!shown.current || instant) pillX.jump(anchor);
		else pillX.set(anchor);
		shown.current = true;
	}, [anchor, instant, pillX]);

	return (
		<g data-slot="chart-live-x-axis" className={className}>
			{Array.from({ length: count }, (_, i) => {
				const px = (i / (count - 1)) * innerWidth;
				return (
					<text
						// biome-ignore lint/suspicious/noArrayIndexKey: generated from a count, so position is the identity.
						key={i}
						className={cn(styles.tick(), styles.timeLabel())}
						x={px}
						y={innerHeight + margin.bottom - 12}
						textAnchor="middle"
						style={{ opacity: crosshairFade(px, active ? active.x : null) }}
					>
						{fmt(start + ((end - start) * i) / (count - 1))}
					</text>
				);
			})}
			{pill && plotEl && active && width > 0
				? createPortal(
						<div
							ref={pillRef}
							data-slot="chart-live-pill"
							aria-hidden="true"
							className="-translate-x-1/2 absolute bottom-1 z-20"
						>
							<div className={chartTooltip().pill()}>
								<span className="whitespace-nowrap tabular-nums">
									{fmt(xScale.invert(active.x).getTime())}
								</span>
							</div>
						</div>,
						plotEl,
					)
				: null}
		</g>
	);
}

function LiveYTick({
	y,
	alpha,
	present,
	x,
	label,
	className,
}: {
	y: number;
	alpha: number;
	present: boolean;
	x: number;
	label: string;
	className: string;
}) {
	const ref = useRef<SVGGElement>(null);
	const pos = useRef({ y, o: 0 });
	const write = () =>
		ref.current?.setAttribute("transform", `translate(${x},${pos.current.y})`);
	const ys = useSpringValue(TICK_SPRING, (v) => {
		pos.current.y = v;
		write();
	});
	const os = useSpringValue(TICK_SPRING, (v) => {
		pos.current.o = v;
		ref.current?.setAttribute("opacity", String(Math.max(0, Math.min(1, v))));
	});
	const mounted = useRef(false);
	useLayoutEffect(() => {
		if (!mounted.current) {
			ys.jump(y);
			os.jump(0);
			mounted.current = true;
		} else ys.set(y);
		os.set(present ? alpha : 0);
		write();
	});
	return (
		<g ref={ref} opacity={0}>
			<text className={className} dominantBaseline="middle">
				{label}
			</text>
		</g>
	);
}

export interface LiveYAxisProps {
	/** Minimum pixel gap between labels. */
	minGap?: number;
	position?: LiveAxisPosition;
	formatValue?: (value: number) => string;
	allowDecimals?: boolean;
	className?: string;
}

export function LiveYAxis({
	minGap = 36,
	position = "left",
	formatValue,
	allowDecimals = true,
	className,
}: LiveYAxisProps) {
	const { yScale, innerHeight, innerWidth } = usePlot();
	const { format } = useChart();
	const styles = liveAxis({ position });
	const fmt = formatValue ?? ((v: number) => format.number(v));
	const [min = 0, max = 0] = yScale.domain();
	const intervalRef = useRef(0);
	const interval = niceInterval(max - min, innerHeight, minGap, intervalRef.current);
	intervalRef.current = interval;
	const ticks = tickValues(min, max, interval)
		.filter((v) => allowDecimals || Number.isInteger(v))
		.map((value) => ({ key: value.toPrecision(10), value, y: yScale(value) }))
		.filter((t) => t.y >= -10 && t.y <= innerHeight + 10);
	const signature = ticks.map((t) => t.key).join("|");

	const prev = useRef<Map<string, number>>(new Map());
	const [leaving, setLeaving] = useState<{ key: string; value: number }[]>([]);
	const timers = useRef<number[]>([]);
	// biome-ignore lint/correctness/useExhaustiveDependencies: signature is a content key, so equal data does not re-run; ticks.map left out on purpose, the listed values decide when it runs.
	useEffect(() => {
		const current = new Set(ticks.map((t) => t.key));
		const gone = [...prev.current]
			.filter(([key]) => !current.has(key))
			.map(([key, value]) => ({ key, value }));
		prev.current = new Map(ticks.map((t) => [t.key, t.value]));
		setLeaving((list) => [...list.filter((t) => !current.has(t.key)), ...gone]);
		if (gone.length) {
			const keys = new Set(gone.map((t) => t.key));
			timers.current.push(
				window.setTimeout(
					() => setLeaving((list) => list.filter((t) => !keys.has(t.key))),
					TICK_EXIT_MS,
				),
			);
		}
	}, [signature]);
	useEffect(
		() => () => {
			for (const id of timers.current) clearTimeout(id);
		},
		[],
	);

	const tx = position === "left" ? -8 : innerWidth + 8;
	// biome-ignore lint/correctness/useExhaustiveDependencies: signature is a content key, so equal data does not recompute; ticks.map left out on purpose, the listed values decide when it runs.
	const presentKeys = useMemo(() => new Set(ticks.map((t) => t.key)), [signature]);
	return (
		<g data-slot="chart-live-y-axis" className={className}>
			{ticks.map((t) => (
				<LiveYTick
					key={t.key}
					y={t.y}
					alpha={edgeOpacity(t.y, innerHeight)}
					present
					x={tx}
					label={fmt(t.value)}
					className={styles.tick()}
				/>
			))}
			{leaving
				.filter((t) => !presentKeys.has(t.key))
				.map((t) => (
					<LiveYTick
						key={t.key}
						y={yScale(t.value)}
						alpha={0}
						present={false}
						x={tx}
						label={fmt(t.value)}
						className={styles.tick()}
					/>
				))}
		</g>
	);
}
