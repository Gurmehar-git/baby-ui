export interface CollectionSurferItem {
	src: string;
	alt: string;
}

/** Pointer distance in px beyond which a card no longer reacts. */
export const SURF_REACH = 400;

/** Scroll offset after wrapping by one loop, or null while it is in the safe middle band. */
export function wrapSurfScroll(top: number, loop: number): number | null {
	if (loop <= 0) return null;
	if (top < loop * 0.5) return top + loop;
	if (top > loop * 2) return top - loop;
	return null;
}

/** Cards travelled so far, looping every `count` cards. */
export function surfShift(top: number, perItem: number, count: number): number {
	if (perItem <= 0 || count <= 0) return 0;
	const shift = (top / perItem) % count;
	return shift < 0 ? shift + count : shift;
}

/** 1 with the pointer on the card's centre, falling to 0 at `SURF_REACH`. */
export function surfNearness(rect: DOMRect, x: number, y: number): number {
	const distance = Math.hypot(
		x - (rect.left + rect.width / 2),
		y - (rect.top + rect.height / 2),
	);
	return Math.max(0, 1 - distance / SURF_REACH);
}
