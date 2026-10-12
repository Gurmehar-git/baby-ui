export type CarouselTrackOptions = {
	/** Pause rotation, e.g. while hovered, focused, dragged or off screen. */
	running: boolean;
	/** Milliseconds per slide while rotating; 0 turns rotation off. */
	interval: number;
	/** Called when a gesture, key or rotation lands on a slide; `announce` is false for rotation. */
	onSelect: (index: number, announce: boolean) => void;
	onDragChange: (dragging: boolean) => void;
	/** Neighbours keep full size and opacity: a plain row instead of the centred depth. */
	flat: boolean;
	/** Keys and arrows wrap from the last slide to the first and back. */
	loop: boolean;
};

type Drag = {
	pointer: number;
	startX: number;
	startY: number;
	origin: number;
	from: number;
	locked: "x" | "y" | null;
	caught: boolean;
	samples: [number, number][];
};

/** Movement before a press reads as a drag, or is handed to the page as a vertical scroll. */
const SLOP = 6;
/** Release speed, px/s, that always moves at least one slide. */
const FLICK = 360;
/** Scale and opacity of a slide one full step from the centre. */
const SCALE = 0.9;
const DIM = 0.5;
/** Near-critical spring for the track, in physical units (stiffness, damping, unit mass). */
const TRAVEL = { stiffness: 300, damping: 34 };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
/** Where a flick would come to rest under a paging deceleration rate. */
const project = (velocity: number, rate = 0.995) =>
	((velocity / 1000) * rate) / (1 - rate);
/** Past an edge every pixel costs more, like pulling against elastic. */
const rubber = (over: number, size: number) =>
	(over * size * 0.55) / (size + 0.55 * over);
const unrubber = (dist: number, size: number) =>
	(dist * size) / (0.55 * Math.max(1, size - dist));

function velocityOf(samples: [number, number][], now: number) {
	const recent = samples.filter(([t]) => now - t <= 90);
	const first = recent[0];
	const last = recent[recent.length - 1];
	if (!first || !last || recent.length < 2 || now - last[0] > 50) return 0;
	return last[0] > first[0] ? (last[1] - first[1]) / ((last[0] - first[0]) / 1000) : 0;
}

/**
 * Drives a centred slide track: drag with axis lock, flick projection, rubber-banded edges,
 * trackpad swipes, arrow keys and timed rotation. Writes transforms straight to the DOM.
 */
