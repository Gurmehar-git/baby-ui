export type CardDecision = "left" | "right";
export type DeckPoint = { x: number; y: number };
export type DeckExit = DeckPoint & { tilt: number };
export type DeckReturn = DeckExit & { delay: number };
export type DeckCard = {
	key: string;
	depth: number;
	decision: CardDecision | null;
	/** Set when undo or start over brings the card back from where it left the screen. */
	returnFrom?: DeckReturn;
};

export type DeckOptions = {
	/** A drag released on the top card; return true when it counts as a decision. */
	onRelease: (
		key: string,
		offset: DeckPoint,
		velocity: DeckPoint,
		width: number,
	) => boolean;
	onThrown: (key: string, exit: DeckExit) => void;
	onGone: (key: string) => void;
	/** How the cards behind sit: peeking below, splayed to the side, or hidden under the top card. */
	layout: DeckLayout;
};

export type DeckLayout = "stack" | "fan" | "flat";

/** Cards rendered in the stack; the last waits invisibly one step behind and fades in as it rises. */
export const VISIBLE = 4;
const PEEK = 12;
const SHRINK = 0.05;
/** Fan layout: sideways step (px) and turn (deg) per card of depth. */
const FAN_X = 10;
const FAN_TURN = 4;
/** How far the cards behind rise while the top card is dragged away, in stack steps. */
const LIFT = 0.4;
const LIFT_DISTANCE = 160;
/** Degrees of rotation per pixel of horizontal travel. */
const ROTATE = 0.065;
/** Vertical travel is not a decision, so past a small free zone it resists like a rubber band. */
const FREE_Y = 48;
const STRETCH_Y = 140;

type Spring = { stiffness: number; damping: number };
const physical = (duration: number, bounce: number): Spring => {
	const root = (2 * Math.PI) / (duration * 1.2);
	return { stiffness: root * root, damping: 2 * (1 - bounce) * root };
};
const SMOOTH = physical(0.45, 0);
const RETURN = physical(0.35, 0.15);
const THROW = physical(0.5, 0);

const clampUnit = (v: number) => Math.min(1, Math.max(0, v));
const ramp = (v: number, a: number, b: number) => clampUnit((v - a) / (b - a));
const resistY = (raw: number) => {
	const d = Math.abs(raw);
	return d <= FREE_Y
		? raw
		: Math.sign(raw) *
				(FREE_Y + (1 - 1 / (((d - FREE_Y) * 0.55) / STRETCH_Y + 1)) * STRETCH_Y);
};
const unresistY = (shown: number) => {
	const d = Math.abs(shown);
	if (d <= FREE_Y) return shown;
	const s = Math.min(d - FREE_Y, STRETCH_Y - 1);
	return Math.sign(shown) * (FREE_Y + ((1 / (1 - s / STRETCH_Y) - 1) * STRETCH_Y) / 0.55);
};

type Motion = {
	value: number;
	velocity: number;
	target: number;
	spring: Spring;
	start: number;
};
type Fade = {
	from: number;
	to: number;
	start: number;
	duration: number;
	done?: () => void;
} | null;
type Card = {
	key: string;
	x: Motion;
	y: Motion;
	depth: Motion;
	depthGoal: number;
	tilt: number;
	opacity: number;
	fade: Fade;
	decision: CardDecision | null;
	interactive: boolean;
	homing: boolean;
	settled: boolean;
};

const motion = (value: number, spring = SMOOTH): Motion => ({
	value,
	velocity: 0,
	target: value,
	spring,
	start: 0,
});

function velocityOf(
	samples: { t: number; x: number; y: number }[],
	now: number,
): DeckPoint {
	const recent = samples.filter((s) => now - s.t <= 80);
	const first = recent[0];
	const last = recent[recent.length - 1];
	if (!first || !last || first === last || now - last.t > 60) return { x: 0, y: 0 };
	const seconds = (last.t - first.t) / 1000;
	return { x: (last.x - first.x) / seconds, y: (last.y - first.y) / seconds };
}

