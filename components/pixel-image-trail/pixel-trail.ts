import { tv, type VariantProps } from "tailwind-variants";

export const pixelImageTrail = tv({
	slots: {
		root: "relative isolate w-full touch-pan-y overflow-hidden rounded-xl bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		image: "pointer-events-none absolute inset-0 size-full object-cover opacity-0",
		canvas: "pointer-events-none absolute inset-0 block size-full",
		content: "relative z-10 flex size-full items-center justify-center",
	},
	variants: {
		variant: {
			fade: {},
			shrink: {},
		},
		size: {
			sm: { root: "h-48" },
			default: { root: "h-72" },
			lg: { root: "h-96" },
		},
	},
	defaultVariants: { variant: "fade", size: "default" },
});

export type PixelImageTrailVariant = NonNullable<
	VariantProps<typeof pixelImageTrail>["variant"]
>;
export type PixelImageTrailSize = NonNullable<
	VariantProps<typeof pixelImageTrail>["size"]
>;

export type PixelTrailOptions = {
	/** Edge of one square, in px (at least 12). */
	pixelSize: number;
	/** Reveal reach in px: squares whose centre lies this close to the pointer show; 0 is one square. */
	radius: number;
	/** Time in ms before a trail square has fully faded. */
	fadeDuration: number;
	/** Most trail squares kept at once; the oldest drop first. */
	maxPixels: number;
	/** Dimmed fragments shown before any interaction. */
	initialPixels: number;
	variant: PixelImageTrailVariant;
};

type Pixel = { column: number; row: number; touchedAt: number; ambient: boolean };

const AMBIENT_ALPHA = 0.58;

/**
 * Reveals `image` square by square along the pointer path; the frame loop runs only while
 * trail squares are still fading.
 */
