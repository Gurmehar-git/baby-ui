export type MeterStatus = "ok" | "near" | "over";

export interface MeterBar {
	key: string;
	value: number;
	/** Start and width as percentages of the bar. */
	left: number;
	width: number;
}

/** The bar spans the limit, or everything used once that is more, so crossing the limit stays continuous. */
export function meterLayout(
	segments: { key: string; value: number }[],
	limit: number,
	warnAt: number,
) {
	const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);
	const span = Math.max(limit, total, 1e-6);
	let start = 0;
	const bars: MeterBar[] = segments.map((s) => {
		const value = Math.max(0, s.value);
		const bar = {
			key: s.key,
			value,
			left: (start / span) * 100,
			width: (value / span) * 100,
		};
		start += value;
		return bar;
	});
	const status: MeterStatus =
		total > limit ? "over" : total >= limit * warnAt ? "near" : "ok";
	return {
		total,
		free: Math.max(0, limit - total),
		over: Math.max(0, total - limit),
		status,
		limitAt: (limit / span) * 100,
		bars,
	};
}

export const meterTone = {
	ok: "secondary",
	near: "warning",
	over: "destructive",
} as const satisfies Record<MeterStatus, string>;

/** Rounds to `decimals` and drops a trailing ".0", so a 50 GB limit never reads "50.0 GB". */
export function meterNumber(value: number, decimals: number, locale?: string) {
	return new Intl.NumberFormat(locale, { maximumFractionDigits: decimals }).format(value);
}

/** Next legend index for an arrow, Home or End key; null for any other key. */
export function meterKeyStep(key: string, index: number, count: number): number | null {
	const next: Record<string, number> = {
		ArrowRight: index + 1,
		ArrowDown: index + 1,
		ArrowLeft: index - 1,
		ArrowUp: index - 1,
		Home: 0,
		End: count - 1,
	};
	const to = next[key];
	return to === undefined ? null : (to + count) % count;
}
