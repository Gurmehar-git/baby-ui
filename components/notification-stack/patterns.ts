import type { NotificationPatternName } from "./variants";

type Art = {
	lines: string[];
	circles: { cx: number; cy: number; r: number; dot?: boolean }[];
	rects: { x: number; y: number; width: number; height: number }[];
};

const rays = Array.from({ length: 8 }, (_, i) => {
	const angle = (i * Math.PI) / 16;
	const x = (210 - Math.cos(angle) * 230).toFixed(1);
	const y = (6 + Math.sin(angle) * 230).toFixed(1);
	return `M210 6 L${x} ${y}`;
});

/** Line art for a card's top-right corner, on a 220 by 160 box. */
export const NOTIFICATION_PATTERNS: Record<NotificationPatternName, Art> = {
	orbit: {
		lines: ["M60 160 220 0M0 58h220M150 0v160"],
		circles: [
			{ cx: 190, cy: 10, r: 46 },
			{ cx: 190, cy: 10, r: 86 },
			{ cx: 190, cy: 10, r: 128 },
			{ cx: 150, cy: 58, r: 3.5, dot: true },
		],
		rects: [],
	},
	grid: {
		lines: [
			...[30, 60, 90, 120, 150, 180, 210].map((x) => `M${x} 0v160`),
			...[20, 50, 80, 110, 140].map((y) => `M0 ${y}h220`),
		],
		circles: [{ cx: 180, cy: 50, r: 3.5, dot: true }],
		rects: [{ x: 150, y: 50, width: 30, height: 30 }],
	},
	rays: {
		lines: [...rays, "M120 6a90 90 0 0 0 90 90"],
		circles: [{ cx: 146, cy: 70, r: 3.5, dot: true }],
		rects: [],
	},
};

/** How far each card behind peeks out below the one in front, in px. */
export const NOTIFICATION_PEEK = 12;

export type StackPlace = { depth: number; y: number; scale: number };

/** Places cards behind the front one so their bottoms peek below it, smaller each step. */
export function stackLayout(
	order: string[],
	dismissed: string[],
	heights: Record<string, number>,
): { places: Record<string, StackPlace>; height: number } {
	const visible = order.filter((id) => !dismissed.includes(id));
	const front = visible[0] ? (heights[visible[0]] ?? 0) : 0;
	const places: Record<string, StackPlace> = {};
	for (const id of order) {
		const depth = visible.indexOf(id);
		const step = Math.min(Math.max(depth, 0), 2);
		places[id] = {
			depth,
			y: depth <= 0 ? 0 : front - (heights[id] ?? front) + step * NOTIFICATION_PEEK,
			scale: 1 - step * 0.05,
		};
	}
	const behind = Math.min(Math.max(visible.length - 1, 0), 2);
	return { places, height: visible.length ? front + behind * NOTIFICATION_PEEK : 0 };
}
