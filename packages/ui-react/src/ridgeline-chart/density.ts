export type RidgelineSeries = {
	/** Stable identity; a ridge that survives a data change morphs into its new shape. */
	id: string;
	label: string;
	/** Raw observations; the ridge is a smoothed density of these. */
	values: number[];
};
export type RidgeStats = {
	q1: number;
	median: number;
	q3: number;
	min: number;
	max: number;
	n: number;
	sorted: number[];
};
export type RidgeShape = {
	id: string;
	label: string;
	xs: number[];
	ys: number[];
	row: number;
	stats: RidgeStats;
};
export type RidgeModel = {
	shapes: RidgeShape[];
	lo: number;
	hi: number;
	ticks: number[];
};

const SAMPLES = 96;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

function quantile(sorted: number[], q: number) {
	if (!sorted.length) return 0;
	const at = (sorted.length - 1) * q;
	const low = sorted[Math.floor(at)] ?? 0;
	const high = sorted[Math.ceil(at)] ?? low;
	return low + (high - low) * (at - Math.floor(at));
}

export function ridgeStats(values: number[]): RidgeStats {
	const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
	return {
		sorted,
		n: sorted.length,
		min: sorted[0] ?? 0,
		max: sorted[sorted.length - 1] ?? 0,
		q1: quantile(sorted, 0.25),
		median: quantile(sorted, 0.5),
		q3: quantile(sorted, 0.75),
	};
}

/** Silverman's rule of thumb for the kernel width. */
function silverman(stats: RidgeStats) {
	if (stats.n < 2) return 1;
	const mean = stats.sorted.reduce((sum, value) => sum + value, 0) / stats.n;
	const sd = Math.sqrt(
		stats.sorted.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (stats.n - 1),
	);
	const spread = Math.min(sd, (stats.q3 - stats.q1) / 1.34 || sd);
	return Math.max(1e-6, 0.9 * (spread || 1) * stats.n ** -0.2);
}

function niceStep(span: number, count: number) {
	const raw = span / Math.max(1, count) || 1;
	const power = 10 ** Math.floor(Math.log10(raw));
	const unit = raw / power;
	return (unit >= 5 ? 5 : unit >= 2 ? 2 : 1) * power;
}

/** A Gaussian kernel density sampled across the domain. */
function density(stats: RidgeStats, lo: number, hi: number, bandwidth: number) {
	const xs: number[] = [];
	const ys: number[] = [];
	const norm = 1 / (Math.max(1, stats.n) * bandwidth * Math.sqrt(2 * Math.PI));
	for (let i = 0; i < SAMPLES; i++) {
		const x = lo + ((hi - lo) * i) / (SAMPLES - 1);
		let sum = 0;
		for (const value of stats.sorted) {
			const u = (x - value) / bandwidth;
			if (u > -5 && u < 5) sum += Math.exp(-0.5 * u * u);
		}
		xs.push(x);
		ys.push(sum * norm);
	}
	return { xs, ys };
}

/** One density per series on a shared domain, scaled so the tallest peak of all is 1. */
export function ridgeModel(
	series: RidgelineSeries[],
	domain?: [number, number],
	bandwidth?: number,
): RidgeModel {
	const stats = series.map((entry) => ridgeStats(entry.values));
	const widths = stats.map((entry) => bandwidth ?? silverman(entry));
	const filled = stats
		.map((entry, index) => ({ entry, room: 2.5 * (widths[index] ?? 1) }))
		.filter(({ entry }) => entry.n);
	let lo = domain?.[0] ?? Math.min(...filled.map(({ entry, room }) => entry.min - room));
	let hi = domain?.[1] ?? Math.max(...filled.map(({ entry, room }) => entry.max + room));
	if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo === hi) {
		lo = 0;
		hi = 1;
	}
	const step = niceStep(hi - lo, 5);
	if (!domain) {
		lo = Math.floor(lo / step) * step;
		hi = Math.ceil(hi / step) * step;
	}
	const curves = stats.map((entry, index) =>
		entry.n
			? density(entry, lo, hi, widths[index] ?? 1)
			: {
					xs: Array.from(
						{ length: SAMPLES },
						(_, i) => lo + ((hi - lo) * i) / (SAMPLES - 1),
					),
					ys: new Array<number>(SAMPLES).fill(0),
				},
	);
	const peak = Math.max(1e-9, ...curves.flatMap((curve) => curve.ys));
	const shapes = series.map((entry, row) => {
		const curve = curves[row] ?? { xs: [], ys: [] };
		return {
			id: entry.id,
			label: entry.label,
			xs: curve.xs,
			ys: curve.ys.map((y) => y / peak),
			row,
			stats: stats[row] ?? ridgeStats([]),
		};
	});
	const ticks: number[] = [];
	for (let at = Math.ceil(lo / step) * step; at <= hi + step * 1e-6; at += step)
		ticks.push(Number(at.toFixed(10)));
	return { shapes, lo, hi, ticks };
}

