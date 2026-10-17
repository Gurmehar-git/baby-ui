import type { Datum } from "../chart/core";

const DAY = 86_400_000;

export type HeatmapLevel = 0 | 1 | 2 | 3 | 4;
export const HEATMAP_LEVELS: readonly HeatmapLevel[] = [0, 1, 2, 3, 4];

export interface HeatmapCell {
	index: number;
	/** Week column and weekday row. */
	col: number;
	row: number;
	date: Date;
	value: number;
	level: HeatmapLevel;
}

export interface HeatmapCalendar {
	cells: HeatmapCell[];
	weeks: number;
	/** First column of each month, for axis labels. */
	months: { col: number; date: Date }[];
	/** Weekday date for each row, for axis labels. */
	weekdays: Date[];
	max: number;
}

/** 0 is Sunday. Week info of the locale dates format in, where the runtime exposes it, else Sunday. */
export function localeWeekStart(locale?: string): number {
	try {
		const info = new Intl.Locale(
			locale ?? new Intl.DateTimeFormat().resolvedOptions().locale,
		) as Intl.Locale & {
			getWeekInfo?: () => { firstDay: number };
			weekInfo?: { firstDay: number };
		};
		const firstDay = (info.getWeekInfo?.() ?? info.weekInfo)?.firstDay;
		return firstDay ? firstDay % 7 : 0;
	} catch {
		return 0;
	}
}

const startOfDay = (date: Date) => {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
};

/** Five levels: 0 for nothing, then quarters of the max unless `thresholds` pins the cut points. */
export function levelOf(
	value: number,
	max: number,
	thresholds?: readonly number[],
): HeatmapLevel {
	if (!(value > 0)) return 0;
	if (thresholds?.length) {
		let level = 1;
		for (const cut of thresholds) if (value > cut) level++;
		return Math.min(4, level) as HeatmapLevel;
	}
	return Math.min(4, Math.max(1, Math.ceil((value / (max || 1)) * 4))) as HeatmapLevel;
}

/** Every day from the first to the last row, missing days as 0, laid out in week columns. */
export function buildCalendar(
	data: Datum[],
	options: {
		dateKey: string;
		valueKey: string;
		weekStart: number;
		thresholds?: readonly number[];
	},
): HeatmapCalendar {
	const { dateKey, valueKey, weekStart, thresholds } = options;
	const values = new Map<number, number>();
	for (const row of data) {
		const raw = row[dateKey];
		const date = startOfDay(raw instanceof Date ? raw : new Date(raw as string | number));
		if (Number.isNaN(date.getTime())) continue;
		const value = Number(row[valueKey]);
		values.set(
			date.getTime(),
			(values.get(date.getTime()) ?? 0) + (Number.isFinite(value) ? value : 0),
		);
	}
	const times = [...values.keys()].sort((a, b) => a - b);
	const first = times[0];
	const last = times.at(-1);
	if (first === undefined || last === undefined)
		return { cells: [], weeks: 0, months: [], weekdays: [], max: 0 };
	const lead = (new Date(first).getDay() - weekStart + 7) % 7;
	const gridStart = new Date(first);
	gridStart.setDate(gridStart.getDate() - lead);
	const max = Math.max(0, ...values.values());
	const cells: HeatmapCell[] = [];
	const months: { col: number; date: Date }[] = [];
	for (
		let d = new Date(first), i = 0;
		d.getTime() <= last;
		d.setDate(d.getDate() + 1), i++
	) {
		const date = new Date(d);
		const offset = Math.round((startOfDay(date).getTime() - gridStart.getTime()) / DAY);
		const col = Math.floor(offset / 7);
		const value = values.get(date.getTime()) ?? 0;
		if (date.getDate() === 1 || i === 0) {
			const prev = months.at(-1);
			if (!prev || prev.col < col || i === 0) months.push({ col, date });
		}
		cells.push({
			index: i,
			col,
			row: offset % 7,
			date,
			value,
			level: levelOf(value, max, thresholds),
		});
	}
	const weekdays = Array.from(
		{ length: 7 },
		(_, row) => new Date(gridStart.getTime() + row * DAY),
	);
	return { cells, weeks: (cells.at(-1)?.col ?? 0) + 1, months, weekdays, max };
}

/** A seeded Park-Miller generator, so reveal and shimmer are identical on every render. */
export function seeded(seed: number): () => number {
	let state = seed % 2_147_483_647;
	if (state <= 0) state += 2_147_483_646;
	return () => {
		state = (state * 16_807) % 2_147_483_647;
		return (state - 1) / 2_147_483_646;
	};
}

export const cellSeed = (col: number, row: number) => col * 1009 + row * 9176;

export const HEATMAP_TIMING = {
	enter: 1600,
	conceal: 450,
	hover: 220,
	/** Share of the spare enter window used for random delays. */
	spread: 0.6,
	enterEase: "cubic-bezier(0.85, 0, 0.916, 0.282)",
	hoverEase: "cubic-bezier(0.4, 0, 0.2, 1)",
	faded: 0.3,
	loadingBase: 0.2,
	loadingMax: 0.85,
} as const;

/** Per-cell delay; with the default 1600ms fade the spread is zero and cells fade together. */
export function enterDelay(
	col: number,
	row: number,
	epoch: number,
	fade = HEATMAP_TIMING.enter,
) {
	const spare = Math.max(0, HEATMAP_TIMING.enter - fade);
	return seeded(cellSeed(col, row) + epoch * 524_287)() * spare * HEATMAP_TIMING.spread;
}

export type HeatmapPhase = "revealing" | "ready" | "concealing" | "loading";

/** Status flips conceal (450ms) into loading, or reveal (1600ms) into ready; completion advances. */
export function heatmapNext(
	phase: HeatmapPhase,
	event: "status-ready" | "status-loading" | "done",
): HeatmapPhase {
	if (event === "status-ready")
		return phase === "loading" || phase === "concealing" ? "revealing" : phase;
	if (event === "status-loading")
		return phase === "ready" || phase === "revealing" ? "concealing" : phase;
	if (phase === "revealing") return "ready";
	if (phase === "concealing") return "loading";
	return phase;
}

/** Pattern per level, so the level reads without colour. */
export const LEVEL_PATTERN: Record<
	HeatmapLevel,
	"none" | "dots" | "lines" | "cross" | "solid"
> = {
	0: "none",
	1: "dots",
	2: "lines",
	3: "cross",
	4: "solid",
};

export type HeatmapWeekStart = "auto" | "sunday" | "monday";

/** `chart.highlighted` key a legend level sets, so cells and legend share one hover state. */
export const heatmapLevelKey = (level: number) => `heatmap-level-${level}`;

export const HEATMAP_MARGIN = { top: 20, right: 4, bottom: 4, left: 32 } as const;
