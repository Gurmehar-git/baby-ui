"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ActivePoint, ChartStatus, Datum } from "../../chart/core";
import { prefersReducedMotion, tween } from "../../chart/motion";
import { useChart } from "../../chart/react/chart";
import { ActivePointProvider, ChartFrame } from "../../chart/react/frame";
import { useActiveIndex } from "../../chart/react/time-series";
import { ChartTooltipContent, ChartTooltipPanel } from "../../chart/react/tooltip";
import { cn } from "../../lib/cn";
import {
	buildCalendar,
	enterDelay,
	HEATMAP_LEVELS,
	HEATMAP_MARGIN,
	HEATMAP_TIMING,
	type HeatmapCell,
	type HeatmapLevel,
	type HeatmapPhase,
	type HeatmapWeekStart,
	heatmapLevelKey,
	heatmapNext,
	LEVEL_PATTERN,
	localeWeekStart,
} from "../calendar";
import { runShimmer } from "../shimmer";
import {
	type HeatmapLegendAlign,
	type HeatmapShape,
	heatmapChart,
	levelFill,
	SHAPE_RADIUS,
} from "../variants";

export interface HeatmapChartProps {
	data: Datum[];
	dateKey?: string;
	valueKey?: string;
	/** Four cut points for levels 1 to 4; defaults to quarters of the max. */
	thresholds?: readonly number[];
	shape?: HeatmapShape;
	/** Pattern per level, so levels read without colour. */
	patterns?: boolean;
	weekStart?: HeatmapWeekStart;
	/** Gap between cells in pixels. */
	gap?: number;
	/** Locale for month, weekday and date labels; pass the same one as ChartContainer. */
	locale?: string;
	status?: ChartStatus;
	/** Tooltip row label; defaults to "Value". */
	valueLabel?: string;
	/** Replaces the tooltip row, e.g. `(v) => \`${v} commits\``. */
	formatLabel?: (value: number, date: Date) => string;
	animate?: boolean;
	activeIndex?: number | null;
	defaultActiveIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	roleDescription?: string;
	/** Screen-reader table headers: date, value. */
	tableHeaders?: [string, string];
	className?: string;
}

export { type HeatmapWeekStart, heatmapLevelKey };

