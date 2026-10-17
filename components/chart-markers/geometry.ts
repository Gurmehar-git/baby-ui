import type { SpringConfig } from "../chart/motion";

export interface ChartMarkerBase {
	date: Date;
	title: string;
	description?: string;
	/** Background override for the marker disc. */
	color?: string;
	href?: string;
	target?: "_blank" | "_self";
}

export interface MarkerGroup<T extends ChartMarkerBase> {
	key: string;
	date: Date;
	items: T[];
}

export const FAN_RADIUS = 50;
export const FAN_ANGLE = 160;
/** Marker disc centre sits this far above the plot top. */
export const MARKER_OFFSET = -8;
export const GROUP_STAGGER = 100;
export const FAN_STAGGER = 40;
/** The motion contract floors entrances at 0.85, never 0. */
export const ENTER_SCALE = 0.85;
export const FANNED_SCALE = 0.6;
export const GUIDE_TRANSITION = "stroke-opacity 200ms cubic-bezier(0, 0, 0.58, 1)";

export const MARKER_SPRING = {
	enter: { stiffness: 300, damping: 25 },
	badge: { stiffness: 400, damping: 20 },
	fan: { stiffness: 400, damping: 22 },
	press: { stiffness: 400, damping: 17 },
} as const satisfies Record<string, SpringConfig>;

export const dayKey = (date: Date) =>
	`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

export function groupMarkers<T extends ChartMarkerBase>(items: T[]): MarkerGroup<T>[] {
	const groups = new Map<string, MarkerGroup<T>>();
	for (const item of items) {
		const key = dayKey(item.date);
		const group = groups.get(key);
		if (group) group.items.push(item);
		else groups.set(key, { key, date: item.date, items: [item] });
	}
	return [...groups.values()].sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function fanPosition(index: number, total: number) {
	const start = -90 - FAN_ANGLE / 2;
	const step = total > 1 ? FAN_ANGLE / (total - 1) : 0;
	const radians = ((start + index * step) * Math.PI) / 180;
	return { x: Math.cos(radians) * FAN_RADIUS, y: Math.sin(radians) * FAN_RADIUS };
}

/** Writes the collapsed disc's look from its entrance and fan progress. */
export function discStyle(enter: number, fan: number) {
	const scale =
		(ENTER_SCALE + (1 - ENTER_SCALE) * enter) * (1 - (1 - FANNED_SCALE) * fan);
	const opacity = Math.max(0, Math.min(1, enter * (1 - fan)));
	const blur = 2 * Math.max(1 - enter, fan);
	return {
		transform: `scale(${scale})`,
		opacity: String(opacity),
		filter: `blur(${blur}px)`,
	};
}

export function popStyle(p: number, dx = 0, dy = 0, maxOpacity = 1) {
	const scale = ENTER_SCALE + (1 - ENTER_SCALE) * p;
	return {
		transform: `translate(${dx * p}px, ${dy * p}px) scale(${scale})`,
		opacity: String(Math.max(0, Math.min(maxOpacity, p * maxOpacity))),
	};
}
