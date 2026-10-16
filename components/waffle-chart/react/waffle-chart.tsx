"use client";

import { type CSSProperties, useLayoutEffect, useMemo, useState } from "react";
import { useChart } from "../../chart/react/chart";
import type { ActivePoint, Datum } from "../../chart/react/core";
import { ActivePointProvider, ChartFrame } from "../../chart/react/frame";
import { useActiveIndex } from "../../chart/react/time-series";
import { ChartTooltipContent, ChartTooltipPanel } from "../../chart/react/tooltip";
import {
	allocateCells,
	emptyCells,
	reassignCells,
	rowShape,
	slotAt,
	slotPosition,
	type WaffleCell,
	type WaffleRow,
	waffleBox,
	waffleRows,
} from "./geometry";
import { type WaffleVariant, waffleChart } from "./variants";

export type { WaffleVariant };

export interface WaffleChartProps {
	data: Datum[];
	/** Key holding each row's value. */
	dataKey?: string;
	/** Key holding each row's name; matches `config` keys for labels, colours and the legend. */
	nameKey?: string;
	/** Grid rows; rows times columns cells make the whole, so 10 by 10 is one cell per percent. */
	rows?: number;
	columns?: number;
	/** Cell shape; `mixed` cycles square, round and framed so neighbours differ without colour. */
	variant?: WaffleVariant;
	/** Screen-reader table headers: name, value, share, cells. */
	tableHeaders?: [string, string, string, string];
	animate?: boolean;
	activeIndex?: number | null;
	defaultActiveIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	roleDescription?: string;
	className?: string;
}

/** A unit chart: every cell is one share of the whole, and cells travel between rows when the data changes. */
export function WaffleChart({
	data,
	dataKey = "value",
	nameKey = "name",
	rows: gridRows = 10,
	columns = 10,
	variant = "mixed",
	tableHeaders = ["Name", "Value", "Share", "Cells"],
	animate = true,
	activeIndex: activeIndexProp,
	defaultActiveIndex = null,
	onActiveIndexChange,
	roleDescription = "waffle chart",
	className,
}: WaffleChartProps) {
	const { config, hidden, format, description } = useChart();
	const rows = useMemo(
		() =>
			waffleRows(data, dataKey, nameKey, config).filter((row) => !hidden.has(row.key)),
		[data, dataKey, nameKey, config, hidden],
	);
	const count = Math.max(1, gridRows * columns);
	const counts = useMemo(() => allocateCells(rows, count), [rows, count]);
	const signature = `${count}|${rows.map((row) => `${row.key}:${row.value}`).join(",")}`;
	const [layout, setLayout] = useState(() => ({
		signature,
		cells: reassignCells(emptyCells(count), rows, counts),
	}));
	if (layout.signature !== signature) {
		const base = Array.from(
			{ length: count },
			(_, id) => layout.cells[id] ?? { id, key: null, slot: id },
		);
		setLayout({ signature, cells: reassignCells(base, rows, counts) });
	}
	const total = rows.reduce((sum, row) => sum + row.value, 0);
	const share = (value: number) => format.percent(total > 0 ? value / total : 0);
	const { activeIndex, instant, setActive } = useActiveIndex(
		activeIndexProp,
		defaultActiveIndex,
		onActiveIndexChange,
	);
	const active = activeIndex !== null ? rows[activeIndex] : undefined;
	const largest = rows.reduce<WaffleRow | undefined>(
		(best, row) => (!best || row.value > best.value ? row : best),
		undefined,
	);

	return (
		<ChartFrame
			roleDescription={roleDescription}
			summary={
				description ??
				(largest
					? `${rows.length} parts of ${count} cells. Largest: ${largest.label}, ${share(largest.value)}.`
					: "No data.")
			}
			table={{
				columns: tableHeaders,
				rows: rows.map((row, index) => ({
					header: row.label,
					cells: [format.number(row.value), share(row.value), String(counts[index] ?? 0)],
				})),
			}}
			count={rows.length}
			activeIndex={activeIndex}
			onActiveChange={setActive}
			interactive={rows.length > 0}
			announcement={
				active && instant
					? `${active.label}: ${format.number(active.value)}, ${share(active.value)}`
					: ""
			}
			className={className}
		>
			{(frame) => (
				<WafflePlot
					frame={frame}
					rows={rows}
					counts={counts}
					cells={layout.cells}
					gridRows={gridRows}
					columns={columns}
					variant={variant}
					animate={animate}
					share={share}
					activeIndex={activeIndex}
					instant={instant}
					setActive={setActive}
				/>
			)}
		</ChartFrame>
	);
}