export function HeatmapChart({
	data,
	dateKey = "date",
	valueKey = "value",
	thresholds,
	shape = "rounded",
	patterns = false,
	weekStart = "auto",
	gap = 3,
	locale,
	status = "ready",
	valueLabel = "Value",
	formatLabel,
	animate = true,
	activeIndex: activeIndexProp,
	defaultActiveIndex = null,
	onActiveIndexChange,
	roleDescription = "calendar heatmap",
	tableHeaders = ["Date", "Value"],
	className,
}: HeatmapChartProps) {
	const { format, description } = useChart();
	const firstDay =
		weekStart === "sunday" ? 0 : weekStart === "monday" ? 1 : localeWeekStart(locale);
	const calendar = useMemo(
		() => buildCalendar(data, { dateKey, valueKey, weekStart: firstDay, thresholds }),
		[data, dateKey, valueKey, firstDay, thresholds],
	);
	const dateFormat = useMemo(
		() => new Intl.DateTimeFormat(locale, { dateStyle: "full" }),
		[locale],
	);
	const { activeIndex, instant, setActive } = useActiveIndex(
		activeIndexProp,
		defaultActiveIndex,
		onActiveIndexChange,
	);
	const [phase, setPhase] = useState<HeatmapPhase>(() =>
		status === "loading" ? "loading" : animate ? "revealing" : "ready",
	);
	const prevStatus = useRef(status);
	useEffect(() => {
		if (prevStatus.current === status) return;
		prevStatus.current = status;
		setPhase((p) =>
			heatmapNext(p, status === "ready" ? "status-ready" : "status-loading"),
		);
	}, [status]);
	const interactive = phase === "ready" && calendar.cells.length > 0;
	const active =
		interactive && activeIndex !== null ? calendar.cells[activeIndex] : undefined;
	const rowFor = (cell: HeatmapCell) =>
		formatLabel
			? { label: formatLabel(cell.value, cell.date), value: null }
			: { label: valueLabel, value: cell.value };
	const spoken = (cell: HeatmapCell) => {
		const row = rowFor(cell);
		return row.value === null ? row.label : `${row.label} ${format.number(row.value)}`;
	};
	const peak = calendar.cells.reduce<HeatmapCell | undefined>(
		(best, c) => (!best || c.value > best.value ? c : best),
		undefined,
	);
	const total = calendar.cells.reduce((sum, c) => sum + c.value, 0);

	return (
		<ChartFrame
			roleDescription={roleDescription}
			summary={
				description ??
				(peak
					? `${calendar.cells.length} days from ${dateFormat.format(calendar.cells[0]?.date ?? peak.date)} to ${dateFormat.format(calendar.cells.at(-1)?.date ?? peak.date)}, total ${format.number(total)}. Highest: ${dateFormat.format(peak.date)}, ${format.number(peak.value)}.`
					: "No data.")
			}
			table={{
				columns: tableHeaders,
				rows: calendar.cells.map((c) => ({
					header: dateFormat.format(c.date),
					cells: [format.number(c.value)],
				})),
			}}
			count={calendar.cells.length}
			activeIndex={activeIndex}
			onActiveChange={setActive}
			interactive={interactive}
			announcement={
				active && instant ? `${dateFormat.format(active.date)}: ${spoken(active)}` : ""
			}
			className={className}
		>
			{(frame) => (
				<HeatmapPlot
					frame={frame}
					cells={calendar.cells}
					weeks={calendar.weeks}
					months={calendar.months}
					weekdays={calendar.weekdays}
					shape={shape}
					patterns={patterns}
					gap={gap}
					locale={locale}
					phase={phase}
					onPhaseDone={() => setPhase((p) => heatmapNext(p, "done"))}
					animate={animate}
					activeIndex={interactive ? activeIndex : null}
					instant={instant}
					setActive={setActive}
					title={(cell) => dateFormat.format(cell.date)}
					rowFor={rowFor}
				/>
			)}
		</ChartFrame>
	);
}

