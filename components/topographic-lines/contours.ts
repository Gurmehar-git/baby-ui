import type { TopographicLinesTone, TopographicLinesVariant } from "./variants";

export type ContourOptions = {
	variant: TopographicLinesVariant;
	tone: TopographicLinesTone;
	/** Contour lines across the full height range. */
	levels: number;
	/** Every Nth line is an index contour, drawn heavier; 0 turns them off. */
	indexEvery: number;
	/** Size of one hill, in CSS px. */
	scale: number;
	/** Drift rate; 0 holds the map still. */
	speed: number;
	/** Picks the terrain; the same seed always draws the same map. */
	seed: number;
	/** Regular line width in CSS px; index contours draw at 1.8x. */
	lineWidth: number;
};

const CELL = 10;
const FRAME_MS = 40;
const DRIFT = 0.00004;
const LINE_ALPHA = 0.22;
const INDEX_ALPHA = 0.5;
const FILL_ALPHA = 0.1;

const TOKENS: Record<TopographicLinesTone, { line: string; index: string }> = {
	mono: { line: "--muted-foreground", index: "--foreground" },
	primary: { line: "--primary", index: "--primary" },
};

function hash(x: number, y: number, seed: number): number {
	let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
	h = Math.imul(h ^ (h >>> 13), 1274126177);
	h ^= h >>> 16;
	return (h >>> 0) / 4294967296;
}

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

