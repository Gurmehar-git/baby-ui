import type { DraggableMarqueeDirection } from "./variants";

export type MarqueeOptions = {
	/** Drift in px per 60fps frame; 0 holds still until dragged. */
	speed: number;
	direction: DraggableMarqueeDirection;
	pauseOnHover: boolean;
	/** Share of a release velocity kept each frame, 0 to 1. */
	friction: number;
	/** New copy count whenever the set or the viewport resizes. */
	onCopies: (count: number) => void;
};

const MAX_THROW = 60;
const THROW_GAIN = 2.8;
const DRAG_SLOP = 4;
const KEY_STEP = 0.35;

function wrap(min: number, max: number, value: number): number {
	const range = max - min;
	return range ? ((((value - min) % range) + range) % range) + min : value;
}

/** Drives an endless horizontal track: drift, drag with inertia, arrow keys, paused offscreen. */
export function createMarquee(
	root: HTMLElement,
	track: HTMLElement,
	initial: MarqueeOptions,
) {
	let opts = initial;
	let x = 0;
	let setWidth = 0;
	let throwV = 0;
	let hovering = false;
	let visible = true;
	let drag: { id: number; lastX: number; lastT: number; moved: number } | null = null;
	let frame = 0;
	let last = 0;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");

	const paint = () => {
		x = wrap(-setWidth, 0, x);
		track.style.transform = `translate3d(${x}px, 0, 0)`;
	};

	const measure = () => {
		const set = track.firstElementChild as HTMLElement | null;
		if (!set) return;
		const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
		setWidth = set.offsetWidth + gap;
		if (setWidth) opts.onCopies(Math.max(2, Math.ceil(root.clientWidth / setWidth) + 1));
		paint();
	};

	const tick = (now: number) => {
		frame = requestAnimationFrame(tick);
		const step = last ? (now - last) / (1000 / 60) : 1;
		last = now;
		if (!setWidth || drag || !visible) return;
		const drifting = !reduced.matches && !(opts.pauseOnHover && hovering);
		if (drifting) x += (opts.direction === "left" ? -1 : 1) * opts.speed * step;
		x += throwV * step;
		throwV *= opts.friction ** step;
		if (Math.abs(throwV) < 0.01) throwV = 0;
		if (drifting || throwV) paint();
	};

	const onDown = (e: PointerEvent) => {
		if (e.button !== 0) return;
		drag = { id: e.pointerId, lastX: e.clientX, lastT: performance.now(), moved: 0 };
		throwV = 0;
	};
	const onMove = (e: PointerEvent) => {
		if (!drag || e.pointerId !== drag.id) return;
		const now = performance.now();
		const dx = e.clientX - drag.lastX;
		const dt = now - drag.lastT;
		x += dx;
		drag.moved += Math.abs(dx);
		// Capture only once it is a drag: capturing on press would retarget a plain click.
		if (drag.moved > DRAG_SLOP && !root.hasPointerCapture(e.pointerId)) {
			root.setPointerCapture(e.pointerId);
		}
		if (dt > 0 && !reduced.matches) {
			throwV = Math.max(-MAX_THROW, Math.min(MAX_THROW, (dx / dt) * 16.67 * THROW_GAIN));
		}
		drag.lastX = e.clientX;
		drag.lastT = now;
		paint();
	};
	const onUp = (e: PointerEvent) => {
		if (!drag || e.pointerId !== drag.id) return;
		// A pause before release means the user stopped the throw.
		if (performance.now() - drag.lastT > 80) throwV = 0;
		root.dataset.dragged = drag.moved > DRAG_SLOP ? "true" : "";
		drag = null;
	};
	// A drag that ends on a link or button must not also click it.
	const onClick = (e: MouseEvent) => {
		if (root.dataset.dragged !== "true") return;
		e.preventDefault();
		e.stopPropagation();
		root.dataset.dragged = "";
	};
	const onKey = (e: KeyboardEvent) => {
		if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		e.preventDefault();
		throwV = 0;
		x += (e.key === "ArrowLeft" ? 1 : -1) * root.clientWidth * KEY_STEP;
		paint();
	};
	const onEnter = () => {
		hovering = true;
	};
	const onLeave = () => {
		hovering = false;
	};

	root.addEventListener("pointerdown", onDown);
	root.addEventListener("pointermove", onMove);
	root.addEventListener("pointerup", onUp);
	root.addEventListener("pointercancel", onUp);
	root.addEventListener("click", onClick, true);
	root.addEventListener("keydown", onKey);
	root.addEventListener("pointerenter", onEnter);
	root.addEventListener("pointerleave", onLeave);
	const resize = new ResizeObserver(measure);
	resize.observe(root);
	if (track.firstElementChild) resize.observe(track.firstElementChild);
	const seen = new IntersectionObserver(([entry]) => {
		visible = entry?.isIntersecting ?? true;
	});
	seen.observe(root);
	measure();
	frame = requestAnimationFrame(tick);

	return {
		update(next: MarqueeOptions) {
			opts = next;
		},
		destroy() {
			cancelAnimationFrame(frame);
			resize.disconnect();
			seen.disconnect();
			root.removeEventListener("pointerdown", onDown);
			root.removeEventListener("pointermove", onMove);
			root.removeEventListener("pointerup", onUp);
			root.removeEventListener("pointercancel", onUp);
			root.removeEventListener("click", onClick, true);
			root.removeEventListener("keydown", onKey);
			root.removeEventListener("pointerenter", onEnter);
			root.removeEventListener("pointerleave", onLeave);
			track.style.transform = "";
		},
	};
}