function HeatmapPlot({
	frame,
	cells,
	weeks,
	months,
	weekdays,
	shape,
	patterns,
	gap,
	locale,
	phase,
	onPhaseDone,
	animate,
	activeIndex,
	instant,
	setActive,
	title,
	rowFor,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	cells: HeatmapCell[];
	weeks: number;
	months: { col: number; date: Date }[];
	weekdays: Date[];
	shape: HeatmapShape;
	patterns: boolean;
	gap: number;
	locale?: string;
	phase: HeatmapPhase;
	onPhaseDone: () => void;
	animate: boolean;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
	title: (cell: HeatmapCell) => string;
	rowFor: (cell: HeatmapCell) => { label: string; value: number | null };
}) {
	const chart = useChart();
	const styles = heatmapChart({ shape });
	const uid = useId().replace(/:/g, "");
	const innerWidth = Math.max(
		0,
		frame.width - HEATMAP_MARGIN.left - HEATMAP_MARGIN.right,
	);
	const innerHeight = Math.max(
		0,
		frame.height - HEATMAP_MARGIN.top - HEATMAP_MARGIN.bottom,
	);
	const size =
		weeks === 0
			? 0
			: Math.max(
					2,
					Math.min(
						(innerWidth - (weeks - 1) * gap) / Math.max(weeks, 1),
						(innerHeight - 6 * gap) / 7,
					),
				);
	const offsetX =
		HEATMAP_MARGIN.left +
		Math.max(0, (innerWidth - (weeks * size + (weeks - 1) * gap)) / 2);
	const at = (cell: HeatmapCell) => ({
		x: offsetX + cell.col * (size + gap),
		y: HEATMAP_MARGIN.top + cell.row * (size + gap),
	});
	const radius = size * SHAPE_RADIUS[shape];
	const monthFormat = useMemo(
		() => new Intl.DateTimeFormat(locale, { month: "short" }),
		[locale],
	);
	const weekdayFormat = useMemo(
		() => new Intl.DateTimeFormat(locale, { weekday: "short" }),
		[locale],
	);

	// Two frames at the hidden start so the CSS transitions have a first value to leave.
	const [epoch, setEpoch] = useState(0);
	const [entered, setEntered] = useState(phase !== "revealing");
	const onDone = useRef(onPhaseDone);
	onDone.current = onPhaseDone;
	useLayoutEffect(() => {
		if (phase !== "revealing" && phase !== "concealing") return;
		const reveal = phase === "revealing";
		const skip = !animate || prefersReducedMotion();
		if (reveal) {
			setEpoch((e) => e + 1);
			setEntered(skip);
		}
		let raf = 0;
		if (reveal && !skip)
			raf = requestAnimationFrame(() => {
				raf = requestAnimationFrame(() => setEntered(true));
			});
		const clock = tween({
			duration: skip ? 0 : reveal ? HEATMAP_TIMING.enter : HEATMAP_TIMING.conceal,
			ease: (t) => t,
			onUpdate: () => {},
			onComplete: () => onDone.current(),
		});
		return () => {
			cancelAnimationFrame(raf);
			clock.stop();
		};
	}, [phase, animate]);

	const overlayRefs = useRef<(SVGRectElement | null)[]>([]);
	useEffect(() => {
		if (phase !== "loading") return;
		return runShimmer(cells.length, (i, opacity) =>
			overlayRefs.current[i]?.setAttribute("opacity", String(opacity)),
		);
	}, [phase, cells.length]);

	// Left and right step a week; the frame already steps a day on up and down.
	const activeRef = useRef(activeIndex);
	activeRef.current = activeIndex;
	useEffect(() => {
		const el = frame.el;
		if (!el) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
			if (phase !== "ready" || cells.length === 0) return;
			event.preventDefault();
			event.stopPropagation();
			const current = activeRef.current;
			const step = event.key === "ArrowRight" ? 7 : -7;
			const next =
				current === null
					? step > 0
						? 0
						: cells.length - 1
					: Math.min(cells.length - 1, Math.max(0, current + step));
			setActive(next, true);
		};
		el.addEventListener("keydown", onKey, true);
		return () => el.removeEventListener("keydown", onKey, true);
	}, [frame.el, phase, cells.length, setActive]);

	const highlightedLevel = chart.highlighted?.startsWith("heatmap-level-")
		? Number(chart.highlighted.slice("heatmap-level-".length))
		: null;
	const activeCell = activeIndex !== null ? cells[activeIndex] : undefined;
	const lit = (cell: HeatmapCell) =>
		activeCell
			? cell.index === activeCell.index
			: highlightedLevel === null || cell.level === highlightedLevel;
	const dimming = activeCell !== undefined || highlightedLevel !== null;

	// biome-ignore lint/correctness/useExhaustiveDependencies: offsetX, gap only invalidate it on change; at left out on purpose, the listed values decide when it runs.
	const activePoint = useMemo<ActivePoint | null>(() => {
		if (!activeCell) return null;
		const p = at(activeCell);
		return {
			index: activeCell.index,
			datum: { index: activeCell.index },
			x: p.x + size / 2,
			y: { value: p.y + size / 2 },
		};
	}, [activeCell, size, offsetX, gap]);
	const activeValue = useMemo(
		() => ({
			active: activePoint,
			instant,
			title: (datum: Datum) => {
				const cell = cells[Number(datum.index)];
				return cell ? title(cell) : "";
			},
			rows: (datum: Datum) => {
				const cell = cells[Number(datum.index)];
				if (!cell) return [];
				return [{ key: "value", color: levelFill(cell.level), ...rowFor(cell) }];
			},
		}),
		[activePoint, instant, cells, title, rowFor],
	);

	const concealing = phase === "concealing";
	const loading = phase === "loading";
	const revealing = phase === "revealing";

	return (
		<ActivePointProvider value={activeValue}>
			<svg
				aria-hidden="true"
				width={frame.width}
				height={frame.height}
				className="absolute inset-0 block overflow-visible"
				onPointerLeave={() => activeIndex !== null && setActive(null, false)}
			>
				{patterns ? <PatternDefs uid={uid} size={size} /> : null}
				<g data-slot="heatmap-axis">
					{months.map((m) => (
						<text
							key={m.date.getTime()}
							x={offsetX + m.col * (size + gap)}
							y={HEATMAP_MARGIN.top - 7}
							className={styles.axis()}
						>
							{monthFormat.format(m.date)}
						</text>
					))}
					{weekdays.map((date, row) =>
						row % 2 === 1 ? (
							<text
								// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
								key={row}
								x={offsetX - 6}
								y={HEATMAP_MARGIN.top + row * (size + gap) + size / 2}
								dy="0.35em"
								textAnchor="end"
								className={styles.axis()}
							>
								{weekdayFormat.format(date)}
							</text>
						) : null,
					)}
				</g>
				<g data-slot="heatmap-cells">
					{cells.map((cell) => {
						const p = at(cell);
						const shown = !loading && !concealing && (!revealing || entered);
						const opacity = shown
							? dimming && !lit(cell)
								? HEATMAP_TIMING.faded
								: 1
							: 0;
						const transition = revealing
							? `opacity ${HEATMAP_TIMING.enter}ms ${HEATMAP_TIMING.enterEase} ${enterDelay(cell.col, cell.row, epoch)}ms`
							: concealing
								? `opacity ${HEATMAP_TIMING.conceal}ms ${HEATMAP_TIMING.enterEase}`
								: `opacity ${HEATMAP_TIMING.hover}ms ${HEATMAP_TIMING.hoverEase}`;
						const pattern = LEVEL_PATTERN[cell.level];
						return (
							<g
								key={cell.index}
								data-slot="heatmap-cell"
								data-level={cell.level}
								style={{
									opacity,
									transition: revealing && !entered ? "none" : transition,
								}}
								onPointerEnter={() => setActive(cell.index, false)}
							>
								<rect
									x={p.x}
									y={p.y}
									width={size}
									height={size}
									rx={radius}
									fill={levelFill(cell.level)}
									className={styles.cell()}
								/>
								{patterns && pattern !== "none" && pattern !== "solid" ? (
									<rect
										x={p.x}
										y={p.y}
										width={size}
										height={size}
										rx={radius}
										fill={`url(#${uid}-${pattern})`}
										pointerEvents="none"
									/>
								) : null}
							</g>
						);
					})}
				</g>
				{loading ? (
					<g data-slot="heatmap-loading">
						{cells.map((cell, i) => {
							const p = at(cell);
							return (
								<rect
									key={cell.index}
									ref={(node) => {
										overlayRefs.current[i] = node;
									}}
									x={p.x}
									y={p.y}
									width={size}
									height={size}
									rx={radius}
									opacity={0}
									className={styles.overlay()}
								/>
							);
						})}
					</g>
				) : null}
				{activeCell ? (
					<rect
						data-slot="heatmap-active"
						x={at(activeCell).x - 1.5}
						y={at(activeCell).y - 1.5}
						width={size + 3}
						height={size + 3}
						rx={radius + 1.5}
						strokeWidth={1.5}
						className={styles.active()}
					/>
				) : null}
			</svg>
			{frame.el ? (
				<ChartTooltipPanel
					anchor={activePoint ? { x: activePoint.x, y: activePoint.y.value ?? 0 } : null}
					instant={instant}
					bounds={frame}
				>
					<ChartTooltipContent />
				</ChartTooltipPanel>
			) : null}
		</ActivePointProvider>
	);
}

