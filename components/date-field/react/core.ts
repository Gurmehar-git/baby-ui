/** Editable segments of a date or time field, in the order the locale prints them. */
export type SegmentPart = "year" | "month" | "day" | "hour" | "minute" | "dayPeriod";

export type FieldLayout = Array<
	{ part: SegmentPart } | { part: "literal"; text: string }
>;

/** A field mid-edit: any segment may still be empty. `hour` is as shown; `dayPeriod` 1 is PM. */
export type Draft = Partial<Record<SegmentPart, number>>;

export type DateParts = { year: number; month: number; day: number };

export interface DateFieldLabels {
	group: string;
	year: string;
	month: string;
	day: string;
	placeholders: { year: string; month: string; day: string };
	outOfRange: string;
}

export const DATE_FIELD_LABELS: DateFieldLabels = {
	group: "Date",
	year: "Year",
	month: "Month",
	day: "Day",
	placeholders: { year: "yyyy", month: "mm", day: "dd" },
	outOfRange: "Pick a date inside the allowed range.",
};

const PARTS: readonly string[] = ["year", "month", "day", "hour", "minute", "dayPeriod"];
const DIGITS: Record<SegmentPart, number> = {
	year: 4,
	month: 2,
	day: 2,
	hour: 2,
	minute: 2,
	dayPeriod: 0,
};

export function fieldLayout(
	kind: "date" | "time",
	locale?: string,
	hourCycle: 12 | 24 = 24,
): FieldLayout {
	const options: Intl.DateTimeFormatOptions =
		kind === "date"
			? { year: "numeric", month: "2-digit", day: "2-digit" }
			: {
					hour: "2-digit",
					minute: "2-digit",
					hourCycle: hourCycle === 12 ? "h12" : "h23",
				};
	return new Intl.DateTimeFormat(locale, options)
		.formatToParts(new Date(2006, 10, 22, 15, 4))
		.flatMap(
			(p): FieldLayout =>
				p.type === "literal"
					? [{ part: "literal", text: p.value }]
					: PARTS.includes(p.type)
						? [{ part: p.type as SegmentPart }]
						: [],
		);
}

/** The locale's own clock, so en-US gets 12-hour and en-GB 24-hour without a prop. */
export function localeHourCycle(locale?: string): 12 | 24 {
	const cycle = new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions()
		.hourCycle;
	return cycle === "h11" || cycle === "h12" ? 12 : 24;
}

export function periodText(pm: boolean, locale?: string): string {
	const parts = new Intl.DateTimeFormat(locale, {
		hour: "numeric",
		hour12: true,
	}).formatToParts(new Date(2000, 0, 1, pm ? 13 : 1));
	return parts.find((p) => p.type === "dayPeriod")?.value ?? (pm ? "PM" : "AM");
}

// Year 2000 is a leap year, so 29 February stays typeable before the year is.
const daysIn = (year = 2000, month?: number) =>
	month === undefined ? 31 : new Date(year, month, 0).getDate();

export function segmentRange(
	part: SegmentPart,
	draft: Draft,
	hourCycle: 12 | 24,
): [number, number] {
	if (part === "year") return [1, 9999];
	if (part === "month") return [1, 12];
	if (part === "day") return [1, daysIn(draft.year, draft.month)];
	if (part === "hour") return hourCycle === 12 ? [1, 12] : [0, 23];
	if (part === "minute") return [0, 59];
	return [0, 1];
}

function nowValue(part: SegmentPart, hourCycle: 12 | 24, now = new Date()): number {
	const hour = now.getHours();
	if (part === "year") return now.getFullYear();
	if (part === "month") return now.getMonth() + 1;
	if (part === "day") return now.getDate();
	if (part === "hour") return hourCycle === 12 ? hour % 12 || 12 : hour;
	if (part === "minute") return now.getMinutes();
	return hour >= 12 ? 1 : 0;
}

