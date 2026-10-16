import type { RippleTransitionState } from "./variants";

export type RippleTransitionImage = {
	src: string;
	/** Announced when the image becomes current. */
	alt: string;
};

export type RipplePoint = { x: number; y: number };

/** Writes the ripple origin (px from the root's top-left) and the radius that covers the root. */
export function placeRipple(root: HTMLElement, point: RipplePoint | null) {
	const w = root.offsetWidth;
	const h = root.offsetHeight;
	const x = point?.x ?? w / 2;
	const y = point?.y ?? h / 2;
	const r = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
	root.style.setProperty("--rt-x", `${x.toFixed(1)}px`);
	root.style.setProperty("--rt-y", `${y.toFixed(1)}px`);
	root.style.setProperty("--rt-r", `${Math.ceil(r)}px`);
}

/** Layer role of image `i` while `shown` hands over to `value`. */
export function layerState(
	i: number,
	value: number,
	shown: number,
	moving: boolean,
): RippleTransitionState {
	if (i === value) return moving ? "enter" : "current";
	return moving && i === shown ? "leave" : "idle";
}

export function wrapIndex(i: number, count: number) {
	return count > 0 ? ((Math.floor(i) % count) + count) % count : 0;
}
