export const SPLIT_FLAP_CHARACTERS =
	" ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$.,!?:;+-=%&#@/'";

/** Characters a cell flips through, in drum order, to get from `from` to `to`. */
export function flapSteps(
	from: string,
	to: string,
	characters = SPLIT_FLAP_CHARACTERS,
): string[] {
	if (from === to) return [];
	const start = characters.indexOf(from);
	const end = characters.indexOf(to);
	// A glyph missing from the drum snaps straight to its target.
	if (start === -1 || end === -1) return [to];
	const steps: string[] = [];
	let i = start;
	while (i !== end) {
		i = (i + 1) % characters.length;
		steps.push(characters[i] ?? to);
	}
	return steps;
}

export function flapColumns(columns: number): number {
	return Math.max(1, Math.floor(columns));
}

/** Uppercased board rows (split on newlines), each padded or cut to `columns` cells. */
export function flapRows(value: string, columns: number): string[][] {
	const width = flapColumns(columns);
	return value
		.toUpperCase()
		.split("\n")
		.map((line) => Array.from(line.padEnd(width, " ").slice(0, width)));
}

export function prefersReducedMotion(): boolean {
	return (
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches
	);
}
