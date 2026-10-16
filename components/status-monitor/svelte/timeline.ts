import type { StatusMonitorStatus } from "./variants";

export type StatusMonitorItem = {
	status: StatusMonitorStatus;
	timestamp?: string | Date;
	info?: string;
};

export type StatusMonitorUnit = "days" | "hours";

/** Every visible string, overridable for other languages. */
export type StatusMonitorLabels = Record<
	| StatusMonitorStatus
	| `${StatusMonitorStatus}Info`
	| "title"
	| "uptime"
	| "ago"
	| "current"
	| StatusMonitorUnit,
	string
>;

export const STATUS_MONITOR_LABELS: StatusMonitorLabels = {
	title: "Status",
	uptime: "uptime",
	ago: "ago",
	current: "Current",
	days: "days",
	hours: "hours",
	normal: "Normal",
	warning: "Warning",
	error: "Error",
	empty: "No data",
	normalInfo: "Systems are operating normally.",
	warningInfo: "Systems are operating with elevated risk or degraded service.",
	errorInfo: "A service-impacting incident is active.",
	emptyInfo: "No status data was recorded for this period.",
};

/** Stroke paths on a 24px grid, one icon per status. */
export const STATUS_ICON: Record<StatusMonitorStatus, string[]> = {
	normal: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "m9 12 2 2 4-4"],
	warning: [
		"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
		"M12 9v4",
		"M12 17h.01",
	],
	error: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "m15 9-6 6", "m9 9 6 6"],
	empty: [
		"m2 2 20 20",
		"M8.35 2.69A10 10 0 0 1 21.3 15.65",
		"M19.08 19.08A10 10 0 1 1 4.92 4.92",
	],
};

export const BAR_WIDTH = 5;
const BAR_GAP = 2;
const SLOT_COUNTS = [90, 60, 30];
const MAX_SLOTS = 90;

export function timelineWidth(slots: number): number {
	return slots * BAR_WIDTH + (slots - 1) * BAR_GAP;
}

/** The most slots, of 90, 60 or 30, whose bars fit the width. */
export function slotsForWidth(width: number): number {
	return SLOT_COUNTS.find((slots) => width >= timelineWidth(slots)) ?? 30;
}

/** Share of recorded periods that were normal, to 2 decimals; 100 when nothing is recorded. */
export function uptimePercent(items: StatusMonitorItem[]): number {
	const recorded = items.filter((item) => item.status !== "empty");
	if (!recorded.length) return 100;
	const normal = recorded.filter((item) => item.status === "normal").length;
	return Number(((normal / recorded.length) * 100).toFixed(2));
}

/** The newest `slots` items, left-padded with empty periods when there are fewer. */
export function visibleItems(
	items: StatusMonitorItem[],
	slots: number,
): StatusMonitorItem[] {
	const latest = items.slice(-MAX_SLOTS);
	const padding = Array.from(
		{ length: Math.max(0, MAX_SLOTS - latest.length) },
		(): StatusMonitorItem => ({ status: "empty" }),
	);
	return [...padding, ...latest].slice(-slots);
}

export function formatTimestamp(
	timestamp: StatusMonitorItem["timestamp"],
	locale?: string,
): string | undefined {
	if (!timestamp) return undefined;
	if (typeof timestamp === "string") return timestamp;
	return new Intl.DateTimeFormat(locale, {
		month: "short",
		day: "2-digit",
		year: "numeric",
	}).format(timestamp);
}

/** Next bar index for a roving-focus key, or null when the key isn't one. */
export function nextIndex(key: string, index: number, count: number): number | null {
	if (key === "ArrowLeft") return Math.max(0, index - 1);
	if (key === "ArrowRight") return Math.min(count - 1, index + 1);
	if (key === "Home") return 0;
	if (key === "End") return count - 1;
	return null;
}
