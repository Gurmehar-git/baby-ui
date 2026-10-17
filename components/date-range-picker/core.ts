import { DATE_FIELD_LABELS, type DateFieldLabels } from "../date-field/core";

/** A calendar day without a time or zone: React converts to `Date`, Svelte to `CalendarDate`. */
export type RangeDateParts = { year: number; month: number; day: number };
export type DateRangeParts = { from: RangeDateParts; to: RangeDateParts };

export type DateRangePreset = {
	label: string;
	/** Builds the range from today, so presets stay right across midnight. */
	range: (today: RangeDateParts) => DateRangeParts;
};

export interface DateRangePickerLabels extends DateFieldLabels {
	start: string;
	end: string;
	choose: string;
	reversed: string;
	presets: string;
	apply: string;
	cancel: string;
}

export const DATE_RANGE_PICKER_LABELS: DateRangePickerLabels = {
	...DATE_FIELD_LABELS,
	group: "Date range",
	start: "Start date",
	end: "End date",
	choose: "Choose dates",
	reversed: "The end date comes before the start date.",
	presets: "Quick ranges",
	apply: "Apply",
	cancel: "Cancel",
};

export function addDays(parts: RangeDateParts, days: number): RangeDateParts {
	const date = new Date(parts.year, parts.month - 1, parts.day + days);
	return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

export const DEFAULT_RANGE_PRESETS: DateRangePreset[] = [
	{ label: "Today", range: (today) => ({ from: today, to: today }) },
	{ label: "Last 7 days", range: (today) => ({ from: addDays(today, -6), to: today }) },
	{
		label: "This month",
		range: (today) => ({ from: { ...today, day: 1 }, to: today }),
	},
	{ label: "Last 30 days", range: (today) => ({ from: addDays(today, -29), to: today }) },
];

export function todayParts(now: Date = new Date()): RangeDateParts {
	return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

export function sameRange(
	a: DateRangeParts | null | undefined,
	b: DateRangeParts,
): boolean {
	if (!a) return false;
	const eq = (x: RangeDateParts, y: RangeDateParts) =>
		x.year === y.year && x.month === y.month && x.day === y.day;
	return eq(a.from, b.from) && eq(a.to, b.to);
}
