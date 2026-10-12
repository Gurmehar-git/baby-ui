import { createHold } from "../hold-to-confirm/hold";

/** Where the control is: resting, asking, working, finished, or failed. */
export type ConfirmMorphState = "idle" | "confirming" | "pending" | "done" | "error";
/** How the question is answered: a press, a held press, or a press then a short cancellable countdown. */
export type ConfirmMorphMode = "press" | "hold" | "countdown";
export type ConfirmMorphFace = ConfirmMorphState | "counting";

export type ConfirmOptions = {
	state: ConfirmMorphState;
	mode: ConfirmMorphMode;
	/** Hold length in milliseconds, for `hold`. */
	holdDuration: number;
	/** Seconds counted down, for `countdown`. */
	countdown: number;
	/** Milliseconds before an unanswered question or a result returns to rest; 0 turns it off. */
	confirmTimeout: number;
	resultTimeout: number;
	cancelOnOutsidePress: boolean;
	onConfirm?: () => unknown;
	onUndo?: () => unknown;
	onCancel?: () => void;
	/** Moves the state; the framework owns it, controlled or not. */
	go: (next: ConfirmMorphState) => void;
	onWorkingChange: (kind: "confirm" | "undo") => void;
	/** Seconds left while counting down, or null when not counting. */
	onCount: (seconds: number | null) => void;
};

/** A press this soon after the question appears is the tail of the press that opened it. */
const ARM_MS = 280;

/**
 * Drives an inline confirm: timeouts that pause under the pointer or in a hidden tab, the
 * countdown ring, the held confirm, Escape and outside presses, and focus that follows the faces.
 */