function PatternDefs({ uid, size }: { uid: string; size: number }) {
	const tile = Math.max(3, Math.round(size / 3));
	const stroke = "color-mix(in oklch, var(--background) 60%, transparent)";
	return (
		<defs>
			<pattern
				id={`${uid}-dots`}
				width={tile}
				height={tile}
				patternUnits="userSpaceOnUse"
			>
				<circle cx={tile / 2} cy={tile / 2} r={Math.max(0.6, tile / 6)} fill={stroke} />
			</pattern>
			<pattern
				id={`${uid}-lines`}
				width={tile}
				height={tile}
				patternUnits="userSpaceOnUse"
			>
				<path d={`M0 ${tile} ${tile} 0`} stroke={stroke} strokeWidth={1} />
			</pattern>
			<pattern
				id={`${uid}-cross`}
				width={tile}
				height={tile}
				patternUnits="userSpaceOnUse"
			>
				<path
					d={`M0 ${tile} ${tile} 0M0 0 ${tile} ${tile}`}
					stroke={stroke}
					strokeWidth={1}
				/>
			</pattern>
		</defs>
	);
}

export interface HeatmapLegendProps {
	/** Caption before the lowest level. */
	lessLabel?: string;
	/** Caption after the highest level. */
	moreLabel?: string;
	align?: HeatmapLegendAlign;
	shape?: HeatmapShape;
	patterns?: boolean;
	/** Accessible name of each level swatch. */
	levelLabel?: (level: number) => string;
	className?: string;
}

