export interface ProjectionPoint {
	date: Date;
	value: number;
}

export type ProjectionMode = "auto" | "target";
export type ProjectionMethod = "linearRegression" | "lastSegment";

const DAY = 86_400_000;

function readDate(value: unknown): Date | null {
	const date = value instanceof Date ? value : new Date(value as string | number);
	return Number.isNaN(date.getTime()) ? null : date;
}

function slopeOf(points: { t: number; y: number }[], method: ProjectionMethod): number {
	if (points.length < 2) return 0;
	if (method === "lastSegment") {
		const prev = points.at(-2);
		const last = points.at(-1);
		if (!(prev && last) || last.t === prev.t) return 0;
		return (last.y - prev.y) / (last.t - prev.t);
	}
	const n = points.length;
	let st = 0;
	let sy = 0;
	let sty = 0;
	let stt = 0;
	for (const { t, y } of points) {
		st += t;
		sy += y;
		sty += t * y;
		stt += t * t;
	}
	const denom = n * stt - st * st;
	return Math.abs(denom) < 1e-12 ? 0 : (n * sty - st * sy) / denom;
}

/** Projection: anchor on the last row, extend `horizon` steps by trend or to a target. */
export function buildProjection(options: {
	data: Record<string, unknown>[];
	dataKey: string;
	xKey?: string;
	mode?: ProjectionMode;
	method?: ProjectionMethod;
	horizon?: number;
	target?: number;
}): ProjectionPoint[] {
	const {
		data,
		dataKey,
		xKey = "date",
		mode = "auto",
		method = "linearRegression",
		horizon = 6,
		target,
	} = options;
	const history: { t: number; y: number }[] = [];
	for (const row of data) {
		const date = readDate(row[xKey]);
		const value = row[dataKey];
		if (date && typeof value === "number" && Number.isFinite(value))
			history.push({ t: date.getTime(), y: value });
	}
	const anchor = history.at(-1);
	if (!anchor) return [];
	const prev = history.at(-2);
	const step = prev && anchor.t > prev.t ? anchor.t - prev.t : DAY;
	const endTime = anchor.t + step * horizon;
	const endValue =
		mode === "target" && target !== undefined && Number.isFinite(target)
			? target
			: anchor.y + slopeOf(history, method) * step * horizon;
	return [
		{ date: new Date(anchor.t), value: anchor.y },
		{ date: new Date(endTime), value: endValue },
	];
}

/** Cubic with flat tangents at both ends, the price-target S-curve. */
export function bezierPath(
	x0: number,
	y0: number,
	x1: number,
	y1: number,
	tension = 0.45,
) {
	const dx = x1 - x0;
	if (Math.abs(dx) < 1e-6) return `M${x0},${y0}L${x1},${y1}`;
	const t = Math.min(0.5, Math.max(0.05, tension));
	return `M${x0},${y0}C${x0 + dx * t},${y0} ${x1 - dx * t},${y1} ${x1},${y1}`;
}

export function projectionExtent(points: ProjectionPoint[]) {
	if (points.length < 2) return null;
	const times = points.map((p) => p.date.getTime());
	const values = points.map((p) => p.value);
	return {
		x: [Math.min(...times), Math.max(...times)] as [number, number],
		y: [Math.min(...values), Math.max(...values)] as [number, number],
	};
}

/** Keeps the end marker inside the plot by padding the visible end by the marker radius. */
export function visibleEndX(
	endX: number,
	innerWidth: number,
	radius: number,
	stroke: number,
) {
	return Math.min(endX, Math.max(0, innerWidth - (radius + stroke * 0.5 + 1)));
}
