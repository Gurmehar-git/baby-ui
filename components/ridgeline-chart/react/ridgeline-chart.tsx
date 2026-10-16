"use client";

import { type CSSProperties, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useChart } from "../../chart/react/chart";
import type { ActivePoint, Datum } from "../../chart/react/core";
import { ActivePointProvider, ChartFrame } from "../../chart/react/frame";
import { CHART_DURATION, tween } from "../../chart/react/motion";
import { useActiveIndex } from "../../chart/react/time-series";
import { ChartTooltipContent, ChartTooltipPanel } from "../../chart/react/tooltip";
import {
	blendModel,
	medianTint,
	type RidgelineSeries,
	type RidgeModel,
	ridgeHeight,
	ridgeModel,
	ridgePath,
} from "./density";
import { type RidgelineVariant, ridgelineChart } from "./variants";

export type { RidgelineSeries, RidgelineVariant };

export interface RidgelineChartProps {
	/** One ridge per series, drawn top to bottom. */
	series: RidgelineSeries[];
	/** Value range of the axis; defaults to the data with a little room. */
	domain?: [number, number];
	/** Kernel width in value units; defaults to Silverman's rule per series. */
	bandwidth?: number;
	/** How far a ridge may rise into the rows above, in row heights. */
	overlap?: number;
	/** Unit after each value, such as "°C". */
	unit?: string;
	/** `tint` shades ridges by median; `series` uses each id's config colour. */
	variant?: RidgelineVariant;
	/** Screen-reader table headers: series, median, middle half, count. */
	tableHeaders?: [string, string, string, string];
	animate?: boolean;
	activeIndex?: number | null;
	defaultActiveIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	roleDescription?: string;
	className?: string;
}

const AXIS = 24;
const GUTTER = 88;

/** Compares the shape of many distributions at once, each a smoothed density on one shared axis. */
export function RidgelineChart({
	series,
	domain,
	bandwidth,
	overlap = 2.4,
	unit = "",
	variant = "tint",
	tableHeaders = ["Series", "Median", "Middle half", "Count"],
	animate = true,
	activeIndex: activeIndexProp,
	defaultActiveIndex = null,
	onActiveIndexChange,
	roleDescription = "ridgeline chart",
	className,
}: RidgelineChartProps) {
	const { format, description } = useChart();
	const model = useMemo(
		() => ridgeModel(series, domain, bandwidth),
		[series, domain, bandwidth],
	);
	const value = (v: number) => `${format.number(v)}${unit}`;
	const { activeIndex, instant, setActive } = useActiveIndex(
		activeIndexProp,
		defaultActiveIndex,
		onActiveIndexChange,
	);
	const active = activeIndex !== null ? model.shapes[activeIndex] : undefined;
	const describe = (index: number) => {
		const shape = model.shapes[index];
		if (!shape) return "";
		const { stats } = shape;
		return `${shape.label}: median ${value(stats.median)}, middle half ${value(stats.q1)} to ${value(stats.q3)}, ${stats.n} values`;
	};

	return (
		<ChartFrame
			roleDescription={roleDescription}
			summary={
				description ??
				(model.shapes.length
					? model.shapes.map((_, index) => describe(index)).join(". ")
					: "No data.")
			}
			table={{
				columns: tableHeaders,
				rows: model.shapes.map((shape) => ({
					header: shape.label,
					cells: [
						value(shape.stats.median),
						`${value(shape.stats.q1)} to ${value(shape.stats.q3)}`,
						String(shape.stats.n),
					],
				})),
			}}
			count={model.shapes.length}
			activeIndex={activeIndex}
			onActiveChange={setActive}
			interactive={model.shapes.length > 0}
			announcement={
				active && instant && activeIndex !== null ? describe(activeIndex) : ""
			}
			className={className}
		>
			{(frame) => (
				<RidgelinePlot
					frame={frame}
					model={model}
					overlap={overlap}
					value={value}
					variant={variant}
					animate={animate}
					activeIndex={activeIndex}
					instant={instant}
					setActive={setActive}
				/>
			)}
		</ChartFrame>
	);
}