export function createConfirmMorph(root: HTMLElement, initial: ConfirmOptions) {
	let options = initial;
	let state = options.state;
	let counting = false;
	let shownFace = faceOf();
	// What the last render showed; `go` moves `state` ahead of it.
	let rendered = { state, mode: options.mode };
	let askedAt = 0;
	let run = 0;
	let working: "confirm" | "undo" = "confirm";
	let pendingFocus = false;
	let hold: ReturnType<typeof createHold> | null = null;
	const paused = { hover: false, hidden: document.hidden };
	let clock = 0;
	let clockLeft = 0;
	let clockFrom = 0;
	let countFrame = 0;

	function faceOf(): ConfirmMorphFace {
		return state === "confirming" && counting ? "counting" : state;
	}

	const keepFocus = () => {
		const active = document.activeElement;
		pendingFocus = root.contains(active) || active === document.body;
	};

	const go = (next: ConfirmMorphState) => {
		if (next !== "confirming") setCounting(false);
		if (next === state) return;
		keepFocus();
		if (next === "confirming") askedAt = performance.now();
		state = next;
		options.go(next);
	};

	const toIdle = () => {
		run++;
		go("idle");
	};

	const cancel = () => {
		options.onCancel?.();
		toIdle();
	};

	async function perform(kind: "confirm" | "undo") {
		const handler = kind === "confirm" ? options.onConfirm : options.onUndo;
		const token = ++run;
		working = kind;
		options.onWorkingChange(kind);
		setCounting(false);
		let result: unknown;
		try {
			result = handler?.();
		} catch {
			go("error");
			return;
		}
		if (result instanceof Promise) {
			go("pending");
			try {
				await result;
			} catch {
				if (token === run) go("error");
				return;
			}
			if (token !== run) return;
		}
		go(kind === "undo" ? "idle" : "done");
	}

	// --- Timeout clock ---
	const stopClock = () => {
		clearTimeout(clock);
		clock = 0;
	};
	const runClock = () => {
		stopClock();
		if (!clockLeft || paused.hover || paused.hidden) return;
		clockFrom = performance.now();
		clock = window.setTimeout(() => {
			clockLeft = 0;
			if (state === "confirming") cancel();
			else toIdle();
		}, clockLeft);
	};
	const pauseClock = () => {
		if (clock) clockLeft = Math.max(1, clockLeft - (performance.now() - clockFrom));
		stopClock();
	};
	const restartClock = () => {
		stopClock();
		clockLeft =
			state === "confirming" && !counting
				? options.confirmTimeout
				: state === "done" || state === "error"
					? options.resultTimeout
					: 0;
		runClock();
	};

	// --- Countdown ---
	function setCounting(next: boolean) {
		if (next === counting) return;
		counting = next;
		cancelAnimationFrame(countFrame);
		if (!next) {
			options.onCount(null);
			return;
		}
		const total = options.countdown * 1000;
		const started = performance.now();
		let shown = options.countdown;
		options.onCount(shown);
		const tick = (now: number) => {
			const left = Math.max(0, 1 - (now - started) / total);
			const ring = root.querySelector<SVGElement>("[data-confirm-ring]");
			if (ring) ring.style.strokeDashoffset = (1 - left).toFixed(4);
			const seconds = Math.max(1, Math.ceil(left * options.countdown));
			if (seconds !== shown) {
				shown = seconds;
				options.onCount(seconds);
			}
			if (left <= 0) {
				void perform("confirm");
				return;
			}
			countFrame = requestAnimationFrame(tick);
		};
		countFrame = requestAnimationFrame(tick);
	}

	// --- Hold: a fresh hold per question, so the fill always starts empty ---
	const armHold = () => {
		hold?.destroy();
		hold = null;
		const button = root.querySelector<HTMLElement>("[data-confirm-hold]");
		if (options.mode !== "hold" || state !== "confirming" || !button) return;
		hold = createHold(button, {
			duration: options.holdDuration,
			done: false,
			disabled: false,
			onComplete: () => void perform("confirm"),
			onHoldChange: () => {},
		});
	};

	const answer = () => {
		if (performance.now() - askedAt < ARM_MS) return;
		if (options.mode === "countdown") {
			keepFocus();
			setCounting(true);
			restartClock();
			return;
		}
		void perform("confirm");
	};

	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			if (state === "confirming") cancel();
			else if (state === "done" || state === "error") toIdle();
			else return;
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		// Enter answers yes from the question, except on one of its own buttons (Cancel keeps meaning Cancel).
		if (
			event.key === "Enter" &&
			state === "confirming" &&
			!event.repeat &&
			!(event.target instanceof HTMLButtonElement)
		) {
			event.preventDefault();
			if (counting) void perform("confirm");
			else if (options.mode !== "hold") answer();
		}
	};
	const onOutside = (event: PointerEvent) => {
		if (
			state === "confirming" &&
			options.cancelOnOutsidePress &&
			event.target instanceof Node &&
			!root.contains(event.target)
		)
			cancel();
	};
	const onEnter = () => {
		paused.hover = true;
		pauseClock();
	};
	const onLeave = () => {
		paused.hover = false;
		runClock();
	};
	const onVisibility = () => {
		paused.hidden = document.hidden;
		if (paused.hidden) pauseClock();
		else runClock();
	};

	root.addEventListener("keydown", onKeyDown);
	root.addEventListener("pointerenter", onEnter);
	root.addEventListener("pointerleave", onLeave);
	root.addEventListener("pointercancel", onLeave);
	document.addEventListener("pointerdown", onOutside);
	document.addEventListener("visibilitychange", onVisibility);
	restartClock();
	armHold();

	return {
		/** The trigger's press: open the question. */
		ask: () => go("confirming"),
		answer,
		cancel,
		undo: () => void perform("undo"),
		retry: () => void perform(working),
		/** Call after every render with the latest options. */
		update(next: ConfirmOptions) {
			options = next;
			state = next.state;
			if (state !== "confirming") setCounting(false);
			if (state !== rendered.state || next.mode !== rendered.mode) {
				rendered = { state, mode: next.mode };
				restartClock();
				armHold();
			}
			const face = faceOf();
			if (face === shownFace) return;
			shownFace = face;
			if (!pendingFocus) return;
			pendingFocus = false;
			const target = root.querySelector<HTMLElement>(
				'[data-on="true"] [data-autofocus]:not(:disabled)',
			);
			(target ?? root).focus({ preventScroll: true });
		},
		destroy() {
			stopClock();
			cancelAnimationFrame(countFrame);
			hold?.destroy();
			root.removeEventListener("keydown", onKeyDown);
			root.removeEventListener("pointerenter", onEnter);
			root.removeEventListener("pointerleave", onLeave);
			root.removeEventListener("pointercancel", onLeave);
			document.removeEventListener("pointerdown", onOutside);
			document.removeEventListener("visibilitychange", onVisibility);
		},
	};
}
