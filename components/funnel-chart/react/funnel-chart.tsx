"use client";

import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useChart } from "../../chart/react/chart";
import type { ActivePoint, Datum } from "../../chart/react/core";
import { ActivePointProvider, ChartFrame } from "../../chart/react/frame";
import {
	CHART_DURATION,
	CHART_EASE,
	EASE_OUT,
	Spring,
	tween,
} from "../../chart/react/motion";
import { useActiveIndex } from "../../chart/react/time-series";
import { ChartTooltipContent, ChartTooltipPanel } from "../../chart/react/tooltip";
import { cn } from "../../lib/react/cn";
import {
	type FunnelCell,
	type FunnelRing,
	type FunnelStage,
	funnelCells,
	LABEL_DELAY,
	LABEL_FADE,
	STAGE_STAGGER,
	stageColor,
} from "./geometry";
import {
	FUNNEL_PATTERN_TILE,
	type FunnelEdges,
	type FunnelLabelLayout,
	type FunnelOrientation,
	type FunnelPattern,
	funnelChart,
	funnelEdges,
} from "./variants";

export type { FunnelStage };

export interface FunnelChartProps {
	data: FunnelStage[];
	orientation?: FunnelOrientation;
	edges?: FunnelEdges;
	labelLayout?: FunnelLabelLayout;
	/** Texture over each stage's innermost ring, a non-colour cue. */
	pattern?: FunnelPattern;
	/** Halo rings per stage; the innermost is the stage's solid colour. */
	layers?: number;
	/** Pixels between stages. */
	gap?: number;
	/** Alternate background bands and rules between stages. */
	grid?: boolean;
	showValues?: boolean;
	showPercentage?: boolean;
	showLabels?: boolean;
	animate?: boolean;
	activeIndex?: number | null;
	defaultActiveIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	/** Screen-reader table headers: stage, value, share of first, share of previous. */
	tableHeaders?: [string, string, string, string];
	roleDescription?: string;
	className?: string;
}

export function FunnelChart({
	data,
	orientation = "horizontal",
	edges = "curved",
	labelLayout = "spread",
	pattern = "none",
	layers = 3,
	gap = 4,
	grid = false,
	showValues = true,
	showPercentage = true,
	showLabels = true,
	animate = true,
	activeIndex: activeIndexProp,
	defaultActiveIndex = null,
	onActiveIndexChange,
	tableHeaders = ["Stage", "Value", "Of first", "Of previous"],
	roleDescription = "funnel chart",
	className,
}: FunnelChartProps) {
	const { format, description } = useChart();
	const { activeIndex, instant, setActive } = useActiveIndex(
		activeIndexProp,
		defaultActiveIndex,
		onActiveIndexChange,
	);
	const first = data[0]?.value ?? 0;
	const last = data.at(-1);
	const value = (stage: FunnelStage) => stage.displayValue ?? format.number(stage.value);
	const ratio = (v: number, of: number) => format.percent(of > 0 ? v / of : 0);
	const active = activeIndex !== null ? data[activeIndex] : undefined;

	return (
		<ChartFrame
			roleDescription={roleDescription}
			summary={
				description ??
				(last && data[0]
					? `${data.length} stages from ${data[0].label}, ${value(data[0])}, to ${last.label}, ${value(last)}: ${ratio(last.value, first)} carried through.`
					: "No data.")
			}
			table={{
				columns: tableHeaders,
				rows: data.map((stage, index) => ({
					header: stage.label,
					cells: [
						value(stage),
						ratio(stage.value, first),
						ratio(stage.value, data[index - 1]?.value ?? stage.value),
					],
				})),
			}}
			count={data.length}
			activeIndex={activeIndex}
			onActiveChange={setActive}
			interactive={data.length > 0}
			announcement={
				active && instant
					? `${active.label}: ${value(active)}, ${ratio(active.value, first)} of ${data[0]?.label ?? ""}`
					: ""
			}
			className={className}
		>
			{(frame) => (
				<FunnelPlot
					frame={frame}
					data={data}
					orientation={orientation}
					edges={edges}
					labelLayout={labelLayout}
					pattern={pattern}
					layers={layers}
					gap={gap}
					grid={grid}
					showValues={showValues}
					showPercentage={showPercentage}
					showLabels={showLabels}
					animate={animate}
					activeIndex={activeIndex}
					instant={instant}
					setActive={setActive}
				/>
			)}
		</ChartFrame>
	);
}

