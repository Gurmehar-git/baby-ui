"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useChart } from "../../chart/react/chart";
import type { ActivePoint, Datum } from "../../chart/react/core";
import { ActivePointProvider, ChartFrame } from "../../chart/react/frame";
import { CHART_DURATION, type Playback, Spring, tween } from "../../chart/react/motion";
import { useActiveIndex } from "../../chart/react/time-series";
import { ChartTooltipContent, ChartTooltipPanel } from "../../chart/react/tooltip";
import { cn } from "../../lib/react/cn";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import {
	arcPath,
	bisector,
	LABEL_MIN_SPAN,
	type PieSlice,
	POP_SPRING,
	pieRows,
	pieSlices,
	sliceDelay,
} from "./geometry";
import { PIE_INNER_RATIO, type PieHover, type PieVariant, pieChart } from "./variants";

export interface PieChartProps {
	data: Datum[];
	/** Key holding each row's value. */
	dataKey?: string;
	/** Key holding each row's name; matches `config` keys for labels, colours and the legend. */
	nameKey?: string;
	variant?: PieVariant;
	hover?: PieHover;
	/** Pixels a hovered slice moves out, or grows by. */
	hoverOffset?: number;
	padAngle?: number;
	cornerRadius?: number;
	/** Percentage labels on slices wide enough to hold them. */
	labels?: boolean;
	/** Donut caption when no slice is active. */
	centerLabel?: string;
	/** Screen-reader table headers: name, value, share. */
	tableHeaders?: [string, string, string];
	animate?: boolean;
	activeIndex?: number | null;
	defaultActiveIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	roleDescription?: string;
	className?: string;
}

export function PieChart({
	data,
	dataKey = "value",
	nameKey = "name",
	variant = "donut",
	hover = "translate",
	hoverOffset = 10,
	padAngle = 0.02,
	cornerRadius = 4,
	labels = true,
	centerLabel = "Total",
	tableHeaders = ["Name", "Value", "Share"],
	animate = true,
	activeIndex: activeIndexProp,
	defaultActiveIndex = null,
	onActiveIndexChange,
	roleDescription = "pie chart",
	className,
}: PieChartProps) {
	const { config, hidden, format, description } = useChart();
	const rows = useMemo(
		() => pieRows(data, dataKey, nameKey, config).filter((row) => !hidden.has(row.key)),
		[data, dataKey, nameKey, config, hidden],
	);
	const slices = useMemo(() => pieSlices(rows, padAngle), [rows, padAngle]);
	const total = rows.reduce((sum, row) => sum + row.value, 0);
	const share = useCallback(
		(value: number) => format.percent(total > 0 ? value / total : 0),
		[total, format],
	);
	const { activeIndex, instant, setActive } = useActiveIndex(
		activeIndexProp,
		defaultActiveIndex,
		onActiveIndexChange,
	);
	const active = activeIndex !== null ? slices[activeIndex] : undefined;
	const largest = slices.reduce<PieSlice | undefined>(
		(best, s) => (!best || s.value > best.value ? s : best),
		undefined,
	);

	return (
		<ChartFrame
			roleDescription={roleDescription}
			summary={
				description ??
				(largest
					? `${slices.length} slices totalling ${format.number(total)}. Largest: ${largest.label}, ${share(largest.value)}.`
					: "No data.")
			}
			table={{
				columns: tableHeaders,
				rows: slices.map((s) => ({
					header: s.label,
					cells: [format.number(s.value), share(s.value)],
				})),
			}}
			count={slices.length}
			activeIndex={activeIndex}
			onActiveChange={setActive}
			interactive={slices.length > 0}
			announcement={
				active && instant
					? `${active.label}: ${format.number(active.value)}, ${share(active.value)}`
					: ""
			}
			className={className}
		>
			{(frame) => (
				<PiePlot
					frame={frame}
					slices={slices}
					total={total}
					share={share}
					variant={variant}
					hover={hover}
					hoverOffset={hoverOffset}
					cornerRadius={cornerRadius}
					labels={labels}
					centerLabel={centerLabel}
					animate={animate}
					activeIndex={activeIndex}
					instant={instant}
					setActive={setActive}
				/>
			)}
		</ChartFrame>
	);
}

