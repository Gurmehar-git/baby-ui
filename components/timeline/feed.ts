export type TimelineTone = "neutral" | "success" | "destructive";

export type TimelineEventBase = {
	id: string;
	/** When it happened, as an ISO string or epoch milliseconds. */
	at: string | number;
	/** Who did it, shown first in the foreground colour. */
	actor?: string;
	/** What happened, completing the actor: "merged Checkout redesign into main". */
	title: string;
	/** Short context under the title, such as a pull request or a build. */
	meta?: string;
	/** Portrait for an event by a person. */
	avatar?: string;
	/** Status of a system event; say the outcome in the title too. */
	tone?: TimelineTone;
};

export type TimelineRow<E extends TimelineEventBase> = {
	event: E;
	time: number;
	iso: string;
	timeLabel: string;
	timeFull: string;
	last: boolean;
};
export type TimelineGroup<E extends TimelineEventBase> = {
	day: string;
	label: string;
	count: string;
	rows: TimelineRow<E>[];
};

const HOUR = 3_600_000;

function dayKey(time: number, timeZone: string) {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).formatToParts(new Date(time));
	const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
	return `${get("year")}-${get("month")}-${get("day")}`;
}

function relative(time: number, now: number) {
	const minutes = Math.max(0, Math.floor((now - time) / 60_000));
	if (minutes < 1) return { short: "Now", long: "just now" };
	if (minutes < 60)
		return {
			short: `${minutes}m`,
			long: `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`,
		};
	const hours = Math.floor(minutes / 60);
	return { short: `${hours}h`, long: `${hours} ${hours === 1 ? "hour" : "hours"} ago` };
}

/** Events newest first, grouped by day with Today and Yesterday labels and relative times today. */
export function groupTimeline<E extends TimelineEventBase>(
	events: readonly E[],
	now: number,
	timeZone: string,
	locale: string,
): TimelineGroup<E>[] {
	const today = dayKey(now, timeZone);
	const yesterday = dayKey(now - 24 * HOUR, timeZone);
	const heading = new Intl.DateTimeFormat(locale, {
		weekday: "long",
		month: "long",
		day: "numeric",
		timeZone,
	});
	const clock = new Intl.DateTimeFormat(locale, {
		hour: "numeric",
		minute: "2-digit",
		timeZone,
	});
	const full = new Intl.DateTimeFormat(locale, {
		weekday: "long",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		timeZone,
	});
	const byDay = new Map<string, { event: E; time: number }[]>();
	for (const entry of events
		.map((event) => ({ event, time: new Date(event.at).getTime() }))
		.sort((a, b) => b.time - a.time)) {
		const day = dayKey(entry.time, timeZone);
		byDay.set(day, [...(byDay.get(day) ?? []), entry]);
	}
	return [...byDay].map(([day, entries]) => {
		const label =
			day === today
				? "Today"
				: day === yesterday
					? "Yesterday"
					: heading.format(new Date(entries[0]?.time ?? now));
		const rows = entries.map(({ event, time }, index) => {
			const recent = day === today && now - time < 12 * HOUR;
			const date = new Date(time);
			const ago = relative(time, now);
			return {
				event,
				time,
				iso: date.toISOString(),
				timeLabel: recent ? ago.short : clock.format(date),
				timeFull: recent ? `${ago.long}, ${full.format(date)}` : full.format(date),
				last: index === entries.length - 1,
			};
		});
		return { day, label, count: rows.length === 1 ? "update" : "updates", rows };
	});
}

/** Events whose ids are not in `known`, i.e. added since the last render. */
export const addedEvents = <E extends TimelineEventBase>(
	known: ReadonlySet<string>,
	events: readonly E[],
) => events.filter((event) => !known.has(event.id));

export const announceAdded = (added: readonly TimelineEventBase[]) =>
	added.length
		? `New update: ${added.map((event) => [event.actor, event.title].filter(Boolean).join(" ")).join(". ")}`
		: "";

const STEP = 0.09;

/**
 * Rows reveal once as they scroll into view, a beat apart so the line reads as drawing down.
 * Call `scan` after rows change; it also feathers the bottom edge while more rows wait below.
 */
export function createTimelineReveal(root: HTMLElement, scroller: HTMLElement) {
	let next = 0;
	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				const row = entry.target;
				if (!(row instanceof HTMLElement)) continue;
				io.unobserve(row);
				const now = performance.now() / 1000;
				const start = Math.min(Math.max(now, next), now + 0.45);
				next = start + STEP;
				row.style.setProperty("--tl-delay", `${(start - now).toFixed(2)}s`);
				row.dataset.shown = "";
			}
		},
		{ threshold: 0.2 },
	);
	const feather = () => {
		const more = scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop > 2;
		if (more) scroller.dataset.more = "";
		else delete scroller.dataset.more;
	};
	const ro = new ResizeObserver(feather);
	ro.observe(scroller);
	scroller.addEventListener("scroll", feather, { passive: true });
	const scan = () => {
		for (const row of root.querySelectorAll<HTMLElement>(
			"[data-timeline-row]:not([data-shown])",
		))
			io.observe(row);
		const track = scroller.firstElementChild;
		if (track) ro.observe(track);
		feather();
	};
	scan();
	return {
		scan,
		destroy() {
			io.disconnect();
			ro.disconnect();
			scroller.removeEventListener("scroll", feather);
		},
	};
}

/** Arrow keys, Home and End move between expandable rows. */
export function moveTimelineFocus(root: HTMLElement, event: KeyboardEvent) {
	if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
	const triggers = [...root.querySelectorAll<HTMLElement>("[data-timeline-trigger]")];
	const active = root.ownerDocument.activeElement;
	const index = active instanceof HTMLElement ? triggers.indexOf(active) : -1;
	if (index < 0) return;
	event.preventDefault();
	const last = triggers.length - 1;
	const to =
		event.key === "Home"
			? 0
			: event.key === "End"
				? last
				: Math.min(Math.max(index + (event.key === "ArrowDown" ? 1 : -1), 0), last);
	triggers[to]?.focus();
}
