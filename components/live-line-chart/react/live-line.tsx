"use client";

import { curveLinear, curveMonotoneX, curveStepAfter, area as d3Area } from "d3-shape";
import {
	type CSSProperties,
	useEffect,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
} from "react";
import { useChart } from "../../chart/react/chart";
import { type Datum, linePath, seriesColor, seriesPoints } from "../../chart/react/core";
import { type Playback, prefersReducedMotion, tween } from "../../chart/react/motion";
import { usePlot } from "../../chart/react/time-series";
import { cn } from "../../lib/react/cn";
import { detectMomentum } from "./live";
import { useLive } from "./live-line-chart";
import { type LiveLineCurve, type LiveLineTint, liveLine } from "./variants";

const CURVES = { monotone: curveMonotoneX, linear: curveLinear, step: curveStepAfter };
const PULSE_MS = 1500;
const ARROWS = { up: "M0 5 4 0 8 5Z", down: "M0 0 4 5 8 0Z", flat: "M0 2h8v1.5H0Z" };

export interface LiveLineProps {
	dataKey: string;
	/** Defaults to the series colour from the chart config, `var(--color-<dataKey>)`. */
	stroke?: string;
	strokeWidth?: number;
	curve?: LiveLineCurve;
	/** Momentum colours the tip only (`dot`) or the whole line (`line`). */
	tint?: LiveLineTint;
	/** Gradient fill under the line. */
	fill?: boolean;
	/** Expanding ring on the live tip while the chart scrolls. */
	pulse?: boolean;
	dotSize?: number;
	/** Value pill beside the tip, with a momentum arrow. */
	badge?: boolean;
	/** Dashed rule across the plot at the live value. */
	guide?: boolean;
	formatValue?: (value: number) => string;
	className?: string;
}

export function LiveLine({
	dataKey,
	stroke,
	strokeWidth = 2,
	curve = "monotone",
	tint = "dot",
	fill = true,
	pulse = true,
	dotSize = 4,
	badge = true,
	guide = true,
	formatValue,
	className,
}: LiveLineProps) {
	const { register, data, x, yScale, xKey, innerWidth, innerHeight } = usePlot();
	const live = useLive();
	const { hidden, highlighted, format } = useChart();
	const uid = useId().replace(/:/g, "");
	const color = stroke ?? seriesColor(dataKey);

	useLayoutEffect(() => register({ key: dataKey, color }), [register, dataKey, color]);

	const points = useMemo(
		() => seriesPoints(data, dataKey, x, (v) => yScale(v), xKey),
		[data, dataKey, x, yScale, xKey],
	);
	const values = useMemo(
		() => data.map((d) => d[dataKey]).filter((v): v is number => typeof v === "number"),
		[data, dataKey],
	);
	const momentum = detectMomentum(values);
	const tip = data.length >= 2 ? (data.at(-2) as Datum) : data.at(-1);
	const tipValue = live.frame.displayValue;
	const tipX = tip ? x(tip) : innerWidth;
	const tipY = yScale(tipValue);
	const styles = liveLine({ curve, momentum, tint });
	const factory = CURVES[curve];
	const areaPath = useMemo(
		() =>
			fill && points.length > 1
				? (d3Area<{ x: number; y: number }>()
						.x((p) => p.x)
						.y0(innerHeight)
						.y1((p) => p.y)
						.curve(factory)(points) ?? "")
				: "",
		[fill, points, innerHeight, factory],
	);

	const ringRef = useRef<SVGCircleElement>(null);
	const pulsing = pulse && live.running && !live.paused;
	useEffect(() => {
		if (!pulsing || prefersReducedMotion()) return;
		let playback: Playback | null = null;
		const cycle = () => {
			playback = tween({
				duration: PULSE_MS,
				ease: (t) => t,
				onUpdate: (p) => {
					ringRef.current?.setAttribute("r", String(dotSize + dotSize * 2.5 * p));
					ringRef.current?.setAttribute("opacity", String(0.5 * (1 - p)));
				},
				onComplete: cycle,
			});
		};
		cycle();
		return () => {
			playback?.stop();
			ringRef.current?.setAttribute("opacity", "0");
		};
	}, [pulsing, dotSize]);

	const label = formatValue
		? formatValue(tipValue)
		: format.number(Math.round(tipValue * 100) / 100);
	const badgeWidth = label.length * 6.6 + 30;
	const fadeEnd = innerWidth > 0 ? Math.min(100, (tipX / innerWidth) * 100) : 100;
	const isHidden = hidden.has(dataKey);
	const dimmed = highlighted !== null && highlighted !== dataKey;

	return (
		<g
			data-slot="chart-live-line"
			data-series={dataKey}
			data-momentum={momentum}
			className={cn(styles.series(), className)}
			style={
				{ "--series": color, opacity: isHidden ? 0 : dimmed ? 0.3 : 1 } as CSSProperties
			}
		>
			<defs>
				<linearGradient id={`${uid}-stroke`} x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stopColor="currentColor" stopOpacity={1} />
					<stop offset="100%" stopColor="currentColor" stopOpacity={0.6} />
				</linearGradient>
				<linearGradient id={`${uid}-area`} x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stopColor="currentColor" stopOpacity={0.1} />
					<stop offset="100%" stopColor="currentColor" stopOpacity={0} />
				</linearGradient>
				<linearGradient id={`${uid}-fade`} x1="0" x2="1" y1="0" y2="0">
					<stop offset="0%" stopColor="white" stopOpacity={0} />
					<stop offset="4%" stopColor="white" stopOpacity={1} />
					<stop offset={`${fadeEnd}%`} stopColor="white" stopOpacity={1} />
					<stop offset="100%" stopColor="white" stopOpacity={fadeEnd >= 99.9 ? 1 : 0} />
				</linearGradient>
				<mask id={`${uid}-mask`}>
					<rect
						x={0}
						y={-20}
						width={innerWidth}
						height={innerHeight + 40}
						fill={`url(#${uid}-fade)`}
					/>
				</mask>
			</defs>
			<g mask={`url(#${uid}-mask)`}>
				{areaPath ? <path d={areaPath} fill={`url(#${uid}-area)`} /> : null}
				<path
					d={linePath(points, factory)}
					className={styles.line()}
					stroke={`url(#${uid}-stroke)`}
					strokeWidth={strokeWidth}
				/>
			</g>
			{guide ? (
				<line
					className={styles.guide()}
					stroke="currentColor"
					strokeOpacity={0.25}
					x1={0}
					x2={innerWidth}
					y1={tipY}
					y2={tipY}
				/>
			) : null}
			<g
				data-slot="chart-live-tip"
				className={styles.tip()}
				style={{ opacity: live.scrubbing ? 0.25 : 1 }}
			>
				<circle
					ref={ringRef}
					className={styles.ring()}
					cx={tipX}
					cy={tipY}
					r={dotSize}
					opacity={0}
				/>
				<circle cx={tipX} cy={tipY} r={dotSize + 2} fill="currentColor" opacity={0.1} />
				<circle className={styles.dot()} cx={tipX} cy={tipY} r={dotSize} />
				{badge ? (
					<g data-slot="chart-live-badge" transform={`translate(${tipX + 12},${tipY})`}>
						<rect
							className={styles.badge()}
							x={0}
							y={-12}
							width={badgeWidth}
							height={24}
							rx={6}
						/>
						<path
							className={styles.arrow()}
							d={ARROWS[momentum]}
							transform="translate(8,-3)"
						/>
						<text className={styles.badgeText()} x={22} y={4}>
							{label}
						</text>
					</g>
				) : null}
			</g>
		</g>
	);
}
