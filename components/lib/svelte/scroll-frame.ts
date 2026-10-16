const PROGRESS = "--scroll-p";

let registered = false;

// Registered so the view() keyframe interpolates it; unregistered custom properties flip discretely.
function registerProgress() {
	if (registered || typeof CSS === "undefined" || !("registerProperty" in CSS)) return;
	registered = true;
	try {
		CSS.registerProperty({
			name: PROGRESS,
			syntax: "<number>",
			inherits: true,
			initialValue: "0",
		});
	} catch {
		// Another copy of this module registered it first.
	}
}

/** Runs `frame` at most once per animation frame while `scroller` scrolls or resizes. */
export function onScrollFrame(
	scroller: HTMLElement,
	frame: () => void,
	observe: HTMLElement[] = [],
): () => void {
	let raf = 0;
	const run = () => {
		raf = 0;
		frame();
	};
	const schedule = () => {
		if (!raf) raf = requestAnimationFrame(run);
	};
	scroller.addEventListener("scroll", schedule, { passive: true });
	const resize = new ResizeObserver(schedule);
	resize.observe(scroller);
	for (const el of observe) resize.observe(el);
	frame();
	return () => {
		scroller.removeEventListener("scroll", schedule);
		resize.disconnect();
		cancelAnimationFrame(raf);
	};
}

/** 0 when `track`'s top meets the scroller's top, 1 when its bottom meets the scroller's bottom. */
export function trackProgress(scroller: HTMLElement, track: HTMLElement): number {
	const range = track.offsetHeight - scroller.clientHeight;
	if (range <= 0) return 0;
	const top = track.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
	return Math.min(1, Math.max(0, -top / range));
}

/** Scrolls so `track` sits at `progress` (0 to 1). */
export function scrollToProgress(
	scroller: HTMLElement,
	track: HTMLElement,
	progress: number,
	behavior: ScrollBehavior = "smooth",
) {
	const top = track.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
	const range = Math.max(0, track.offsetHeight - scroller.clientHeight);
	scroller.scrollTo({ top: scroller.scrollTop + top + progress * range, behavior });
}

/**
 * Feeds `--scroll-p` on `track` (pair it with the `scroll-frame-track` class): a CSS view()
 * timeline where supported, a rAF-throttled scroll listener otherwise.
 */
export function bindScrollProgress(
	scroller: HTMLElement,
	track: HTMLElement,
	onProgress?: (progress: number) => void,
): () => void {
	registerProgress();
	const native = CSS.supports("animation-timeline: view()");
	const stop = onScrollFrame(scroller, () => {
		const progress = trackProgress(scroller, track);
		if (!native) track.style.setProperty(PROGRESS, progress.toFixed(4));
		onProgress?.(progress);
	}, [track]);
	return () => {
		stop();
		track.style.removeProperty(PROGRESS);
	};
}
