"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { prefersReducedMotion, Spring } from "../../chart/motion";
import { cn } from "../../lib/cn";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import {
	activeCount,
	arcNotches,
	clampStagger,
	type GaugeBand,
	gaugeBand,
	LINEAR_HEIGHT,
	linearNotches,
	NOTCH_SPRING,
	NOTCH_TIMING,
	type Notch,
	RING_CIRCUMFERENCE,
	RING_RADIUS,
	scaleFill,
} from "../geometry";
import { type GaugeChartLayout, type GaugeChartTone, gaugeChart } from "../variants";

/** Drives one notch between hidden (0) and shown (1) after `delay` seconds. */
function NotchPath({
	notch,
	on,
	delay,
	animate,
	className,
	fill,
}: {
	notch: Notch;
	on: boolean;
	delay: number;
	animate: boolean;
	className?: string;
	fill?: string;
}) {
	const ref = useRef<SVGPathElement>(null);
	const springRef = useRef<Spring | null>(null);
	if (!springRef.current)
		springRef.current = new Spring(0, NOTCH_SPRING, (p) => {
			const node = ref.current;
			if (!node) return;
			node.style.transform = `scale(${0.9 + 0.1 * p})`;
			node.style.opacity = String(Math.min(1, Math.max(0, p)));
		});
	useLayoutEffect(() => {
		const spring = springRef.current;
		if (!spring) return;
		const target = on ? 1 : 0;
		if (!animate || prefersReducedMotion()) {
			spring.jump(target);
			return;
		}
		const timer = setTimeout(() => spring.set(target), delay * 1000);
		return () => clearTimeout(timer);
	}, [on, delay, animate]);
	useLayoutEffect(() => () => springRef.current?.stop(), []);
	return (
		<path
			ref={ref}
			d={notch.path}
			className={className}
			fill={fill}
			style={{ transformOrigin: `${notch.origin.x}px ${notch.origin.y}px`, opacity: 0 }}
		/>
	);
}

export interface GaugeChartProps {
	value: number;
	min?: number;
	max?: number;
	/** How many notches make up the track. */
	notches?: number;
	/** Share of the track left as gaps between notches, 0 to 100. */
	spacing?: number;
	layout?: GaugeChartLayout;
	tone?: GaugeChartTone;
	/** Accessible name; also printed under the value. */
	label?: string;
	/** Value bands: the highest one reached sets the tone and names the state beside the label. */
	bands?: GaugeBand<Exclude<GaugeChartTone, "scale">>[];
	showValue?: boolean;
	/** Formats the printed value; defaults to the locale's grouped number. */
	format?: (value: number) => string;
	/** BCP 47 locale for the default formatter. */
	locale?: string;
	/** Scales every enter delay, clamped to 0.25 to 2.5. */
	staggerScale?: number;
	animate?: boolean;
	className?: string;
}

