import type { ChartConfigShape, Datum } from "../../chart/react/core";

export type WaffleRow = { key: string; label: string; value: number; color: string };
export type WaffleCell = { id: number; key: string | null; slot: number };
export type WaffleShape = "square" | "round" | "framed";

export const WAFFLE_GAP = 3;
const SHAPES: WaffleShape[] = ["square", "round", "framed"];

export function waffleRows(
	data: Datum[],
	dataKey: string,
	nameKey: string,
	config: ChartConfigShape,
): WaffleRow[] {
	return data.flatMap((datum, index) => {
		const value = datum[dataKey];
		if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return [];
		const key = String(datum[nameKey] ?? index);
		const entry = config[key];
		const label = typeof entry?.label === "string" ? entry.label : key;
		const color =
			entry && (entry.color || entry.theme)
				? `var(--color-${key})`
				: `var(--chart-${(index % 5) + 1})`;
		return [{ key, label, value, color }];
	});
}

/** Whole cells per row by largest remainder, so the counts always add up to the grid. */
export function allocateCells(rows: WaffleRow[], cells: number): number[] {
	const total = rows.reduce((sum, row) => sum + row.value, 0);
	if (total <= 0) return rows.map(() => 0);
	const exact = rows.map((row) => (row.value / total) * cells);
	const counts = exact.map(Math.floor);
	let left = cells - counts.reduce((sum, count) => sum + count, 0);
	const order = exact
		.map((value, index) => ({ index, rest: value - Math.floor(value) }))
		.sort((a, b) => b.rest - a.rest);
	for (let k = 0; left > 0 && k < order.length; k++, left--) {
		const at = order[k]?.index ?? 0;
		counts[at] = (counts[at] ?? 0) + 1;
	}
	return counts;
}

/**
 * Hands cells to rows moving as few as possible: each row keeps the cells it had, surplus cells
 * join rows that grew, and every block keeps its cells' previous order so paths never cross.
 */
export function reassignCells(
	previous: WaffleCell[],
	rows: WaffleRow[],
	counts: number[],
): WaffleCell[] {
	const bySlot = [...previous].sort((a, b) => a.slot - b.slot);
	const kept = new Map<string, WaffleCell[]>();
	const pool: WaffleCell[] = [];
	const want = new Map(rows.map((row, index) => [row.key, counts[index] ?? 0]));
	for (const cell of bySlot) {
		const list = cell.key !== null ? (kept.get(cell.key) ?? []) : [];
		if (cell.key !== null && list.length < (want.get(cell.key) ?? 0)) {
			list.push(cell);
			kept.set(cell.key, list);
		} else pool.push(cell);
	}
	const next: WaffleCell[] = [];
	let slot = 0;
	rows.forEach((row, index) => {
		const own = kept.get(row.key) ?? [];
		while (own.length < (counts[index] ?? 0)) {
			const cell = pool.shift();
			if (!cell) break;
			own.push(cell);
		}
		for (const cell of own.sort((a, b) => a.slot - b.slot))
			next.push({ id: cell.id, key: row.key, slot: slot++ });
	});
	for (const cell of pool) next.push({ id: cell.id, key: null, slot: slot++ });
	return next.sort((a, b) => a.id - b.id);
}

export const emptyCells = (count: number): WaffleCell[] =>
	Array.from({ length: count }, (_, id) => ({ id, key: null, slot: id }));

/** Cell size and grid box that fit the frame. */
export function waffleBox(width: number, height: number, rows: number, columns: number) {
	const size = Math.max(
		0,
		Math.min(
			(width - WAFFLE_GAP * (columns - 1)) / columns,
			(height - WAFFLE_GAP * (rows - 1)) / rows,
		),
	);
	const w = size * columns + WAFFLE_GAP * (columns - 1);
	const h = size * rows + WAFFLE_GAP * (rows - 1);
	return { size, w, h, left: (width - w) / 2, top: (height - h) / 2 };
}

/** Column by column from the bottom-left corner, like a glass filling up. */
export const slotPosition = (slot: number, rows: number, size: number) => ({
	x: Math.floor(slot / rows) * (size + WAFFLE_GAP),
	y: (rows - 1 - (slot % rows)) * (size + WAFFLE_GAP),
});

export function slotAt(
	x: number,
	y: number,
	rows: number,
	columns: number,
	size: number,
) {
	const step = size + WAFFLE_GAP;
	const col = Math.min(columns - 1, Math.max(0, Math.floor(x / step)));
	const row = Math.min(rows - 1, Math.max(0, Math.floor(y / step)));
	return col * rows + (rows - 1 - row);
}

/** A colour-free second channel: neighbouring rows differ in shape as well as colour. */
export const rowShape = (
	index: number,
	variant: "square" | "round" | "mixed",
): WaffleShape =>
	variant === "mixed" ? (SHAPES[index % SHAPES.length] ?? "square") : variant;