/** An arrow press on the minute segment: snaps onto the `step` grid, wrapping within the hour. */
export function stepMinute(minute: number, delta: number, step: number): number {
	const next =
		delta > 0
			? Math.floor(minute / step) * step + step
			: Math.ceil(minute / step) * step - step;
	return ((next % 60) + 60) % 60;
}

/** Arrow keys: an empty segment starts from now, a filled one wraps within its range. */
export function stepSegment(
	draft: Draft,
	part: SegmentPart,
	delta: number,
	hourCycle: 12 | 24,
	step = 1,
): Draft {
	const current = draft[part];
	if (current === undefined) return { ...draft, [part]: nowValue(part, hourCycle) };
	if (part === "minute") return { ...draft, minute: stepMinute(current, delta, step) };
	const [min, max] = segmentRange(part, draft, hourCycle);
	const next = current + delta;
	const size = max - min + 1;
	return { ...draft, [part]: min + ((((next - min) % size) + size) % size) };
}

/** A typed digit. `typed` is what the segment took so far; `done` moves focus on. */
export function typeDigit(
	draft: Draft,
	part: SegmentPart,
	typed: string,
	digit: string,
	hourCycle: 12 | 24,
): { draft: Draft; typed: string; done: boolean } {
	const [min, max] = segmentRange(part, draft, hourCycle);
	const text = Number(typed + digit) > max ? digit : typed + digit;
	const value = Number(text);
	// A lone 0 in a segment that starts at 1 waits for its second digit.
	if (value < min) return { draft, typed: text, done: false };
	return {
		draft: { ...draft, [part]: value },
		typed: text,
		done: text.length >= DIGITS[part] || value * 10 > max,
	};
}

export function clearSegment(draft: Draft, part: SegmentPart): Draft {
	const next = { ...draft };
	delete next[part];
	return next;
}

export function segmentText(
	part: SegmentPart,
	value: number | undefined,
	placeholder: string,
	locale?: string,
): string {
	if (part === "dayPeriod") return periodText(value === 1, locale);
	if (value === undefined) return placeholder;
	return part === "year" ? String(value) : String(value).padStart(2, "0");
}

export const dateToDraft = (parts: DateParts | null): Draft =>
	parts ? { ...parts } : {};

export function draftToDate({ year, month, day }: Draft): DateParts | null {
	if (year === undefined || month === undefined || day === undefined) return null;
	return day > daysIn(year, month) ? null : { year, month, day };
}

export function timeToDraft(
	time: { hour: number; minute: number } | null,
	hourCycle: 12 | 24,
): Draft {
	if (!time) return {};
	const { hour, minute } = time;
	return hourCycle === 12
		? { hour: hour % 12 || 12, minute, dayPeriod: hour >= 12 ? 1 : 0 }
		: { hour, minute };
}

/** An unset AM/PM reads as the AM it shows, so hour and minute alone complete a time. */
export function draftToTime(
	{ hour, minute, dayPeriod = 0 }: Draft,
	hourCycle: 12 | 24,
): { hour: number; minute: number } | null {
	if (hour === undefined || minute === undefined) return null;
	return { hour: hourCycle === 12 ? (hour % 12) + dayPeriod * 12 : hour, minute };
}

export function compareDateParts(a: DateParts, b: DateParts): number {
	return a.year - b.year || a.month - b.month || a.day - b.day;
}

export function isOutsideRange(
	parts: DateParts,
	min?: DateParts,
	max?: DateParts,
): boolean {
	return (
		(min !== undefined && compareDateParts(parts, min) < 0) ||
		(max !== undefined && compareDateParts(parts, max) > 0)
	);
}

export const toDateParts = (date: Date): DateParts => ({
	year: date.getFullYear(),
	month: date.getMonth() + 1,
	day: date.getDate(),
});

export const fromDateParts = (p: DateParts) => new Date(p.year, p.month - 1, p.day);

export const isoDate = (p: DateParts) =>
	`${String(p.year).padStart(4, "0")}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
