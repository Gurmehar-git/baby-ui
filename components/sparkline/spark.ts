import { line as d3Line } from "d3-shape";
import {
	CHART_DURATION,
	CHART_SPRING,
	prefersReducedMotion,
	Spring,
	tween,
} from "../chart/motion";

type Point = [number, number];
const INSET = 5;
const CAP = 1.25;
const GRID = Array.from({ length: 161 }, (_, index) => index / 160);
const toPath = d3Line<Point>();

/** A dense sampling of a monotone cubic through the data in unit space (y up), so it never overshoots. */
export function sparkCurve(data: readonly number[]): Point[] {
	const values = data.length > 1 ? data : [data[0] ?? 0, data[0] ?? 0];
	const min = Math.min(...values);
	const span = Math.max(...values) - min;
	const ys = values.map((value) => (span ? (value - min) / span : 0.5));
	const last = ys.length - 1;
	const step = 1 / last;
	const at = (list: number[], index: number) => list[index] ?? 0;
	const slopes = ys.slice(1).map((y, index) => (y - at(ys, index)) / step);
	const tangents = ys.map((_, index) => {
		if (index === 0 || index === last) return at(slopes, 0);
		const a = at(slopes, index - 1);
		const b = at(slopes, index);
		return (
			(Math.sign(a) + Math.sign(b)) *
				Math.min(Math.abs(a), Math.abs(b), Math.abs(a + b) / 4) || 0
		);
	});
	if (last > 1) {
		tangents[0] = (3 * at(slopes, 0) - at(tangents, 1)) / 2;
		tangents[last] = (3 * at(slopes, last - 1) - at(tangents, last - 1)) / 2;
	}
	const samples = Math.max(1, Math.min(16, Math.round(128 / last)));
	const points: Point[] = [];
	for (let index = 0; index < last; index++) {
		for (let sample = 0; sample < samples; sample++) {
			const t = sample / samples;
			const t2 = t * t;
			const t3 = t2 * t;
			const y =
				(2 * t3 - 3 * t2 + 1) * at(ys, index) +
				(t3 - 2 * t2 + t) * step * at(tangents, index) +
				(3 * t2 - 2 * t3) * at(ys, index + 1) +
				(t3 - t2) * step * at(tangents, index + 1);
			points.push([(index + t) * step, Math.min(1, Math.max(0, y))]);
		}
	}
	points.push([1, at(ys, last)]);
	return points;
}