export function createCarouselTrack(
	root: HTMLElement,
	viewport: HTMLElement,
	track: HTMLElement,
	initialIndex: number,
	initial: CarouselTrackOptions,
) {
	let opts = initial;
	let target = initialIndex;
	let x = 0;
	let velocity = 0;
	let springFrame = 0;
	let drainFrame = 0;
	let drainStart = 0;
	let drainValue = 0;
	let drag: Drag | null = null;
	let swallowClick = false;
	let step = 0;
	let width = 0;
	const wheel = { active: false, raw: 0, timer: 0 };
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");

	const slides = () => [...track.querySelectorAll<HTMLElement>("[data-carousel-slide]")];
	const dots = () => [...root.querySelectorAll<HTMLElement>("[data-carousel-dot]")];
	const last = () => Math.max(0, slides().length - 1);
	const bounds = () => ({ min: -last() * step, max: 0 });
	const band = (raw: number) => {
		const { min, max } = bounds();
		const size = width || 1;
		return raw > max
			? max + rubber(raw - max, size)
			: raw < min
				? min - rubber(min - raw, size)
				: raw;
	};
	const unband = (shown: number) => {
		const { min, max } = bounds();
		const size = width || 1;
		return shown > max
			? max + unrubber(shown - max, size)
			: shown < min
				? min - unrubber(min - shown, size)
				: shown;
	};

	const paint = () => {
		if (!step) return;
		track.style.transform = `translate3d(${x}px, 0, 0)`;
		const position = -x / step;
		const end = last();
		slides().forEach((el, i) => {
			const d = Math.min(1, Math.abs(position - i));
			el.style.scale = opts.flat ? "1" : String(1 - (1 - SCALE) * d);
			el.style.opacity = opts.flat ? "1" : String(1 - (1 - DIM) * d);
		});
		dots().forEach((el, i) => {
			const emphasis = Math.max(0, 1 - Math.abs(clamp(position, 0, end) - i));
			el.style.setProperty("--emphasis", String(emphasis));
			if (i !== target) el.style.setProperty("--drain", "0");
		});
	};

	const stopSpring = () => {
		cancelAnimationFrame(springFrame);
		springFrame = 0;
	};

	/** Springs the track to a slide from wherever it is, carrying any velocity it already has. */
	const glide = (to: number, v = 0) => {
		stopSpring();
		const goal = -to * step;
		if (!step) return;
		if (reduced.matches) {
			x = goal;
			velocity = 0;
			paint();
			return;
		}
		velocity = v;
		let then = performance.now();
		const tick = (now: number) => {
			const dt = Math.min(1 / 30, (now - then) / 1000);
			then = now;
			const accel = -TRAVEL.stiffness * (x - goal) - TRAVEL.damping * velocity;
			velocity += accel * dt;
			x += velocity * dt;
			if (Math.abs(x - goal) < 0.5 && Math.abs(velocity) < 5) {
				x = goal;
				velocity = 0;
				springFrame = 0;
				paint();
				return;
			}
			paint();
			springFrame = requestAnimationFrame(tick);
		};
		springFrame = requestAnimationFrame(tick);
	};

	const select = (to: number, v = 0, announce = true) => {
		const next = clamp(to, 0, last());
		const changed = next !== target;
		target = next;
		glide(next, v);
		restartDrain();
		if (changed) opts.onSelect(next, announce);
	};

	// --- Rotation: the active dot drains over `interval`, then the track advances. ---
	const paintDrain = () => {
		dots()[target]?.style.setProperty("--drain", String(drainValue));
	};
	const stopDrain = () => {
		cancelAnimationFrame(drainFrame);
		drainFrame = 0;
	};
	const runDrain = () => {
		stopDrain();
		if (!opts.running || !opts.interval || reduced.matches || last() < 1) return;
		drainStart = performance.now() - drainValue * opts.interval;
		const tick = (now: number) => {
			drainValue = Math.min(1, (now - drainStart) / opts.interval);
			paintDrain();
			if (drainValue >= 1) {
				drainValue = 0;
				drainFrame = 0;
				select(target >= last() ? 0 : target + 1, 0, false);
				return;
			}
			drainFrame = requestAnimationFrame(tick);
		};
		drainFrame = requestAnimationFrame(tick);
	};
	function restartDrain() {
		drainValue = 0;
		paintDrain();
		runDrain();
	}

	const measure = () => {
		const [first, second] = slides();
		if (!first) return;
		const centre = (el: HTMLElement) => {
			const rect = el.getBoundingClientRect();
			return rect.left + rect.width / 2;
		};
		// Centres ignore each slide's scale, and rects keep the sub-pixel step offsetLeft rounds away.
		const next = second ? centre(second) - centre(first) : first.offsetWidth;
		const changed = next !== step;
		step = next;
		width = viewport.clientWidth;
		// The server places the start slide with CSS; from here on the engine owns the track.
		track.dataset.measured = "";
		if (changed && !drag) {
			stopSpring();
			x = -target * step;
			paint();
		}
	};

	const slideAt = (clientX: number) => {
		const hit = slides().findIndex((el) => {
			const rect = el.getBoundingClientRect();
			return clientX >= rect.left && clientX <= rect.right;
		});
		return hit < 0 ? null : hit;
	};

	const onPointerDown = (event: PointerEvent) => {
		if (
			last() < 1 ||
			drag ||
			!step ||
			(event.pointerType === "mouse" && event.button !== 0)
		)
			return;
		swallowClick = false;
		// Touching a visibly moving track catches it, like a hand stopping a wheel; a settling tail is left so a tap still selects.
		const caught = springFrame !== 0 && Math.abs(x + target * step) > 12;
		if (caught) stopSpring();
		drag = {
			pointer: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			origin: 0,
			from: target,
			locked: null,
			caught,
			samples: [],
		};
	};

	const onPointerMove = (event: PointerEvent) => {
		if (!drag || drag.pointer !== event.pointerId) return;
		if (!drag.locked) {
			const dx = event.clientX - drag.startX;
			const dy = event.clientY - drag.startY;
			if (Math.abs(dx) < SLOP && Math.abs(dy) < SLOP) return;
			if (Math.abs(dy) > Math.abs(dx)) {
				drag.locked = "y";
				return;
			}
			// The slop is consumed, not applied, so the track starts under the finger without a jump.
			drag.locked = "x";
			stopSpring();
			drag.startX = event.clientX;
			drag.origin = unband(x);
			viewport.setPointerCapture(event.pointerId);
			stopDrain();
			opts.onDragChange(true);
		}
		if (drag.locked !== "x") return;
		x = band(drag.origin + event.clientX - drag.startX);
		paint();
		drag.samples.push([event.timeStamp, event.clientX]);
		if (drag.samples.length > 16) drag.samples.shift();
	};

	const finish = (event: PointerEvent, cancelled: boolean) => {
		const current = drag;
		if (!current || current.pointer !== event.pointerId) return;
		drag = null;
		if (current.locked === "x") {
			swallowClick = true;
			opts.onDragChange(false);
			const v = cancelled ? 0 : velocityOf(current.samples, event.timeStamp);
			// The landing slide comes from where the flick would carry the track, not where the finger let go.
			let to = Math.round(-(x + project(v)) / step);
			if (Math.abs(v) > FLICK) {
				const dir = v < 0 ? 1 : -1;
				if ((to - current.from) * dir < 1) to = current.from + dir;
			}
			select(to, v);
		} else if (current.caught) {
			swallowClick = true;
			select(Math.round(-x / step));
		} else if (!cancelled && current.locked === null) {
			const hit = slideAt(event.clientX);
			if (hit !== null && hit !== target) {
				swallowClick = true;
				select(hit);
			}
		} else if (cancelled) select(target);
	};
	const onPointerUp = (event: PointerEvent) => finish(event, false);
	const onPointerCancel = (event: PointerEvent) => finish(event, true);
	const onClickCapture = (event: MouseEvent) => {
		if (!swallowClick) return;
		event.preventDefault();
		event.stopPropagation();
		swallowClick = false;
	};
	const onDragStart = (event: DragEvent) => event.preventDefault();

	// A horizontal trackpad swipe moves the track 1:1 and settles on the nearest slide once it ends.
	const onWheel = (event: WheelEvent) => {
		if (last() < 1 || drag || !step) return;
		if (!wheel.active && Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
		event.preventDefault();
		if (!wheel.active) {
			wheel.active = true;
			stopSpring();
			wheel.raw = unband(x);
		}
		const before = x;
		wheel.raw -= event.deltaX * (event.deltaMode === 1 ? 16 : 1);
		x = band(wheel.raw);
		paint();
		const v = (x - before) * 60;
		clearTimeout(wheel.timer);
		wheel.timer = window.setTimeout(() => {
			wheel.active = false;
			select(Math.round(-x / step), v);
		}, 120);
	};

	const onKeyDown = (event: KeyboardEvent) => {
		if (event.altKey || event.ctrlKey || event.metaKey || last() < 1) return;
		const node = event.target as HTMLElement;
		if (node.closest("input, textarea, select, [contenteditable]")) return;
		const to =
			event.key === "ArrowLeft"
				? target - 1
				: event.key === "ArrowRight"
					? target + 1
					: event.key === "Home"
						? 0
						: event.key === "End"
							? last()
							: null;
		if (to === null) return;
		event.preventDefault();
		const count = last() + 1;
		const next = opts.loop ? (to + count) % count : clamp(to, 0, last());
		select(next);
		const tabs = root.querySelectorAll<HTMLElement>("[data-carousel-dot]");
		if (node.getAttribute("role") === "tab") tabs[next]?.focus({ preventScroll: true });
		else if (track.contains(node)) viewport.focus({ preventScroll: true });
	};

	viewport.addEventListener("pointerdown", onPointerDown);
	viewport.addEventListener("pointermove", onPointerMove);
	viewport.addEventListener("pointerup", onPointerUp);
	viewport.addEventListener("pointercancel", onPointerCancel);
	viewport.addEventListener("click", onClickCapture, true);
	viewport.addEventListener("dragstart", onDragStart);
	viewport.addEventListener("wheel", onWheel, { passive: false });
	root.addEventListener("keydown", onKeyDown);
	const observer = new ResizeObserver(measure);
	observer.observe(viewport);
	measure();
	runDrain();

	return {
		/** Moves to a slide set from outside (controlled index, dots, arrows). */
		go(index: number) {
			if (index !== target) select(index);
		},
		update(next: CarouselTrackOptions) {
			const restart = next.running !== opts.running || next.interval !== opts.interval;
			const repaint = next.flat !== opts.flat;
			opts = next;
			if (repaint) paint();
			if (!restart) return;
			if (next.running) runDrain();
			else stopDrain();
		},
		/** Pausing refills the active dot: the slide stays until the viewer moves on. */
		resetDrain() {
			drainValue = 0;
			paintDrain();
		},
		destroy() {
			stopSpring();
			stopDrain();
			clearTimeout(wheel.timer);
			observer.disconnect();
			viewport.removeEventListener("pointerdown", onPointerDown);
			viewport.removeEventListener("pointermove", onPointerMove);
			viewport.removeEventListener("pointerup", onPointerUp);
			viewport.removeEventListener("pointercancel", onPointerCancel);
			viewport.removeEventListener("click", onClickCapture, true);
			viewport.removeEventListener("dragstart", onDragStart);
			viewport.removeEventListener("wheel", onWheel);
			root.removeEventListener("keydown", onKeyDown);
		},
	};
}
