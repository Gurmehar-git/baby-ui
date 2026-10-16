"use client";

import { extent, max } from "d3-array";
import { scaleLinear, scaleTime } from "d3-scale";
import { curveMonotoneX, area as d3Area, line as d3Line } from "d3-shape";
import {
	type KeyboardEvent,
	type PointerEvent,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useChart } from "../../chart/react/chart";
import {
	type Datum,
	DEFAULT_MARGIN,
	nearestIndex,
	seriesColor,
	toDate,
} from "../../chart/react/core";
import { cn } from "../../lib/react/cn";
import {
	type BrushMode,
	clampRange,
	HANDLE_HEIGHT,
	HANDLE_HIT,
	HANDLE_WIDTH,
	type IndexRange,
	keyRange,
	moveRange,
	resizeRange,
	sameRange,
} from "./geometry";
import { type ChartBrushVariant, chartBrush } from "./variants";

export interface ChartBrushProps {
	/** The full series; pass the same rows as the chart it drives. */
	data: Datum[];
	/** Series drawn in the overview strip. */
	dataKeys: string[];
	xKey?: string;
	range?: [Date, Date];
	defaultRange?: [Date, Date];
	/** Wire this to the chart's `xDomain`. */
	onRangeChange?: (range: [Date, Date]) => void;
	variant?: ChartBrushVariant;
	height?: number;
	/** Keep equal to the chart's left and right margins so the strip lines up. */
	margin?: { left?: number; right?: number };
	/** Accessible name of the range slider. */
	label?: string;
	/** Spoken value of the slider; defaults to "start to end" with locale dates. */
	rangeText?: (start: Date, end: Date) => string;
	className?: string;
}

