"use client";

import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { useChart } from "../../chart/react/chart";
import type { ActivePoint, Datum } from "../../chart/react/core";
import { ActivePointProvider, ChartFrame } from "../../chart/react/frame";
import { CHART_DURATION, type Playback, Spring, tween } from "../../chart/react/motion";
import { useActiveIndex } from "../../chart/react/time-series";
import { ChartTooltipContent, ChartTooltipPanel } from "../../chart/react/tooltip";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import {
	EXPAND_FROM,
	expandDelay,
	POP_SPRING,
	RING_END,
	RING_START,
	type RingLayout,
	type RingRow,
	ringLayout,
	ringPath,
	ringRows,
	sweepDelay,
} from "./geometry";
import { type RingCap, ringChart } from "./variants";

export interface RingChartProps {
	data: Datum[];
	/** Key holding each ring's value. */
	dataKey?: string;
	/** Key holding each ring's maximum; missing or non-positive maxima count as 100. */
	maxKey?: string;
	/** Key holding each ring's name; matches `config` keys for labels, colours and the legend. */
	nameKey?: string;
	cap?: RingCap;
	/** Unfilled remainder of each ring, drawn in the border colour. */
	track?: boolean;
	strokeWidth?: number;
	gap?: number;
	/** Radius of the innermost ring before the chart scales to fit. */
	baseInnerRadius?: number;
	/** Centre caption when no ring is active. */
	centerLabel?: string;
	/** Screen-reader table headers: name, value, maximum, progress. */
	tableHeaders?: [string, string, string, string];
	animate?: boolean;
	activeIndex?: number | null;
	defaultActiveIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	roleDescription?: string;
	className?: string;
}

