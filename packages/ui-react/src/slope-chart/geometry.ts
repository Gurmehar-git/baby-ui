import type { Datum } from "../chart/core";

export type SlopeItem = { key: string; label: string; start: number; end: number };
export type SlopeRow = SlopeItem & {
	y0: number;
	y1: number;
	l0: number;
	l1: number;
	rank0: number;
	rank1: number;
	order: number;
};
export type SlopeLayout = { rows: SlopeRow[]; x0: number; x1: number; height: number };

const LABEL_GAP = 20;
const PAD = 14;
export const SLOPE_HEAD = 28;
const clamp = (value: number, low: number, high: number) =>
	Math.min(high, Math.max(low, value));

export function slopeItems(
	data: Datum[],
	nameKey: string,
	startKey: string,
	endKey: string,
	labels: (key: string) => string,
) {
	return data.flatMap((datum, index) => {
		const start = datum[startKey];
		const end = datum[endKey];
		if (typeof start !== "number" || typeof end !== "number") return [];
		const key = String(datum[nameKey] ?? index);
		return [{ key, label: labels(key), start, end }];
	});
}

/** Moves labels apart just enough to stop overlaps; touching labels centre on where they want to be. */
function spread(wanted: number[], low: number, high: number) {
	const order = wanted.map((y, index) => ({ y, index })).sort((a, b) => a.y - b.y);
	let groups = order.map((entry) => ({ members: [entry], top: entry.y }));
	for (let changed = true; changed; ) {
		changed = false;
		const next: typeof groups = [];
		for (const group of groups) {
			const prev = next[next.length - 1];
			if (prev && prev.top + prev.members.length * LABEL_GAP > group.top) {
				const members = [...prev.members, ...group.members];
				next[next.length - 1] = {
					members,
					top:
						members.reduce((sum, member, k) => sum + member.y - k * LABEL_GAP, 0) /
						members.length,
				};
				changed = true;
			} else next.push(group);
		}
		groups = next.map((group) => ({
			...group,
			top: clamp(
				group.top,
				low,
				Math.max(low, high - (group.members.length - 1) * LABEL_GAP),
			),
		}));
	}
	const out = new Array<number>(wanted.length).fill(0);
	for (const group of groups) {
		group.members.forEach((member, k) => {
			out[member.index] = group.top + k * LABEL_GAP;
		});
	}
	return out;
}

/** Both columns share one value axis; rows carry dot and label heights and both ranks. */
export function slopeLayout(
	items: SlopeItem[],
	width: number,
	height: number,
	ranks: boolean,
): SlopeLayout {
	const narrow = width < 440;
	const left = narrow ? (width < 300 ? 116 : 132) : 168;
	const right = ranks ? (narrow ? 76 : 96) : narrow ? 52 : 64;
	const x0 = left;
	const x1 = Math.max(x0 + 40, width - right);
	const plot = Math.max(1, height - SLOPE_HEAD);
	const values = items.flatMap((item) => [item.start, item.end]);
	let lo = values.length ? Math.min(...values) : 0;
	let hi = values.length ? Math.max(...values) : 1;
	if (hi - lo < 1e-9) {
		lo -= 1;
		hi += 1;
	}
	const yOf = (value: number) =>
		SLOPE_HEAD + PAD + (1 - (value - lo) / (hi - lo)) * (plot - PAD * 2);
	const rankBy = (field: "start" | "end") => {
		const sorted = [...items].sort((a, b) => b[field] - a[field]);
		return (item: SlopeItem) => sorted.indexOf(item) + 1;
	};
	const r0 = rankBy("start");
	const r1 = rankBy("end");
	const l0 = spread(
		items.map((item) => yOf(item.start)),
		SLOPE_HEAD + 8,
		height - 8,
	);
	const l1 = spread(
		items.map((item) => yOf(item.end)),
		SLOPE_HEAD + 8,
		height - 8,
	);
	const rows = items.map((item, i) => ({
		...item,
		y0: yOf(item.start),
		y1: yOf(item.end),
		l0: l0[i] ?? 0,
		l1: l1[i] ?? 0,
		rank0: r0(item),
		rank1: r1(item),
		order: 0,
	}));
	[...rows]
		.sort((a, b) => a.rank1 - b.rank1)
		.forEach((row, k) => {
			row.order = k;
		});
	return { rows, x0, x1, height };
}

/** Rows blended between two layouts by key, so a dataset switch morphs each line. */
export function blendLayout(
	from: SlopeLayout | null,
	to: SlopeLayout,
	t: number,
): SlopeLayout {
	if (!from || t >= 1) return to;
	const old = new Map(from.rows.map((row) => [row.key, row]));
	const mix = (a: number, b: number) => a + (b - a) * t;
	return {
		...to,
		rows: to.rows.map((row) => {
			const was = old.get(row.key);
			return was
				? {
						...row,
						y0: mix(was.y0, row.y0),
						y1: mix(was.y1, row.y1),
						l0: mix(was.l0, row.l0),
						l1: mix(was.l1, row.l1),
					}
				: row;
		}),
	};
}

/** The line nearest a point, along the line or beside its labels; null past 22px. */
export function nearestSlope(layout: SlopeLayout, x: number, y: number) {
	const { rows, x0, x1 } = layout;
	const t = (clamp(x, x0, x1) - x0) / Math.max(1, x1 - x0);
	let best: SlopeRow | null = null;
	let distance = Number.POSITIVE_INFINITY;
	for (const row of rows) {
		const inLine = Math.abs(row.y0 + (row.y1 - row.y0) * t - y);
		const onLabel =
			x < x0
				? Math.abs(row.l0 - y)
				: x > x1
					? Math.abs(row.l1 - y)
					: Number.POSITIVE_INFINITY;
		const d = Math.min(inLine, onLabel);
		if (d < distance) {
			distance = d;
			best = row;
		}
	}
	return distance <= 22 ? best : null;
}

export const rankText = (row: SlopeRow) =>
	row.rank0 === row.rank1
		? "same rank"
		: row.rank1 < row.rank0
			? `up ${row.rank0 - row.rank1} to rank ${row.rank1}`
			: `down ${row.rank1 - row.rank0} to rank ${row.rank1}`;