export function ChartBrush({
	data,
	dataKeys,
	xKey = "date",
	range: rangeProp,
	defaultRange,
	onRangeChange,
	variant = "area",
	height = 64,
	margin,
	label = "Visible range",
	rangeText,
	className,
}: ChartBrushProps) {
	const { format, hidden, config } = useChart();
	const rootRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);
	const left = margin?.left ?? DEFAULT_MARGIN.left;
	const right = margin?.right ?? DEFAULT_MARGIN.right;
	const inner = Math.max(0, width - left - right);
	const count = data.length;

	useLayoutEffect(() => {
		const node = rootRef.current;
		if (!node) return;
		const measure = () => setWidth(Math.floor(node.clientWidth));
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	const toIndices = useCallback(
		(dates: [Date, Date] | undefined): IndexRange =>
			dates
				? clampRange(
						[
							nearestIndex(data, xKey, dates[0].getTime()),
							nearestIndex(data, xKey, dates[1].getTime()),
						],
						count,
					)
				: [0, Math.max(0, count - 1)],
		[data, xKey, count],
	);
	const [internal, setInternal] = useState<IndexRange>(() => toIndices(defaultRange));
	const indices = rangeProp ? toIndices(rangeProp) : clampRange(internal, count);
	const commit = (next: IndexRange) => {
		if (sameRange(next, indices)) return;
		if (!rangeProp) setInternal(next);
		const a = data[next[0]];
		const b = data[next[1]];
		if (a && b) onRangeChange?.([toDate(a[xKey]), toDate(b[xKey])]);
	};

	const xScale = useMemo(() => {
		const [min = 0, maxTime = min] = extent(data, (d) => toDate(d[xKey]).getTime());
		return scaleTime().domain([min, maxTime]).range([0, inner]);
	}, [data, xKey, inner]);
	const keys = dataKeys.filter((key) => !hidden.has(key));
	// biome-ignore lint/correctness/useExhaustiveDependencies: keys.join("|") is a content key, so equal data does not recompute; keys left out on purpose, the listed values decide when it runs.
	const yScale = useMemo(() => {
		const top = max(data, (d) =>
			max(keys, (k) => (typeof d[k] === "number" ? (d[k] as number) : 0)),
		);
		return scaleLinear()
			.domain([0, top || 1])
			.range([height - 6, 6]);
	}, [data, keys.join("|"), height]);
	const xAt = (i: number) => {
		const d = data[i];
		return d ? xScale(toDate(d[xKey])) : 0;
	};
	const x0 = xAt(indices[0]);
	const x1 = xAt(indices[1]);

	const drag = useRef<{ mode: BrushMode; origin: number; start: IndexRange } | null>(
		null,
	);
	const indexAt = (event: PointerEvent<SVGSVGElement>) => {
		const bounds = event.currentTarget.getBoundingClientRect();
		const time = xScale.invert(event.clientX - bounds.left - left).getTime();
		return nearestIndex(data, xKey, time);
	};
	const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
		if (count < 2) return;
		const target = event.target as Element;
		const mode = (target.getAttribute("data-brush") as BrushMode | null) ?? "new";
		const index = indexAt(event);
		event.currentTarget.setPointerCapture(event.pointerId);
		drag.current = { mode, origin: index, start: indices };
		rootRef.current?.focus({ preventScroll: true });
		if (mode === "new") commit(clampRange([index, index + 1], count));
	};
	const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
		const state = drag.current;
		if (!state) return;
		const index = indexAt(event);
		if (state.mode === "move")
			commit(moveRange(state.start, index - state.origin, count));
		else if (state.mode === "start" || state.mode === "end")
			commit(resizeRange(state.start, state.mode, index, count));
		else commit(clampRange([state.origin, index], count));
	};
	const onPointerUp = () => {
		drag.current = null;
	};
	const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		const next = keyRange(event.key, event.shiftKey, indices, count);
		if (!next) return;
		event.preventDefault();
		commit(next);
	};

	const pathFor = (key: string) =>
		d3Line<Datum>()
			.x((d) => xScale(toDate(d[xKey])))
			.y((d) => yScale(typeof d[key] === "number" ? (d[key] as number) : 0))
			.curve(curveMonotoneX)(data) ?? "";
	const areaFor = (key: string) =>
		d3Area<Datum>()
			.x((d) => xScale(toDate(d[xKey])))
			.y0(height - 6)
			.y1((d) => yScale(typeof d[key] === "number" ? (d[key] as number) : 0))
			.curve(curveMonotoneX)(data) ?? "";
	const colorOf = (key: string) => (config[key] ? seriesColor(key) : "var(--chart-1)");
	const styles = chartBrush({ variant });
	const first = data[indices[0]];
	const last = data[indices[1]];
	const describe =
		rangeText ??
		((start: Date, end: Date) => `${format.tick(start)} to ${format.tick(end)}`);
	const valueText =
		first && last ? describe(toDate(first[xKey]), toDate(last[xKey])) : "";

	return (
		<div
			ref={rootRef}
			data-slot="chart-brush"
			role="slider"
			tabIndex={0}
			aria-label={label}
			aria-valuemin={0}
			aria-valuemax={Math.max(0, count - 1)}
			aria-valuenow={indices[0]}
			aria-valuetext={valueText}
			onKeyDown={onKeyDown}
			className={cn(styles.root(), className)}
			style={{ height }}
		>
			{width > 0 ? (
				<svg
					aria-hidden="true"
					width={width}
					height={height}
					className={styles.svg()}
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onPointerUp={onPointerUp}
					onPointerCancel={onPointerUp}
				>
					<g transform={`translate(${left},0)`}>
						<rect width={inner} height={height} rx={6} className={styles.track()} />
						{keys.map((key) => (
							<g key={key}>
								<path
									d={areaFor(key)}
									className={styles.area()}
									fill={colorOf(key)}
									fillOpacity={0.14}
								/>
								<path
									d={pathFor(key)}
									className={styles.preview()}
									stroke={colorOf(key)}
								/>
							</g>
						))}
						<rect
							x={0}
							width={Math.max(0, x0)}
							height={height}
							className={styles.shade()}
						/>
						<rect
							x={x1}
							width={Math.max(0, inner - x1)}
							height={height}
							className={styles.shade()}
						/>
						<rect
							data-brush="move"
							data-slot="chart-brush-selection"
							x={x0}
							width={Math.max(0, x1 - x0)}
							height={height}
							rx={4}
							className={styles.selection()}
						/>
						{[
							{ edge: "start", x: x0 },
							{ edge: "end", x: x1 },
						].map(({ edge, x }) => (
							<g key={edge}>
								<rect
									x={x - HANDLE_WIDTH / 2}
									y={(height - HANDLE_HEIGHT) / 2}
									width={HANDLE_WIDTH}
									height={HANDLE_HEIGHT}
									rx={2}
									className={cn(styles.handle(), "pointer-events-none")}
								/>
								<rect
									data-brush={edge}
									data-slot="chart-brush-handle"
									x={x - HANDLE_HIT / 2}
									width={HANDLE_HIT}
									height={height}
									className={styles.hit()}
								/>
							</g>
						))}
					</g>
				</svg>
			) : null}
		</div>
	);
}
