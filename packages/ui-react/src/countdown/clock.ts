export type CountdownUnit = "days" | "hours" | "minutes" | "seconds";

export const COUNTDOWN_UNITS: CountdownUnit[] = ["days", "hours", "minutes", "seconds"];
const SECONDS: Record<CountdownUnit, number> = {
	days: 86_400,
	hours: 3_600,
	minutes: 60,
	seconds: 1,
};
const LIMIT: Record<CountdownUnit, number> = {
	days: Number.POSITIVE_INFINITY,
	hours: 24,
	minutes: 60,
	seconds: 60,
};
/** Long label, short letter, spoken singular. */
export const UNIT_NAMES: Record<CountdownUnit, [string, string, string]> = {
	days: ["Days", "d", "day"],
	hours: ["Hours", "h", "hour"],
	minutes: ["Minutes", "m", "minute"],
	seconds: ["Seconds", "s", "second"],
};
// setTimeout overflows past 2^31 - 1 ms.
const MAX_TIMEOUT = 2_147_483_647;

function zoneOffset(epoch: number, timeZone: string) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone,
		hourCycle: "h23",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	}).formatToParts(new Date(epoch));
	const get = (type: string) =>
		Number(parts.find((part) => part.type === type)?.value ?? 0);
	return (
		Date.UTC(
			get("year"),
			get("month") - 1,
			get("day"),
			get("hour"),
			get("minute"),
			get("second"),
		) -
		Math.floor(epoch / 1000) * 1000
	);
}

/** Resolves a target to epoch ms; a string without an offset is wall time in `timeZone`, or UTC. */
export function toEpoch(target: Date | number | string, timeZone?: string) {
	if (typeof target === "number") return target;
	if (target instanceof Date) return target.getTime();
	const wall =
		/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?)?$/.exec(
			target.trim(),
		);
	if (!wall) return Date.parse(target);
	const [, y, mo, d, h, mi, s] = wall;
	const utc = Date.UTC(
		Number(y),
		Number(mo) - 1,
		Number(d),
		Number(h ?? 0),
		Number(mi ?? 0),
		Number(s ?? 0),
	);
	if (!timeZone) return utc;
	// Two passes settle the offset across a daylight saving change.
	const guess = utc - zoneOffset(utc, timeZone);
	return utc - zoneOffset(guess, timeZone);
}

export const sortUnits = (units: readonly CountdownUnit[]) =>
	units.length ? [...units].sort((a, b) => SECONDS[b] - SECONDS[a]) : COUNTDOWN_UNITS;

/** Whole seconds split across the units on show; the largest absorbs the rest. */
export const countdownParts = (seconds: number, units: readonly CountdownUnit[]) =>
	units.map((unit, index) => ({
		unit,
		value:
			index === 0
				? Math.floor(seconds / SECONDS[unit])
				: Math.floor(seconds / SECONDS[unit]) % LIMIT[unit],
	}));

export function spokenCountdown(
	parts: { unit: CountdownUnit; value: number }[],
	seconds: number,
) {
	return parts
		.filter((part, index) => part.value > 0 || index === parts.length - 1)
		.filter((part) => seconds < 60 || part.unit !== "seconds")
		.map(
			(part) => `${part.value} ${UNIT_NAMES[part.unit][2]}${part.value === 1 ? "" : "s"}`,
		)
		.join(", ");
}

/**
 * Ticks on whole seconds aligned to `end` while `root` is on screen and the tab is visible, and
 * separately arms a timer so completion lands on time even while ticking is paused.
 */
export function createCountdownClock(
	root: HTMLElement,
	end: number,
	clock: () => number,
	onTick: (now: number) => void,
) {
	let timer: ReturnType<typeof setTimeout> | undefined;
	let inView = false;
	const tick = () => {
		const now = clock();
		onTick(now);
		const left = end - now;
		if (left > 0 && inView && document.visibilityState === "visible")
			timer = setTimeout(tick, (left % 1000 || 1000) + 8);
	};
	const restart = () => {
		clearTimeout(timer);
		if (inView && document.visibilityState === "visible") tick();
	};
	const io = new IntersectionObserver(([entry]) => {
		inView = entry?.isIntersecting ?? false;
		restart();
	});
	io.observe(root);
	document.addEventListener("visibilitychange", restart);
	const left = end - clock();
	const done =
		left > 0
			? setTimeout(() => onTick(clock()), Math.min(MAX_TIMEOUT, left + 8))
			: undefined;
	onTick(clock());
	return () => {
		clearTimeout(timer);
		clearTimeout(done);
		io.disconnect();
		document.removeEventListener("visibilitychange", restart);
	};
}
