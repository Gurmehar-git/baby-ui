export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const WEEK_LENGTH = 7;

export function startOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Same day of month in another month, clamped to that month's last day. */
export function addMonths(date: Date, months: number): Date {
	const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
	const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
	return new Date(
		target.getFullYear(),
		target.getMonth(),
		Math.min(date.getDate(), last),
	);
}

export function startOfWeek(date: Date, weekStartsOn: WeekStartsOn): Date {
	const shift = (date.getDay() - weekStartsOn + WEEK_LENGTH) % WEEK_LENGTH;
	return addDays(startOfDay(date), -shift);
}

export function sameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

export function sameMonth(a: Date, b: Date): boolean {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Every week touching `anchor`'s month, as rows of seven days. */
export function monthWeeks(anchor: Date, weekStartsOn: WeekStartsOn): Date[][] {
	const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
	const last = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
	const weeks: Date[][] = [];
	for (
		let start = startOfWeek(first, weekStartsOn);
		start <= last;
		start = addDays(start, 7)
	) {
		weeks.push(Array.from({ length: WEEK_LENGTH }, (_, i) => addDays(start, i)));
	}
	return weeks;
}

/** Key for a day, stable across renders and time zones. */
export function dayKey(date: Date): string {
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

/** Target of an arrow key from `date`, or null for other keys. */
export function arrowTarget(date: Date, key: string): Date | null {
	const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[key];
	return step === undefined ? null : addDays(date, step);
}
