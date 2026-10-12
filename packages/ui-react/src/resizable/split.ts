type Mode = "open" | "before" | "after";
type Pane = {
	el: HTMLElement;
	min: number;
	max: number;
	preset: number;
	collapsible: boolean;
	startsCollapsed: boolean;
};
type Drag = {
	handle: number;
	pointer: number;
	startX: number;
	a0: number;
	b0: number;
	pair: number;
	lo: number;
	hi: number;
	mode: Mode;
	startMode: Mode;
	moved: boolean;
	samples: [number, number][];
};

const DEFAULT_MIN = 80;
const STRETCH = 44;
const STEP = 16;
const BIG_STEP = 64;
const SETTLE_MS = 420;
const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value));
// Past a limit every pixel costs more, like pulling against elastic.
const rubber = (over: number) => (over * STRETCH * 0.55) / (STRETCH + 0.55 * over);
const band = (value: number, lo: number, hi: number) =>
	value < lo ? lo - rubber(lo - value) : value > hi ? hi + rubber(value - hi) : value;
const collapseAt = (min: number) => min - Math.max(min * 0.5, 40);
const project = (velocity: number) => ((velocity / 1000) * 0.99) / 0.01;
const toShares = (values: number[]) => {
	const total = values.reduce((sum, value) => sum + value, 0) || 1;
	return values.map((value) => (value / total) * 100);
};

function velocityOf(samples: [number, number][], now: number) {
	const recent = samples.filter(([time]) => now - time <= 90);
	const first = recent[0];
	const last = recent[recent.length - 1];
	if (!first || !last || recent.length < 2 || now - last[0] > 50) return 0;
	return last[0] > first[0] ? (last[1] - first[1]) / ((last[0] - first[0]) / 1000) : 0;
}

const num = (value: string | undefined, fallback: number) => {
	const parsed = Number(value);
	return value !== undefined && value !== "" && Number.isFinite(parsed)
		? parsed
		: fallback;
};

/**
 * Drives a split view from its panel and handle children's data attributes. Widths are
 * flex-grow factors, so CSS keeps them proportional and transitions every glide.
 */