function RidgelinePlot({
	frame,
	model,
	overlap,
	value,
	variant,
	animate,
	activeIndex,
	instant,
	setActive,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	model: RidgeModel;
	overlap: number;
	value: (v: number) => string;
	variant: RidgelineVariant;
	animate: boolean;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
}) {
	const { config } = useChart();
	const [drawn, setDrawn] = useState(!animate);
	const [shown, setShown] = useState<RidgeModel>(model);
	const previous = useRef<RidgeModel | null>(null);
	useLayoutEffect(() => {
		if (!animate) return setDrawn(true);
		const id = requestAnimationFrame(() => setDrawn(true));
		return () => cancelAnimationFrame(id);
	}, [animate]);
	useLayoutEffect(() => {
		const from = previous.current;
		previous.current = model;
		if (!from) return setShown(model);
		const playback = tween({
			duration: CHART_DURATION.update * 1.4,
			onUpdate: (t) => setShown(blendModel(from, model, t)),
		});
		return () => playback.stop();
	}, [model]);
	const [cursor, setCursor] = useState<number | null>(null);
	const rows = Math.max(1, model.shapes.length);
	const rowHeight = Math.max(8, (frame.height - 14 - AXIS) / (rows + overlap - 1));
	const top = (overlap - 1) * rowHeight + 14;
	const lift = rowHeight * overlap;
	const plotWidth = Math.max(40, frame.width - GUTTER - 4);
	const sx = (v: number) =>
		GUTTER + ((v - shown.lo) / (shown.hi - shown.lo || 1)) * plotWidth;
	const baseOf = (row: number) => top + (row + 1) * rowHeight;
	const s = ridgelineChart({ variant });
	const activeShape = activeIndex !== null ? shown.shapes[activeIndex] : undefined;
	const activePoint: ActivePoint | null =
		activeShape && activeIndex !== null
			? {
					index: activeIndex,
					datum: { id: activeShape.id, label: activeShape.label },
					x: cursor ?? sx(activeShape.stats.median),
					y: { value: baseOf(activeShape.row) - lift * 0.6 },
				}
			: null;
	const activeValue = {
		active: activePoint,
		instant,
		title: (datum: Datum) => String(datum.label ?? ""),
		rows: () =>
			activeShape
				? [
						{
							key: "median",
							label: `Median ${value(activeShape.stats.median)}`,
							color: "transparent",
							value: null,
						},
						{
							key: "iqr",
							label: `Middle half ${value(activeShape.stats.q1)} to ${value(activeShape.stats.q3)}`,
							color: "transparent",
							value: null,
						},
						{
							key: "n",
							label: `${activeShape.stats.n} values`,
							color: "transparent",
							value: null,
						},
					]
				: [],
	};

	return (
		<ActivePointProvider value={activeValue}>
			<svg
				aria-hidden="true"
				width={frame.width}
				height={frame.height}
				className="absolute inset-0 block touch-pan-y overflow-visible"
				onPointerMove={(event) => {
					if (event.pointerType !== "mouse" && !event.buttons) return;
					const box = event.currentTarget.getBoundingClientRect();
					const y = event.clientY - box.top;
					const x = event.clientX - box.left;
					const row = Math.min(rows - 1, Math.max(0, Math.floor((y - top) / rowHeight)));
					setCursor(x >= GUTTER ? x : null);
					setActive(row, false);
				}}
				onPointerLeave={() => {
					setCursor(null);
					if (activeIndex !== null) setActive(null, false);
				}}
			>
				{shown.ticks.map((tick) => (
					<g key={tick}>
						<line
							x1={sx(tick)}
							x2={sx(tick)}
							y1={top - lift + rowHeight}
							y2={frame.height - AXIS}
							className={s.grid()}
						/>
						<text
							x={sx(tick)}
							y={frame.height - 6}
							textAnchor="middle"
							className={s.tick()}
						>
							{value(tick)}
						</text>
					</g>
				))}
				{shown.shapes.map((shape, index) => {
					const base = baseOf(shape.row);
					const on = activeIndex === index;
					const color =
						variant === "series" && config[shape.id]
							? `var(--color-${shape.id})`
							: "var(--chart-1)";
					const style = {
						"--ridge-color": color,
						"--ridge-tint": medianTint(shape.stats.median, shown.shapes),
						transitionDelay: animate ? `${index * 60}ms` : undefined,
					} as CSSProperties;
					return (
						<g
							key={shape.id}
							data-slot="ridgeline-ridge"
							data-drawn={drawn}
							data-active={on}
							data-dim={activeIndex !== null && !on}
							className={s.ridge()}
							style={style}
						>
							<path d={ridgePath(shape, sx, base, lift, true)} className={s.fill()} />
							{on && (
								<path
									d={ridgePath(
										shape,
										sx,
										base,
										lift,
										true,
										shape.stats.q1,
										shape.stats.q3,
									)}
									className={s.band()}
								/>
							)}
							<path d={ridgePath(shape, sx, base, lift, false)} className={s.line()} />
							<line
								x1={sx(shape.stats.median)}
								x2={sx(shape.stats.median)}
								y1={base}
								y2={base - ridgeHeight(shape, shape.stats.median) * lift}
								className={s.median()}
							/>
							<line
								x1={GUTTER}
								x2={GUTTER + plotWidth}
								y1={base}
								y2={base}
								className={s.baseline()}
							/>
						</g>
					);
				})}
				{cursor !== null && activeShape && (
					<line
						x1={cursor}
						x2={cursor}
						y1={top - lift + rowHeight}
						y2={frame.height - AXIS}
						className="stroke-foreground/40"
					/>
				)}
			</svg>
			{shown.shapes.map((shape) => (
				<span
					key={shape.id}
					aria-hidden
					className={s.label()}
					style={{ top: baseOf(shape.row), maxWidth: GUTTER - 4 }}
				>
					{shape.label}
				</span>
			))}
			<ChartTooltipPanel
				anchor={activePoint ? { x: activePoint.x, y: activePoint.y.value ?? 0 } : null}
				instant={instant}
				bounds={frame}
			>
				<ChartTooltipContent hideIndicator />
			</ChartTooltipPanel>
		</ActivePointProvider>
	);
}
