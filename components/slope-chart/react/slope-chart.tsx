"use client";

import { type CSSProperties, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ActivePoint, Datum } from "../../chart/core";
import { CHART_DURATION, tween } from "../../chart/motion";
import { useChart } from "../../chart/react/chart";
import { ActivePointProvider, ChartFrame } from "../../chart/react/frame";
import { useActiveIndex } from "../../chart/react/time-series";
import { ChartTooltipContent, ChartTooltipPanel } from "../../chart/react/tooltip";
import {
	blendLayout,
	nearestSlope,
	rankText,
	SLOPE_HEAD,
	type SlopeItem,
	type SlopeLayout,
	type SlopeRow,
	slopeItems,
	slopeLayout,
} from "../geometry";
import { type SlopeVariant, slopeChart } from "../variants";

export type { SlopeVariant };

export interface SlopeChartProps {
	data: Datum[];
	/** Key holding each row's name; matches `config` keys for labels and colours. */
	nameKey?: string;
	startKey?: string;
	endKey?: string;
	/** Heading of the first column, such as "Q1". */
	startLabel: string;
	/** Heading of the second column, such as "Q2". */
	endLabel: string;
	/** The item drawn in its config colour while the rest stay neutral; others all take their colour without it. */
	highlightKey?: string | null;
	/** `minimal` drops the label leaders and rank movement. */
	variant?: SlopeVariant;
	/** Screen-reader table headers: item, start, end, change, rank. */
	tableHeaders?: [string, string, string, string, string];
	animate?: boolean;
	activeIndex?: number | null;
	defaultActiveIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	roleDescription?: string;
	className?: string;
}

/** How several items changed between exactly two moments, and how their order changed. */
export function SlopeChart({
	data,
	nameKey = "name",
	startKey = "start",
	endKey = "end",
	startLabel,
	endLabel,
	highlightKey = null,
	variant = "default",
	tableHeaders,
	animate = true,
	activeIndex: activeIndexProp,
	defaultActiveIndex = null,
	onActiveIndexChange,
	roleDescription = "slope chart",
	className,
}: SlopeChartProps) {
	const { config, format, description } = useChart();
	const items = useMemo(
		() =>
			slopeItems(data, nameKey, startKey, endKey, (key) => {
				const label = config[key]?.label;
				return typeof label === "string" ? label : key;
			}),
		[data, nameKey, startKey, endKey, config],
	);
	const byEnd = [...items].sort((a, b) => b.end - a.end);
	const { activeIndex, instant, setActive } = useActiveIndex(
		activeIndexProp,
		defaultActiveIndex,
		onActiveIndexChange,
	);
	const active = activeIndex !== null ? byEnd[activeIndex] : undefined;
	const change = (item: SlopeItem) =>
		`${item.end >= item.start ? "+" : "−"}${format.number(Math.abs(item.end - item.start))}`;

	return (
		<ChartFrame
			roleDescription={roleDescription}
			summary={
				description ??
				(items.length
					? `${startLabel} to ${endLabel}. ${byEnd.map((item) => `${item.label} ${format.number(item.start)} to ${format.number(item.end)}`).join(", ")}.`
					: "No data.")
			}
			table={{
				columns: tableHeaders ?? ["Item", startLabel, endLabel, "Change", "Rank"],
				rows: byEnd.map((item, rank) => ({
					header: item.label,
					cells: [
						format.number(item.start),
						format.number(item.end),
						change(item),
						`${[...items].sort((a, b) => b.start - a.start).indexOf(item) + 1} to ${rank + 1}`,
					],
				})),
			}}
			count={byEnd.length}
			activeIndex={activeIndex}
			onActiveChange={setActive}
			interactive={items.length > 0}
			announcement={
				active && instant
					? `${active.label}, ${startLabel} ${format.number(active.start)}, ${endLabel} ${format.number(active.end)}, ${change(active)}`
					: ""
			}
			className={className}
		>
			{(frame) => (
				<SlopePlot
					frame={frame}
					items={items}
					byEnd={byEnd}
					startLabel={startLabel}
					endLabel={endLabel}
					highlightKey={highlightKey}
					variant={variant}
					animate={animate}
					change={change}
					activeIndex={activeIndex}
					instant={instant}
					setActive={setActive}
				/>
			)}
		</ChartFrame>
	);
}

