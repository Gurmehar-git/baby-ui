export type SwipeSide = "leading" | "trailing";

/** Width of one action while a row rests open. */
export const SWIPE_ACTION_WIDTH = 76;
/** Movement before a press is read as a swipe or handed to the page as a scroll. */
const SLOP = 8;
/** Seconds of travel projected from the release velocity. */
const PROJECTION = 0.1;
/** Release speed in px/s that counts as a flick. */
const FLICK = 900;
/** The row slides away, then its height closes before the action runs. */
const COLLAPSE_MS = 320;
/** A list that keeps the item gets the row back after this long. */
const RESTORE_MS = 1400;

type Spring = { stiffness: number; damping: number };
const physical = (duration: number, bounce: number): Spring => {
	const root = (2 * Math.PI) / (duration * 1.2);
	return { stiffness: root * root, damping: 2 * (1 - bounce) * root };
};
const SMOOTH = physical(0.4, 0);
const SNAPPY = physical(0.3, 0.15);
const COVER = physical(0.35, 0.1);
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
/** Past its last stop the row still follows, but every pixel costs more. */
const rubberBand = (over: number, size: number) =>
	(1 - 1 / ((over * 0.55) / size + 1)) * size;
const sideOf = (value: number): SwipeSide | null =>
	value > 0 ? "leading" : value < 0 ? "trailing" : null;

/** Keeps one row open at a time, and closes it on an outside press or Escape. */
export function createSwipeGroup() {
	const rows = new Set<{ el: HTMLElement; close: () => void }>();
	let open: { el: HTMLElement; close: () => void } | null = null;
	const onDown = (event: PointerEvent) => {
		if (open && !(event.target instanceof Node && open.el.contains(event.target)))
			open.close();
	};
	const onKey = (event: KeyboardEvent) => {
		if (event.key === "Escape") open?.close();
	};
	document.addEventListener("pointerdown", onDown, true);
	document.addEventListener("keydown", onKey);
	return {
		register(el: HTMLElement, close: () => void) {
			const entry = { el, close };
			rows.add(entry);
			return {
				opened() {
					if (open && open !== entry) open.close();
					open = entry;
				},
				closed() {
					if (open === entry) open = null;
				},
				remove() {
					rows.delete(entry);
					if (open === entry) open = null;
				},
			};
		},
		destroy() {
			document.removeEventListener("pointerdown", onDown, true);
			document.removeEventListener("keydown", onKey);
		},
	};
}
export type SwipeGroup = ReturnType<typeof createSwipeGroup>;

export type SwipeRowOptions = {
	leading: number;
	trailing: number;
	/** Lets a long swipe commit the outermost action without a tap. */
	fullSwipe: boolean;
	keepRow: (side: SwipeSide, index: number) => boolean;
	/** Runs the action; for a leaving row, after it has slid away and closed its height. */
	onCommit: (side: SwipeSide, index: number) => void;
};

/**
 * Drives one swipeable row: drag with axis lock and rubber band, spring settle carrying the
 * release velocity, a full swipe that stretches the outer action across the row, and the slide out.
 */