function heightAt(shape: Point[], x: number) {
	const first = shape[0];
	const end = shape[shape.length - 1];
	if (!first || !end) return 0.5;
	if (x <= first[0]) return first[1];
	if (x >= end[0]) return end[1];
	let low = 0;
	let high = shape.length - 1;
	while (high - low > 1) {
		const middle = (low + high) >> 1;
		if ((shape[middle]?.[0] ?? 0) < x) low = middle;
		else high = middle;
	}
	const [x0, y0] = shape[low] ?? first;
	const [x1, y1] = shape[high] ?? end;
	return x1 === x0 ? y1 : y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

function tipAt(points: Point[], progress: number) {
	const steps = points.slice(1).map(([x, y], index) => {
		const [px, py] = points[index] ?? [x, y];
		return Math.hypot(x - px, y - py);
	});
	let left = progress * steps.reduce((sum, step) => sum + step, 0);
	for (let index = 0; index < steps.length; index++) {
		const step = steps[index] ?? 0;
		const from = points[index]?.[0] ?? 0;
		if (left <= step)
			return from + ((points[index + 1]?.[0] ?? from) - from) * (step ? left / step : 1);
		left -= step;
	}
	return points[points.length - 1]?.[0] ?? 0;
}

export type SparkParts = {
	svg: SVGSVGElement;
	line: SVGPathElement;
	trail: SVGPathElement;
	area: SVGPathElement | null;
	cursor: SVGLineElement;
	dot: SVGPathElement;
	lit: SVGRectElement;
	dim: SVGRectElement;
	fill: SVGRectElement;
	baseline: SVGLineElement;
};

/**
 * Owns every drawn attribute: the line draws left to right once `reveal` runs, new data morphs
 * from the shape on screen, and the cursor springs along the line to the scrubbed point.
 */
export function createSparkline(
	parts: SparkParts,
	data: readonly number[],
	onLanded: () => void,
) {
	let shape = sparkCurve(data);
	let w = 0;
	let h = 0;
	let drawn = 0;
	let morph: { stop: () => void } | null = null;
	const paint = () => {
		if (!w) return;
		const toY = (y: number) => INSET + (1 - y) * (h - INSET * 2);
		const points = shape.map(([x, y]): Point => [x * w, toY(y)]);
		const path = toPath(points) ?? "";
		const at = cursor.value;
		const cx = at * w;
		const cy = toY(heightAt(shape, at));
		parts.svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
		parts.line.setAttribute("d", path);
		parts.line.style.strokeDashoffset = String(1 - drawn);
		parts.line.style.opacity = drawn > 0.001 ? "1" : "0";
		parts.trail.setAttribute("d", path);
		parts.area?.setAttribute("d", `${path}L${w},${h}L0,${h}Z`);
		parts.dot.setAttribute("d", `M${cx},${cy}h0`);
		parts.cursor.setAttribute("x1", String(cx));
		parts.cursor.setAttribute("x2", String(cx));
		parts.cursor.setAttribute("y2", String(h));
		parts.baseline.setAttribute("x2", String(w));
		parts.baseline.setAttribute("y1", String(h - 0.5));
		parts.baseline.setAttribute("y2", String(h - 0.5));
		parts.lit.setAttribute("width", String(cx + CAP + 16));
		parts.lit.setAttribute("height", String(h + 32));
		parts.dim.setAttribute("x", String(cx + CAP));
		parts.dim.setAttribute("width", String(w + 32));
		parts.dim.setAttribute("height", String(h + 32));
		parts.fill.setAttribute(
			"width",
			String(drawn >= 1 ? w + 32 : tipAt(points, drawn) + 16),
		);
		parts.fill.setAttribute("height", String(h + 32));
	};
	const cursor = new Spring(1, CHART_SPRING.ticker, paint);
	return {
		resize(width: number, height: number) {
			w = width;
			h = height;
			paint();
		},
		reveal() {
			tween({
				duration: CHART_DURATION.enter * 1.4,
				onUpdate: (progress) => {
					drawn = progress;
					paint();
				},
				onComplete: onLanded,
			});
		},
		setData(next: readonly number[]) {
			const target = sparkCurve(next);
			const from = shape;
			morph?.stop();
			if (prefersReducedMotion()) {
				shape = target;
				paint();
				return;
			}
			const xs = [...new Set([...GRID, ...target.map(([x]) => x)])].sort((a, b) => a - b);
			const start = xs.map((x) => heightAt(from, x));
			const goal = xs.map((x) => heightAt(target, x));
			morph = tween({
				duration: CHART_DURATION.update,
				onUpdate: (progress) => {
					shape = xs.map(
						(x, index): Point => [
							x,
							(start[index] ?? 0) + ((goal[index] ?? 0) - (start[index] ?? 0)) * progress,
						],
					);
					paint();
				},
				onComplete: () => {
					shape = target;
					paint();
				},
			});
		},
		/** 0 to 1 along the line. */
		setCursor(at: number) {
			cursor.set(at);
		},
		destroy() {
			morph?.stop();
			cursor.stop();
		},
	};
}

/** The point nearest a pointer's x inside the plot. */
export function pointAt(plot: HTMLElement, clientX: number, last: number) {
	const rect = plot.getBoundingClientRect();
	return rect.width
		? Math.max(0, Math.min(last, Math.round(((clientX - rect.left) / rect.width) * last)))
		: last;
}

/** Arrow, Page, Home and End keys move through points; null leaves the key alone. */
export function scrubKey(key: string, from: number, last: number) {
	const page = Math.max(1, Math.round((last + 1) / 6));
	const next: Record<string, number> = {
		ArrowLeft: from - 1,
		ArrowDown: from - 1,
		ArrowRight: from + 1,
		ArrowUp: from + 1,
		PageDown: from - page,
		PageUp: from + page,
		Home: 0,
		End: last,
	};
	const to = next[key];
	return to === undefined ? null : Math.max(0, Math.min(last, to));
}
