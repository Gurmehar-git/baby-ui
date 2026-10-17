import { bisector } from "d3-array";
import type { Datum } from "../chart/core";

export interface LivePoint {
	/** Unix seconds. */
	time: number;
	value: number;
}

export interface LiveFrame {
	/** Wall-clock ms the viewport ends at, before the leading offset. */
	now: number;
	yMin: number;
	yMax: number;
	displayValue: number;
}

export type Momentum = "up" | "down" | "flat";

/** The per-frame lerp was tuned at 60fps; this is its frame-rate independent form. */
const REFERENCE_FRAME_MS = 1000 / 60;
/** Longer gaps (a stalled tab) settle in one step instead of overshooting the maths. */
const MAX_STEP_MS = 250;

export function smoothingFactor(elapsedMs: number, lerpSpeed: number): number {
	if (lerpSpeed >= 1) return 1;
	const dt = Math.min(Math.max(elapsedMs, 0), MAX_STEP_MS);
	return 1 - (1 - lerpSpeed) ** (dt / REFERENCE_FRAME_MS);
}

/** Equivalent exponential time constant in ms, for docs and measurement. */
export function smoothingTau(lerpSpeed: number): number {
	return -REFERENCE_FRAME_MS / Math.log(1 - lerpSpeed);
}

export function targetRange(
	data: LivePoint[],
	value: number,
	exaggerate: boolean,
): { yMin: number; yMax: number } {
	if (data.length === 0) return { yMin: 0, yMax: 100 };
	let min = value;
	let max = value;
	for (const point of data) {
		if (point.value < min) min = point.value;
		if (point.value > max) max = point.value;
	}
	const pad = (max - min) * (exaggerate ? 0.03 : 0.15) || (exaggerate ? 0.04 : 10);
	return { yMin: min - pad, yMax: max + pad };
}

/** Expansion snaps so a spike is never clipped; contraction and the value ease. */
export function nextFrame(
	prev: LiveFrame,
	target: { yMin: number; yMax: number },
	value: number,
	factor: number,
	now: number,
): LiveFrame {
	return {
		now,
		yMin:
			target.yMin < prev.yMin
				? target.yMin
				: prev.yMin + (target.yMin - prev.yMin) * factor,
		yMax:
			target.yMax > prev.yMax
				? target.yMax
				: prev.yMax + (target.yMax - prev.yMax) * factor,
		displayValue: prev.displayValue + (value - prev.displayValue) * factor,
	};
}

export function settled(
	frame: LiveFrame,
	target: { yMin: number; yMax: number },
	value: number,
) {
	const span = Math.max(Math.abs(frame.yMax - frame.yMin), 1e-9);
	const eps = span * 1e-4;
	return (
		Math.abs(frame.displayValue - value) < eps &&
		Math.abs(frame.yMin - target.yMin) < eps &&
		Math.abs(frame.yMax - target.yMax) < eps
	);
}

const bisectTime = bisector<LivePoint, number>((d) => d.time).left;

export function interpolateAt(points: LivePoint[], timeSec: number): number | null {
	const first = points[0];
	const last = points.at(-1);
	if (!first || !last) return null;
	if (timeSec <= first.time) return first.value;
	if (timeSec >= last.time) return last.value;
	const hi = bisectTime(points, timeSec, 1);
	const a = points[hi - 1];
	const b = points[hi];
	if (!a || !b) return null;
	const span = b.time - a.time;
	return span === 0
		? a.value
		: a.value + ((b.value - a.value) * (timeSec - a.time)) / span;
}

export function nearestPointIndex(points: LivePoint[], timeSec: number): number {
	if (points.length === 0) return -1;
	const hi = bisectTime(points, timeSec, 1);
	const a = points[hi - 1];
	const b = points[hi];
	if (!a) return 0;
	if (!b) return hi - 1;
	return timeSec - a.time > b.time - timeSec ? hi : hi - 1;
}

/** Window points plus a virtual live tip at `now` and one queued a tick ahead. */
export function liveRecords(
	data: LivePoint[],
	frame: LiveFrame,
	windowStartMs: number,
	queueMs: number,
	dataKey: string,
): Datum[] {
	let start = bisectTime(data, windowStartMs / 1000);
	if (start > 0) start--;
	const records: Datum[] = [];
	for (let i = start; i < data.length; i++) {
		const point = data[i] as LivePoint;
		records.push({ date: new Date(point.time * 1000), [dataKey]: point.value });
	}
	records.push({ date: new Date(frame.now), [dataKey]: frame.displayValue });
	records.push({ date: new Date(frame.now + queueMs), [dataKey]: frame.displayValue });
	return records;
}

/** Detects against the last five samples vs. the recent range, with a 12% dead band. */
export function detectMomentum(values: number[], lookback = 20): Momentum {
	if (values.length < 5) return "flat";
	const start = Math.max(0, values.length - lookback);
	let min = Number.POSITIVE_INFINITY;
	let max = Number.NEGATIVE_INFINITY;
	for (let i = start; i < values.length; i++) {
		const v = values[i] as number;
		if (v < min) min = v;
		if (v > max) max = v;
	}
	const range = max - min;
	if (range === 0) return "flat";
	const first = values[Math.max(start, values.length - 5)] as number;
	const delta = (values.at(-1) as number) - first;
	if (delta > range * 0.12) return "up";
	if (delta < -range * 0.12) return "down";
	return "flat";
}

/** Nice tick step about `minGap` px apart; keeps the previous step while it still fits. */
export function niceInterval(
	range: number,
	height: number,
	minGap: number,
	previous: number,
): number {
	if (range <= 0 || height <= 0) return 1;
	const pxPerUnit = height / range;
	if (previous > 0) {
		const px = previous * pxPerUnit;
		if (px >= minGap * 0.5 && px <= minGap * 3) return previous;
	}
	let best = Number.POSITIVE_INFINITY;
	for (const divisors of [
		[2, 2.5, 2],
		[2, 2, 2.5],
		[2.5, 2, 2],
	]) {
		let span = 10 ** Math.ceil(Math.log10(range));
		let i = 0;
		while ((span / (divisors[i % 3] as number)) * pxPerUnit >= minGap) {
			span /= divisors[i % 3] as number;
			i++;
		}
		if (span < best) best = span;
	}
	return Number.isFinite(best) ? best : range / 5;
}

export function tickValues(min: number, max: number, interval: number): number[] {
	if (interval <= 0 || max <= min) return [];
	const values: number[] = [];
	const first = Math.ceil((min - interval * 0.5) / interval) * interval;
	for (let v = first; v <= max + interval * 0.5; v += interval) {
		values.push(Math.round(v * 1e10) / 1e10);
	}
	return values;
}

const EDGE_FADE_PX = 28;

/** Labels fade as they near the plot's top and bottom edges. */
export function edgeOpacity(y: number, height: number): number {
	const fromEdge = Math.min(y, height - y);
	if (fromEdge >= EDGE_FADE_PX) return 1;
	return fromEdge <= 0 ? 0 : fromEdge / EDGE_FADE_PX;
}

export const LIVE_TICKER_CLEARANCE = 50;
const LIVE_FADE_BUFFER = 20;

export function crosshairFade(x: number, crosshair: number | null): number {
	if (crosshair === null) return 1;
	const distance = Math.abs(x - crosshair);
	if (distance < LIVE_TICKER_CLEARANCE) return 0;
	if (distance < LIVE_TICKER_CLEARANCE + LIVE_FADE_BUFFER)
		return (distance - LIVE_TICKER_CLEARANCE) / LIVE_FADE_BUFFER;
	return 1;
}
