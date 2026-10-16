import type { OrbitHeroLabels, OrbitHeroTone } from "./types";

/** Degrees per second; scrolling multiplies both and flips them with the scroll direction. */
const OUTER_SPEED = 360 / 25;
const INNER_SPEED = -360 / 10;

export const ORBIT_OUTER_RADIUS = 260;
export const ORBIT_INNER_RADIUS = 185;

export const ORBIT_HERO_TONES: OrbitHeroTone[] = [
	{ label: "Primary", color: "var(--primary)" },
	{ label: "Chart 2", color: "var(--chart-2)" },
	{ label: "Chart 3", color: "var(--chart-3)" },
	{ label: "Chart 4", color: "var(--chart-4)" },
	{ label: "Chart 5", color: "var(--chart-5)" },
];

export const ORBIT_HERO_LABELS: OrbitHeroLabels = {
	group: "Change group",
	tone: "Change tone",
};

/** An item's offset from the ring centre; items are 48px boxes centred on their point. */
export function orbitPlace(index: number, length: number, radius: number): string {
	const angle = (index * 2 * Math.PI) / length;
	return `${radius * Math.cos(angle) - 24}px ${radius * Math.sin(angle) - 24}px`;
}

/** Stagger for an item's swap, capped so a full ring settles within ~850ms. */
export const orbitDelay = (index: number) => `${Math.min(index * 45, 450)}ms`;

/** Spins both rings while `stage` is on screen, faster while the page scrolls; returns a stop. */
export function spinOrbits(
	stage: Element,
	outer: HTMLElement,
	inner: HTMLElement,
): () => void {
	let frame = 0;
	let last = 0;
	let lastY = 0;
	let velocity = 0;
	let direction = 1;
	let outerAngle = 0;
	let innerAngle = 0;

	const tick = (now: number) => {
		const dt = Math.min(now - last, 32) / 1000;
		last = now;
		const y = window.scrollY;
		const raw = dt > 0 ? (y - lastY) / dt : 0;
		lastY = y;
		velocity += (raw - velocity) * (1 - Math.exp(-dt * 12));
		if (Math.abs(raw) > 1) direction = raw < 0 ? -1 : 1;
		const boost = (1 + Math.abs(velocity) / 200) * direction;
		outerAngle += OUTER_SPEED * boost * dt;
		innerAngle += INNER_SPEED * boost * dt;
		outer.style.setProperty("--spin", `${outerAngle}deg`);
		inner.style.setProperty("--spin", `${innerAngle}deg`);
		frame = requestAnimationFrame(tick);
	};

	const observer = new IntersectionObserver(([entry]) => {
		cancelAnimationFrame(frame);
		if (!entry?.isIntersecting) return;
		last = performance.now();
		lastY = window.scrollY;
		frame = requestAnimationFrame(tick);
	});
	observer.observe(stage);
	return () => {
		observer.disconnect();
		cancelAnimationFrame(frame);
	};
}
