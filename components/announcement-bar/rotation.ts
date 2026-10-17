export type AnnouncementAction = { label: string; href?: string; onClick?: () => void };

const KEY = (id: string) => `baby-ui-announcement:${id}`;

export function readDismissed(id: string | undefined) {
	if (!id) return false;
	try {
		return window.localStorage.getItem(KEY(id)) === "dismissed";
	} catch {
		return false;
	}
}

export function rememberDismissed(id: string | undefined) {
	if (!id) return;
	try {
		window.localStorage.setItem(KEY(id), "dismissed");
	} catch {}
}

/** Forgets a remembered dismissal so the bar with this id shows again. */
export function clearAnnouncementDismissal(id: string) {
	try {
		window.localStorage.removeItem(KEY(id));
	} catch {}
}

/** Where a face sits: the current one shows, the previous one leaves, the rest wait off-stage. */
export const faceState = (index: number, current: number, previous: number | null) =>
	index === current ? "shown" : index === previous ? "gone" : "wait";

/**
 * The pause ring is the clock: progress runs to one over `interval` and then advances. Pausing
 * stops it where it is and resuming finishes the rest; `reset` starts a new message from zero.
 */
export function createRotation(
	ring: SVGCircleElement | null,
	interval: number,
	onAdvance: () => void,
) {
	let progress = 0;
	let frame = 0;
	let last = 0;
	const paint = () => ring?.style.setProperty("stroke-dashoffset", String(1 - progress));
	const step = (time: number) => {
		progress = Math.min(1, progress + (time - last) / interval);
		last = time;
		paint();
		if (progress >= 1) {
			frame = 0;
			onAdvance();
			return;
		}
		frame = requestAnimationFrame(step);
	};
	return {
		setRunning(running: boolean) {
			if (running && !frame) {
				last = performance.now();
				frame = requestAnimationFrame(step);
			} else if (!running && frame) {
				cancelAnimationFrame(frame);
				frame = 0;
			}
		},
		reset() {
			progress = 0;
			last = performance.now();
			paint();
		},
		destroy() {
			cancelAnimationFrame(frame);
		},
	};
}
