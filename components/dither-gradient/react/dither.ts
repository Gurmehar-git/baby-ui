import type { DitherGradientMatrix, DitherGradientTone } from "./variants";

export type DitherOptions = {
	tone: DitherGradientTone;
	matrix: DitherGradientMatrix;
	/** Gradient direction in degrees. */
	angle: number;
	/** Drift speed multiplier; 0 holds a still frame. */
	speed: number;
	/** Size of one dither cell, in CSS px. */
	pixelSize: number;
};

type Rgb = [number, number, number];

/** The ramp always starts at the surface colour so the gradient fades into the page. */
const RAMPS: Record<DitherGradientTone, string[]> = {
	spectrum: ["--background", "--chart-1", "--chart-5", "--chart-4"],
	cool: ["--background", "--chart-scale-4", "--chart-1", "--chart-3"],
	warm: ["--background", "--chart-2", "--chart-5", "--chart-4"],
	mono: ["--background", "--muted-foreground", "--foreground"],
};

const MATRIX_SIZE: Record<DitherGradientMatrix, number> = {
	bayer2: 2,
	bayer4: 4,
	bayer8: 8,
};

/** Recursive Bayer index matrix, normalised to thresholds in (0, 1). */
function bayer(size: number): Float32Array {
	let m = [0];
	let n = 1;
	while (n < size) {
		const next: number[] = new Array(n * n * 4);
		for (let y = 0; y < n; y++) {
			for (let x = 0; x < n; x++) {
				const v = (m[y * n + x] ?? 0) * 4;
				next[y * 2 * n + x] = v;
				next[y * 2 * n + x + n] = v + 2;
				next[(y + n) * 2 * n + x] = v + 3;
				next[(y + n) * 2 * n + x + n] = v + 1;
			}
		}
		m = next;
		n *= 2;
	}
	return Float32Array.from(m, (v) => (v + 0.5) / (n * n));
}

function readColors(
	el: HTMLElement,
	names: string[],
	probe: CanvasRenderingContext2D,
): Rgb[] {
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

/**
 * Draws an ordered-dither gradient at cell resolution and scales it up unsmoothed. The loop
 * runs only while visible, the tab is shown, motion is allowed and `speed` is above zero.
 */
export function mountDither(
	container: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: DitherOptions,
): { update: (next: DitherOptions) => void; destroy: () => void } {
	const ctx = canvas.getContext("2d");
	const grid = document.createElement("canvas");
	const gridCtx = grid.getContext("2d");
	const probe = document
		.createElement("canvas")
		.getContext("2d", { willReadFrequently: true });
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	let options = initial;
	let colors: Rgb[] = [];
	let thresholds = bayer(MATRIX_SIZE[options.matrix]);
	let image: ImageData | null = null;
	let visible = true;
	let frame = 0;
	let last = 0;
	let time = 0;

	const running = () =>
		visible && !document.hidden && !reduced.matches && options.speed > 0;

	const layout = () => {
		if (!ctx || !gridCtx || !probe) return;
		const dpr = window.devicePixelRatio || 1;
		const width = container.clientWidth;
		const height = container.clientHeight;
		canvas.width = Math.max(1, Math.round(width * dpr));
		canvas.height = Math.max(1, Math.round(height * dpr));
		const cell = Math.max(1, options.pixelSize);
		grid.width = Math.max(1, Math.ceil(width / cell));
		grid.height = Math.max(1, Math.ceil(height / cell));
		image = gridCtx.createImageData(grid.width, grid.height);
		colors = readColors(container, RAMPS[options.tone], probe);
		thresholds = bayer(MATRIX_SIZE[options.matrix]);
	};

	const render = () => {
		if (!ctx || !gridCtx || !image) return;
		const { width: cols, height: rows, data } = image;
		const size = MATRIX_SIZE[options.matrix];
		const rad = (options.angle * Math.PI) / 180;
		const cos = Math.cos(rad);
		const sin = Math.sin(rad);
		const span = Math.abs(cos) + Math.abs(sin);
		const aspect = cols / Math.max(1, rows);
		const shift = Math.sin(time * 0.6) * 0.12;
		const steps = colors.length - 1;
		for (let y = 0; y < rows; y++) {
			const ny = y / rows - 0.5;
			for (let x = 0; x < cols; x++) {
				const nx = x / cols - 0.5;
				const wave = Math.sin(ny * 6 + nx * 3 * aspect + time * 0.9) * 0.05;
				const t = Math.min(
					1,
					Math.max(0, (nx * cos + ny * sin) / span + 0.5 + shift + wave),
				);
				const scaled = t * steps;
				const low = Math.floor(scaled);
				const threshold = thresholds[(y % size) * size + (x % size)] ?? 0.5;
				const color = colors[Math.min(steps, scaled - low > threshold ? low + 1 : low)];
				const i = (y * cols + x) * 4;
				data[i] = color?.[0] ?? 0;
				data[i + 1] = color?.[1] ?? 0;
				data[i + 2] = color?.[2] ?? 0;
				data[i + 3] = 255;
			}
		}
		gridCtx.putImageData(image, 0, 0);
		ctx.imageSmoothingEnabled = false;
		const cell =
			Math.max(1, options.pixelSize) * (canvas.width / container.clientWidth || 1);
		ctx.drawImage(grid, 0, 0, cols * cell, rows * cell);
	};

	const tick = (now: number) => {
		frame = 0;
		if (last && running()) time += (Math.min(now - last, 50) / 1000) * options.speed;
		last = now;
		render();
		if (running()) frame = requestAnimationFrame(tick);
		else last = 0;
	};

	const wake = () => {
		if (!frame) frame = requestAnimationFrame(tick);
	};

	const reset = () => {
		layout();
		wake();
	};

	const resize = new ResizeObserver(reset);
	resize.observe(container);
	// Theme switches change the ramp tokens; resample them.
	const theme = new MutationObserver(reset);
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
	reduced.addEventListener("change", wake);

	return {
		update(next) {
			options = next;
			reset();
		},
		destroy() {
			cancelAnimationFrame(frame);
			resize.disconnect();
			theme.disconnect();
			intersection.disconnect();
			document.removeEventListener("visibilitychange", wake);
			reduced.removeEventListener("change", wake);
		},
	};
}
