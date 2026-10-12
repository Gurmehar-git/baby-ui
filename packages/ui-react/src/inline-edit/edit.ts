export type InlineEditPhase = "idle" | "saving" | "saved" | "failed";

/** The character offset under a click inside `textNode`, the way a text field places its caret. */
export function caretAt(
	textNode: Node | null | undefined,
	x: number,
	y: number,
	length: number,
): number {
	if (!textNode) return length;
	const position =
		"caretPositionFromPoint" in document ? document.caretPositionFromPoint(x, y) : null;
	if (position)
		return position.offsetNode === textNode ? Math.min(position.offset, length) : length;
	const range =
		"caretRangeFromPoint" in document ? document.caretRangeFromPoint(x, y) : null;
	return range && range.startContainer === textNode
		? Math.min(range.startOffset, length)
		: length;
}

/** Single-line drafts collapse runs of whitespace; multiline ones only trim the ends. */
export const cleanDraft = (text: string, multiline: boolean) =>
	multiline ? text.trim() : text.replace(/\s+/g, " ").trim();

/** Runs `onSave`, sync or async, and reports whether it succeeded. */
export async function runSave(
	onSave: (next: string) => unknown,
	next: string,
): Promise<boolean> {
	try {
		await onSave(next);
		return true;
	} catch {
		return false;
	}
}
