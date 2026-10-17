import { type Datum, type Domain, niceDomain } from "../chart/core";
import { CHART_DURATION, type SpringConfig } from "../chart/motion";

export interface Ohlc {
	open: number;
	high: number;
	low: number;
	close: number;
}

export interface CandleGeometry {
	index: number;
	x: number;
	up: boolean;
	bodyTop: number;
	bodyHeight: number;
	wickTop: number;
	wickBottom: number;
}

/** Default candle enter: `{ type: "spring", duration: 0.8, bounce: 0.15 }` solved to k and c. */
export const CANDLE_SPRING: SpringConfig = { stiffness: 117.98, damping: 18.47 };
export const CANDLE_FADE = 150;
export const CANDLE_CONCEAL = 450;

export function readOhlc(datum: Datum): Ohlc | null {
	const { open, high, low, close } = datum;
	if (
		typeof open !== "number" ||
		typeof high !== "number" ||
		typeof low !== "number" ||
		typeof close !== "number"
	)
		return null;
	return { open, high, low, close };
}

/** Low-to-high with 5% padding: prices never sit on zero, unlike a series domain. */
export function ohlcDomain(data: Datum[]): Domain {
	let min = Number.POSITIVE_INFINITY;
	let max = Number.NEGATIVE_INFINITY;
	for (const datum of data) {
		const ohlc = readOhlc(datum);
		if (!ohlc) continue;
		min = Math.min(min, ohlc.low);
		max = Math.max(max, ohlc.high);
	}
	if (min === Number.POSITIVE_INFINITY) return niceDomain([0, 100]);
	const pad = (max - min) * 0.05 || 1;
	return niceDomain([min - pad, max + pad]);
}

export function candleGeometry(
	data: Datum[],
	x: (datum: Datum) => number,
	y: (value: number) => number,
): CandleGeometry[] {
	const out: CandleGeometry[] = [];
	data.forEach((datum, index) => {
		const ohlc = readOhlc(datum);
		if (!ohlc) return;
		const open = y(ohlc.open);
		const close = y(ohlc.close);
		const bodyTop = Math.min(open, close);
		out.push({
			index,
			x: x(datum),
			up: ohlc.close >= ohlc.open,
			bodyTop,
			bodyHeight: Math.max(1, Math.abs(close - open)),
			wickTop: Math.min(y(ohlc.high), y(ohlc.low)),
			wickBottom: Math.max(y(ohlc.high), y(ohlc.low)),
		});
	});
	return out;
}

/** Staggers candles across 60% of the enter duration. */
export function candleStagger(count: number): number {
	return count > 0 ? (0.6 * CHART_DURATION.enter) / count : 0;
}

/** A config colour wins; otherwise the positive and negative chart tokens. */
export function candleColor(key: string, up: boolean): string {
	return `var(--color-${key}, var(--chart-${up ? "positive" : "negative"}))`;
}