export function createSwipeRow(
	row: HTMLElement,
	group: SwipeGroup | null,
	initial: SwipeRowOptions,
) {
	let options = initial;
	const content = row.querySelector<HTMLElement>("[data-swipe-content]");
	let x = 0;
	let vx = 0;
	let target = 0;
	let cover = 0;
	let vCover = 0;
	let coverTarget = 0;
	let covering: { side: SwipeSide; index: number } | null = null;
	let armed = false;
	let leaving = false;
	let frame = 0;
	let then = 0;
	let width = row.offsetWidth || 320;
	let swallowClick = false;
	let restore = 0;
	let collapse = 0;
	let spring = SMOOTH;
	let drag: {
		pointer: number;
		type: string;
		startX: number;
		startY: number;
		origin: number;
		locked: "x" | "y" | null;
		samples: [number, number][];
	} | null = null;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const entry = group?.register(row, () => {
		if (!leaving && drag?.locked !== "x" && x !== 0) settle(0);
	});

	const count = (side: SwipeSide) =>
		side === "leading" ? options.leading : options.trailing;
	const openWidth = (side: SwipeSide) => count(side) * SWIPE_ACTION_WIDTH;
	const outermost = (side: SwipeSide) => (side === "leading" ? 0 : options.trailing - 1);
	const canCommit = (side: SwipeSide) => options.fullSwipe && count(side) > 0;
	const threshold = (side: SwipeSide) => Math.max(openWidth(side) + 48, width * 0.56);

	const paint = () => {
		if (content) content.style.translate = `${x}px 0`;
		for (const layer of row.querySelectorAll<HTMLElement>("[data-swipe-layer]")) {
			const side = layer.dataset.side === "leading" ? "leading" : "trailing";
			const total = count(side);
			const index = Number(layer.dataset.index);
			const dir = side === "leading" ? 1 : -1;
			const rank = side === "leading" ? total - 1 - index : index;
			const coverRank =
				covering?.side === side
					? side === "leading"
						? total - 1 - covering.index
						: covering.index
					: null;
			const revealed = Math.max(0, x * dir);
			const base = ((total - rank) * revealed) / total;
			const p = clamp01(cover);
			const inset =
				coverRank === rank
					? base + p * (revealed - base)
					: coverRank !== null && rank > coverRank
						? base * (1 - p)
						: base;
			const share = revealed / total;
			const glyph =
				-dir *
				(coverRank === rank
					? share / 2 + p * (SWIPE_ACTION_WIDTH / 2 - share / 2)
					: share / 2);
			const reveal = (own: number) =>
				coverRank === rank ? Math.max(own, p) : coverRank === null ? own : own * (1 - p);
			const icon = reveal(
				clamp01((share - SWIPE_ACTION_WIDTH * 0.25) / (SWIPE_ACTION_WIDTH * 0.55)),
			);
			const label = reveal(
				clamp01((share - SWIPE_ACTION_WIDTH * 0.72) / (SWIPE_ACTION_WIDTH * 0.24)),
			);
			layer.style.translate = `${dir * inset}px 0`;
			const anchor = layer.querySelector<HTMLElement>("[data-swipe-glyph]");
			if (anchor) anchor.style.translate = `${glyph}px 0`;
			const iconEl = layer.querySelector<HTMLElement>("[data-swipe-icon]");
			if (iconEl) {
				iconEl.style.opacity = icon.toFixed(3);
				iconEl.style.scale = (0.6 + 0.4 * icon).toFixed(3);
			}
			const labelEl = layer.querySelector<HTMLElement>("[data-swipe-label]");
			if (labelEl) labelEl.style.opacity = label.toFixed(3);
		}
	};

	const tick = (now: number) => {
		const dt = Math.min(1 / 30, (now - then) / 1000);
		then = now;
		let moving = false;
		if (drag?.locked !== "x") {
			vx += (-spring.stiffness * (x - target) - spring.damping * vx) * dt;
			x += vx * dt;
			if (Math.abs(x - target) < 0.3 && Math.abs(vx) < 4) {
				x = target;
				vx = 0;
			} else moving = true;
		}
		vCover += (-COVER.stiffness * (cover - coverTarget) - COVER.damping * vCover) * dt;
		cover += vCover * dt;
		if (Math.abs(cover - coverTarget) < 0.002 && Math.abs(vCover) < 0.01) {
			cover = coverTarget;
			vCover = 0;
		} else moving = true;
		if (!moving && x === 0 && coverTarget === 0) covering = null;
		paint();
		frame = moving ? requestAnimationFrame(tick) : 0;
	};
	const run = () => {
		if (reduced.matches) {
			x = target;
			cover = coverTarget;
			vx = vCover = 0;
			if (x === 0 && cover === 0) covering = null;
			paint();
			return;
		}
		if (frame) return;
		then = performance.now();
		frame = requestAnimationFrame(tick);
	};

	const stretchTo = (value: number) => {
		coverTarget = value;
		run();
	};

	function settle(to: number, velocity = 0) {
		if (armed || (to !== 0 && cover !== 0)) coverTarget = 0;
		armed = false;
		// Heading home, the spring may not carry the row past zero, or the opposite actions would flash.
		const toward = to === 0 && Math.sign(velocity) === -Math.sign(x);
		vx = toward
			? Math.sign(velocity) * Math.min(Math.abs(velocity), Math.abs(x) * 12)
			: velocity;
		spring = to === 0 ? SMOOTH : SNAPPY;
		target = to;
		if (to === 0) {
			coverTarget = 0;
			entry?.closed();
		} else entry?.opened();
		run();
	}

	function commit(side: SwipeSide, index: number, velocity = 0) {
		if (leaving || index < 0 || index >= count(side)) return;
		const dir = side === "leading" ? 1 : -1;
		armed = false;
		covering = { side, index };
		stretchTo(1);
		if (options.keepRow(side, index)) {
			options.onCommit(side, index);
			settle(0, velocity);
			return;
		}
		leaving = true;
		row.dataset.leaving = "";
		spring = SMOOTH;
		vx = Math.sign(velocity) === dir ? velocity : 0;
		target = dir * (width + 2);
		entry?.closed();
		run();
		clearTimeout(collapse);
		collapse = window.setTimeout(
			() => {
				row.dataset.removing = "";
				collapse = window.setTimeout(() => {
					options.onCommit(side, index);
					clearTimeout(restore);
					restore = window.setTimeout(() => {
						if (!leaving || !row.isConnected) return;
						leaving = false;
						delete row.dataset.removing;
						delete row.dataset.leaving;
						settle(0);
					}, RESTORE_MS);
				}, COLLAPSE_MS);
			},
			reduced.matches ? 0 : 220,
		);
	}

	function arm(value: number, pointerType: string) {
		const side = sideOf(value);
		if (!side) {
			if (armed) {
				armed = false;
				stretchTo(0);
			}
			return;
		}
		const limit = threshold(side);
		const next = canCommit(side) && Math.abs(value) > (armed ? limit - 20 : limit);
		if (next === armed) return;
		armed = next;
		if (next) {
			covering = { side, index: outermost(side) };
			if (pointerType === "touch") navigator.vibrate?.(8);
		}
		stretchTo(next ? 1 : 0);
	}

	function constrain(raw: number) {
		const side = sideOf(raw);
		if (!side) return 0;
		const limit = count(side) === 0 ? 0 : canCommit(side) ? width : openWidth(side);
		const distance = Math.abs(raw);
		return (
			Math.sign(raw) *
			(distance <= limit ? distance : limit + rubberBand(distance - limit, width))
		);
	}

	function release(velocity: number) {
		const side = sideOf(x);
		if (!side || count(side) === 0) {
			settle(0, velocity);
			return;
		}
		const dir = side === "leading" ? 1 : -1;
		const distance = Math.abs(x);
		const outward = velocity * dir;
		const open = openWidth(side);
		const projected = distance + outward * PROJECTION;
		const flung = distance > open && outward > FLICK && projected > threshold(side);
		// A flick back toward home cancels an armed full swipe.
		if (canCommit(side) && ((armed && outward > -FLICK) || flung)) {
			commit(side, outermost(side), velocity);
			return;
		}
		settle(projected > open / 2 ? dir * open : 0, velocity);
	}

	const velocityOf = (samples: [number, number][]) => {
		const last = samples.at(-1);
		if (!last) return 0;
		const first = samples.find((sample) => last[0] - sample[0] <= 80) ?? last;
		const elapsed = (last[0] - first[0]) / 1000;
		return elapsed > 0 ? (last[1] - first[1]) / elapsed : 0;
	};

	const onPointerDown = (event: PointerEvent) => {
		swallowClick = false;
		if (
			leaving ||
			!event.isPrimary ||
			(event.pointerType === "mouse" && event.button !== 0)
		)
			return;
		if (event.target instanceof Element && event.target.closest("[data-swipe-more]"))
			return;
		drag = {
			pointer: event.pointerId,
			type: event.pointerType,
			startX: event.clientX,
			startY: event.clientY,
			origin: x,
			locked: null,
			samples: [[event.timeStamp, event.clientX]],
		};
	};
	const onPointerMove = (event: PointerEvent) => {
		if (!drag || drag.pointer !== event.pointerId || drag.locked === "y") return;
		if (!drag.locked) {
			const dx = event.clientX - drag.startX;
			const dy = event.clientY - drag.startY;
			if (Math.hypot(dx, dy) < SLOP) return;
			if (Math.abs(dy) > Math.abs(dx)) {
				drag.locked = "y";
				return;
			}
			// Measure from here, so crossing the slop never jumps the row.
			drag.locked = "x";
			drag.startX = event.clientX;
			content?.setPointerCapture(event.pointerId);
			row.dataset.dragging = "";
			cancelAnimationFrame(frame);
			frame = 0;
			vx = 0;
			entry?.opened();
		}
		x = constrain(drag.origin + event.clientX - drag.startX);
		drag.samples.push([event.timeStamp, event.clientX]);
		if (drag.samples.length > 12) drag.samples.shift();
		arm(x, drag.type);
		paint();
	};
	const onPointerEnd = (event: PointerEvent) => {
		if (!drag || drag.pointer !== event.pointerId) return;
		const current = drag;
		drag = null;
		if (current.locked === "x") {
			swallowClick = true;
			delete row.dataset.dragging;
			current.samples.push([event.timeStamp, event.clientX]);
			release(event.type === "pointercancel" ? 0 : velocityOf(current.samples));
			return;
		}
		// A tap on an open row closes it instead of acting on what is underneath.
		if (current.locked === null && Math.abs(x) > 0.5) {
			swallowClick = true;
			settle(0);
		}
	};
	const onClickCapture = (event: MouseEvent) => {
		if (!swallowClick) return;
		swallowClick = false;
		event.preventDefault();
		event.stopPropagation();
	};
	const onLayerClick = (event: MouseEvent) => {
		const layer =
			event.target instanceof Element
				? event.target.closest<HTMLElement>("[data-swipe-layer]")
				: null;
		if (!layer) return;
		commit(
			layer.dataset.side === "leading" ? "leading" : "trailing",
			Number(layer.dataset.index),
		);
	};
	const resize = new ResizeObserver(() => {
		width = row.offsetWidth || width;
	});
	resize.observe(row);

	content?.addEventListener("pointerdown", onPointerDown);
	content?.addEventListener("pointermove", onPointerMove);
	content?.addEventListener("pointerup", onPointerEnd);
	content?.addEventListener("pointercancel", onPointerEnd);
	content?.addEventListener("click", onClickCapture, true);
	row.addEventListener("click", onLayerClick);
	paint();

	return {
		/** Runs an action as if swiped fully, e.g. from the menu. */
		commit: (side: SwipeSide, index: number) => commit(side, index),
		update(next: SwipeRowOptions) {
			options = next;
		},
		destroy() {
			cancelAnimationFrame(frame);
			clearTimeout(collapse);
			clearTimeout(restore);
			resize.disconnect();
			entry?.remove();
			content?.removeEventListener("pointerdown", onPointerDown);
			content?.removeEventListener("pointermove", onPointerMove);
			content?.removeEventListener("pointerup", onPointerEnd);
			content?.removeEventListener("pointercancel", onPointerEnd);
			content?.removeEventListener("click", onClickCapture, true);
			row.removeEventListener("click", onLayerClick);
		},
	};
}