/**
 * Drives a deck of cards: drag the top card with a tilt that follows the grip, throw it along the
 * flick, spring it home below the threshold, and raise the cards behind as it leaves.
 */
export function createCardDeck(stage: HTMLElement, opts: DeckOptions) {
	let options = opts;
	const cards = new Map<string, Card>();
	const flings = new Map<string, DeckPoint>();
	let lift = 0;
	let frame = 0;
	let drag: {
		key: string;
		ox: number;
		oy: number;
		samples: { t: number; x: number; y: number }[];
	} | null = null;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");

	const slotEl = (key: string) =>
		stage.querySelector<HTMLElement>(`[data-stack-slot="${CSS.escape(key)}"]`);
	const cardEl = (key: string) =>
		slotEl(key)?.querySelector<HTMLElement>("[data-stack-card]") ?? null;

	const paint = (card: Card) => {
		const slot = slotEl(card.key);
		const el = cardEl(card.key);
		if (!slot || !el) return;
		const d = card.depth.value;
		slot.style.transform =
			options.layout === "fan"
				? `translateX(${d * FAN_X}px) rotate(${d * FAN_TURN}deg) scale(${1 - d * 0.03})`
				: options.layout === "flat"
					? "none"
					: `translateY(${d * PEEK}px) scale(${1 - d * SHRINK})`;
		slot.style.opacity = String(1 - ramp(d, VISIBLE - 2, VISIBLE - 1));
		el.style.transform = `translate(${card.x.value}px, ${card.y.value}px) rotate(${card.x.value * ROTATE * card.tilt}deg)`;
		el.style.opacity = String(card.opacity);
		const shade = el.querySelector<HTMLElement>("[data-stack-shade]");
		if (shade) shade.style.opacity = String(clampUnit(d / 2));
		const keep = el.querySelector<HTMLElement>('[data-stack-stamp="right"]');
		const pass = el.querySelector<HTMLElement>('[data-stack-stamp="left"]');
		if (keep) keep.style.opacity = String(ramp(card.x.value, 16, 96));
		if (pass) pass.style.opacity = String(1 - ramp(card.x.value, -96, -16));
	};

	const step = (m: Motion, dt: number, now: number) => {
		if (now < m.start) return false;
		m.velocity +=
			(-m.spring.stiffness * (m.value - m.target) - m.spring.damping * m.velocity) * dt;
		m.value += m.velocity * dt;
		if (Math.abs(m.value - m.target) < 0.05 && Math.abs(m.velocity) < 0.5) {
			m.value = m.target;
			m.velocity = 0;
			return false;
		}
		return true;
	};

	let then = 0;
	const tick = (now: number) => {
		const dt = Math.min(1 / 30, (now - then) / 1000);
		then = now;
		let busy = false;
		for (const card of cards.values()) {
			card.depth.target = card.depthGoal - (card.depthGoal > 0 ? lift * LIFT : 0);
			if (reduced.matches) card.depth.value = card.depth.target;
			else if (step(card.depth, dt, now)) busy = true;
			if (!(drag && drag.key === card.key)) {
				const movingX = step(card.x, dt, now);
				const movingY = step(card.y, dt, now);
				if (movingX || movingY) busy = true;
				else if (card.homing && card.x.value === 0) card.homing = false;
			}
			if (card.fade) {
				const t = clampUnit((now - card.fade.start) / card.fade.duration);
				if (now >= card.fade.start)
					card.opacity = card.fade.from + (card.fade.to - card.fade.from) * t;
				if (t >= 1) {
					const done = card.fade.done;
					card.fade = null;
					done?.();
				} else busy = true;
			}
			// The top card reports how far it has travelled, so the stack behind responds.
			if (card.interactive && !card.homing)
				lift = clampUnit(Math.hypot(card.x.value, card.y.value * 0.5) / LIFT_DISTANCE);
			paint(card);
		}
		frame = busy || drag ? requestAnimationFrame(tick) : 0;
	};
	const wake = () => {
		if (frame) return;
		then = performance.now();
		frame = requestAnimationFrame(tick);
	};

	const springTo = (
		m: Motion,
		target: number,
		spring: Spring,
		velocity?: number,
		delay = 0,
	) => {
		m.target = target;
		m.spring = spring;
		if (velocity !== undefined) m.velocity = velocity;
		m.start = performance.now() + delay * 1000;
	};

	function throwCard(card: Card) {
		const el = cardEl(card.key);
		drag = drag?.key === card.key ? null : drag;
		card.homing = false;
		el?.removeAttribute("data-dragging");
		const direction = card.decision === "right" ? 1 : -1;
		const width = el?.offsetWidth ?? 320;
		const cx = card.x.value;
		const cy = card.y.value;
		// Buttons and keys throw with a default flick; a drag keeps the finger's velocity.
		const velocity = flings.get(card.key) ?? { x: direction * 900, y: -120 };
		flings.delete(card.key);
		const speed = Math.hypot(velocity.x, velocity.y);
		// Leave along the flick when it heads the chosen way, otherwise along the drag, otherwise straight out.
		let ux = velocity.x;
		let uy = velocity.y;
		if (speed < 200 || Math.sign(ux) !== direction) {
			ux = Math.abs(cx) > 8 ? cx : direction;
			uy = Math.abs(cx) > 8 ? cy * 0.5 : -0.12;
		}
		const length = Math.hypot(ux, uy) || 1;
		ux /= length;
		uy /= length;
		if (Math.abs(ux) < 0.45) {
			ux = direction * 0.45;
			uy = Math.sign(uy || -1) * Math.sqrt(1 - 0.45 * 0.45);
		}
		const reach = width * 1.6;
		const exit = { x: cx + ux * reach, y: cy + uy * reach, tilt: card.tilt };
		options.onThrown(card.key, exit);
		const gone = () => options.onGone(card.key);
		if (reduced.matches) {
			card.fade = {
				from: card.opacity,
				to: 0,
				start: performance.now(),
				duration: 150,
				done: gone,
			};
			return;
		}
		springTo(card.x, exit.x, THROW, velocity.x);
		springTo(card.y, exit.y, THROW, velocity.y);
		card.fade = {
			from: card.opacity,
			to: 0,
			start: performance.now() + 120,
			duration: 220,
			done: gone,
		};
	}

	function returnCard(card: Card, delay: number) {
		card.settled = true;
		if (reduced.matches) {
			card.x.value = 0;
			card.y.value = 0;
			card.fade = {
				from: card.opacity,
				to: 1,
				start: performance.now() + delay * 1000,
				duration: 150,
			};
			return;
		}
		// A card flying home leaves the stack alone, so the cards behind make room in one motion.
		card.homing = true;
		springTo(card.x, 0, SMOOTH, undefined, delay);
		springTo(card.y, 0, SMOOTH, undefined, delay);
		card.fade = {
			from: card.opacity,
			to: 1,
			start: performance.now() + delay * 1000,
			duration: 150,
		};
	}

	const onPointerDown = (event: PointerEvent) => {
		if (event.button !== 0 || !event.isPrimary) return;
		const target = event.target as Element;
		if (target.closest("button, a, input, select, textarea, [role='button']")) return;
		const el = target.closest<HTMLElement>("[data-stack-card][data-top]");
		const key = el?.closest<HTMLElement>("[data-stack-slot]")?.dataset.stackSlot;
		const card = key ? cards.get(key) : undefined;
		if (!el || !card?.interactive) return;
		card.homing = false;
		// Grabbing the top half tips the card the way the hand moves; the bottom half tips it the other way.
		if (Math.abs(card.x.value) < 2) {
			const rect = el.getBoundingClientRect();
			card.tilt = event.clientY < rect.top + rect.height / 2 ? 1 : -1;
		}
		card.x.velocity = 0;
		card.y.velocity = 0;
		drag = {
			key: card.key,
			ox: event.clientX - card.x.value,
			oy: event.clientY - unresistY(card.y.value),
			samples: [{ t: event.timeStamp, x: event.clientX, y: event.clientY }],
		};
		el.setPointerCapture(event.pointerId);
		el.setAttribute("data-dragging", "");
		wake();
	};

	const onPointerMove = (event: PointerEvent) => {
		const card = drag ? cards.get(drag.key) : undefined;
		if (!drag || !card) return;
		card.x.value = event.clientX - drag.ox;
		card.y.value = resistY(event.clientY - drag.oy);
		card.x.target = card.x.value;
		card.y.target = card.y.value;
		drag.samples.push({ t: event.timeStamp, x: event.clientX, y: event.clientY });
		if (drag.samples.length > 12) drag.samples.shift();
	};

	const onPointerUp = (event: PointerEvent) => {
		const state = drag;
		if (!state) return;
		drag = null;
		const el = cardEl(state.key);
		el?.removeAttribute("data-dragging");
		if (el?.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
		const card = cards.get(state.key);
		if (!card) return;
		const velocity =
			event.type === "pointercancel"
				? { x: 0, y: 0 }
				: velocityOf(state.samples, event.timeStamp);
		flings.set(card.key, velocity);
		if (
			options.onRelease(
				card.key,
				{ x: card.x.value, y: card.y.value },
				velocity,
				el?.offsetWidth ?? 320,
			)
		)
			return;
		flings.delete(card.key);
		// Below the threshold the card springs home, keeping the release velocity so it settles.
		if (reduced.matches) {
			card.x.value = 0;
			card.y.value = 0;
		} else {
			springTo(card.x, 0, RETURN, velocity.x);
			springTo(card.y, 0, RETURN, velocity.y);
		}
		wake();
	};

	stage.addEventListener("pointerdown", onPointerDown);
	stage.addEventListener("pointermove", onPointerMove);
	stage.addEventListener("pointerup", onPointerUp);
	stage.addEventListener("pointercancel", onPointerUp);

	return {
		/** Reconciles the engine with what the framework rendered; call after every render. */
		sync(list: DeckCard[]) {
			const seen = new Set<string>();
			for (const item of list) {
				seen.add(item.key);
				let card = cards.get(item.key);
				const travel = item.returnFrom && !reduced.matches ? item.returnFrom : undefined;
				if (!card) {
					card = {
						key: item.key,
						x: motion(travel?.x ?? 0),
						y: motion(travel?.y ?? 0),
						depth: motion(item.depth),
						depthGoal: item.depth,
						tilt: travel?.tilt ?? 1,
						opacity: item.returnFrom ? 0 : 1,
						fade: null,
						decision: null,
						interactive: false,
						homing: false,
						settled: !item.returnFrom,
					};
					cards.set(item.key, card);
					if (item.returnFrom && !item.decision) returnCard(card, item.returnFrom.delay);
				}
				card.depthGoal = item.depth;
				card.interactive = !item.decision && item.depth === 0;
				const el = cardEl(item.key);
				if (el) {
					el.toggleAttribute("data-flying", item.decision !== null);
				}
				if (item.decision && card.decision !== item.decision) {
					card.decision = item.decision;
					lift = 0;
					throwCard(card);
				} else if (!item.decision && card.decision) {
					// Undo mid-flight: the card turns back from wherever it is now.
					card.decision = null;
					returnCard(card, item.returnFrom?.delay ?? 0);
				}
				paint(card);
			}
			for (const key of cards.keys()) if (!seen.has(key)) cards.delete(key);
			wake();
		},
		update(next: DeckOptions) {
			const relayout = next.layout !== options.layout;
			options = next;
			if (relayout) for (const card of cards.values()) paint(card);
		},
		destroy() {
			cancelAnimationFrame(frame);
			stage.removeEventListener("pointerdown", onPointerDown);
			stage.removeEventListener("pointermove", onPointerMove);
			stage.removeEventListener("pointerup", onPointerUp);
			stage.removeEventListener("pointercancel", onPointerUp);
		},
	};
}
