/** What an animated canvas reacts to; `watchSurface` wires and unwires every source. */
export type SurfaceEvents = {
	/** The element changed size; also fires once when watching starts. */
	resize(): void;
	/** Theme class/style on `<html>` changed: re-read token colours. */
	theme(): void;
	/** On-screen, tab visibility or reduced-motion changed: start or stop the loop. */
	wake(): void;
	pointer?: {
		/** Pointer position relative to the element's top-left, with its current box. */
		move(x: number, y: number, box: DOMRect): void;
		leave?(): void;
		/** `window` keeps tracking under page content, e.g. for a `fixed` background. */
		scope?: "element" | "window";
	};
};

export type Surface = {
	/** On-screen, tab visible and motion allowed: the loop may run. */
	live(): boolean;
	reducedMotion(): boolean;
	destroy(): void;
};

/** Observes size, theme, visibility and pointer for one canvas host until `destroy()`. */
export function watchSurface(el: HTMLElement, events: SurfaceEvents): Surface {
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	let visible = true;

	const onMove = (event: PointerEvent) => {
		const box = el.getBoundingClientRect();
		events.pointer?.move(event.clientX - box.left, event.clientY - box.top, box);
	};
	const onLeave = () => events.pointer?.leave?.();
	const pointerTarget = events.pointer?.scope === "window" ? window : el;
	if (events.pointer) {
		pointerTarget.addEventListener("pointermove", onMove as EventListener, {
			passive: true,
		});
		if (pointerTarget === el) {
			el.addEventListener("pointerleave", onLeave);
			el.addEventListener("pointercancel", onLeave);
		}
	}

	const sizes = new ResizeObserver(() => events.resize());
	sizes.observe(el);
	const theme = new MutationObserver(() => events.theme());
	theme.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class", "style", "data-theme"],
	});
	const seen = new IntersectionObserver(([entry]) => {
		visible = entry?.isIntersecting ?? true;
		events.wake();
	});
	seen.observe(el);
	const wake = () => events.wake();
	document.addEventListener("visibilitychange", wake);
	reduced.addEventListener("change", wake);

	return {
		live: () => visible && !document.hidden && !reduced.matches,
		reducedMotion: () => reduced.matches,
		destroy() {
			pointerTarget.removeEventListener("pointermove", onMove as EventListener);
			el.removeEventListener("pointerleave", onLeave);
			el.removeEventListener("pointercancel", onLeave);
			sizes.disconnect();
			theme.disconnect();
			seen.disconnect();
			document.removeEventListener("visibilitychange", wake);
			reduced.removeEventListener("change", wake);
		},
	};
}

/** Resolves CSS colour tokens on `el` to sRGB bytes; unset tokens fall back to `color`. */
export function readColors(
	el: HTMLElement,
	names: string[],
	probe: CanvasRenderingContext2D,
): [number, number, number][] {
	const style = getComputedStyle(el);
	return names.map((name) => {
		probe.clearRect(0, 0, 1, 1);
		probe.fillStyle = style.color;
		probe.fillStyle = style.getPropertyValue(name).trim() || style.color;
		probe.fillRect(0, 0, 1, 1);
		const [r = 0, g = 0, b = 0] = probe.getImageData(0, 0, 1, 1).data;
		return [r, g, b];
	});
}
