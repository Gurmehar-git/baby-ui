import type { DitheredLogoVariant } from "./variants";

export type DitherOptions = {
	/** Image URL or data URI; remote images need CORS headers. */
	src: string;
	variant: DitheredLogoVariant;
	/** Dots across the longer side of the logo. */
	gridSize: number;
	/** Share of the shorter box side the logo fills, 0 to 1. */
	scale: number;
	/** Dot size relative to its grid cell. */
	dotScale: number;
	/** Ink level, 0 to 1, a cell needs to become a dot. */
	threshold: number;
	/** Edge softening before dithering, in grid cells. */
	blur: number;
	/** Corner radius of the inverted plate, as a share of its shorter side. */
	cornerRadius: number;
	/** Pointer influence radius, in px. */
	radius: number;
};

type Ripple = { x: number; y: number; start: number };

const PUSH = 36;
const LERP = 0.12;
const SETTLE = 0.02;
const RIPPLE_SPEED = 0.25;
const RIPPLE_WIDTH = 36;
const RIPPLE_FORCE = 18;
const RIPPLE_LIFE = 700;

function loadImage(src: string): Promise<HTMLImageElement | null> {
	return new Promise((resolve) => {
		const image = new Image();
		if (/^https?:\/\//.test(src)) image.crossOrigin = "anonymous";
		image.onload = () => resolve(image);
		image.onerror = () => resolve(null);
		image.src = src;
	});
}

function insidePlate(x: number, y: number, w: number, h: number, r: number) {
	const cx = Math.min(Math.max(x, r), w - 1 - r);
	const cy = Math.min(Math.max(y, r), h - 1 - r);
	return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}

/** Serpentine Floyd-Steinberg over `ink`, returning the grid cells that became dots. */
function dither(ink: Float32Array, w: number, h: number, threshold: number) {
	const dots: number[] = [];
	for (let y = 0; y < h; y++) {
		const ltr = y % 2 === 0;
		for (let i = 0; i < w; i++) {
			const x = ltr ? i : w - 1 - i;
			const at = y * w + x;
			const value = ink[at] ?? 0;
			const on = value >= threshold ? 1 : 0;
			if (on) dots.push(x, y);
			const err = value - on;
			const dir = ltr ? 1 : -1;
			const spread = (nx: number, ny: number, weight: number) => {
				if (nx < 0 || nx >= w || ny >= h) return;
				const n = ny * w + nx;
				ink[n] = (ink[n] ?? 0) + err * weight;
			};
			spread(x + dir, y, 7 / 16);
			spread(x - dir, y + 1, 3 / 16);
			spread(x, y + 1, 5 / 16);
			spread(x + dir, y + 1, 1 / 16);
		}
	}
	return dots;
}

/**
 * Dithers `src` into a dot grid drawn in the container's text colour. Dots shy away from the
 * pointer and ripple on click; the loop stops once they settle, offscreen or in a hidden tab.
 */
export function mountDither(
	container: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: DitherOptions,
): { update: (next: DitherOptions) => void; destroy: () => void } {
	const ctx = canvas.getContext("2d");
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	let options = initial;
	let image: HTMLImageElement | null = null;
	let loaded = "";
	let grid: number[] = [];
	let gridW = 0;
	let gridH = 0;
	let baseX = new Float32Array(0);
	let baseY = new Float32Array(0);
	let offX = new Float32Array(0);
	let offY = new Float32Array(0);
	let cell = 1;
	let width = 0;
	let height = 0;
	let color = "#000";
	let pointer: { x: number; y: number } | null = null;
	let ripples: Ripple[] = [];
	let visible = true;
	let destroyed = false;
	let frame = 0;

	const rasterise = () => {
		grid = [];
		if (!image) return;
		const natW = image.naturalWidth || 512;
		const natH = image.naturalHeight || 512;
		const long = Math.max(8, Math.round(options.gridSize));
		const outW = natW >= natH ? long : Math.max(1, Math.round((long * natW) / natH));
		const outH = natW >= natH ? Math.max(1, Math.round((long * natH) / natW)) : long;
		const blur = Math.max(0, options.blur);
		const pad = Math.ceil(blur * 2);
		gridW = outW + pad * 2;
		gridH = outH + pad * 2;
		const work = document.createElement("canvas");
		work.width = gridW;
		work.height = gridH;
		const wctx = work.getContext("2d", { willReadFrequently: true });
		if (!wctx) return;
		if (blur > 0) wctx.filter = `blur(${blur}px)`;
		wctx.drawImage(image, pad, pad, outW, outH);
		let data: Uint8ClampedArray;
		try {
			data = wctx.getImageData(0, 0, gridW, gridH).data;
		} catch {
			// A cross-origin image without CORS headers taints the canvas; draw nothing.
			return;
		}
		const ink = new Float32Array(gridW * gridH);
		const r = options.cornerRadius * Math.min(gridW, gridH);
		for (let i = 0; i < ink.length; i++) {
			const alpha = (data[i * 4 + 3] ?? 0) / 255;
			const luma =
				(0.299 * (data[i * 4] ?? 0) +
					0.587 * (data[i * 4 + 1] ?? 0) +
					0.114 * (data[i * 4 + 2] ?? 0)) /
				255;
			// Light pixels still count a little so white logos keep a sparse texture.
			const value = alpha * (0.35 + 0.65 * (1 - luma));
			if (options.variant === "solid") ink[i] = value;
			else
				ink[i] = insidePlate(i % gridW, Math.floor(i / gridW), gridW, gridH, r)
					? 1 - value
					: 0;
		}
		grid = dither(ink, gridW, gridH, Math.min(0.99, Math.max(0.01, options.threshold)));
		const count = grid.length / 2;
		offX = new Float32Array(count);
		offY = new Float32Array(count);
	};

	const layout = () => {
		if (!ctx) return;
		const dpr = window.devicePixelRatio || 1;
		width = container.clientWidth;
		height = container.clientHeight;
		canvas.width = Math.max(1, Math.round(width * dpr));
		canvas.height = Math.max(1, Math.round(height * dpr));
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		color = getComputedStyle(container).color;
		const count = grid.length / 2;
		cell = gridW ? (Math.min(width, height) * options.scale) / Math.max(gridW, gridH) : 1;
		const ox = (width - gridW * cell) / 2;
		const oy = (height - gridH * cell) / 2;
		baseX = new Float32Array(count);
		baseY = new Float32Array(count);
		for (let i = 0; i < count; i++) {
			baseX[i] = ox + (grid[i * 2] ?? 0) * cell;
			baseY[i] = oy + (grid[i * 2 + 1] ?? 0) * cell;
		}
	};

	const draw = () => {
		if (!ctx) return;
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = color;
		const size = Math.max(0.5, cell * options.dotScale);
		const inset = (cell - size) / 2;
		for (let i = 0; i < baseX.length; i++) {
			ctx.fillRect(
				(baseX[i] ?? 0) + (offX[i] ?? 0) + inset,
				(baseY[i] ?? 0) + (offY[i] ?? 0) + inset,
				size,
				size,
			);
		}
	};

	const step = (now: number) => {
		ripples = ripples.filter((r) => now - r.start < RIPPLE_LIFE);
		const reach = options.radius;
		let moving = ripples.length > 0;
		for (let i = 0; i < baseX.length; i++) {
			const bx = baseX[i] ?? 0;
			const by = baseY[i] ?? 0;
			let fx = 0;
			let fy = 0;
			if (pointer) {
				const dx = bx - pointer.x;
				const dy = by - pointer.y;
				const d = Math.hypot(dx, dy);
				if (d > 0.1 && d < reach) {
					const f = (1 - d / reach) ** 3 * PUSH;
					fx += (dx / d) * f;
					fy += (dy / d) * f;
				}
			}
			for (const r of ripples) {
				const age = now - r.start;
				const dx = bx - r.x;
				const dy = by - r.y;
				const d = Math.hypot(dx, dy);
				const band = Math.abs(d - age * RIPPLE_SPEED);
				if (d < 0.1 || band >= RIPPLE_WIDTH) continue;
				const f = (1 - band / RIPPLE_WIDTH) * (1 - age / RIPPLE_LIFE) * RIPPLE_FORCE;
				fx += (dx / d) * f;
				fy += (dy / d) * f;
			}
			const x = offX[i] ?? 0;
			const y = offY[i] ?? 0;
			const nx = x + (fx - x) * LERP;
			const ny = y + (fy - y) * LERP;
			offX[i] = Math.abs(nx) < SETTLE && fx === 0 ? 0 : nx;
			offY[i] = Math.abs(ny) < SETTLE && fy === 0 ? 0 : ny;
			if (Math.abs(nx - x) > SETTLE || Math.abs(ny - y) > SETTLE) moving = true;
		}
		return moving;
	};

	const running = () => visible && !document.hidden && !reduced.matches;

	const tick = (now: number) => {
		frame = 0;
		const moving = step(now);
		draw();
		if (moving && running()) frame = requestAnimationFrame(tick);
	};

	const wake = () => {
		if (!running()) return draw();
		if (!frame) frame = requestAnimationFrame(tick);
	};

	const rebuild = () => {
		if (destroyed) return;
		rasterise();
		layout();
		wake();
	};

	const load = () => {
		const src = options.src;
		if (src === loaded) return rebuild();
		loaded = src;
		image = null;
		rebuild();
		void loadImage(src).then((next) => {
			if (destroyed || src !== options.src) return;
			image = next;
			rebuild();
		});
	};

	const local = (event: PointerEvent) => {
		const box = canvas.getBoundingClientRect();
		return { x: event.clientX - box.left, y: event.clientY - box.top };
	};
	const onMove = (event: PointerEvent) => {
		if (reduced.matches) return;
		pointer = local(event);
		wake();
	};
	const onLeave = () => {
		pointer = null;
		wake();
	};
	const onUp = (event: PointerEvent) => {
		if (reduced.matches) return;
		ripples.push({ ...local(event), start: performance.now() });
		if (event.pointerType !== "mouse") pointer = null;
		wake();
	};
	const onReducedChange = () => {
		pointer = null;
		ripples = [];
		offX.fill(0);
		offY.fill(0);
		wake();
	};
	const onResize = () => {
		if (destroyed) return;
		layout();
		wake();
	};

	container.addEventListener("pointermove", onMove);
	container.addEventListener("pointerleave", onLeave);
	container.addEventListener("pointercancel", onLeave);
	container.addEventListener("pointerup", onUp);
	const resize = new ResizeObserver(onResize);
	resize.observe(container);
	// Theme switches change the text colour token; redraw in the new one.
	const theme = new MutationObserver(onResize);
	theme.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class", "style", "data-theme"],
	});
	const intersection = new IntersectionObserver(([entry]) => {
		visible = entry?.isIntersecting ?? false;
		wake();
	});
	intersection.observe(container);
	document.addEventListener("visibilitychange", wake);
	reduced.addEventListener("change", onReducedChange);
	load();

	return {
		update(next) {
			options = next;
			load();
		},
		destroy() {
			destroyed = true;
			cancelAnimationFrame(frame);
			container.removeEventListener("pointermove", onMove);
			container.removeEventListener("pointerleave", onLeave);
			container.removeEventListener("pointercancel", onLeave);
			container.removeEventListener("pointerup", onUp);
			resize.disconnect();
			theme.disconnect();
			intersection.disconnect();
			document.removeEventListener("visibilitychange", wake);
			reduced.removeEventListener("change", onReducedChange);
		},
	};
}