function SlopePlot({
	frame,
	items,
	byEnd,
	startLabel,
	endLabel,
	highlightKey,
	variant,
	animate,
	change,
	activeIndex,
	instant,
	setActive,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	items: SlopeItem[];
	byEnd: SlopeItem[];
	startLabel: string;
	endLabel: string;
	highlightKey: string | null;
	variant: SlopeVariant;
	animate: boolean;
	change: (item: SlopeItem) => string;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
}) {
	const { config, format } = useChart();
	const target = useMemo(
		() => slopeLayout(items, frame.width, frame.height, variant !== "minimal"),
		[items, frame.width, frame.height, variant],
	);
	const [drawn, setDrawn] = useState(!animate);
	const [shown, setShown] = useState<SlopeLayout>(target);
	const previous = useRef<SlopeLayout | null>(null);
	const signature = items
		.map((item) => `${item.key}:${item.start}:${item.end}`)
		.join("|");
	useLayoutEffect(() => {
		if (!animate) return setDrawn(true);
		const id = requestAnimationFrame(() => setDrawn(true));
		return () => cancelAnimationFrame(id);
	}, [animate]);
	const seen = useRef(signature);
	useLayoutEffect(() => {
		const from = previous.current;
		previous.current = target;
		const morph = seen.current !== signature;
		seen.current = signature;
		// Only new data morphs; a resize or first paint jumps.
		if (!morph || !from || from.x0 !== target.x0 || from.height !== target.height)
			return setShown(target);
		const playback = tween({
			duration: CHART_DURATION.update,
			onUpdate: (t) => setShown(blendLayout(from, target, t)),
		});
		return () => playback.stop();
	}, [target, signature]);
	const layout =
		shown.x1 === target.x1 && shown.height === target.height ? shown : target;
	const activeKey = activeIndex !== null ? byEnd[activeIndex]?.key : undefined;
	const activeRow = layout.rows.find((row) => row.key === activeKey);
	const colorOf = (row: SlopeRow) =>
		highlightKey
			? row.key === highlightKey
				? `var(--color-${row.key}, var(--chart-1))`
				: "var(--color-muted-foreground)"
			: config[row.key]
				? `var(--color-${row.key})`
				: "var(--chart-1)";
	const s = slopeChart({ variant });
	const activePoint: ActivePoint | null =
		activeRow && activeIndex !== null
			? {
					index: activeIndex,
					datum: { ...activeRow },
					x: (layout.x0 + layout.x1) / 2,
					y: { value: (activeRow.y0 + activeRow.y1) / 2 },
				}
			: null;
	const activeValue = {
		active: activePoint,
		instant,
		title: (datum: Datum) => String(datum.label ?? ""),
		rows: (datum: Datum) => [
			{
				key: "start",
				label: startLabel,
				color: "transparent",
				value: Number(datum.start),
			},
			{ key: "end", label: endLabel, color: "transparent", value: Number(datum.end) },
			{
				key: "change",
				label: activeRow ? `${change(activeRow)}, ${rankText(activeRow)}` : "",
				color: "transparent",
				value: null,
			},
		],
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
					const row = nearestSlope(
						layout,
						event.clientX - box.left,
						event.clientY - box.top,
					);
					const index = row ? byEnd.findIndex((item) => item.key === row.key) : -1;
					setActive(index < 0 ? null : index, false);
				}}
				onPointerLeave={() => activeIndex !== null && setActive(null, false)}
			>
				<line
					x1={layout.x0}
					x2={layout.x0}
					y1={SLOPE_HEAD}
					y2={frame.height}
					className={s.axis()}
				/>
				<line
					x1={layout.x1}
					x2={layout.x1}
					y1={SLOPE_HEAD}
					y2={frame.height}
					className={s.axis()}
				/>
				{layout.rows.map((row, i) => {
					const on = activeKey === row.key;
					const style = {
						"--slope-color": colorOf(row),
						"--slope-delay": `${i * 50}ms`,
					} as CSSProperties;
					return (
						<g
							key={row.key}
							data-dim={activeKey !== undefined && !on}
							className={s.item()}
							style={style}
						>
							<path
								d={`M${layout.x0 - 6},${row.l0}L${layout.x0 - 1},${row.y0}`}
								className={s.leader()}
							/>
							<path
								d={`M${layout.x1 + 6},${row.l1}L${layout.x1 + 1},${row.y1}`}
								className={s.leader()}
							/>
							<path
								d={`M${layout.x0},${row.y0}L${layout.x1},${row.y1}`}
								pathLength={1}
								data-drawn={drawn}
								className={s.line()}
								style={{ strokeWidth: on ? 3 : undefined }}
							/>
							<circle
								cx={layout.x0}
								cy={row.y0}
								r={4}
								data-drawn={drawn}
								className={s.dot()}
							/>
							<circle
								cx={layout.x1}
								cy={row.y1}
								r={4}
								data-drawn={drawn}
								className={s.dot()}
								style={{ "--slope-delay": `${700 + i * 50}ms` } as CSSProperties}
							/>
						</g>
					);
				})}
			</svg>
			<span aria-hidden className={s.column()} style={{ left: layout.x0 }}>
				{startLabel}
			</span>
			<span aria-hidden className={s.column()} style={{ left: layout.x1 }}>
				{endLabel}
			</span>
			{layout.rows.map((row, i) => {
				const dim = activeKey !== undefined && activeKey !== row.key;
				const move = row.rank0 - row.rank1;
				return (
					<div key={row.key} aria-hidden>
						<span
							data-drawn={drawn}
							data-dim={dim}
							className={s.label()}
							style={
								{
									top: row.l0,
									right: frame.width - layout.x0 + 10,
									maxWidth: layout.x0 - 10,
									"--slope-delay": `${i * 50}ms`,
								} as CSSProperties
							}
						>
							<span className={s.name()}>{row.label}</span>
							<span className={s.value()}>{format.number(row.start)}</span>
						</span>
						<span
							data-drawn={drawn}
							data-dim={dim}
							className={s.label()}
							style={
								{
									top: row.l1,
									left: layout.x1 + 10,
									"--slope-delay": `${700 + i * 50}ms`,
								} as CSSProperties
							}
						>
							<span className={s.value()}>{format.number(row.end)}</span>
							<span
								data-move={move > 0 ? "up" : move < 0 ? "down" : "level"}
								className={s.rank()}
							>
								{move !== 0 && (
									<svg
										viewBox="0 0 8 8"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.3"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden
									>
										<path
											d={
												move > 0
													? "M4 7V1M1.5 3.5 4 1l2.5 2.5"
													: "M4 1v6M1.5 4.5 4 7l2.5-2.5"
											}
										/>
									</svg>
								)}
								{move === 0 ? "=" : Math.abs(move)}
							</span>
						</span>
					</div>
				);
			})}
			<ChartTooltipPanel
				anchor={activePoint ? { x: activePoint.x, y: activePoint.y.value ?? 0 } : null}
				instant={instant}
				bounds={frame}
			>
				<ChartTooltipContent indicator="line" hideIndicator />
			</ChartTooltipPanel>
		</ActivePointProvider>
	);
}