export function RingChart({
	data,
	dataKey = "value",
	maxKey = "max",
	nameKey = "name",
	cap = "round",
	track = true,
	strokeWidth = 12,
	gap = 6,
	baseInnerRadius = 60,
	centerLabel = "Total",
	tableHeaders = ["Name", "Value", "Maximum", "Progress"],
	animate = true,
	activeIndex: activeIndexProp,
	defaultActiveIndex = null,
	onActiveIndexChange,
	roleDescription = "ring chart",
	className,
}: RingChartProps) {
	const { config, hidden, format, description } = useChart();
	const rows = useMemo(
		() =>
			ringRows(data, dataKey, maxKey, nameKey, config).filter(
				(row) => !hidden.has(row.key),
			),
		[data, dataKey, maxKey, nameKey, config, hidden],
	);
	const progress = useCallback(
		(row: RingRow) => format.percent(row.value / row.max),
		[format],
	);
	const { activeIndex, instant, setActive } = useActiveIndex(
		activeIndexProp,
		defaultActiveIndex,
		onActiveIndexChange,
	);
	const active = activeIndex !== null ? rows[activeIndex] : undefined;

	return (
		<ChartFrame
			roleDescription={roleDescription}
			summary={
				description ??
				(rows.length
					? `${rows.length} rings. ${rows.map((r) => `${r.label} ${progress(r)}`).join(", ")}.`
					: "No data.")
			}
			table={{
				columns: tableHeaders,
				rows: rows.map((r) => ({
					header: r.label,
					cells: [format.number(r.value), format.number(r.max), progress(r)],
				})),
			}}
			count={rows.length}
			activeIndex={activeIndex}
			onActiveChange={setActive}
			interactive={rows.length > 0}
			announcement={
				active && instant
					? `${active.label}: ${format.number(active.value)} of ${format.number(active.max)}, ${progress(active)}`
					: ""
			}
			className={className}
		>
			{(frame) => (
				<RingPlot
					frame={frame}
					rows={rows}
					progress={progress}
					cap={cap}
					track={track}
					strokeWidth={strokeWidth}
					gap={gap}
					baseInnerRadius={baseInnerRadius}
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

function RingPlot({
	frame,
	rows,
	progress,
	cap,
	track,
	strokeWidth,
	gap,
	baseInnerRadius,
	centerLabel,
	animate,
	activeIndex,
	instant,
	setActive,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	rows: RingRow[];
	progress: (row: RingRow) => string;
	cap: RingCap;
	track: boolean;
	strokeWidth: number;
	gap: number;
	baseInnerRadius: number;
	centerLabel: string;
	animate: boolean;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
}) {
	const { format } = useChart();
	const styles = ringChart({ cap, track });
	const size = Math.min(frame.width, frame.height);
	const { rings, scale } = ringLayout(
		rows.length,
		size,
		strokeWidth,
		gap,
		baseInnerRadius,
	);
	const cx = frame.width / 2;
	const cy = frame.height / 2;
	const signature = rows.map((r) => `${r.key}:${r.value}:${r.max}`).join("|");
	const total = rows.reduce((sum, r) => sum + r.value, 0);
	const activeRow = activeIndex !== null ? rows[activeIndex] : undefined;
	const counterFormat = useCallback(
		(v: number) => format.number(Math.round(v)),
		[format],
	);

	const activePoint = useMemo<ActivePoint | null>(() => {
		const ring = activeIndex !== null ? rings[activeIndex] : undefined;
		if (!activeRow || !ring || activeIndex === null) return null;
		const end =
			RING_START + (RING_END - RING_START) * Math.min(1, activeRow.value / activeRow.max);
		const angle = (RING_START + end) / 2;
		const r = (ring.inner + ring.outer) / 2;
		return {
			index: activeIndex,
			datum: { key: activeRow.key, label: activeRow.label, value: activeRow.value },
			x: cx + Math.sin(angle) * r,
			y: { value: cy - Math.cos(angle) * r },
		};
	}, [activeRow, activeIndex, rings, cx, cy]);
	const activeValue = useMemo(
		() => ({
			active: activePoint,
			instant,
			title: (datum: Datum) => String(datum.label ?? ""),
			rows: (datum: Datum) => {
				const row = rows.find((r) => r.key === datum.key);
				return row
					? [{ key: row.key, label: progress(row), color: row.color, value: row.value }]
					: [];
			},
		}),
		[activePoint, instant, rows, progress],
	);
	const centerRadius = (rings[0]?.inner ?? 0) - 8 * scale;

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
					{rows.map((row, index) => {
						const ring = rings[index];
						if (!ring) return null;
						return (
							<Ring
								key={row.key}
								row={row}
								index={index}
								ring={ring}
								round={cap === "round"}
								active={activeIndex === index}
								pushed={activeIndex !== null && activeIndex < index}
								faded={activeIndex !== null && activeIndex !== index}
								instant={instant}
								signature={signature}
								animate={animate}
								className={styles.ring()}
								trackClass={styles.track()}
								onEnter={() => setActive(index, false)}
							/>
						);
					})}
				</g>
			</svg>
			{centerRadius > 20 ? (
				<div
					data-slot="ring-center"
					className={styles.center()}
					style={{
						left: cx - centerRadius,
						top: cy - centerRadius,
						width: centerRadius * 2,
						height: centerRadius * 2,
					}}
				>
					<RollingDigits
						variant="count"
						value={activeRow ? activeRow.value : total}
						format={counterFormat}
						durationMs={600}
						startOnView={false}
						size="sm"
						className="font-bold text-foreground"
					/>
					<span className={styles.caption()}>
						{activeRow ? activeRow.label : centerLabel}
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

function Ring({
	row,
	index,
	ring,
	round,
	active,
	pushed,
	faded,
	instant,
	signature,
	animate,
	className,
	trackClass,
	onEnter,
}: {
	row: RingRow;
	index: number;
	ring: RingLayout;
	round: boolean;
	active: boolean;
	pushed: boolean;
	faded: boolean;
	instant: boolean;
	signature: string;
	animate: boolean;
	className: string;
	trackClass: string;
	onEnter: () => void;
}) {
	const groupRef = useRef<SVGGElement>(null);
	const progressRef = useRef<SVGPathElement>(null);
	const expand = useRef(animate ? 0 : 1);
	const sweep = useRef(animate ? 0 : 1);
	const hoverScale = useRef(1);
	const geometry = useRef({ ring, row, round });
	geometry.current = { ring, row, round };

	const apply = useCallback(() => {
		const scale = (EXPAND_FROM + (1 - EXPAND_FROM) * expand.current) * hoverScale.current;
		if (groupRef.current) {
			groupRef.current.style.transform = `scale(${scale})`;
			groupRef.current.style.opacity = String(expand.current);
		}
		const { ring: r, row: d, round: isRound } = geometry.current;
		const end =
			RING_START + (RING_END - RING_START) * Math.min(1, d.value / d.max) * sweep.current;
		progressRef.current?.setAttribute(
			"d",
			ringPath(r.inner, r.outer, RING_START, end, isRound),
		);
	}, []);

	const spring = useRef<Spring | null>(null);
	if (!spring.current)
		spring.current = new Spring(1, POP_SPRING, (v) => {
			hoverScale.current = v;
			apply();
		});

	useLayoutEffect(() => {
		const target = active ? 1.03 : pushed ? 1.02 : 1;
		if (instant) spring.current?.jump(target);
		else spring.current?.set(target);
	}, [active, pushed, instant]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: ring, row, round.
	useLayoutEffect(() => {
		apply();
	}, [ring, row, round, apply]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: signature is a content key, so equal data does not re-run.
	useLayoutEffect(() => {
		if (!animate) {
			expand.current = 1;
			sweep.current = 1;
			apply();
			return;
		}
		expand.current = 0;
		sweep.current = 0;
		apply();
		const playbacks: Playback[] = [
			tween({
				duration: CHART_DURATION.enter,
				delay: expandDelay(index),
				onUpdate: (p) => {
					expand.current = p;
					apply();
				},
			}),
			tween({
				duration: CHART_DURATION.enter,
				delay: sweepDelay(index),
				onUpdate: (p) => {
					sweep.current = p;
					apply();
				},
			}),
		];
		return () => {
			for (const playback of playbacks) playback.stop();
		};
	}, [signature, animate, index, apply]);

	useLayoutEffect(() => () => spring.current?.stop(), []);

	return (
		<g
			data-slot="ring"
			data-key={row.key}
			data-active={active ? "" : undefined}
			className={className}
			style={{
				opacity: faded ? 0.35 : 1,
				filter: active ? `drop-shadow(0 0 12px ${row.color})` : undefined,
			}}
			onPointerEnter={onEnter}
		>
			<g ref={groupRef} style={{ transformOrigin: "0px 0px" }}>
				<path
					className={trackClass}
					d={ringPath(ring.inner, ring.outer, RING_START, RING_END, round)}
				/>
				<path ref={progressRef} fill={row.color} />
			</g>
		</g>
	);
}