function PiePlot({
	frame,
	slices,
	total,
	share,
	variant,
	hover,
	hoverOffset,
	cornerRadius,
	labels,
	centerLabel,
	animate,
	activeIndex,
	instant,
	setActive,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	slices: PieSlice[];
	total: number;
	share: (value: number) => string;
	variant: PieVariant;
	hover: PieHover;
	hoverOffset: number;
	cornerRadius: number;
	labels: boolean;
	centerLabel: string;
	animate: boolean;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
}) {
	const { format } = useChart();
	const styles = pieChart({ variant, hover });
	const size = Math.min(frame.width, frame.height);
	const outer = Math.max(0, size / 2 - hoverOffset);
	const inner = outer * PIE_INNER_RATIO[variant];
	const cx = frame.width / 2;
	const cy = frame.height / 2;

	// Any change to what is drawn replays the sweep, the same as on mount.
	const signature = slices.map((s) => `${s.key}:${s.value}`).join("|");
	const [epoch, setEpoch] = useState(0);
	const [settled, setSettled] = useState(!animate);
	const prevSignature = useRef(signature);
	useLayoutEffect(() => {
		if (prevSignature.current === signature) return;
		prevSignature.current = signature;
		setEpoch((e) => e + 1);
	}, [signature]);
	// biome-ignore lint/correctness/useExhaustiveDependencies: epoch is a content key, so equal data does not re-run.
	useLayoutEffect(() => {
		if (!animate || slices.length === 0) {
			setSettled(true);
			return;
		}
		setSettled(false);
		const playback = tween({
			duration: CHART_DURATION.enter,
			delay: sliceDelay(slices.length - 1),
			ease: (t) => t,
			onUpdate: () => {},
			onComplete: () => setSettled(true),
		});
		return () => playback.stop();
	}, [epoch, animate, slices.length]);

	const activeSlice = activeIndex !== null ? slices[activeIndex] : undefined;
	const counterFormat = useCallback(
		(v: number) => format.number(Math.round(v)),
		[format],
	);
	const activePoint = useMemo<ActivePoint | null>(() => {
		if (!activeSlice || activeIndex === null) return null;
		const mid = bisector(
			activeSlice.startAngle,
			activeSlice.endAngle,
			(inner + outer) / 2,
		);
		return {
			index: activeIndex,
			datum: { key: activeSlice.key, label: activeSlice.label, value: activeSlice.value },
			x: cx + mid.x,
			y: { value: cy + mid.y },
		};
	}, [activeSlice, activeIndex, inner, outer, cx, cy]);
	const activeValue = useMemo(
		() => ({
			active: activePoint,
			instant,
			title: (datum: Datum) => String(datum.label ?? ""),
			rows: (datum: Datum) => [
				{
					key: String(datum.key),
					label: share(Number(datum.value)),
					color: slices.find((s) => s.key === datum.key)?.color ?? "currentColor",
					value: Number(datum.value),
				},
			],
		}),
		[activePoint, instant, share, slices],
	);

	return (
		<ActivePointProvider value={activeValue}>
			<svg
				aria-hidden="true"
				width={frame.width}
				height={frame.height}
				className="absolute inset-0 block overflow-visible"
				onPointerLeave={() => activeIndex !== null && setActive(null, false)}
			>
				<g transform={`translate(${cx},${cy})`}>
					{slices.map((slice, index) => (
						<Slice
							key={slice.key}
							slice={slice}
							index={index}
							inner={inner}
							outer={outer}
							cornerRadius={cornerRadius}
							hover={hover}
							hoverOffset={hoverOffset}
							active={activeIndex === index}
							faded={activeIndex !== null && activeIndex !== index}
							instant={instant}
							epoch={epoch}
							animate={animate}
							className={styles.slice()}
							onEnter={() => setActive(index, false)}
							onLeave={() => setActive(null, false)}
						/>
					))}
					{labels
						? slices.map((slice) => {
								if (slice.endAngle - slice.startAngle < LABEL_MIN_SPAN) return null;
								const at = bisector(
									slice.startAngle,
									slice.endAngle,
									inner > 0 ? (inner + outer) / 2 : outer * 0.65,
								);
								return (
									<text
										key={slice.key}
										x={at.x}
										y={at.y}
										textAnchor="middle"
										dominantBaseline="middle"
										className={styles.label()}
										style={{ opacity: settled ? 1 : 0 }}
									>
										{share(slice.value)}
									</text>
								);
							})
						: null}
				</g>
			</svg>
			{variant === "donut" && inner > 24 ? (
				<div
					data-slot="pie-center"
					className={styles.center()}
					style={{
						left: cx - inner,
						top: cy - inner,
						width: inner * 2,
						height: inner * 2,
					}}
				>
					<RollingDigits
						variant="count"
						value={activeSlice ? activeSlice.value : total}
						format={counterFormat}
						durationMs={600}
						startOnView={false}
						size="sm"
						className="font-bold text-foreground"
					/>
					<span className={styles.caption()}>
						{activeSlice ? activeSlice.label : centerLabel}
					</span>
				</div>
			) : null}
			{frame.el ? (
				<ChartTooltipPanel
					anchor={activePoint ? { x: activePoint.x, y: activePoint.y.value ?? cy } : null}
					instant={instant}
					bounds={frame}
				>
					<ChartTooltipContent />
				</ChartTooltipPanel>
			) : null}
		</ActivePointProvider>
	);
}