function FunnelPlot({
	frame,
	data,
	orientation,
	edges,
	labelLayout,
	pattern,
	layers,
	gap,
	grid,
	showValues,
	showPercentage,
	showLabels,
	animate,
	activeIndex,
	instant,
	setActive,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	data: FunnelStage[];
	orientation: FunnelOrientation;
	edges: FunnelEdges;
	labelLayout: FunnelLabelLayout;
	pattern: FunnelPattern;
	layers: number;
	gap: number;
	grid: boolean;
	showValues: boolean;
	showPercentage: boolean;
	showLabels: boolean;
	animate: boolean;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
}) {
	const { format } = useChart();
	const vertical = orientation === "vertical";
	const along = vertical ? frame.height : frame.width;
	const across = vertical ? frame.width : frame.height;
	const cells = useMemo(
		() =>
			funnelCells(
				data,
				along,
				across,
				gap,
				Math.max(1, layers),
				edges === "straight",
				vertical,
			),
		[data, along, across, gap, layers, edges, vertical],
	);
	const styles = funnelChart({ orientation, labelLayout, pattern });
	const uid = useId().replace(/:/g, "");

	const n = data.length;
	const enterTotal = (n - 1) * STAGE_STAGGER + LABEL_DELAY + CHART_DURATION.enter;
	const signature = data.map((s) => `${s.label}:${s.value}`).join("|");
	const [elapsed, setElapsed] = useState(animate ? 0 : Number.POSITIVE_INFINITY);
	// biome-ignore lint/correctness/useExhaustiveDependencies: signature is a content key, so equal data does not re-run; enterTotal left out on purpose, the listed values decide when it runs.
	useLayoutEffect(() => {
		if (!animate) {
			setElapsed(Number.POSITIVE_INFINITY);
			return;
		}
		setElapsed(0);
		const playback = tween({
			duration: enterTotal,
			ease: (t) => t,
			onUpdate: (p) => setElapsed(p * enterTotal),
		});
		return () => playback.stop();
		// Only a change to what is drawn replays the enter.
	}, [signature, animate]);

	const first = data[0]?.value ?? 0;
	const cellRect = (cell: FunnelCell) =>
		vertical
			? { x: 0, y: cell.offset, width: frame.width, height: cell.size }
			: { x: cell.offset, y: 0, width: cell.size, height: frame.height };
	const activeCell = activeIndex !== null ? cells[activeIndex] : undefined;
	// biome-ignore lint/correctness/useExhaustiveDependencies: frame.width only invalidate it on change; cellRect left out on purpose, the listed values decide when it runs.
	const activePoint = useMemo<ActivePoint | null>(() => {
		if (!activeCell || activeIndex === null) return null;
		const r = cellRect(activeCell);
		return {
			index: activeIndex,
			datum: { ...activeCell.stage, index: activeIndex },
			x: r.x + r.width / 2,
			y: { value: vertical ? r.y + r.height / 2 : frame.height * 0.2 },
		};
	}, [activeCell, activeIndex, vertical, frame.width, frame.height]);
	const activeValue = useMemo(
		() => ({
			active: activePoint,
			instant,
			title: (datum: Datum) => String(datum.label ?? ""),
			rows: (datum: Datum) => [
				{
					key: String(datum.label ?? ""),
					label: format.percent(first > 0 ? Number(datum.value) / first : 0),
					color: stageColor(Number(datum.index), n, datum as unknown as FunnelStage),
					value: Number(datum.value),
				},
			],
		}),
		[activePoint, instant, format, first, n],
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
				{grid
					? cells.map((cell) =>
							cell.index % 2 === 0 ? (
								<rect
									key={`band-${cell.index}`}
									{...cellRect(cell)}
									className={styles.band()}
								/>
							) : null,
						)
					: null}
				{cells.map((cell) => {
					const r = cellRect(cell);
					const p = CHART_EASE(
						Math.min(
							1,
							Math.max(0, (elapsed - cell.index * STAGE_STAGGER) / CHART_DURATION.enter),
						),
					);
					const scale = 0.9 + 0.1 * p;
					return (
						<g
							key={cell.stage.label}
							data-slot="funnel-stage"
							data-active={activeIndex === cell.index ? "" : undefined}
							className={styles.cell()}
							style={{
								opacity: activeIndex !== null && activeIndex !== cell.index ? 0.4 : 1,
							}}
							onPointerEnter={() => setActive(cell.index, false)}
						>
							<rect {...r} fill="transparent" />
							<g
								transform={`translate(${r.x} ${r.y})`}
								style={{
									opacity: p,
									transform:
										p < 1 ? `translate(${r.x}px, ${r.y}px) scale(${scale})` : undefined,
									transformOrigin: vertical
										? `${frame.width / 2}px 0`
										: `0 ${frame.height / 2}px`,
								}}
							>
								{pattern !== "none" ? (
									<defs>
										<pattern
											id={`${uid}-pattern-${cell.index}`}
											width={8}
											height={8}
											patternUnits="userSpaceOnUse"
										>
											<rect
												width={8}
												height={8}
												fill={stageColor(cell.index, n, cell.stage)}
											/>
											<path d={FUNNEL_PATTERN_TILE[pattern]} className={styles.mark()} />
										</pattern>
									</defs>
								) : null}
								{cell.rings.map((ring, i) => (
									<Ring
										// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
										key={i}
										ring={ring}
										color={
											pattern !== "none" && i === cell.rings.length - 1
												? `url(#${uid}-pattern-${cell.index})`
												: stageColor(cell.index, n, cell.stage)
										}
										active={activeIndex === cell.index}
										instant={instant}
										vertical={vertical}
										className={cn(styles.ring(), funnelEdges({ edges }))}
									/>
								))}
							</g>
						</g>
					);
				})}
				{grid
					? cells.slice(1).map((cell) => {
							const at = cell.offset - gap / 2;
							return vertical ? (
								<line
									key={`rule-${cell.index}`}
									x1={0}
									x2={frame.width}
									y1={at}
									y2={at}
									className={styles.rule()}
								/>
							) : (
								<line
									key={`rule-${cell.index}`}
									x1={at}
									x2={at}
									y1={0}
									y2={frame.height}
									className={styles.rule()}
								/>
							);
						})
					: null}
			</svg>
			{cells.map((cell) => {
				const r = cellRect(cell);
				const labelDelay = cell.index * STAGE_STAGGER + LABEL_DELAY;
				const opacity = EASE_OUT(
					Math.min(1, Math.max(0, (elapsed - labelDelay) / LABEL_FADE)),
				);
				return (
					<div
						key={cell.stage.label}
						data-slot="funnel-label"
						className={styles.labels()}
						style={{
							left: r.x,
							top: r.y,
							width: r.width,
							height: r.height,
							opacity:
								opacity * (activeIndex !== null && activeIndex !== cell.index ? 0.4 : 1),
						}}
					>
						{showValues ? (
							<span className={styles.value()}>
								{cell.stage.displayValue ?? format.number(cell.stage.value)}
							</span>
						) : null}
						{showPercentage ? (
							<span className={styles.percent()}>{format.percent(cell.ratio)}</span>
						) : null}
						{showLabels ? (
							<span className={styles.name()} title={cell.stage.label}>
								{cell.stage.label}
							</span>
						) : null}
					</div>
				);
			})}
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

function Ring({
	ring,
	color,
	active,
	instant,
	vertical,
	className,
}: {
	ring: FunnelRing;
	color: string;
	active: boolean;
	instant: boolean;
	vertical: boolean;
	className: string;
}) {
	const ref = useRef<SVGPathElement>(null);
	const axis = useRef(vertical);
	axis.current = vertical;
	const spring = useRef<Spring | null>(null);
	if (!spring.current) {
		spring.current = new Spring(1, ring.spring, (v) => {
			if (ref.current)
				ref.current.style.transform = axis.current ? `scaleX(${v})` : `scaleY(${v})`;
		});
	}
	useLayoutEffect(() => {
		const s = spring.current;
		if (!s) return;
		s.configure(ring.spring);
		const to = active ? ring.hoverScale : 1;
		if (instant) s.jump(to);
		else s.set(to);
	}, [active, instant, ring.hoverScale, ring.spring]);
	useLayoutEffect(() => () => spring.current?.stop(), []);
	return (
		<path
			ref={ref}
			d={ring.d}
			fill={color}
			opacity={ring.opacity}
			className={className}
		/>
	);
}