function valueNoise(x: number, y: number, seed: number): number {
	const x0 = Math.floor(x);
	const y0 = Math.floor(y);
	const fx = fade(x - x0);
	const fy = fade(y - y0);
	const a = hash(x0, y0, seed);
	const b = hash(x0 + 1, y0, seed);
	const c = hash(x0, y0 + 1, seed);
	const d = hash(x0 + 1, y0 + 1, seed);
	return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

/** Three octaves of value noise, normalised to 0..1. */
function fbm(x: number, y: number, seed: number): number {
	return (
		(valueNoise(x, y, seed) +
			0.5 * valueNoise(x * 2.03, y * 2.03, seed + 17) +
			0.25 * valueNoise(x * 4.1, y * 4.1, seed + 43)) /
		1.75
	);
}

// Edge pairs per marching-squares case; edges are 0 top, 1 right, 2 bottom, 3 left.
const SEGMENTS: number[][] = [
	[],
	[3, 2],
	[2, 1],
	[3, 1],
	[0, 1],
	[3, 0, 2, 1],
	[0, 2],
	[3, 0],
	[3, 0],
	[0, 2],
	[3, 2, 0, 1],
	[0, 1],
	[3, 1],
	[2, 1],
	[3, 2],
	[],
];

function readColor(
	el: HTMLElement,
	name: string,
	probe: CanvasRenderingContext2D,
): string {
	const style = getComputedStyle(el);
	probe.clearRect(0, 0, 1, 1);
	probe.fillStyle = style.color;
	probe.fillStyle = style.getPropertyValue(name).trim() || style.color;
	probe.fillRect(0, 0, 1, 1);
	const [r = 0, g = 0, b = 0] = probe.getImageData(0, 0, 1, 1).data;
	return `rgb(${r} ${g} ${b})`;
}

/** A drifting contour map: a noise height field traced with marching squares at even levels.
 * Redraws at most every 40ms; never offscreen, in a hidden tab or under reduced motion. */
export function mountContours(
	container: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: ContourOptions,
): { update: (next: ContourOptions) => void; destroy: () => void } {
	const ctx = canvas.getContext("2d");
	const fill = document.createElement("canvas");
	const fillCtx = fill.getContext("2d");
	const probe = document
		.createElement("canvas")
		.getContext("2d", { willReadFrequently: true });
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	let options = initial;
	let width = 0;
	let height = 0;
	let cols = 0;
	let rows = 0;
	let field = new Float32Array(0);
	let lineColor = "";
	let indexColor = "";
	let visible = true;
	let frame = 0;
	let last = 0;
	let elapsed = 0;

	const layout = () => {
		if (!ctx || !probe) return;
		const dpr = window.devicePixelRatio || 1;
		width = container.clientWidth;
		height = container.clientHeight;
		canvas.width = Math.max(1, Math.round(width * dpr));
		canvas.height = Math.max(1, Math.round(height * dpr));
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		cols = Math.ceil(width / CELL) + 1;
		rows = Math.ceil(height / CELL) + 1;
		field = new Float32Array(cols * rows);
		fill.width = cols;
		fill.height = rows;
		const tokens = TOKENS[options.tone];
		lineColor = readColor(container, tokens.line, probe);
		indexColor = readColor(container, tokens.index, probe);
	};

	const sample = () => {
		const unit = 1 / Math.max(40, options.scale);
		const t = elapsed * DRIFT * options.speed * 60;
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				const nx = x * CELL * unit;
				const ny = y * CELL * unit;
				// Two layers drifting apart morph the hills instead of sliding the whole map.
				const a = fbm(nx + t, ny + t * 0.6, options.seed);
				const b = fbm(nx * 1.3 - t * 0.7, ny * 1.3 + t * 0.4, options.seed + 101);
				field[y * cols + x] = a * 0.65 + b * 0.35;
			}
		}
	};

	const drawFill = () => {
		if (!ctx || !fillCtx) return;
		const image = fillCtx.createImageData(cols, rows);
		const [r, g, b] = indexColor.match(/\d+/g)?.map(Number) ?? [0, 0, 0];
		const levels = Math.max(2, options.levels);
		for (let i = 0; i < field.length; i++) {
			const band = Math.floor((field[i] ?? 0) * levels);
			const o = i * 4;
			image.data[o] = r ?? 0;
			image.data[o + 1] = g ?? 0;
			image.data[o + 2] = b ?? 0;
			image.data[o + 3] = Math.round(255 * FILL_ALPHA * (band / levels));
		}
		fillCtx.putImageData(image, 0, 0);
		ctx.imageSmoothingEnabled = true;
		ctx.drawImage(fill, 0, 0, cols, rows, 0, 0, (cols - 1) * CELL, (rows - 1) * CELL);
	};

	const trace = (threshold: number, path: Path2D) => {
		for (let y = 0; y < rows - 1; y++) {
			for (let x = 0; x < cols - 1; x++) {
				const a = field[y * cols + x] ?? 0;
				const b = field[y * cols + x + 1] ?? 0;
				const c = field[(y + 1) * cols + x + 1] ?? 0;
				const d = field[(y + 1) * cols + x] ?? 0;
				const kind =
					(+(a > threshold) << 3) |
					(+(b > threshold) << 2) |
					(+(c > threshold) << 1) |
					+(d > threshold);
				const edges = SEGMENTS[kind] ?? [];
				if (!edges.length) continue;
				const px = x * CELL;
				const py = y * CELL;
				const point = (edge: number): [number, number] => {
					const lerp = (p: number, q: number) => (threshold - p) / (q - p || 1e-6);
					if (edge === 0) return [px + CELL * lerp(a, b), py];
					if (edge === 1) return [px + CELL, py + CELL * lerp(b, c)];
					if (edge === 2) return [px + CELL * lerp(d, c), py + CELL];
					return [px, py + CELL * lerp(a, d)];
				};
				for (let s = 0; s < edges.length; s += 2) {
					const [x1, y1] = point(edges[s] ?? 0);
					const [x2, y2] = point(edges[s + 1] ?? 0);
					path.moveTo(x1, y1);
					path.lineTo(x2, y2);
				}
			}
		}
	};

	const draw = () => {
		if (!ctx) return;
		sample();
		ctx.clearRect(0, 0, width, height);
		if (options.variant === "filled") drawFill();
		const levels = Math.max(2, Math.round(options.levels));
		const regular = new Path2D();
		const index = new Path2D();
		for (let level = 1; level < levels; level++) {
			const major = options.indexEvery > 0 && level % options.indexEvery === 0;
			trace(level / levels, major ? index : regular);
		}
		ctx.lineJoin = "round";
		ctx.lineCap = "round";
		ctx.globalAlpha = LINE_ALPHA;
		ctx.strokeStyle = lineColor;
		ctx.lineWidth = options.lineWidth;
		ctx.stroke(regular);
		ctx.globalAlpha = INDEX_ALPHA;
		ctx.strokeStyle = indexColor;
		ctx.lineWidth = options.lineWidth * 1.8;
		ctx.stroke(index);
		ctx.globalAlpha = 1;
	};

	const moving = () => options.speed > 0 && !reduced.matches;
	const running = () => visible && !document.hidden && moving();

	const tick = (now: number) => {
		frame = 0;
		if (!running()) {
			last = 0;
			return;
		}
		if (!last || now - last >= FRAME_MS) {
			elapsed += last ? Math.min(now - last, 100) : 0;
			last = now;
			draw();
		}
		frame = requestAnimationFrame(tick);
	};

	const wake = () => {
		if (!frame && running()) frame = requestAnimationFrame(tick);
	};

	const reset = () => {
		layout();
		draw();
		wake();
	};

	const resize = new ResizeObserver(reset);
	resize.observe(container);
	// Theme switches change the line tokens; resample them.
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
	reduced.addEventListener("change", reset);

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
			reduced.removeEventListener("change", reset);
		},
	};
}