function Slice({
	slice,
	index,
	inner,
	outer,
	cornerRadius,
	hover,
	hoverOffset,
	active,
	faded,
	instant,
	epoch,
	animate,
	className,
	onEnter,
	onLeave,
}: {
	slice: PieSlice;
	index: number;
	inner: number;
	outer: number;
	cornerRadius: number;
	hover: PieHover;
	hoverOffset: number;
	active: boolean;
	faded: boolean;
	instant: boolean;
	epoch: number;
	animate: boolean;
	className: string;
	onEnter: () => void;
	onLeave: () => void;
}) {
	const groupRef = useRef<SVGGElement>(null);
	const pathRef = useRef<SVGPathElement>(null);
	const progress = useRef(animate ? 0 : 1);
	const geometry = useRef({ inner, outer, slice, cornerRadius });
	geometry.current = { inner, outer, slice, cornerRadius };
	const radius = useRef(outer);

	const draw = useCallback(() => {
		const g = geometry.current;
		const s = g.slice;
		const end = s.startAngle + (s.endAngle - s.startAngle) * progress.current;
		pathRef.current?.setAttribute(
			"d",
			arcPath(g.inner, radius.current, s.startAngle, end, g.cornerRadius, s.padAngle),
		);
	}, []);

	const springs = useRef<{ grow: Spring; shift: Spring } | null>(null);
	if (!springs.current) {
		springs.current = {
			grow: new Spring(outer, POP_SPRING, (v) => {
				radius.current = v;
				draw();
			}),
			shift: new Spring(0, POP_SPRING, (v) => {
				const s = geometry.current.slice;
				const at = bisector(s.startAngle, s.endAngle, v);
				if (groupRef.current)
					groupRef.current.style.transform = `translate(${at.x}px, ${at.y}px)`;
			}),
		};
	}

	useLayoutEffect(() => {
		const { grow, shift } = springs.current ?? {};
		if (!grow || !shift) return;
		const growTo = hover === "grow" && active ? outer + hoverOffset : outer;
		const shiftTo = hover === "translate" && active ? hoverOffset : 0;
		if (instant) {
			grow.jump(growTo);
			shift.jump(shiftTo);
		} else {
			grow.set(growTo);
			shift.set(shiftTo);
		}
	}, [active, hover, hoverOffset, outer, instant]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: inner, outer, slice and more.
	useLayoutEffect(() => {
		draw();
	}, [inner, outer, slice, cornerRadius, draw]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: epoch is a content key, so equal data does not re-run.
	useLayoutEffect(() => {
		let playback: Playback | null = null;
		if (!animate) {
			progress.current = 1;
			draw();
			return;
		}
		progress.current = 0;
		draw();
		playback = tween({
			duration: CHART_DURATION.enter,
			delay: sliceDelay(index),
			onUpdate: (p) => {
				progress.current = p;
				draw();
			},
		});
		return () => playback?.stop();
	}, [epoch, animate, index, draw]);

	useLayoutEffect(
		() => () => {
			springs.current?.grow.stop();
			springs.current?.shift.stop();
		},
		[],
	);

	return (
		<g
			ref={groupRef}
			data-slot="pie-slice"
			data-key={slice.key}
			data-active={active ? "" : undefined}
			className={cn(className)}
			style={{
				opacity: faded ? 0.4 : 1,
				filter: active ? `drop-shadow(0 0 12px ${slice.color})` : undefined,
			}}
			onPointerEnter={onEnter}
			onPointerLeave={(event) => {
				const next = event.relatedTarget;
				if (!(next instanceof Element && next.closest("[data-slot=pie-slice]")))
					onLeave();
			}}
		>
			<path ref={pathRef} fill={slice.color} />
		</g>
	);
}
