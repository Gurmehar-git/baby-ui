/** Inclusive data indices of the selected window. */
export type IndexRange = [number, number];

export type BrushMode = "move" | "start" | "end" | "new";

/** Handle hit width in px, wider than the drawn 4px pill. */
export const HANDLE_HIT = 12;
export const HANDLE_WIDTH = 4;
export const HANDLE_HEIGHT = 24;

export function clampRange([a, b]: IndexRange, count: number, minSpan = 1): IndexRange {
	const last = Math.max(0, count - 1);
	let start = Math.max(0, Math.min(a, b));
	let end = Math.min(last, Math.max(a, b));
	if (end - start < minSpan) {
		if (start + minSpan <= last) end = start + minSpan;
		else start = Math.max(0, end - minSpan);
	}
	return [start, end];
}

/** Slides the window without changing its span. */
export function moveRange([a, b]: IndexRange, delta: number, count: number): IndexRange {
	const span = b - a;
	const start = Math.max(0, Math.min(count - 1 - span, a + delta));
	return [start, start + span];
}

export function resizeRange(
	range: IndexRange,
	edge: "start" | "end",
	index: number,
	count: number,
): IndexRange {
	const [a, b] = range;
	if (edge === "start") return clampRange([Math.min(index, b - 1), b], count);
	return clampRange([a, Math.max(index, a + 1)], count);
}

export function sameRange(a: IndexRange, b: IndexRange) {
	return a[0] === b[0] && a[1] === b[1];
}

/** Keyboard model: arrows slide, shift+arrows resize the end, Page keys jump a span. */
export function keyRange(key: string, shift: boolean, range: IndexRange, count: number) {
	const span = range[1] - range[0];
	switch (key) {
		case "ArrowLeft":
		case "ArrowDown":
			return shift
				? resizeRange(range, "end", range[1] - 1, count)
				: moveRange(range, -1, count);
		case "ArrowRight":
		case "ArrowUp":
			return shift
				? resizeRange(range, "end", range[1] + 1, count)
				: moveRange(range, 1, count);
		case "PageDown":
			return moveRange(range, -span, count);
		case "PageUp":
			return moveRange(range, span, count);
		case "Home":
			return moveRange(range, -count, count);
		case "End":
			return moveRange(range, count, count);
		default:
			return null;
	}
}