/** Hovering or focusing a level dims every cell outside it. */
export function HeatmapLegend({
	lessLabel = "Less",
	moreLabel = "More",
	align = "end",
	shape = "rounded",
	patterns = false,
	levelLabel = (level) => `Level ${level + 1} of 5`,
	className,
}: HeatmapLegendProps) {
	const chart = useChart();
	const styles = heatmapChart({ shape, align });
	const uid = useId().replace(/:/g, "");
	const current = chart.highlighted;
	const [pinned, setPinned] = useState<string | null>(null);
	const preview = (key: string | null) => chart.setHighlighted(key ?? pinned);
	return (
		<div data-slot="heatmap-legend" className={cn(styles.legend(), className)}>
			<span>{lessLabel}</span>
			<svg width={0} height={0} aria-hidden="true" className="absolute">
				{patterns ? <PatternDefs uid={uid} size={12} /> : null}
			</svg>
			{HEATMAP_LEVELS.map((level: HeatmapLevel) => {
				const key = heatmapLevelKey(level);
				const pattern = LEVEL_PATTERN[level];
				const dim = current?.startsWith("heatmap-level-") && current !== key;
				return (
					<button
						key={level}
						type="button"
						aria-label={levelLabel(level)}
						aria-pressed={pinned === key}
						data-level={level}
						className={styles.swatch()}
						style={{ opacity: dim ? HEATMAP_TIMING.faded : 1 }}
						onClick={() => {
							const next = pinned === key ? null : key;
							setPinned(next);
							chart.setHighlighted(next ?? key);
						}}
						onPointerEnter={() => preview(key)}
						onPointerLeave={() => preview(null)}
						onFocus={() => preview(key)}
						onBlur={() => preview(null)}
					>
						<svg
							viewBox="0 0 12 12"
							className="size-full overflow-visible"
							aria-hidden="true"
						>
							<rect
								width={12}
								height={12}
								rx={12 * SHAPE_RADIUS[shape]}
								fill={levelFill(level)}
							/>
							{patterns && pattern !== "none" && pattern !== "solid" ? (
								<rect
									width={12}
									height={12}
									rx={12 * SHAPE_RADIUS[shape]}
									fill={`url(#${uid}-${pattern})`}
								/>
							) : null}
						</svg>
					</button>
				);
			})}
			<span>{moreLabel}</span>
		</div>
	);
}
