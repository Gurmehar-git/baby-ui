import { tv, type VariantProps } from "tailwind-variants";

export const textRepel = tv({
	slots: {
		root: "relative inline-flex cursor-default select-none flex-wrap items-center justify-center",
		// The easing is a spring (stiffness 180, damping 14, mass 0.4) sampled over 600ms, so the
		// transition settles like the physics it replaces and still retargets mid-flight.
		letter: [
			"inline-block whitespace-pre [translate:var(--repel-x,0)_var(--repel-y,0)] [rotate:var(--repel-r,0deg)]",
			"transition-[translate,rotate] duration-600 ease-[linear(0,0.103,0.302,0.508,0.681,0.81,0.898,0.953,0.984,1.001,1.007,1.009,1.008,1.006,1.004,1.003,1.002,1.001,1)] motion-reduce:transition-none",
		],
		srOnly: "sr-only",
	},
	variants: {
		/** Repel pushes letters away, attract pulls them in, inertia flicks each one the pointer crosses. */
		mode: {
			repel: {},
			attract: {},
			inertia: {},
		},
		size: {
			inherit: {},
			sm: { root: "text-2xl" },
			default: { root: "text-4xl" },
			lg: { root: "text-6xl" },
		},
	},
	defaultVariants: { mode: "repel", size: "inherit" },
});

export type TextRepelMode = NonNullable<VariantProps<typeof textRepel>["mode"]>;
export type TextRepelSize = NonNullable<VariantProps<typeof textRepel>["size"]>;

export type RepelOffset = { x: number; y: number; rotate: number };
type Point = { x: number; y: number };

/** Offset for a letter centred at `origin`, with a quadratic falloff to zero at `radius`. */
export function repelOffset(
	origin: Point,
	pointer: Point | null,
	radius: number,
	strength: number,
	mode: TextRepelMode,
): RepelOffset {
	if (!pointer) return { x: 0, y: 0, rotate: 0 };
	const dx = origin.x - pointer.x;
	const dy = origin.y - pointer.y;
	const distance = Math.hypot(dx, dy);
	if (distance === 0 || distance >= radius) return { x: 0, y: 0, rotate: 0 };
	const force = (1 - distance / radius) ** 2 * strength * (mode === "attract" ? -1 : 1);
	const angle = Math.atan2(dy, dx);
	const x = Math.cos(angle) * force;
	return { x, y: Math.sin(angle) * force, rotate: x * 0.3 };
}

/** Writes an offset onto a letter's custom properties; no re-render per pointer move. */
export function applyOffset(el: HTMLElement, offset: RepelOffset): void {
	el.style.setProperty("--repel-x", `${offset.x.toFixed(2)}px`);
	el.style.setProperty("--repel-y", `${offset.y.toFixed(2)}px`);
	el.style.setProperty("--repel-r", `${offset.rotate.toFixed(2)}deg`);
}

/** Letter centres relative to the root (their offsetParent), from untransformed layout. */
export function letterOrigins(letters: HTMLElement[]): Point[] {
	return letters.map((el) => ({
		x: el.offsetLeft + el.offsetWidth / 2,
		y: el.offsetTop + el.offsetHeight / 2,
	}));
}

/** Moves every letter for a pointer position (container coordinates), or releases them all. */
export function repelAll(
	letters: HTMLElement[],
	origins: Point[],
	pointer: Point | null,
	radius: number,
	strength: number,
	mode: TextRepelMode,
): void {
	letters.forEach((el, i) => {
		const origin = origins[i];
		if (origin) applyOffset(el, repelOffset(origin, pointer, radius, strength, mode));
	});
}

const REST: RepelOffset = { x: 0, y: 0, rotate: 0 };
const KICK_HOLD_MS = 180;
const MAX_ROTATION = 18;
const clamp = (v: number, max: number) => Math.min(Math.max(v, -max), max);
const orFallback = (v: number, fallback: number) => (Math.abs(v) < 1 ? fallback : v);

/** Kick for a letter the pointer just entered: its velocity, or an alternating nudge when still. */
export function inertiaKick(
	velocity: Point,
	index: number,
	strength: number,
): RepelOffset {
	const k = strength / 45;
	const side = index % 2 === 0 ? 1 : -1;
	return {
		x: clamp(orFallback(velocity.x * k * 2.2, side * k * 10), strength),
		y: clamp(orFallback(velocity.y * k * 2.2, -k * 7), strength),
		rotate: clamp(
			orFallback((velocity.x - velocity.y) * k * 0.5, side * k * 6),
			MAX_ROTATION,
		),
	};
}

/** Inertia mode: flicks the letter under the pointer, then lets the spring carry it home. */
export function createInertia() {
	let last: Point | null = null;
	let velocity: Point = { x: 0, y: 0 };
	let current: HTMLElement | undefined;
	const timers = new Set<ReturnType<typeof setTimeout>>();
	return {
		move(
			pointer: Point,
			target: EventTarget | null,
			letters: HTMLElement[],
			strength: number,
		) {
			if (last) velocity = { x: pointer.x - last.x, y: pointer.y - last.y };
			last = pointer;
			const index = target instanceof HTMLElement ? letters.indexOf(target) : -1;
			const el = letters[index];
			if (!el || el === current) return;
			current = el;
			applyOffset(el, inertiaKick(velocity, index, strength));
			const timer = setTimeout(() => {
				timers.delete(timer);
				applyOffset(el, REST);
			}, KICK_HOLD_MS);
			timers.add(timer);
		},
		leave() {
			last = null;
			velocity = { x: 0, y: 0 };
			current = undefined;
		},
		destroy() {
			for (const timer of timers) clearTimeout(timer);
		},
	};
}