export function createResizable(
	group: HTMLElement,
	onLayoutChange?: (sizes: number[]) => void,
) {
	const panesOf = (): Pane[] =>
		[...group.querySelectorAll<HTMLElement>(":scope > [data-slot=resizable-panel]")].map(
			(el) => ({
				el,
				min: num(el.dataset.min, DEFAULT_MIN),
				max: num(el.dataset.max, Number.POSITIVE_INFINITY),
				preset: num(el.dataset.default, 1),
				collapsible: el.dataset.collapsible === "true",
				startsCollapsed:
					el.dataset.collapsible === "true" && el.dataset.defaultCollapsed === "true",
			}),
		);
	const handlesOf = () => [
		...group.querySelectorAll<HTMLElement>(":scope > [data-slot=resizable-handle]"),
	];
	let panes = panesOf();
	let sizes = panes.map((pane) => (pane.startsCollapsed ? 0 : pane.preset));
	let collapsed = panes.map((pane) => pane.startsCollapsed);
	const restore: (number | null)[] = panes.map(() => null);
	let stale = true;
	// Sizes start as shares; after the first measurement they are px widths.
	let measured = false;
	let drag: Drag | null = null;
	let settle: ReturnType<typeof setTimeout> | undefined;
	let goals: number[] | null = null;

	const available = () =>
		panes.reduce((sum, pane) => sum + pane.el.getBoundingClientRect().width, 0);
	const minTotal = () => panes.reduce((sum, pane) => sum + pane.min, 0);
	const minOf = (index: number) => {
		const min = panes[index]?.min ?? DEFAULT_MIN;
		const room = available();
		const total = minTotal();
		return room > 0 && room < total ? (min * room) / total : min;
	};
	const maxOf = (index: number) => panes[index]?.max ?? Number.POSITIVE_INFINITY;
	const modeOf = (handle: number): Mode =>
		collapsed[handle] ? "before" : collapsed[handle + 1] ? "after" : "open";

	const paint = () => {
		const total = minTotal();
		const gaps = panes.length - 1;
		panes.forEach((pane, index) => {
			const size = Math.max(0, sizes[index] ?? 0);
			// Below the sum of the minimums, each floor becomes its share of the room between dividers.
			pane.el.style.setProperty(
				"--panel-min",
				`min(${pane.min}px, (100cqw - ${gaps}px) * ${(pane.min / Math.max(1, total)).toFixed(5)})`,
			);
			pane.el.style.setProperty(
				"--panel-max",
				Number.isFinite(pane.max) ? `${pane.max}px` : "none",
			);
			pane.el.style.flexGrow = String(size);
			const fade = measured
				? clamp(size / Math.max(1, minOf(index)), 0, 1)
				: collapsed[index]
					? 0
					: 1;
			pane.el.style.setProperty("--resizable-fade", String(fade));
			pane.el.dataset.collapsed = String(collapsed[index] ?? false);
			const content = pane.el.firstElementChild;
			if (content instanceof HTMLElement) content.inert = collapsed[index] ?? false;
		});
		const shares = toShares(goals ?? sizes);
		const room = available();
		handlesOf().forEach((handle, index) => {
			const before = panes[index];
			const after = panes[index + 1];
			if (!before || !after) return;
			const mode = modeOf(index);
			const now = Math.round(shares[index] ?? 0);
			const a = ((shares[index] ?? 0) / 100) * room;
			const b = ((shares[index + 1] ?? 0) / 100) * room;
			const { lo, hi } = room ? limits(index, a, b) : { lo: 0, hi: room };
			handle.dataset.collapsed = mode;
			handle.setAttribute("aria-controls", before.el.id);
			handle.setAttribute("aria-label", before.el.dataset.label ?? "Resize");
			handle.setAttribute("aria-valuenow", String(now));
			handle.setAttribute(
				"aria-valuemin",
				String(Math.min(room ? Math.round((lo / room) * 100) : 0, now)),
			);
			handle.setAttribute(
				"aria-valuemax",
				String(Math.max(room ? Math.round((hi / room) * 100) : 100, now)),
			);
			const hidden =
				mode === "before"
					? before.el.dataset.label
					: mode === "after"
						? after.el.dataset.label
						: null;
			handle.setAttribute(
				"aria-valuetext",
				hidden ? `${hidden} hidden, press Enter to show` : `${now}%`,
			);
		});
	};

	function limits(handle: number, a: number, b: number) {
		const pair = a + b;
		let lo = Math.max(minOf(handle), pair - maxOf(handle + 1));
		let hi = Math.min(maxOf(handle), pair - minOf(handle + 1));
		if (a > 0 && b > 0) {
			lo = Math.min(lo, a);
			hi = Math.max(hi, a);
		}
		if (lo > hi) lo = hi = clamp((lo + hi) / 2, 0, pair);
		return { pair, lo: clamp(lo, 0, pair), hi: clamp(hi, 0, pair) };
	}

	function resolve(
		handle: number,
		raw: number,
		pair: number,
		lo: number,
		hi: number,
	): { mode: Mode; size: number } {
		if (panes[handle]?.collapsible && raw < collapseAt(minOf(handle)))
			return { mode: "before", size: 0 };
		if (panes[handle + 1]?.collapsible && pair - raw < collapseAt(minOf(handle + 1)))
			return { mode: "after", size: pair };
		return { mode: "open", size: band(raw, lo, hi) };
	}

	/** Stops a glide and makes the sizes the px widths on screen, so nothing jumps. */
	function begin(involved: number[]) {
		clearTimeout(settle);
		goals = null;
		// Mid-glide or after a group resize, the widths on screen are the truth.
		if (stale || group.dataset.gliding === "true") {
			stale = false;
			measured = true;
			sizes = panes.map((pane) => pane.el.getBoundingClientRect().width);
		}
		group.dataset.gliding = "false";
		for (const index of involved) panes[index]?.el.setAttribute("data-free", "");
		paint();
		return [...sizes];
	}

	function commit() {
		for (const pane of panes) pane.el.removeAttribute("data-free");
		goals = null;
		group.dataset.gliding = "false";
		paint();
		onLayoutChange?.(toShares(sizes));
	}

	/** Moves panes to new widths on a CSS transition, then hands their limits back to CSS. */
	function glide(targets: (number | null)[]) {
		sizes = targets.map((target, index) => target ?? sizes[index] ?? 0);
		goals = [...sizes];
		group.dataset.gliding = "true";
		paint();
		clearTimeout(settle);
		settle = setTimeout(commit, SETTLE_MS);
	}

	const pairTargets = (handle: number, size: number, pair: number) =>
		sizes.map((_, index) =>
			index === handle ? size : index === handle + 1 ? pair - size : null,
		);
	const setPair = (handle: number, mode: Mode) => {
		collapsed = collapsed.map((value, index) =>
			index === handle
				? mode === "before"
				: index === handle + 1
					? mode === "after"
					: value,
		);
	};
	const remember = (handle: number, a: number, b: number, mode: Mode) => {
		if (mode === "before" && a > 0) restore[handle] = a;
		if (mode === "after" && b > 0) restore[handle + 1] = b;
	};

	function reopen(handle: number, side: Mode) {
		const values = begin([handle, handle + 1]);
		const { pair, lo, hi } = limits(handle, values[handle] ?? 0, values[handle + 1] ?? 0);
		const size =
			side === "before"
				? clamp(restore[handle] ?? minOf(handle), lo, hi)
				: clamp(pair - (restore[handle + 1] ?? minOf(handle + 1)), lo, hi);
		setPair(handle, "open");
		glide(pairTargets(handle, size, pair));
	}

	function collapse(handle: number, side: Mode) {
		const values = begin([handle, handle + 1]);
		const a = values[handle] ?? 0;
		const b = values[handle + 1] ?? 0;
		remember(handle, a, b, side);
		setPair(handle, side);
		glide(pairTargets(handle, side === "before" ? 0 : a + b, a + b));
	}

	/** Back to the default shares, fitted so every pane respects its limits. */
	function reset() {
		const values = begin(panes.map((_, index) => index));
		const total = values.reduce((sum, value) => sum + value, 0);
		const wanted = panes.map((pane) => (pane.startsCollapsed ? 0 : pane.preset));
		const targets = [...wanted];
		const frozen = wanted.map((value) => value === 0);
		for (let pass = 0; pass < panes.length; pass++) {
			const fixed = targets.reduce(
				(sum, value, index) => (frozen[index] ? sum + value : sum),
				0,
			);
			const share = wanted.reduce(
				(sum, value, index) => (frozen[index] ? sum : sum + value),
				0,
			);
			let violated = false;
			targets.forEach((_, index) => {
				if (frozen[index]) return;
				const size = share ? ((wanted[index] ?? 0) / share) * (total - fixed) : 0;
				const bounded = clamp(size, minOf(index), maxOf(index));
				targets[index] = bounded;
				if (bounded !== size) {
					frozen[index] = true;
					violated = true;
				}
			});
			if (!violated) break;
		}
		collapsed = panes.map((pane) => pane.startsCollapsed);
		glide(targets);
	}

	const handleIndex = (target: EventTarget | null) => {
		const el =
			target instanceof Element
				? target.closest<HTMLElement>("[data-slot=resizable-handle]")
				: null;
		return el && el.parentElement === group ? handlesOf().indexOf(el) : -1;
	};

	const onPointerDown = (event: PointerEvent) => {
		const handle = handleIndex(event.target);
		if (handle < 0 || drag || (event.pointerType === "mouse" && event.button !== 0))
			return;
		const el = handlesOf()[handle];
		const values = begin([handle, handle + 1]);
		const a = values[handle] ?? 0;
		const b = values[handle + 1] ?? 0;
		const { pair, lo, hi } = limits(handle, a, b);
		el?.setPointerCapture(event.pointerId);
		const mode = modeOf(handle);
		drag = {
			handle,
			pointer: event.pointerId,
			startX: event.clientX,
			a0: a,
			b0: b,
			pair,
			lo,
			hi,
			mode,
			startMode: mode,
			moved: false,
			samples: [[event.timeStamp, event.clientX]],
		};
	};
	const onPointerMove = (event: PointerEvent) => {
		if (!drag || drag.pointer !== event.pointerId) return;
		const dx = event.clientX - drag.startX;
		if (!drag.moved) {
			if (Math.abs(dx) < 2) return;
			drag.moved = true;
			group.dataset.resizing = "true";
			handlesOf()[drag.handle]?.setAttribute("data-active", "");
		}
		const next = resolve(drag.handle, drag.a0 + dx, drag.pair, drag.lo, drag.hi);
		// A collapse state change glides; everything else follows the pointer 1:1.
		group.dataset.gliding = String(next.mode !== drag.mode);
		if (next.mode !== drag.mode) setPair(drag.handle, next.mode);
		drag.mode = next.mode;
		sizes[drag.handle] = next.size;
		sizes[drag.handle + 1] = drag.pair - next.size;
		paint();
		drag.samples.push([event.timeStamp, event.clientX]);
		if (drag.samples.length > 16) drag.samples.shift();
	};
	const finish = (event: PointerEvent, cancelled: boolean) => {
		if (!drag || drag.pointer !== event.pointerId) return;
		const current = drag;
		drag = null;
		delete group.dataset.resizing;
		handlesOf()[current.handle]?.removeAttribute("data-active");
		const { handle, pair, lo, hi } = current;
		if (!current.moved) {
			if (current.startMode !== "open" && !cancelled) reopen(handle, current.startMode);
			else commit();
			return;
		}
		const raw = current.a0 + event.clientX - current.startX;
		const velocity = cancelled ? 0 : velocityOf(current.samples, event.timeStamp);
		const flung = resolve(handle, raw + project(velocity), pair, lo, hi);
		const mode = cancelled ? current.startMode : flung.mode;
		const size =
			mode === "before"
				? 0
				: mode === "after"
					? pair
					: cancelled
						? current.a0
						: clamp(raw, lo, hi);
		remember(handle, current.a0, current.b0, mode);
		setPair(handle, mode);
		glide(pairTargets(handle, size, pair));
	};
	const onPointerUp = (event: PointerEvent) => finish(event, false);
	const onPointerCancel = (event: PointerEvent) => finish(event, true);
	const onDoubleClick = (event: MouseEvent) => {
		if (handleIndex(event.target) >= 0) reset();
	};
	const onKeyDown = (event: KeyboardEvent) => {
		const handle = handleIndex(event.target);
		if (handle < 0) return;
		if (event.key === "Escape" && drag) {
			event.preventDefault();
			const current = drag;
			drag = null;
			delete group.dataset.resizing;
			setPair(handle, current.startMode);
			glide(pairTargets(handle, current.a0, current.pair));
			return;
		}
		if (drag || !["ArrowLeft", "ArrowRight", "Home", "End", "Enter"].includes(event.key))
			return;
		event.preventDefault();
		const mode = modeOf(handle);
		const before = Boolean(panes[handle]?.collapsible);
		const after = Boolean(panes[handle + 1]?.collapsible);
		if (event.key === "Enter") {
			if (mode !== "open") reopen(handle, mode);
			else if (before) collapse(handle, "before");
			else if (after) collapse(handle, "after");
			return;
		}
		const heading = goals;
		const values = begin([handle, handle + 1]);
		const pair = (values[handle] ?? 0) + (values[handle + 1] ?? 0);
		// Repeated presses build on where the divider is heading, not where the transition is now.
		const a = heading ? clamp(heading[handle] ?? 0, 0, pair) : (values[handle] ?? 0);
		const step = event.shiftKey ? BIG_STEP : STEP;
		const { lo, hi } = limits(handle, a, pair - a);
		const open = (size: number) => {
			setPair(handle, "open");
			glide(pairTargets(handle, size, pair));
		};
		if (event.key === "ArrowLeft" && mode === "after") return open(hi);
		if (event.key === "ArrowRight" && mode === "before") return open(lo);
		if (event.key === "ArrowLeft" && a <= lo + 0.5 && before && mode === "open")
			return collapse(handle, "before");
		if (event.key === "ArrowRight" && a >= hi - 0.5 && after && mode === "open")
			return collapse(handle, "after");
		if (mode !== "open") return;
		const size =
			event.key === "Home"
				? lo
				: event.key === "End"
					? hi
					: clamp(a + (event.key === "ArrowLeft" ? -step : step), lo, hi);
		glide(pairTargets(handle, size, pair));
	};

	const ro = new ResizeObserver(() => {
		stale = true;
		paint();
	});
	ro.observe(group);
	group.addEventListener("pointerdown", onPointerDown);
	group.addEventListener("pointermove", onPointerMove);
	group.addEventListener("pointerup", onPointerUp);
	group.addEventListener("pointercancel", onPointerCancel);
	group.addEventListener("dblclick", onDoubleClick);
	group.addEventListener("keydown", onKeyDown);
	paint();

	return {
		/** Re-reads panes after the set of panels changes. */
		refresh() {
			panes = panesOf();
			sizes = panes.map((pane, index) => sizes[index] ?? pane.preset);
			collapsed = panes.map((pane, index) => collapsed[index] ?? pane.startsCollapsed);
			stale = true;
			paint();
		},
		reset,
		destroy() {
			clearTimeout(settle);
			ro.disconnect();
			group.removeEventListener("pointerdown", onPointerDown);
			group.removeEventListener("pointermove", onPointerMove);
			group.removeEventListener("pointerup", onPointerUp);
			group.removeEventListener("pointercancel", onPointerCancel);
			group.removeEventListener("dblclick", onDoubleClick);
			group.removeEventListener("keydown", onKeyDown);
		},
	};
}