/** Height of a ridge at x, straight between samples. */
export function ridgeHeight(shape: RidgeShape, x: number) {
	const { xs, ys } = shape;
	const first = xs[0] ?? 0;
	const last = xs[xs.length - 1] ?? 0;
	if (x <= first || x >= last) return 0;
	let i = 1;
	while (i < xs.length - 1 && (xs[i] ?? 0) < x) i++;
	const x0 = xs[i - 1] ?? 0;
	const x1 = xs[i] ?? x0;
	return mix(ys[i - 1] ?? 0, ys[i] ?? 0, (x - x0) / (x1 - x0 || 1));
}

/** Blends models by series id; new ridges grow from flat, so a dataset switch morphs. */
export function blendModel(
	from: RidgeModel | null,
	to: RidgeModel,
	t: number,
): RidgeModel {
	if (!from || t >= 1) return to;
	const old = new Map(from.shapes.map((shape) => [shape.id, shape]));
	return {
		lo: mix(from.lo, to.lo, t),
		hi: mix(from.hi, to.hi, t),
		ticks: to.ticks,
		shapes: to.shapes.map((shape) => {
			const was = old.get(shape.id);
			return {
				...shape,
				xs: shape.xs.map((x, i) => mix(was?.xs[i] ?? x, x, t)),
				ys: shape.ys.map((y, i) => mix(was?.ys[i] ?? 0, y, t)),
			};
		}),
	};
}

/** SVG path of a ridge from `from` to `to` in value units, closed to its baseline for fills. */
export function ridgePath(
	shape: RidgeShape,
	sx: (value: number) => number,
	base: number,
	lift: number,
	closed: boolean,
	from = Number.NEGATIVE_INFINITY,
	to = Number.POSITIVE_INFINITY,
) {
	const points: string[] = [];
	const push = (x: number, y: number) =>
		points.push(`${sx(x).toFixed(2)},${(base - y * lift).toFixed(2)}`);
	if (from > Number.NEGATIVE_INFINITY) push(from, ridgeHeight(shape, from));
	shape.xs.forEach((x, i) => {
		if (x > from && x < to) push(x, shape.ys[i] ?? 0);
	});
	if (to < Number.POSITIVE_INFINITY) push(to, ridgeHeight(shape, to));
	if (!points.length) return "";
	const first = from > Number.NEGATIVE_INFINITY ? from : (shape.xs[0] ?? 0);
	const last = to < Number.POSITIVE_INFINITY ? to : (shape.xs[shape.xs.length - 1] ?? 0);
	return closed
		? `M${sx(first).toFixed(2)},${base}L${points.join("L")}L${sx(last).toFixed(2)},${base}Z`
		: `M${points.join("L")}`;
}

/** Light-to-full tint by median, so warmer distributions read deeper. */
export function medianTint(median: number, shapes: RidgeShape[]) {
	const medians = shapes
		.filter((shape) => shape.stats.n)
		.map((shape) => shape.stats.median);
	const lo = Math.min(...medians);
	const hi = Math.max(...medians);
	const t = hi > lo ? (median - lo) / (hi - lo) : 1;
	return Math.round(24 + t * 76);
}
