import { c } from "./logger.ts";

export interface DiffLine {
	readonly kind: " " | "+" | "-";
	readonly text: string;
}

// LCS table; registry files stay small enough that O(n*m) is instant.
export function lineDiff(before: string, after: string): DiffLine[] {
	const a = before.split("\n");
	const b = after.split("\n");
	const rows = a.length + 1;
	const cols = b.length + 1;
	const lcs = new Uint32Array(rows * cols);
	for (let i = a.length - 1; i >= 0; i--) {
		for (let j = b.length - 1; j >= 0; j--) {
			lcs[i * cols + j] =
				a[i] === b[j]
					? (lcs[(i + 1) * cols + j + 1] ?? 0) + 1
					: Math.max(lcs[(i + 1) * cols + j] ?? 0, lcs[i * cols + j + 1] ?? 0);
		}
	}
	const out: DiffLine[] = [];
	let i = 0;
	let j = 0;
	while (i < a.length || j < b.length) {
		if (i < a.length && j < b.length && a[i] === b[j]) {
			out.push({ kind: " ", text: a[i] ?? "" });
			i++;
			j++;
		} else if (
			j < b.length &&
			(i >= a.length || (lcs[i * cols + j + 1] ?? 0) >= (lcs[(i + 1) * cols + j] ?? 0))
		) {
			out.push({ kind: "+", text: b[j] ?? "" });
			j++;
		} else {
			out.push({ kind: "-", text: a[i] ?? "" });
			i++;
		}
	}
	return out;
}

export function diffStat(
	before: string,
	after: string,
): { added: number; removed: number } {
	const lines = lineDiff(before, after);
	return {
		added: lines.filter((l) => l.kind === "+").length,
		removed: lines.filter((l) => l.kind === "-").length,
	};
}

/** Changed lines with `context` lines around each hunk, coloured for a terminal. */
export function formatDiff(before: string, after: string, context = 3): string {
	const lines = lineDiff(before, after);
	const keep = new Set<number>();
	lines.forEach((line, index) => {
		if (line.kind === " ") return;
		for (let k = index - context; k <= index + context; k++) keep.add(k);
	});
	const out: string[] = [];
	let gap = false;
	lines.forEach((line, index) => {
		if (!keep.has(index)) {
			gap = true;
			return;
		}
		if (gap && out.length) out.push(c.dim("..."));
		gap = false;
		if (line.kind === "+") out.push(c.green(`+ ${line.text}`));
		else if (line.kind === "-") out.push(c.red(`- ${line.text}`));
		else out.push(c.dim(`  ${line.text}`));
	});
	return out.join("\n");
}
