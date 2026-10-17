import type { ClickSparkScope } from "./variants";

export type SparkOptions = {
	count: number;
	/** Starting stroke length, px. */
	size: number;
	/** Distance travelled, px. */
	radius: number;
	durationMs: number;
};

type Burst = { x: number; y: number; start: number; color: string };

const easeOut = (t: number) => t * (2 - t);

/** Draws a spark burst at each pointer press on the page or the canvas's parent. */
export function createSparks(
	canvas: HTMLCanvasElement,
	scope: ClickSparkScope,
	initial: SparkOptions,
) {
	let opts = initial;
	let bursts: Burst[] = [];
	let frame = 0;
	let width = 0;
	let height = 0;
	const ctx = canvas.getContext("2d");
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const parent = scope === "parent" ? canvas.parentElement : null;
	const target: HTMLElement | Document = parent ?? document;

	const resize = () => {
		const dpr = window.devicePixelRatio || 1;
		width = parent ? parent.clientWidth : window.innerWidth;
		height = parent ? parent.clientHeight : window.innerHeight;
		canvas.width = Math.round(width * dpr);
		canvas.height = Math.round(height * dpr);
		ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
	};

	const draw = (now: number) => {
		if (!ctx) return;
		ctx.clearRect(0, 0, width, height);
		bursts = bursts.filter((burst) => now - burst.start < opts.durationMs);
		for (const burst of bursts) {
			const eased = easeOut((now - burst.start) / opts.durationMs);
			const distance = eased * opts.radius;
			const length = opts.size * (1 - eased);
			ctx.strokeStyle = burst.color;
			ctx.lineWidth = 2;
			ctx.lineCap = "round";
			ctx.beginPath();
			for (let i = 0; i < opts.count; i++) {
				const angle = (2 * Math.PI * i) / opts.count;
				const cos = Math.cos(angle);
				const sin = Math.sin(angle);
				ctx.moveTo(burst.x + distance * cos, burst.y + distance * sin);
				ctx.lineTo(
					burst.x + (distance + length) * cos,
					burst.y + (distance + length) * sin,
				);
			}
			ctx.stroke();
		}
		frame = bursts.length ? requestAnimationFrame(draw) : 0;
	};

	// pointerdown, not click: one burst per tap, and none for keyboard-triggered clicks.
	const onDown = (e: Event) => {
		const press = e as PointerEvent;
		if (reduced.matches || !press.isPrimary) return;
		// A parent-scoped instance owns presses inside its box; the page one stays out.
		if (!parent && (press.target as Element | null)?.closest?.("[data-spark-scope]"))
			return;
		const origin = parent?.getBoundingClientRect();
		bursts.push({
			x: press.clientX - (origin?.left ?? 0),
			y: press.clientY - (origin?.top ?? 0),
			start: performance.now(),
			color: getComputedStyle(canvas).color,
		});
		if (!frame) frame = requestAnimationFrame(draw);
	};

	const observer = new ResizeObserver(resize);
	observer.observe(parent ?? document.documentElement);
	resize();
	if (parent) parent.dataset.sparkScope = "";
	target.addEventListener("pointerdown", onDown, { passive: true });

	return {
		update(next: SparkOptions) {
			opts = next;
		},
		destroy() {
			cancelAnimationFrame(frame);
			observer.disconnect();
			if (parent) delete parent.dataset.sparkScope;
			target.removeEventListener("pointerdown", onDown);
		},
	};
}
