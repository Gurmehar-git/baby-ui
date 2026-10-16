import { scaleLinear } from "d3-scale";

export interface RadarMetric {
	key: string;
	label: string;
}

export interface RadarSeries {
	/** Legend and config key; defaults to the label. */
	key?: string;
	label: string;
	values: Record<string, number>;
	/** Defaults to the next `--chart-N` slot in order. */
	color?: string;
}

export interface Point {
	x: number;
	y: number;
}

/** Enter timing in seconds, before the reduced-motion gate. */
export const RADAR_TIMING = {
	gridStagger: 0.08,
	levelLabelStep: 0.06,
	axisStagger: 0.05,
	labelStagger: 0.08,
	labelFade: 500,
	areaBase: 0.2,
	areaStagger: 0.15,
	areaFade: 150,
} as const;

export const RADAR_SPRING = {
	grid: { stiffness: 100, damping: 15 },
	axis: { stiffness: 80, damping: 15 },
	hover: { stiffness: 400, damping: 25 },
} as const;

/** Dash per series slot, so series stay apart without colour. */
export const SERIES_DASH = ["", "6 4", "2 4", "10 4 2 4", "1 3"] as const;

export const seriesKey = (series: RadarSeries) => series.key ?? series.label;

export const seriesColor = (series: RadarSeries, index: number) =>
	series.color ?? `var(--chart-${(index % 5) + 1})`;

export const seriesDash = (index: number) =>
	SERIES_DASH[index % SERIES_DASH.length] ?? "";

/** First metric points straight up, the rest go clockwise. */
export function angleAt(index: number, count: number): number {
	return (index * Math.PI * 2) / Math.max(1, count) - Math.PI / 2;
}

export function pointAt(index: number, count: number, radius: number): Point {
	const angle = angleAt(index, count);
	return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
}

export function polygonPath(points: Point[]): string {
	if (points.length === 0) return "";
	return `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")} Z`;
}

export function ringPath(
	shape: "polygon" | "circle",
	count: number,
	radius: number,
): string {
	if (shape === "circle") {
		return `M 0,${-radius} A ${radius} ${radius} 0 1 1 0,${radius} A ${radius} ${radius} 0 1 1 0,${-radius} Z`;
	}
	return polygonPath(Array.from({ length: count }, (_, i) => pointAt(i, count, radius)));
}

/** Nice ceiling over every value, so ring labels land on round numbers. */
export function niceMax(series: RadarSeries[], metrics: RadarMetric[]): number {
	let max = 0;
	for (const s of series) {
		for (const m of metrics) {
			const value = s.values[m.key];
			if (typeof value === "number" && value > max) max = value;
		}
	}
	return scaleLinear()
		.domain([0, max || 1])
		.nice()
		.domain()[1] as number;
}

/** Marker per series slot: circle, square, diamond, triangle, cross, centred on 0,0. */
export function markerPath(index: number, r: number): string {
	switch (index % 5) {
		case 1:
			return `M ${-r},${-r} H ${r} V ${r} H ${-r} Z`;
		case 2:
			return `M 0,${-r * 1.3} L ${r * 1.3},0 L 0,${r * 1.3} L ${-r * 1.3},0 Z`;
		case 3:
			return `M 0,${-r * 1.3} L ${r * 1.2},${r} L ${-r * 1.2},${r} Z`;
		case 4:
			return `M ${-r},${-r * 0.35} H ${-r * 0.35} V ${-r} H ${r * 0.35} V ${-r * 0.35} H ${r} V ${r * 0.35} H ${r * 0.35} V ${r} H ${-r * 0.35} V ${r * 0.35} H ${-r} Z`;
		default:
			return `M ${-r},0 A ${r} ${r} 0 1 0 ${r},0 A ${r} ${r} 0 1 0 ${-r},0 Z`;
	}
}

export function seriesPoints(
	series: RadarSeries,
	metrics: RadarMetric[],
	radius: number,
	max: number,
	progress = 1,
): Point[] {
	return metrics.map((m, i) => {
		const value = series.values[m.key] ?? 0;
		return pointAt(
			i,
			metrics.length,
			(Math.max(0, value) / (max || 1)) * radius * progress,
		);
	});
}
