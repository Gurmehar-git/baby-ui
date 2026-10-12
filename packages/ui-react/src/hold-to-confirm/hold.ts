export type HoldOptions = {
	/** Hold length in milliseconds. */
	duration: number;
	/** Locked once confirmed, until the parent resets it. */
	done: boolean;
	disabled: boolean;
	onComplete: () => void;
	onHoldChange: (holding: boolean) => void;
};

/** Rewinds faster than it fills, on a critically damped spring, so letting go feels forgiving. */
const REWIND = { stiffness: 260, damping: 32 };
/** Sliding this far off the button cancels the hold, the way a native press does. */
const SLACK = 24;

/**
 * Drives a press-and-hold button: a linear fill while held (pointer, Space or Enter), a spring
 * rewind on early release, and completion once the fill reaches the end.
 */
export function createHold(button: HTMLElement, initial: HoldOptions) {
	let options = initial;
	let progress = options.done ? 1 : 0;
	let velocity = 0;
	let frame = 0;
	let source: "pointer" | "key" | null = null;
	let pointerType = "mouse";
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const fill = () => button.querySelector<HTMLElement>("[data-hold-fill]");

	const paint = () => {
		const el = fill();
		if (el)
			el.style.clipPath = `inset(0 ${((1 - Math.min(1, Math.max(0, progress))) * 100).toFixed(3)}% 0 0)`;
	};
	const stop = () => {
		cancelAnimationFrame(frame);
		frame = 0;
	};

	/** Fills linearly from wherever it is, so a quick re-press carries on instead of starting over. */
	const fillUp = () => {
		stop();
		const started = performance.now() - progress * options.duration;
		const tick = (now: number) => {
			progress = Math.min(1, (now - started) / options.duration);
			paint();
			if (progress >= 1) {
				frame = 0;
				complete();
				return;
			}
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
	};

	const springTo = (target: number) => {
		stop();
		if (reduced.matches) {
			progress = target;
			paint();
			return;
		}
		velocity = 0;
		let then = performance.now();
		const tick = (now: number) => {
			const dt = Math.min(1 / 30, (now - then) / 1000);
			then = now;
			velocity +=
				(-REWIND.stiffness * (progress - target) - REWIND.damping * velocity) * dt;
			progress += velocity * dt;
			if (Math.abs(progress - target) < 0.001 && Math.abs(velocity) < 0.01) {
				progress = target;
				paint();
				frame = 0;
				return;
			}
			paint();
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
	};

	const setHolding = (holding: boolean) => {
		button.toggleAttribute("data-holding", holding);
		options.onHoldChange(holding);
	};

	function complete() {
		if (!source) return;
		source = null;
		setHolding(false);
		if (pointerType === "touch") navigator.vibrate?.(12);
		options.onComplete();
	}

	const begin = (from: "pointer" | "key") => {
		if (options.done || options.disabled || source) return;
		source = from;
		setHolding(true);
		fillUp();
	};
	const release = () => {
		if (!source) return;
		source = null;
		setHolding(false);
		springTo(0);
	};

	const onPointerDown = (event: PointerEvent) => {
		if (!event.isPrimary || event.button !== 0) return;
		pointerType = event.pointerType;
		button.setPointerCapture(event.pointerId);
		begin("pointer");
	};
	const onPointerMove = (event: PointerEvent) => {
		if (source !== "pointer") return;
		const box = button.getBoundingClientRect();
		if (
			event.clientX < box.left - SLACK ||
			event.clientX > box.right + SLACK ||
			event.clientY < box.top - SLACK ||
			event.clientY > box.bottom + SLACK
		)
			release();
	};
	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key !== " " && event.key !== "Enter") return;
		event.preventDefault();
		if (!event.repeat) begin("key");
	};
	const onKeyUp = (event: KeyboardEvent) => {
		if (event.key !== " " && event.key !== "Enter") return;
		event.preventDefault();
		if (source === "key") release();
	};
	const onContextMenu = (event: Event) => event.preventDefault();

	button.addEventListener("pointerdown", onPointerDown);
	button.addEventListener("pointermove", onPointerMove);
	button.addEventListener("pointerup", release);
	button.addEventListener("pointercancel", release);
	button.addEventListener("lostpointercapture", release);
	button.addEventListener("keydown", onKeyDown);
	button.addEventListener("keyup", onKeyUp);
	button.addEventListener("blur", release);
	button.addEventListener("contextmenu", onContextMenu);
	paint();

	return {
		update(next: HoldOptions) {
			const changed = next.done !== options.done;
			options = next;
			// A reset rewinds the fill as the label morphs back; a confirmation fills it the rest of the way.
			if (changed && !source) springTo(next.done ? 1 : 0);
		},
		destroy() {
			stop();
			button.removeEventListener("pointerdown", onPointerDown);
			button.removeEventListener("pointermove", onPointerMove);
			button.removeEventListener("pointerup", release);
			button.removeEventListener("pointercancel", release);
			button.removeEventListener("lostpointercapture", release);
			button.removeEventListener("keydown", onKeyDown);
			button.removeEventListener("keyup", onKeyUp);
			button.removeEventListener("blur", release);
			button.removeEventListener("contextmenu", onContextMenu);
		},
	};
}
