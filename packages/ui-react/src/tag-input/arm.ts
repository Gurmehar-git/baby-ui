/**
 * Keys on an empty field: Backspace or Delete first selects a tag, a second press removes it, and
 * the arrows move the selection. Returns null for keys this does not handle.
 */
export function armKey(
	key: string,
	armed: number | null,
	count: number,
): { armed: number | null; remove?: number } | null {
	if (count === 0) return null;
	if (key === "Backspace" || key === "Delete") {
		return armed === null ? { armed: count - 1 } : { armed: null, remove: armed };
	}
	if (key === "ArrowLeft") return { armed: Math.max(0, (armed ?? count) - 1) };
	if (key === "ArrowRight" && armed !== null)
		return { armed: armed + 1 < count ? armed + 1 : null };
	if (key === "Escape" && armed !== null) return { armed: null };
	return null;
}