function WafflePlot({
	frame,
	rows,
	counts,
	cells,
	gridRows,
	columns,
	variant,
	animate,
	share,
	activeIndex,
	instant,
	setActive,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	rows: WaffleRow[];
	counts: number[];
	cells: WaffleCell[];
	gridRows: number;
	columns: number;
	variant: WaffleVariant;
	animate: boolean;
	share: (value: number) => string;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
}) {
	const { highlighted } = useChart();
	const [shown, setShown] = useState(!animate);
	const [hoverSlot, setHoverSlot] = useState<number | null>(null);
	useLayoutEffect(() => {
		if (!animate) return setShown(true);
		const frameId = requestAnimationFrame(() => setShown(true));
		return () => cancelAnimationFrame(frameId);
	}, [animate]);
	const box = waffleBox(frame.width, frame.height, gridRows, columns);
	const count = gridRows * columns;
	const indexOf = new Map(rows.map((row, index) => [row.key, index]));
	const focusKey = activeIndex !== null ? rows[activeIndex]?.key : highlighted;
	const s = waffleChart({ variant });

	const anchorSlot =
		activeIndex === null
			? null
			: hoverSlot !== null &&
					cells.find((cell) => cell.slot === hoverSlot)?.key === rows[activeIndex]?.key
				? hoverSlot
				: counts.slice(0, activeIndex).reduce((sum, value) => sum + value, 0);
	const anchor =
		anchorSlot === null ? null : slotPosition(anchorSlot, gridRows, box.size);
	const cursor =
		hoverSlot !== null && box.size > 0
			? slotPosition(hoverSlot, gridRows, box.size)
			: null;
	const activeRow = activeIndex !== null ? rows[activeIndex] : undefined;
	const activePoint: ActivePoint | null =
		activeRow && anchor && activeIndex !== null
			? {
					index: activeIndex,
					datum: { ...activeRow, index: activeIndex },
					x: box.left + anchor.x + box.size / 2,
					y: { value: box.top + anchor.y },
				}
			: null;
	const activeValue = {
		active: activePoint,
		instant,
		title: (datum: Datum) => String(datum.label ?? ""),
		rows: (datum: Datum) => [
			{
				key: String(datum.key ?? ""),
				label: share(Number(datum.value)),
				color: String(datum.color ?? ""),
				value: Number(datum.value),
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
					const rect = event.currentTarget.getBoundingClientRect();
					const slot = slotAt(
						event.clientX - rect.left - box.left,
						event.clientY - rect.top - box.top,
						gridRows,
						columns,
						box.size,
					);
					const key = cells.find((cell) => cell.slot === slot)?.key;
					setHoverSlot(key ? slot : null);
					setActive(key ? (indexOf.get(key) ?? null) : null, false);
				}}
				onPointerLeave={() => {
					setHoverSlot(null);
					if (activeIndex !== null) setActive(null, false);
				}}
			>
				<g transform={`translate(${box.left} ${box.top})`}>
					{box.size > 0 &&
						cells.map((cell) => {
							const { x, y } = slotPosition(cell.slot, gridRows, box.size);
							const index = cell.key !== null ? (indexOf.get(cell.key) ?? -1) : -1;
							const row = rows[index];
							const shape = rowShape(Math.max(0, index), variant);
							const dim = focusKey != null && cell.key !== focusKey;
							const color = row?.color ?? "transparent";
							return (
								<rect
									key={cell.id}
									width={box.size}
									height={box.size}
									rx={shape === "round" ? box.size / 2 : box.size * 0.22}
									data-empty={cell.key === null}
									data-slot="waffle-cell"
									className={s.cell()}
									style={
										{
											"--waffle-delay": animate ? `${(cell.slot / count) * 0.32}s` : "0s",
											transform: `translate(${x}px, ${y}px) scale(${shown ? 1 : 0.4})`,
											opacity: cell.key === null || !shown ? 0 : dim ? 0.26 : 1,
											fill:
												shape === "framed"
													? `color-mix(in oklab, ${color} 30%, transparent)`
													: color,
											stroke: shape === "framed" ? color : "none",
											strokeWidth: shape === "framed" ? 2 : 0,
										} as CSSProperties
									}
								/>
							);
						})}
					{cursor && (
						<rect
							x={cursor.x - 2}
							y={cursor.y - 2}
							width={box.size + 4}
							height={box.size + 4}
							rx={box.size * 0.3}
							className={s.cursor()}
						/>
					)}
				</g>
			</svg>
			{activePoint && (
				<ChartTooltipPanel
					anchor={{ x: activePoint.x, y: activePoint.y.value ?? 0 }}
					instant={instant}
					bounds={frame}
				>
					<ChartTooltipContent />
				</ChartTooltipPanel>
			)}
		</ActivePointProvider>
	);
}
