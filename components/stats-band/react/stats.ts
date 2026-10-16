/**
 * A tiny visual that proves the number: a trend line, one bar per day of uptime, a histogram
 * with bins under `marker` inked, or a dotted world with a dot lit per [longitude, latitude].
 */
export type StatVisual =
	| { kind: "trend"; values: number[] }
	| { kind: "uptime"; days: number[] }
	| { kind: "distribution"; bins: number[]; max: number; marker: number }
	| { kind: "map"; points: [number, number][] };

export interface Stat {
	/** The final number; it counts up from zero once seen. */
	value: number;
	prefix?: string;
	suffix?: string;
	decimals?: number;
	/** `compact` shortens to 2.3M or 12K, counting inside the final unit. */
	notation?: "standard" | "compact";
	label: string;
	/** One supporting line under the number. */
	detail?: string;
	/** Replaces the detail while the stat is hovered or focused. */
	context?: string;
	visual?: StatVisual;
}

/** The stat's number format, split from its compact unit so the unit reads like a suffix. */
export function statFormat(stat: Stat, locale?: string) {
	const decimals = stat.decimals ?? 0;
	const digits = new Intl.NumberFormat(locale, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	});
	if (stat.notation !== "compact")
		return { unit: "", format: (v: number) => digits.format(v) };
	const size = Math.abs(stat.value);
	const scale =
		size >= 1e12 ? 1e12 : size >= 1e9 ? 1e9 : size >= 1e6 ? 1e6 : size >= 1e3 ? 1e3 : 1;
	const unit =
		scale === 1
			? ""
			: (new Intl.NumberFormat(locale, { notation: "compact" })
					.formatToParts(scale)
					.find((part) => part.type === "compact")?.value ?? "");
	return { unit, format: (v: number) => digits.format(v / scale) };
}

export interface StatBar {
	height: number;
	ink: boolean;
}

/** Uptime days as bars: a full day is full height, a day with downtime visibly shorter and inked. */
export const uptimeBars = (days: number[]): StatBar[] =>
	days.map((uptime) => ({
		height: Math.min(1, Math.max(0.3, 1 - (100 - uptime) * 0.7)),
		ink: uptime < 100,
	}));

/** Histogram bins as bars; bins below `marker` (e.g. the median) are inked. */
export function distributionBars(bins: number[], max: number, marker: number): StatBar[] {
	const peak = Math.max(...bins) || 1;
	const width = max / bins.length;
	return bins.map((count, index) => ({
		height: Math.max(0.04, count / peak),
		ink: index * width < marker,
	}));
}

// 80 by 30 cells from 168W to 192E and 76N to 56S; hex rows, four columns per digit, MSB first.
const ROWS = [
	"001f007f800020fc0000",
	"7fc0cc7f00781ffffff8",
	"7ffffe38c0dffffffff8",
	"7fff0e1003bfffffff60",
	"40ffcf0009bffffff0c0",
	"007fff801ffffffff880",
	"003fff0007fffffff000",
	"003ffc001c737fffec00",
	"003ff800181f7fff4800",
	"001ff0000f07ffff3000",
	"000f80001fff7fff0000",
	"000f00003ffb9fff0000",
	"000340003fffc7b80000",
	"0001c0003ffd82380000",
	"000020003ffe021c0000",
	"00001f001fff00100000",
	"00000fc001ff00010000",
	"00000fe001fe00028000",
	"00001ff800fc00080c00",
	"00000ff800fc00000200",
	"000007f800fc00003000",
	"000003f800fd0000fc00",
	"000003f000790001fe00",
	"000007e000780001fe00",
	"000007c000700001de00",
	"00000780000000000e00",
	"00000600000000000008",
	"00000600000000000020",
	"00000400000000000000",
	"00000400000000000000",
];

export const WORLD = {
	columns: 80,
	rows: 30,
	west: -168,
	east: 192,
	north: 76,
	south: -56,
};

const LAND = ROWS.flatMap((row) =>
	[...row].flatMap((digit) => {
		const bits = Number.parseInt(digit, 16);
		return [8, 4, 2, 1].map((bit) => (bits & bit) !== 0);
	}),
);

function cellOf(lon: number, lat: number) {
	const x = Math.floor(
		(((((lon - WORLD.west) % 360) + 360) % 360) / (WORLD.east - WORLD.west)) *
			WORLD.columns,
	);
	const y = Math.floor(((WORLD.north - lat) / (WORLD.north - WORLD.south)) * WORLD.rows);
	return [
		Math.min(WORLD.columns - 1, Math.max(0, x)),
		Math.min(WORLD.rows - 1, Math.max(0, y)),
	] as const;
}

/** Snaps a point to the nearest land dot, so a coastal city never lights the sea. */
function nearestLand(lon: number, lat: number) {
	const [x, y] = cellOf(lon, lat);
	let best = y * WORLD.columns + x;
	let distance = Number.POSITIVE_INFINITY;
	for (let dy = -2; dy <= 2; dy++) {
		for (let dx = -2; dx <= 2; dx++) {
			const cx = x + dx;
			const cy = y + dy;
			if (cx < 0 || cy < 0 || cx >= WORLD.columns || cy >= WORLD.rows) continue;
			if (!LAND[cy * WORLD.columns + cx]) continue;
			const d = dx * dx + dy * dy;
			if (d < distance) {
				distance = d;
				best = cy * WORLD.columns + cx;
			}
		}
	}
	return best;
}

/** Land dots as cell centres, with the ones nearest `points` lit. */
export function worldDots(points: [number, number][]) {
	const lit = new Set(points.map(([lon, lat]) => nearestLand(lon, lat)));
	return LAND.flatMap((land, index) =>
		land || lit.has(index)
			? [
					{
						key: index,
						x: (index % WORLD.columns) + 0.5,
						y: Math.floor(index / WORLD.columns) + 0.5,
						lit: lit.has(index),
					},
				]
			: [],
	);
}
