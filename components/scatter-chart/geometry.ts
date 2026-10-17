import { type Datum, type Domain, niceDomain } from "../chart/core";
import { CHART_DURATION } from "../chart/motion";
import type { ScatterShape } from "./variants";

/** Marker enter: opacity and a 2px blur settle over 500ms. */
export const POINT_ENTER = 500;
export const POINT_BLUR = 2;
export const POINT_CONCEAL = 450;

/** Scatter reads spread, not magnitude, so the domain hugs the data instead of starting at zero. */
export function scatterDomain(data: Datum[], keys: string[]): Domain {
	let min = Number.POSITIVE_INFINITY;
	let max = Number.NEGATIVE_INFINITY;
	for (const datum of data) {
		for (const key of keys) {
			const value = datum[key];
			if (typeof value !== "number" || !Number.isFinite(value)) continue;
			min = Math.min(min, value);
			max = Math.max(max, value);
		}
	}
	if (min === Number.POSITIVE_INFINITY) return niceDomain([0, 100]);
	const pad = (max - min) * 0.08 || 1;
	return niceDomain([min - pad, max + pad]);
}

/** Points appear as the reveal edge passes them. */
export function enterDelay(x: number, radius: number, innerWidth: number): number {
	if (innerWidth <= 0) return 0;
	return (Math.max(0, x - radius) / innerWidth) * CHART_DURATION.enter;
}

export interface NearestHit {
	index: number;
	key: string;
}

/** True 2D nearest point across every visible series, not an x-only bisect. */
export function nearestPoint(
	data: Datum[],
	keys: string[],
	px: number,
	py: number,
	x: (datum: Datum) => number,
	y: (value: number) => number,
): NearestHit | null {
	let best: NearestHit | null = null;
	let bestDistance = Number.POSITIVE_INFINITY;
	data.forEach((datum, index) => {
		const dx = x(datum) - px;
		for (const key of keys) {
			const value = datum[key];
			if (typeof value !== "number" || !Number.isFinite(value)) continue;
			const dy = y(value) - py;
			const distance = dx * dx + dy * dy;
			if (distance < bestDistance) {
				bestDistance = distance;
				best = { index, key };
			}
		}
	});
	return best;
}

/** Marker outlines centred on the origin, so every shape shares one transform. */
export function shapePath(shape: ScatterShape, r: number): string {
	switch (shape) {
		case "square": {
			const s = r * 0.9;
			return `M${-s},${-s}H${s}V${s}H${-s}Z`;
		}
		case "diamond": {
			const s = r * 1.25;
			return `M0,${-s}L${s},0L0,${s}L${-s},0Z`;
		}
		case "triangle": {
			const s = r * 1.25;
			return `M0,${-s}L${s * 0.95},${s * 0.6}L${-s * 0.95},${s * 0.6}Z`;
		}
		default:
			return `M${-r},0a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0`;
	}
}
