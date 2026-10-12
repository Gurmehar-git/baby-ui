import {
	area,
	curveMonotoneX,
	stack,
	stackOffsetNone,
	stackOffsetSilhouette,
	stackOffsetWiggle,
	stackOrderInsideOut,
	stackOrderNone,
} from "d3-shape";
import type { Datum } from "../chart/core";

export type StreamOffset = "wiggle" | "silhouette" | "zero";
/** Per layer, per point: [bottom, top] in value units. */
export type StreamLayers = { key: string; points: [number, number][] }[];

const value = (datum: Datum, key: string) => {
	const raw = datum[key];
	return typeof raw === "number" && Number.isFinite(raw) ? Math.max(0, raw) : 0;
};

/** Stacks the series; hidden keys stay as zero-height layers so toggling them morphs. */
export function streamLayers(
	data: Datum[],
	keys: string[],
	hidden: ReadonlySet<string>,
	offset: StreamOffset,
): StreamLayers {
	const layout = stack<Datum, string>()
		.keys(keys)
		.value((datum, key) => (hidden.has(key) ? 0 : value(datum, key)))
		.order(offset === "zero" ? stackOrderNone : stackOrderInsideOut)
		.offset(
			offset === "wiggle"
				? stackOffsetWiggle
				: offset === "silhouette"
					? stackOffsetSilhouette
					: stackOffsetNone,
		);
	return layout(data).map((series) => ({
		key: series.key,
		points: series.map((point): [number, number] => [
			Number.isFinite(point[0]) ? point[0] : 0,
			Number.isFinite(point[1]) ? point[1] : 0,
		]),
	}));
}

export function streamExtent(layers: StreamLayers): [number, number] {
	let lo = 0;
	let hi = 0;
	for (const layer of layers)
		for (const [bottom, top] of layer.points) {
			lo = Math.min(lo, bottom);
			hi = Math.max(hi, top);
		}
	return hi - lo > 0 ? [lo, hi] : [0, 1];
}

/** Blends two stacks point by point; differing shapes jump straight to the target. */
export function blendLayers(
	from: StreamLayers | null,
	to: StreamLayers,
	t: number,
): StreamLayers {
	if (!from || t >= 1) return to;
	const old = new Map(from.map((layer) => [layer.key, layer.points]));
	return to.map((layer) => {
		const was = old.get(layer.key);
		if (!was || was.length !== layer.points.length) return layer;
		return {
			key: layer.key,
			points: layer.points.map(([b, top], i): [number, number] => {
				const [wb, wt] = was[i] ?? [b, top];
				return [wb + (b - wb) * t, wt + (top - wt) * t];
			}),
		};
	});
}

export function streamPath(
	points: [number, number][],
	sx: (index: number) => number,
	sy: (value: number) => number,
) {
	return (
		area<[number, number]>()
			.x((_, index) => sx(index))
			.y0((point) => sy(point[0]))
			.y1((point) => sy(point[1]))
			.curve(curveMonotoneX)(points) ?? ""
	);
}

/** The layer under a point at a given index, by its stacked band. */
export function layerAt(layers: StreamLayers, index: number, valueAt: number) {
	for (const layer of layers) {
		const point = layer.points[index];
		if (point && point[1] - point[0] > 0 && valueAt >= point[0] && valueAt <= point[1])
			return layer.key;
	}
	return null;
}

/** Where a layer is thickest, for a direct label that fits inside it. */
export function widestStretch(points: [number, number][]) {
	let best = 0;
	let thickness = 0;
	points.forEach(([bottom, top], index) => {
		if (top - bottom > thickness) {
			thickness = top - bottom;
			best = index;
		}
	});
	const [bottom, top] = points[best] ?? [0, 0];
	return { index: best, middle: (bottom + top) / 2, thickness };
}

/** Axis labels that fit: at most one per 72px, counted back from the latest. */
export function axisPicks(count: number, width: number) {
	if (!count || !width) return [];
	const stride = Math.ceil(count / Math.max(2, Math.floor(width / 72)));
	const picks: number[] = [];
	for (let index = count - 1; index >= 0; index -= stride) picks.unshift(index);
	return picks;
}
