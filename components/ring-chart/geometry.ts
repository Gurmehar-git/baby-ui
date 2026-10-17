import { arc } from "d3-shape";
import type { ChartConfigShape, Datum } from "../chart/core";

export interface RingRow {
	key: string;
	label: string;
	value: number;
	max: number;
	color: string;
	/** Position in the source data, so colour follows the entity, not its rank. */
	dataIndex: number;
}

export interface RingLayout {
	inner: number;
	outer: number;
}

export const RING_START = -Math.PI / 2;
export const RING_END = (3 * Math.PI) / 2;
/** Hover pop: stiffness 400, damping 25, about 8% overshoot. */
export const POP_SPRING = { stiffness: 400, damping: 25 };
/** Staggers each ring's expand by 80ms and its progress sweep from 600ms, 100ms apart. */
export const expandDelay = (index: number) => index * 80;
export const sweepDelay = (index: number) => 600 + index * 100;
/** Rings start at 0.9, not 0: the motion contract never scales from nothing. */
export const EXPAND_FROM = 0.9;

export function ringRows(
	data: Datum[],
	dataKey: string,
	maxKey: string,
	nameKey: string,
	config: ChartConfigShape,
): RingRow[] {
	return data.flatMap((datum, dataIndex) => {
		const value = datum[dataKey];
		const max = datum[maxKey];
		if (typeof value !== "number" || !Number.isFinite(value)) return [];
		const key = String(datum[nameKey] ?? dataIndex);
		const entry = config[key];
		const label = typeof entry?.label === "string" ? entry.label : key;
		const color =
			entry && (entry.color || entry.theme)
				? `var(--color-${key})`
				: `var(--chart-${(dataIndex % 5) + 1})`;
		return [
			{
				key,
				label,
				value,
				max: typeof max === "number" && max > 0 ? max : 100,
				color,
				dataIndex,
			},
		];
	});
}

/** Layout: rings grow outward from `baseInner`, scaled so the outermost fits. */
export function ringLayout(
	count: number,
	size: number,
	strokeWidth: number,
	gap: number,
	baseInner: number,
): { rings: RingLayout[]; scale: number } {
	const available = Math.max(0, size / 2 - 8);
	const natural = baseInner + Math.max(0, count - 1) * (strokeWidth + gap) + strokeWidth;
	const scale = natural > 0 ? available / natural : 1;
	return {
		scale,
		rings: Array.from({ length: count }, (_, i) => {
			const inner = (baseInner + i * (strokeWidth + gap)) * scale;
			return { inner, outer: inner + strokeWidth * scale };
		}),
	};
}

export function ringPath(
	inner: number,
	outer: number,
	startAngle: number,
	endAngle: number,
	round: boolean,
): string {
	if (endAngle <= startAngle + 0.001) return "";
	return (
		arc()
			.innerRadius(inner)
			.outerRadius(outer)
			.cornerRadius(round ? (outer - inner) / 2 : 0)({
			innerRadius: inner,
			outerRadius: outer,
			startAngle,
			endAngle,
		}) ?? ""
	);
}
