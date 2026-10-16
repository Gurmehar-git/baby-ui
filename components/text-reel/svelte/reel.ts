const BASE_SPEED = 0.6;
const MAX_SPEED = 12;
const EASE = 0.14;
const SETTLE_MS = 120;

export type ReelOptions = {
	/** Drift in px per 60fps frame while the page is still. */
	speed: number;
	paused: boolean;
	axis: "x" | "y";
	/** New copy count whenever the content or viewport resizes. */
	onCopies: (count: number) => void;
};

function wrap(min: number, max: number, value: number): number {
	const range = max - min;
	return ((((value - min) % range) + range) % range) + min;
}

/** Drives a reel on either axis: steady drift, boosted and reversed by page scroll, paused offscreen. */
export function createReel(
	viewport: HTMLElement,
	track: HTMLElement,
	initial: ReelOptions,
) {
	let opts = initial;
	let y = 0;
	let velocity = initial.speed || BASE_SPEED;
	let target = velocity;
	let lastDirection = 1;
	let distance = 0;
	let visible = true;
	let frame = 0;
	let last = 0;
	let settle: ReturnType<typeof setTimeout> | undefined;
	let lastScroll = window.scrollY;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");

	const measure = () => {
		const content = track.firstElementChild as HTMLElement | null;
		const x = opts.axis === "x";
		distance = (x ? content?.offsetWidth : content?.offsetHeight) ?? 0;
		const span = x ? viewport.offsetWidth : viewport.offsetHeight;
		if (distance) opts.onCopies(Math.max(2, Math.ceil(span / distance) + 2));
	};

	const tick = (now: number) => {
		frame = requestAnimationFrame(tick);
		const step = last ? (now - last) / (1000 / 60) : 1;
		last = now;
		if (!distance || opts.paused || reduced.matches || !visible) return;
		velocity += (target - velocity) * EASE;
		y = wrap(-distance, 0, y + velocity * step);
		track.style.transform =
			opts.axis === "x" ? `translate3d(${y}px, 0, 0)` : `translate3d(0, ${y}px, 0)`;
	};

	const onScroll = () => {
		const delta = window.scrollY - lastScroll;
		lastScroll = window.scrollY;
		if (!delta) return;
		lastDirection = delta > 0 ? -1 : 1;
		const base = opts.speed || BASE_SPEED;
		target = lastDirection * Math.min(MAX_SPEED, base + Math.abs(delta) ** 1.2 * 0.08);
		clearTimeout(settle);
		settle = setTimeout(() => {
			target = lastDirection * (opts.speed || BASE_SPEED);
		}, SETTLE_MS);
	};

	const resize = new ResizeObserver(measure);
	resize.observe(viewport);
	if (track.firstElementChild) resize.observe(track.firstElementChild);
	const seen = new IntersectionObserver(([entry]) => {
		visible = entry?.isIntersecting ?? true;
	});
	seen.observe(viewport);
	window.addEventListener("scroll", onScroll, { passive: true });
	measure();
	frame = requestAnimationFrame(tick);

	return {
		update(next: ReelOptions) {
			opts = next;
			target = lastDirection * (next.speed || BASE_SPEED);
		},
		destroy() {
			cancelAnimationFrame(frame);
			clearTimeout(settle);
			resize.disconnect();
			seen.disconnect();
			window.removeEventListener("scroll", onScroll);
			track.style.transform = "";
		},
	};
}