export function mountPixelTrail(
	container: HTMLElement,
	canvas: HTMLCanvasElement,
	image: HTMLImageElement,
	initial: PixelTrailOptions,
): { update: (next: PixelTrailOptions) => void; destroy: () => void } {
	const ctx = canvas.getContext("2d");
	let options = initial;
	const pixels = new Map<string, Pixel>();
	const hovered = new Set<string>();
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	let width = 0;
	let height = 0;
	let frame = 0;
	let inside = false;
	let lastColumn: number | null = null;
	let lastRow: number | null = null;

	const cell = () => Math.max(12, options.pixelSize);
	const inBounds = (column: number, row: number) =>
		column >= 0 && row >= 0 && column * cell() < width && row * cell() < height;

	const seed = () => {
		const size = cell();
		const columns = Math.max(1, Math.ceil(width / size));
		const rows = Math.max(1, Math.ceil(height / size));
		const count = Math.min(options.initialPixels, columns * rows);
		const now = performance.now();
		for (let i = 0; i < count; i += 1) {
			const column = Math.floor(Math.random() * columns);
			const row = Math.floor(Math.random() * rows);
			pixels.set(`${column}:${row}`, { column, row, touchedAt: now, ambient: true });
		}
	};

	const drawPixel = (pixel: Pixel, alpha: number) => {
		if (!ctx || !image.complete || !image.naturalWidth || !image.naturalHeight) return;
		const size = cell();
		const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
		const offsetX = (width - image.naturalWidth * scale) / 2;
		const offsetY = (height - image.naturalHeight * scale) / 2;
		const x = pixel.column * size;
		const y = pixel.row * size;
		// Shrink keeps the square's centre and scales its edge with the remaining alpha.
		const edge = options.variant === "shrink" && !pixel.ambient ? size * alpha : size;
		const inset = (size - edge) / 2;
		ctx.globalAlpha = options.variant === "shrink" && !pixel.ambient ? 1 : alpha;
		ctx.drawImage(
			image,
			(x + inset - offsetX) / scale,
			(y + inset - offsetY) / scale,
			edge / scale,
			edge / scale,
			x + inset,
			y + inset,
			edge,
			edge,
		);
	};

	const draw = (now: number) => {
		frame = 0;
		if (!ctx) return;
		ctx.clearRect(0, 0, width, height);
		let fading = false;
		for (const [key, pixel] of pixels) {
			const under = inside && hovered.has(key);
			if (under) pixel.touchedAt = now;
			let alpha: number;
			if (pixel.ambient) alpha = under ? 1 : AMBIENT_ALPHA;
			else if (reduced.matches) alpha = under ? 1 : 0;
			else
				alpha = Math.max(
					0,
					1 - (now - pixel.touchedAt) / Math.max(120, options.fadeDuration),
				);
			if (alpha <= 0) {
				pixels.delete(key);
				continue;
			}
			if (!pixel.ambient && !under && !reduced.matches) fading = true;
			drawPixel(pixel, alpha * alpha * (3 - 2 * alpha));
		}
		ctx.globalAlpha = 1;
		if (fading && !document.hidden) frame = requestAnimationFrame(draw);
	};

	const requestDraw = () => {
		if (!frame) frame = requestAnimationFrame(draw);
	};

	const resize = () => {
		if (!ctx) return;
		cancelAnimationFrame(frame);
		frame = 0;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		width = container.clientWidth;
		height = container.clientHeight;
		canvas.width = Math.max(1, Math.round(width * dpr));
		canvas.height = Math.max(1, Math.round(height * dpr));
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		pixels.clear();
		seed();
		requestDraw();
	};

	const dropTrail = () => {
		for (const [key, pixel] of pixels) if (!pixel.ambient) pixels.delete(key);
	};

	const trim = () => {
		const trail = [...pixels.entries()].filter(([, p]) => !p.ambient);
		const excess = trail.length - Math.max(1, options.maxPixels);
		if (excess <= 0) return;
		trail.sort((a, b) => a[1].touchedAt - b[1].touchedAt);
		for (let i = 0; i < excess; i += 1) pixels.delete((trail[i] as [string, Pixel])[0]);
	};

	const mark = (column: number, row: number, touchedAt: number) => {
		const key = `${column}:${row}`;
		if (pixels.get(key)?.ambient) return;
		pixels.set(key, { column, row, touchedAt, ambient: false });
	};

	const paintAt = (clientX: number, clientY: number) => {
		const size = cell();
		const box = container.getBoundingClientRect();
		const x = clientX - box.left;
		const y = clientY - box.top;
		const column = Math.floor(x / size);
		const row = Math.floor(y / size);
		const now = performance.now();
		const still = reduced.matches;
		if (still) dropTrail();
		hovered.clear();

		const fromColumn = lastColumn ?? column;
		const fromRow = lastRow ?? row;
		const dc = column - fromColumn;
		const dr = row - fromRow;
		if (!still) {
			const steps = Math.max(1, Math.abs(dc), Math.abs(dr));
			for (let step = 0; step <= steps; step += 1) {
				const t = step / steps;
				mark(Math.round(fromColumn + dc * t), Math.round(fromRow + dr * t), now);
			}
		}

		const reach = Math.max(0, options.radius);
		const span = Math.ceil(reach / size) + 1;
		for (let i = -span; i <= span; i += 1) {
			for (let j = -span; j <= span; j += 1) {
				const c = column + i;
				const r = row + j;
				if (!inBounds(c, r)) continue;
				const far = Math.hypot((c + 0.5) * size - x, (r + 0.5) * size - y) > reach;
				if ((i !== 0 || j !== 0) && far) continue;
				hovered.add(`${c}:${r}`);
				mark(c, r, now);
			}
		}

		const moved = lastColumn !== column || lastRow !== row;
		if (moved && !still && reach > 0 && Math.random() < 0.34) {
			// Occasional satellite just past the reach, perpendicular to the motion.
			const distance = reach * (1 + Math.random() * 0.6) * (Math.random() < 0.5 ? -1 : 1);
			const horizontal = Math.abs(dc) >= Math.abs(dr);
			const c = Math.floor((x + (horizontal ? 0 : distance)) / size);
			const r = Math.floor((y + (horizontal ? distance : 0)) / size);
			if (inBounds(c, r)) mark(c, r, now - options.fadeDuration * 0.18);
		}

		lastColumn = column;
		lastRow = row;
		trim();
		requestDraw();
	};

	const onMove = (event: PointerEvent) => {
		inside = true;
		paintAt(event.clientX, event.clientY);
	};
	const onLeave = () => {
		inside = false;
		hovered.clear();
		lastColumn = null;
		lastRow = null;
		if (reduced.matches) dropTrail();
		requestDraw();
	};
	const onFocusIn = () => {
		const box = container.getBoundingClientRect();
		inside = true;
		paintAt(box.left + box.width / 2, box.top + box.height / 2);
	};
	const onFocusOut = (event: FocusEvent) => {
		if (!container.contains(event.relatedTarget as Node | null)) onLeave();
	};
	const onVisibility = () => {
		if (!document.hidden) requestDraw();
	};

	resize();
	const observer = new ResizeObserver(resize);
	observer.observe(container);
	image.addEventListener("load", requestDraw);
	container.addEventListener("pointerdown", onMove);
	container.addEventListener("pointermove", onMove);
	container.addEventListener("pointerleave", onLeave);
	container.addEventListener("pointercancel", onLeave);
	container.addEventListener("focusin", onFocusIn);
	container.addEventListener("focusout", onFocusOut);
	document.addEventListener("visibilitychange", onVisibility);

	return {
		update(next) {
			const reseed =
				next.pixelSize !== options.pixelSize ||
				next.initialPixels !== options.initialPixels;
			options = next;
			if (reseed) resize();
			else requestDraw();
		},
		destroy() {
			cancelAnimationFrame(frame);
			observer.disconnect();
			image.removeEventListener("load", requestDraw);
			container.removeEventListener("pointerdown", onMove);
			container.removeEventListener("pointermove", onMove);
			container.removeEventListener("pointerleave", onLeave);
			container.removeEventListener("pointercancel", onLeave);
			container.removeEventListener("focusin", onFocusIn);
			container.removeEventListener("focusout", onFocusOut);
			document.removeEventListener("visibilitychange", onVisibility);
		},
	};
}
