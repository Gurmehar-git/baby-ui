/** Bar width: 88% of a slot unless sized, then shrunk so a group fits 92% of the slot. */
export function seriesBarWidth(options: {
	innerWidth: number;
	count: number;
	groups: number;
	size?: number;
	maxSize?: number;
	gap: number;
}): number {
	const { innerWidth, count, groups, size, maxSize, gap } = options;
	const slot = count < 2 ? innerWidth : innerWidth / (count - 1);
	let width = size ?? Math.min(slot * 0.88, maxSize ?? Number.POSITIVE_INFINITY);
	if (maxSize !== undefined) width = Math.min(width, maxSize);
	if (groups > 1) {
		const room = slot * 0.92;
		const needed = groups * width + (groups - 1) * gap;
		if (needed > room && room > 0)
			width = Math.max(4, (room - (groups - 1) * gap) / groups);
	}
	return Math.max(2, width);
}

/** Left edge of one bar relative to its datum's x, for grouped or stacked layouts. */
export function seriesBarOffset(options: {
	index: number;
	groups: number;
	width: number;
	gap: number;
	stacked: boolean;
}): number {
	const { index, groups, width, gap, stacked } = options;
	if (stacked || groups <= 1) return -width / 2;
	const total = groups * width + (groups - 1) * gap;
	return -total / 2 + index * (width + gap);
}

/** Staggers bar i by i x 40% of the enter duration over the bar count. */
export function seriesBarDelay(index: number, count: number, duration: number): number {
	return count > 0 ? (index * duration * 0.4) / count : 0;
}

/** Eased local progress of a bar that starts `delay` ms into a clock of `elapsed` ms. */
export function localProgress(
	elapsed: number,
	delay: number,
	duration: number,
	ease: (t: number) => number,
): number {
	if (duration <= 0) return 1;
	return ease(Math.min(1, Math.max(0, (elapsed - delay) / duration)));
}
