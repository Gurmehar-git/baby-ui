export type WheelOptions = {
	/** Distance from the apex to the wheel's centre, px. */
	radius: number;
	/** Degrees between neighbouring labels. */
	spacing: number;
	/** Labels drawn either side of the selected one. */
	visibleItems: number;
	/** Horizontal position of the apex, as a share of the list's width, 0 to 100. */
	apexInset: number;
	/** Rotation per wheel pixel; 0 leaves the page scroll alone. */
	scrollSpeed: number;
	/** Rotation per dragged pixel. */
	dragSpeed: number;
	snap: boolean;
	momentum: boolean;
	onSelect: (index: number) => void;
};

const CLICK_SLOP = 4;

const wrap = (index: number, length: number) => ((index % length) + length) % length;

function shortestOffset(index: number, rotation: number, length: number): number {
	let offset = index - rotation;
	while (offset > length / 2) offset -= length;
	while (offset < -length / 2) offset += length;
	return offset;
}

/** Drives a vertical wheel of labels: drag, wheel, keys and momentum, snapping to an item. */
export function createWheel(
	stage: HTMLElement,
	list: HTMLElement,
	initialIndex: number,
	initial: WheelOptions,
) {
	let opts = initial;
	let rotation = initialIndex;
	let selected = -1;
	let velocity = 0;
	let frame = 0;
	let drag: {
		id: number;
		y: number;
		rotation: number;
		last: number;
		moved: number;
	} | null = null;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const items = () => [...list.querySelectorAll<HTMLElement>("[data-wheel-item]")];

	const paint = () => {
		const all = items();
		const count = all.length;
		if (!count) return;
		all.forEach((el, index) => {
			const offset = shortestOffset(index, rotation, count);
			const hidden = Math.abs(offset) > opts.visibleItems + 1;
			el.style.visibility = hidden ? "hidden" : "";
			if (hidden) return;
			const angle = offset * opts.spacing;
			const radians = (angle * Math.PI) / 180;
			const x = -opts.radius * (1 - Math.cos(radians));
			const y = opts.radius * Math.sin(radians);
			const distance = Math.min(Math.abs(offset) / opts.visibleItems, 1);
			const scale = 1 - Math.min(Math.abs(offset) * 0.04, 0.45);
			el.style.left = `${opts.apexInset}%`;
			el.style.opacity = String(Math.cos((distance * Math.PI) / 2));
			el.style.transform = `translate(${x}px, ${y}px) translateY(-50%) rotate(${angle}deg) scale(${scale})`;
			el.toggleAttribute("data-selected", Math.abs(offset) < 0.5);
		});
		const next = wrap(Math.round(rotation), count);
		if (next !== selected) {
			selected = next;
			opts.onSelect(next);
		}
	};

	const tick = () => {
		frame = 0;
		if (drag) return;
		const still = reduced.matches || !opts.momentum;
		if (!still && Math.abs(velocity) > 0.0008) {
			rotation += velocity;
			velocity *= opts.snap ? 0.9 : 0.94;
		} else if (opts.snap) {
			velocity = 0;
			const delta = Math.round(rotation) - rotation;
			rotation += reduced.matches || Math.abs(delta) < 0.001 ? delta : delta * 0.22;
			if (Math.abs(Math.round(rotation) - rotation) < 0.001)
				rotation = Math.round(rotation);
		} else {
			velocity = 0;
		}
		paint();
		const settled =
			Math.abs(velocity) <= 0.0008 && (!opts.snap || rotation === Math.round(rotation));
		if (!settled) frame = requestAnimationFrame(tick);
	};
	const run = () => {
		if (!frame) frame = requestAnimationFrame(tick);
	};

	/** Rotates the shortest way round to `index`. */
	const goTo = (index: number) => {
		const count = items().length;
		if (!count) return;
		velocity = 0;
		rotation += shortestOffset(wrap(index, count), rotation, count);
		if (!opts.snap || reduced.matches) paint();
		run();
	};

	const onWheel = (e: WheelEvent) => {
		if (!opts.scrollSpeed || e.ctrlKey || e.metaKey) return;
		e.preventDefault();
		const delta = e.deltaY * opts.scrollSpeed;
		rotation += delta;
		velocity = delta * 0.2;
		paint();
		run();
	};
	const onDown = (e: PointerEvent) => {
		if (!e.isPrimary || e.button !== 0) return;
		drag = { id: e.pointerId, y: e.clientY, rotation, last: rotation, moved: 0 };
		velocity = 0;
		stage.setPointerCapture(e.pointerId);
	};
	const onMove = (e: PointerEvent) => {
		if (!drag || e.pointerId !== drag.id) return;
		const next = drag.rotation - (e.clientY - drag.y) * opts.dragSpeed;
		drag.moved = Math.max(drag.moved, Math.abs(e.clientY - drag.y));
		velocity = next - drag.last;
		drag.last = next;
		rotation = next;
		paint();
	};
	const onUp = (e: PointerEvent) => {
		if (!drag || e.pointerId !== drag.id) return;
		const { moved } = drag;
		drag = null;
		if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
		// A press that never moved is a click: select the label under it.
		if (moved <= CLICK_SLOP) {
			const target = document
				.elementsFromPoint(e.clientX, e.clientY)
				.find((el) => el instanceof HTMLElement && el.dataset.wheelItem !== undefined);
			if (target) return goTo(items().indexOf(target as HTMLElement));
		}
		run();
	};
	const KEYS: Record<string, number> = {
		ArrowDown: 1,
		ArrowRight: 1,
		ArrowUp: -1,
		ArrowLeft: -1,
	};
	const onKey = (e: KeyboardEvent) => {
		const count = items().length;
		if (e.key in KEYS) {
			e.preventDefault();
			goTo(Math.round(rotation) + (KEYS[e.key] as number));
		} else if (e.key === "Home" || e.key === "End") {
			e.preventDefault();
			goTo(e.key === "Home" ? 0 : count - 1);
		}
	};

	stage.addEventListener("wheel", onWheel, { passive: false });
	stage.addEventListener("pointerdown", onDown);
	stage.addEventListener("pointermove", onMove);
	stage.addEventListener("pointerup", onUp);
	stage.addEventListener("pointercancel", onUp);
	stage.addEventListener("keydown", onKey);
	const resize = new ResizeObserver(paint);
	resize.observe(list);
	paint();

	return {
		goTo,
		/** Repaints after items were added or removed. */
		refresh: paint,
		update(next: WheelOptions) {
			opts = next;
			paint();
		},
		destroy() {
			cancelAnimationFrame(frame);
			resize.disconnect();
			stage.removeEventListener("wheel", onWheel);
			stage.removeEventListener("pointerdown", onDown);
			stage.removeEventListener("pointermove", onMove);
			stage.removeEventListener("pointerup", onUp);
			stage.removeEventListener("pointercancel", onUp);
			stage.removeEventListener("keydown", onKey);
		},
	};
}
