import { offsetBox, type PillBox, pillStyle } from "../lib/pill";

/** Hover delay before a section opens from rest, so a pointer crossing the bar opens nothing. */
export const EXPAND_OPEN_MS = 70;
/** Grace before the panel closes, so a pointer cutting a corner off the bar keeps it open. */
export const EXPAND_CLOSE_MS = 140;

/** Where a section's pane sits: open, waiting on either side of the open one, or all closed. */
export type ExpandSide = "on" | "start" | "end" | "off";

/**
 * A pane's side relative to the open section. Panes before it wait to the start and panes after
 * it to the end, so moving along the bar slides the next one in from the way the pointer went.
 */
export function expandSide(index: number, open: number): ExpandSide {
	if (open < 0) return "off";
	if (index === open) return "on";
	return index < open ? "start" : "end";
}

/** The hovered control's layout box in `container`, else the current one's; null when neither.
 * Layout boxes ignore transforms, so items still rising in or sliding over measure true. */
export function slideBox(
	container: HTMLElement,
	target?: EventTarget | null,
): PillBox | null {
	const hovered =
		target instanceof Element ? target.closest<HTMLElement>("a, button") : null;
	const el =
		hovered && container.contains(hovered)
			? hovered
			: container.querySelector<HTMLElement>('[data-current="true"]');
	return el ? offsetBox(el) : null;
}

/** Moves a sliding mark to `box`. Shown from hidden, it appears in place instead of sliding in. */
export function placeMark(mark: HTMLElement, box: PillBox | null) {
	const wasOn = mark.dataset.on === "true";
	if (box && !wasOn) mark.style.transition = "none";
	Object.assign(mark.style, pillStyle(box), box ? { opacity: "" } : {});
	if (box && !wasOn) {
		void mark.offsetWidth;
		mark.style.transition = "";
	}
	mark.dataset.on = String(Boolean(box));
}
