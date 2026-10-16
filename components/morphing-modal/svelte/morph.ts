export type MorphSpring = "snappy" | "gentle" | "bouncy";

/** Mirrors @baby-ui/tokens spring durations; inlined so a copied file stands alone. */
export const MORPH_MS: Record<MorphSpring, number> = {
	snappy: 300,
	gentle: 500,
	bouncy: 600,
};

export const MORPH_EASE: Record<MorphSpring, string> = {
	snappy: "cubic-bezier(0.23, 1, 0.32, 1)",
	gentle: "cubic-bezier(0.23, 1, 0.32, 1)",
	bouncy: "cubic-bezier(0.34, 1.56, 0.64, 1)",
};

/**
 * Transform that places `to` exactly over `from`. Applied to the dialog and then
 * cleared, so the browser interpolates from the trigger's box to the dialog's own.
 */
export function invert(from: DOMRect, to: DOMRect): string {
	const scaleX = from.width / to.width;
	const scaleY = from.height / to.height;
	const dx = from.left + from.width / 2 - (to.left + to.width / 2);
	const dy = from.top + from.height / 2 - (to.top + to.height / 2);
	return `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
}
