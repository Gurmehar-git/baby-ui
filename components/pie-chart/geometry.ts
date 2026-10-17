import { arc, pie } from "d3-shape";
import type { ChartConfigShape, Datum } from "../chart/core";

export interface PieSlice {
	key: string;
	label: string;
	value: number;
	color: string;
	/** Position in the source data, so colour follows the entity, not its rank. */
	dataIndex: number;
	startAngle: number;
	endAngle: number;
	padAngle: number;
}

export interface PieRow {
	key: string;
	label: string;
	value: number;
	color: string;
	dataIndex: number;
}

/** Hover pop: stiffness 400, damping 25, about 8% overshoot. */
export const POP_SPRING = { stiffness: 400, damping: 25 };

export const PIE_START = -Math.PI / 2;
export const PIE_END = (3 * Math.PI) / 2;
/** Per-slice enter delay: 100ms, then 80ms per slice. */
export const sliceDelay = (index: number) => 100 + index * 80;
/** Labels only fit slices wider than ~20 degrees. */
export const LABEL_MIN_SPAN = 0.35;

/** Colour from the chart config when the key has one, else `--chart-N` by data position. */
export function pieRows(
	data: Datum[],
	dataKey: string,
	nameKey: string,
	config: ChartConfigShape,
): PieRow[] {
	return data.flatMap((datum, dataIndex) => {
		const value = datum[dataKey];
		if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return [];
		const key = String(datum[nameKey] ?? dataIndex);
		const entry = config[key];
		const label = typeof entry?.label === "string" ? entry.label : key;
		const color =
			entry && (entry.color || entry.theme)
				? `var(--color-${key})`
				: `var(--chart-${(dataIndex % 5) + 1})`;
		return [{ key, label, value, color, dataIndex }];
	});
}

export function pieSlices(rows: PieRow[], padAngle: number): PieSlice[] {
	return pie<PieRow>()
		.value((row) => row.value)
		.startAngle(PIE_START)
		.endAngle(PIE_END)
		.padAngle(padAngle)
		.sort(null)(rows)
		.map((a) => ({
			...a.data,
			startAngle: a.startAngle,
			endAngle: a.endAngle,
			padAngle: a.padAngle,
		}));
}

export function arcPath(
	innerRadius: number,
	outerRadius: number,
	startAngle: number,
	endAngle: number,
	cornerRadius = 0,
	padAngle = 0,
): string {
	if (endAngle <= startAngle + 0.001) return "";
	return (
		arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius)
			.cornerRadius(cornerRadius)
			.padAngle(padAngle)({ innerRadius, outerRadius, startAngle, endAngle }) ?? ""
	);
}

/** Offset along the slice bisector; d3 puts 0 rad at 12 o'clock, clockwise. */
export function bisector(startAngle: number, endAngle: number, distance: number) {
	const mid = (startAngle + endAngle) / 2;
	return { x: Math.sin(mid) * distance, y: -Math.cos(mid) * distance };
}
