import { cubicBezier, prefersReducedMotion } from "../chart/motion";
import { cellSeed, HEATMAP_TIMING, seeded } from "./calendar";

const shimmerEase = cubicBezier(0.45, 0, 0.55, 1);

/** One rAF loop for every cell: pulse to rand * 0.85 over 0.35 to 1.2s, rest 80 to 500ms, repeat. */
export function runShimmer(
	count: number,
	apply: (index: number, opacity: number) => void,
) {
	if (count === 0 || typeof requestAnimationFrame === "undefined") return () => {};
	if (prefersReducedMotion()) {
		for (let i = 0; i < count; i++) apply(i, HEATMAP_TIMING.loadingBase);
		return () => {};
	}
	const now = performance.now();
	const cells = Array.from({ length: count }, (_, i) => {
		const random = seeded(cellSeed(i, 7) + 73_133);
		return {
			random,
			from: 0,
			to: random() * HEATMAP_TIMING.loadingMax,
			start: now,
			duration: 350 + random() * 850,
			rest: 0,
		};
	});
	let id = requestAnimationFrame(function frame(time) {
		for (let i = 0; i < count; i++) {
			const cell = cells[i];
			if (!cell) continue;
			const t = Math.min(1, (time - cell.start) / cell.duration);
			apply(i, cell.from + (cell.to - cell.from) * shimmerEase(t));
			if (t >= 1 && time >= cell.start + cell.duration + cell.rest) {
				cell.from = cell.to;
				cell.to = cell.random() * HEATMAP_TIMING.loadingMax;
				cell.start = time;
				cell.duration = 350 + cell.random() * 850;
				cell.rest = 80 + cell.random() * 420;
			}
		}
		id = requestAnimationFrame(frame);
	});
	return () => cancelAnimationFrame(id);
}
