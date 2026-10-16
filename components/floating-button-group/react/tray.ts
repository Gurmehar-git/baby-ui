import { offsetBox, pillStyle } from "../../lib/react/pill";

const ITEM = "[data-fbg-item]";
const usable = (el: HTMLElement | null) =>
	!!el && el.getAttribute("aria-disabled") !== "true";

/**
 * Moves one shared highlight to whichever button the pointer or keyboard focus is on. It glides
 * between buttons, appears in place, fades when the pointer leaves, and dips while pressed.
 */
export function createTray(root: HTMLElement, highlight: HTMLElement) {
	let hover: HTMLElement | null = null;
	let focus: HTMLElement | null = null;
	let active: HTMLElement | null = null;
	let shown = false;

	const place = (target: HTMLElement | null, travel: boolean) => {
		if (active && active !== target) active.removeAttribute("data-active");
		active = target;
		if (!target) {
			shown = false;
			highlight.style.opacity = "0";
			highlight.removeAttribute("data-pressing");
			return;
		}
		target.setAttribute("data-active", "");
		const appear = !shown || !travel;
		// Appearing lands in place; only a visible highlight travels.
		if (appear) highlight.style.transitionProperty = "opacity, background-color";
		Object.assign(highlight.style, pillStyle(offsetBox(target)), { opacity: "1" });
		if (!shown) highlight.setAttribute("data-appear", "");
		if (appear) {
			highlight.getBoundingClientRect();
			highlight.style.transitionProperty = "";
			highlight.removeAttribute("data-appear");
		}
		shown = true;
	};
	const sync = () => place(usable(hover) ? hover : focus, true);
	const itemOf = (target: EventTarget | null) =>
		target instanceof Element ? target.closest<HTMLElement>(ITEM) : null;
	const press = (on: boolean) =>
		highlight.toggleAttribute("data-pressing", on && !!active);

	const onMove = (event: PointerEvent) => {
		if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
		const item = itemOf(event.target);
		if (item && item !== hover) {
			hover = item;
			sync();
		}
	};
	// A native listener: framework events bubble through portals, so moving onto a tooltip would not count as leaving.
	const onLeave = () => {
		hover = null;
		press(false);
		sync();
	};
	const onDown = (event: PointerEvent) => {
		const item = itemOf(event.target);
		if (!item || event.button !== 0 || !usable(item)) return;
		hover = item;
		sync();
		press(true);
	};
	const onUp = () => press(false);
	const onKeyDown = (event: KeyboardEvent) => {
		if (
			(event.key === "Enter" || event.key === " ") &&
			!event.repeat &&
			usable(itemOf(event.target))
		)
			press(true);
		// The keyboard takes the highlight back until the pointer moves again.
		if (event.key.startsWith("Arrow") || event.key === "Home" || event.key === "End")
			hover = null;
	};
	const onKeyUp = (event: KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") press(false);
	};
	const onFocusIn = (event: FocusEvent) => {
		const item = itemOf(event.target);
		focus = item?.matches(":focus-visible") ? item : null;
		sync();
	};
	const onFocusOut = (event: FocusEvent) => {
		if (event.relatedTarget instanceof Node && root.contains(event.relatedTarget)) return;
		focus = null;
		press(false);
		sync();
	};
	// A font that loads or a reflow moves the buttons; the highlight follows without travelling.
	const resize = new ResizeObserver(() => {
		if (active) place(active, false);
	});
	resize.observe(root);

	root.addEventListener("pointermove", onMove);
	root.addEventListener("pointerleave", onLeave);
	root.addEventListener("pointerdown", onDown);
	root.addEventListener("pointerup", onUp);
	root.addEventListener("pointercancel", onUp);
	root.addEventListener("keydown", onKeyDown);
	root.addEventListener("keyup", onKeyUp);
	root.addEventListener("focusin", onFocusIn);
	root.addEventListener("focusout", onFocusOut);

	return () => {
		resize.disconnect();
		root.removeEventListener("pointermove", onMove);
		root.removeEventListener("pointerleave", onLeave);
		root.removeEventListener("pointerdown", onDown);
		root.removeEventListener("pointerup", onUp);
		root.removeEventListener("pointercancel", onUp);
		root.removeEventListener("keydown", onKeyDown);
		root.removeEventListener("keyup", onKeyUp);
		root.removeEventListener("focusin", onFocusIn);
		root.removeEventListener("focusout", onFocusOut);
	};
}