export function GaugeChart({
	value,
	min = 0,
	max = 100,
	notches: total = 40,
	spacing = 25,
	layout = "arc",
	tone = "primary",
	label,
	bands = [],
	showValue = true,
	format,
	locale,
	staggerScale = 1,
	animate = true,
	className,
}: GaugeChartProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	useLayoutEffect(() => {
		const node = ref.current;
		if (!node) return;
		const measure = () => {
			setWidth(Math.floor(node.clientWidth));
			setHeight(Math.floor(node.clientHeight));
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	const formatter = useMemo(
		() => format ?? ((v: number) => new Intl.NumberFormat(locale).format(Math.round(v))),
		[format, locale],
	);
	const stagger = clampStagger(staggerScale);
	const count = activeCount(value, min, max, total);

	const linear = layout === "linear";
	const plotWidth = width;
	const plotHeight = linear ? LINEAR_HEIGHT : height;
	const geometry = useMemo(() => {
		if (plotWidth <= 0 || plotHeight <= 0) return null;
		return linear
			? {
					notches: linearNotches({
						width: plotWidth,
						height: plotHeight,
						total,
						spacing,
					}),
					size: 0,
				}
			: arcNotches({ width: plotWidth, height: plotHeight, total, spacing });
	}, [linear, plotWidth, plotHeight, total, spacing]);
	// The first drawn value enters with the base delay; later changes ripple from the old edge.
	const previous = useRef<number | null>(null);
	const from = previous.current;
	const drawn = geometry !== null;
	useLayoutEffect(() => {
		if (drawn) previous.current = count;
	}, [count, drawn]);

	const activeDelay = (index: number) => {
		if (from === null)
			return (NOTCH_TIMING.activeBase + index * NOTCH_TIMING.activeStep) * stagger;
		const step = NOTCH_TIMING.activeStep * stagger;
		return index >= from ? (index - from) * step : (from - 1 - index) * step;
	};
	const band = gaugeBand(bands, value);
	const shownLabel = band ? (label ? `${label} · ${band.label}` : band.label) : label;
	const activeTone = band?.tone ?? tone;
	const styles = gaugeChart({ layout, tone: activeTone });
	const text = formatter(value);
	// The ring sweeps from empty on mount; later changes ease along the dash.
	const [swept, setSwept] = useState(!animate);
	useEffect(() => {
		if (swept) return;
		const id = requestAnimationFrame(() => setSwept(true));
		return () => cancelAnimationFrame(id);
	}, [swept]);

	if (layout === "ring") {
		const arc = RING_CIRCUMFERENCE * 0.75;
		const share = max > min ? Math.min(1, Math.max(0, (value - min) / (max - min))) : 0;
		return (
			// biome-ignore lint/a11y/useSemanticElements: <meter> cannot hold the drawn dial
			<div
				role="meter"
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={value}
				aria-valuetext={text}
				aria-label={shownLabel}
				data-slot="gauge-chart"
				data-layout="ring"
				className={cn(styles.root(), className)}
			>
				<svg viewBox="0 0 100 100" aria-hidden="true" className={styles.ring()}>
					<circle
						cx={50}
						cy={50}
						r={RING_RADIUS}
						strokeWidth={8}
						strokeLinecap="round"
						strokeDasharray={`${arc} ${RING_CIRCUMFERENCE}`}
						className={styles.ringTrack()}
					/>
					<circle
						cx={50}
						cy={50}
						r={RING_RADIUS}
						strokeWidth={8}
						strokeLinecap="round"
						strokeDasharray={`${arc} ${RING_CIRCUMFERENCE}`}
						strokeDashoffset={arc * (1 - (swept ? share : 0))}
						stroke={
							activeTone === "scale"
								? scaleFill(Math.max(0, Math.round(share * total) - 1), total)
								: undefined
						}
						className={styles.ringActive()}
					/>
				</svg>
				{showValue ? (
					<div className={styles.center()}>
						<RollingDigits
							variant="count"
							value={value}
							format={formatter}
							size="sm"
							startOnView={false}
							className={cn("font-bold text-foreground", styles.value())}
						/>
						{shownLabel ? <span className={styles.label()}>{shownLabel}</span> : null}
					</div>
				) : null}
			</div>
		);
	}

	const svg = geometry ? (
		<svg
			aria-hidden="true"
			width={plotWidth}
			height={plotHeight}
			className={cn("block overflow-visible", linear ? "" : "absolute inset-0")}
		>
			{geometry.notches.map((notch) => (
				<NotchPath
					key={`bg-${notch.index}`}
					notch={notch}
					on
					delay={notch.index * NOTCH_TIMING.background * stagger}
					animate={animate}
					className={styles.track()}
				/>
			))}
			{geometry.notches.map((notch) => (
				<NotchPath
					key={`active-${notch.index}`}
					notch={notch}
					on={notch.index < count}
					delay={activeDelay(notch.index)}
					animate={animate}
					className={styles.active()}
					fill={activeTone === "scale" ? scaleFill(notch.index, total) : undefined}
				/>
			))}
		</svg>
	) : null;

	return (
		// biome-ignore lint/a11y/useSemanticElements: <meter> cannot hold the notched track
		<div
			ref={ref}
			role="meter"
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={value}
			aria-valuetext={text}
			aria-label={shownLabel}
			data-slot="gauge-chart"
			data-layout={layout}
			className={cn(styles.root(), className)}
		>
			{linear ? (
				<>
					{showValue || shownLabel ? (
						<div className={styles.header()}>
							{shownLabel ? (
								<span className={styles.label()}>{shownLabel}</span>
							) : (
								<span />
							)}
							{showValue ? (
								<RollingDigits
									variant="count"
									value={value}
									format={formatter}
									size="sm"
									startOnView={false}
									className={cn("font-bold text-foreground", styles.value())}
								/>
							) : null}
						</div>
					) : null}
					{svg}
				</>
			) : (
				<>
					{svg}
					{showValue ? (
						<div
							className={styles.center()}
							style={{ paddingTop: (geometry?.size ?? 0) * 0.08 }}
						>
							<RollingDigits
								variant="count"
								value={value}
								format={formatter}
								size="default"
								startOnView={false}
								className={cn("font-bold text-foreground", styles.value())}
							/>
							{shownLabel ? <span className={styles.label()}>{shownLabel}</span> : null}
						</div>
					) : null}
				</>
			)}
		</div>
	);
}
