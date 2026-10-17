import { readColors, watchSurface } from "../lib/surface";
import type {
	AsciiEffectDither,
	AsciiEffectFit,
	AsciiEffectTone,
	AsciiEffectVariant,
} from "./variants";

export type AsciiOptions = {
	/** Image URL; must be same-origin or served with CORS so its pixels can be read. */
	src: string;
	variant: AsciiEffectVariant;
	tone: AsciiEffectTone;
	/** Glyph ramp from sparse to dense. */
	chars: string;
	/** Glyph size in px. */
	fontSize: number;
	contrast: number;
	brightness: number;
	dither: AsciiEffectDither;
	/** Flip the brightness mapping (applied after the theme-aware default). */
	invert: boolean;
	fit: AsciiEffectFit;
	/** Flow drift or glitch frequency multiplier; 0 holds a still frame. */
	speed: number;
};

type Rgb = [number, number, number];

const RAMPS: Record<AsciiEffectTone, string[]> = {
	mono: ["--muted-foreground", "--foreground"],
	spectrum: ["--chart-1", "--chart-5", "--chart-4"],
	cool: ["--chart-scale-4", "--chart-1", "--chart-3"],
	warm: ["--chart-2", "--chart-5", "--chart-4"],
	source: [],
};

const BUCKETS = 24;
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function lerp(colors: Rgb[], amount: number): string {
	const last = colors.length - 1;
	if (last < 1) {
		const [r, g, b] = colors[0] ?? [0, 0, 0];
		return `rgb(${r} ${g} ${b})`;
	}
	const at = clamp(amount) * last;
	const i = Math.min(Math.floor(at), last - 1);
	const f = at - i;
	const a = colors[i] ?? [0, 0, 0];
	const b = colors[i + 1] ?? a;
	return `rgb(${a[0] + (b[0] - a[0]) * f} ${a[1] + (b[1] - a[1]) * f} ${a[2] + (b[2] - a[2]) * f})`;
}

/**
 * Samples an image to one pixel per glyph cell and draws it as text. `image` draws once; `flow`
 * loops while visible; `glitch` redraws only when a band tears or heals, on timers.
 */
export function mountAscii(
	container: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: AsciiOptions,
): { update: (next: AsciiOptions) => void; destroy: () => void } {
	const ctx = canvas.getContext("2d");
	const sample = document.createElement("canvas");
	const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
	const probe = document
		.createElement("canvas")
		.getContext("2d", { willReadFrequently: true });
	let options = initial;
	let image: HTMLImageElement | null = null;
	let loaded = false;
	let width = 0;
	let height = 0;
	let cellW = 0;
	let cellH = 0;
	let cols = 0;
	let rows = 0;
	let font = "";
	let pixels: Uint8ClampedArray | null = null;
	let lum = new Float32Array(0);
	let palette: string[] = [];
	let bands = new Map<number, number>();
	const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };
	let frame = 0;
	let timer = 0;
	// Late callbacks (fonts.ready, image load) must not restart a torn-down engine.
	let destroyed = false;
	let last = 0;
	let time = 0;

	const running = () =>
		surface.live() && options.speed > 0 && options.variant !== "image";

	const load = () => {
		loaded = false;
		pixels = null;
		const next = new Image();
		next.crossOrigin = "anonymous";
		next.decoding = "async";
		next.onload = () => {
			if (image !== next) return;
			loaded = true;
			reset();
		};
		next.src = options.src;
		image = next;
	};

	const layout = () => {
		if (!ctx || !sampleCtx || !probe) return;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		width = container.clientWidth;
		height = container.clientHeight;
		canvas.width = Math.max(1, Math.round(width * dpr));
		canvas.height = Math.max(1, Math.round(height * dpr));
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		const style = getComputedStyle(container);
		const size = Math.max(4, options.fontSize);
		font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
		ctx.font = font;
		cellW = Math.max(2, ctx.measureText("M").width);
		cellH = size;
		cols = Math.ceil(width / cellW) + 1;
		rows = Math.ceil(height / cellH) + 1;
		const [bg] = readColors(container, ["--background"], probe);
		const lightSurface = bg
			? (bg[0] * 0.2126 + bg[1] * 0.7152 + bg[2] * 0.0722) / 255 > 0.5
			: false;
		const ramp = readColors(container, RAMPS[options.tone], probe);
		palette = Array.from({ length: BUCKETS }, (_, i) => lerp(ramp, i / (BUCKETS - 1)));
		if (!loaded || !image?.naturalWidth) return;
		sample.width = cols;
		sample.height = rows;
		const scale =
			options.fit === "contain"
				? Math.min(width / image.naturalWidth, height / image.naturalHeight)
				: Math.max(width / image.naturalWidth, height / image.naturalHeight);
		const w = (image.naturalWidth * scale) / cellW;
		const h = (image.naturalHeight * scale) / cellH;
		sampleCtx.clearRect(0, 0, cols, rows);
		sampleCtx.drawImage(image, (cols - w) / 2, (rows - h) / 2, w, h);
		try {
			pixels = sampleCtx.getImageData(0, 0, cols, rows).data;
		} catch {
			// A cross-origin image without CORS headers taints the canvas; draw nothing.
			pixels = null;
			return;
		}
		const steps = Math.max(2, options.chars.length);
		lum = new Float32Array(cols * rows);
		for (let i = 0; i < lum.length; i++) {
			const p = i * 4;
			const alpha = (pixels[p + 3] ?? 0) / 255;
			let l =
				((pixels[p] ?? 0) * 0.2126 +
					(pixels[p + 1] ?? 0) * 0.7152 +
					(pixels[p + 2] ?? 0) * 0.0722) /
				255;
			l = clamp(((l - 0.5) * options.contrast + 0.5) * options.brightness);
			// On a light surface bright areas read as empty paper, so fewer glyphs.
			if (options.invert !== lightSurface) l = 1 - l;
			lum[i] = l * alpha;
		}
		if (options.dither === "floyd-steinberg") {
			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					const i = y * cols + x;
					const old = clamp(lum[i] ?? 0);
					const value = Math.round(old * (steps - 1)) / (steps - 1);
					const error = old - value;
					lum[i] = value;
					if (x + 1 < cols) lum[i + 1] = (lum[i + 1] ?? 0) + (error * 7) / 16;
					if (y + 1 < rows) {
						if (x > 0) lum[i + cols - 1] = (lum[i + cols - 1] ?? 0) + (error * 3) / 16;
						lum[i + cols] = (lum[i + cols] ?? 0) + (error * 5) / 16;
						if (x + 1 < cols) lum[i + cols + 1] = (lum[i + cols + 1] ?? 0) + error / 16;
					}
				}
			}
		} else if (options.dither === "bayer") {
			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					const i = y * cols + x;
					const offset = ((BAYER4[(y % 4) * 4 + (x % 4)] ?? 0) / 16 - 0.5) / (steps - 1);
					lum[i] = clamp((lum[i] ?? 0) + offset);
				}
			}
		}
	};

	const render = () => {
		if (!ctx) return;
		ctx.clearRect(0, 0, width, height);
		if (!pixels) return;
		const flow = options.variant === "flow" && !surface.reducedMotion();
		const chars = options.chars;
		const glyphs = chars.length - 1;
		ctx.font = font;
		ctx.textBaseline = "top";
		if (flow) {
			pointer.x += (pointer.tx - pointer.x) * 0.08;
			pointer.y += (pointer.ty - pointer.y) * 0.08;
		}
		for (let row = 0; row < rows; row++) {
			const tear = bands.get(row) ?? 0;
			for (let col = 0; col < cols; col++) {
				let sc = col;
				let sr = row;
				let boost = 0;
				if (flow) {
					const x = col * cellW;
					const y = row * cellH;
					const phase = x * 0.018 + time * 1.4;
					const drift =
						(Math.sin(phase) + Math.sin(phase * 0.61 + y * 0.012) * 0.45) * 12;
					sc -= drift / cellW;
					if (pointer.active) {
						const dx = x - pointer.x;
						const dy = y - pointer.y;
						const d = Math.hypot(dx, dy);
						const influence = clamp(1 - d / 150);
						if (d > 0 && influence > 0) {
							const push = influence ** 2 * 22 * Math.sin(d * 0.055 - time * 7.5);
							sc -= ((dx / d) * push) / cellW;
							sr -= ((dy / d) * push) / cellH;
							boost = influence * 0.08;
						}
					}
				}
				const i =
					Math.round(clamp(sr, 0, rows - 1)) * cols + Math.round(clamp(sc, 0, cols - 1));
				const l = clamp((lum[i] ?? 0) + boost);
				const char = chars[Math.min(glyphs, Math.floor(l * glyphs))];
				if (!char || char === " ") continue;
				if (options.tone === "source") {
					const p = i * 4;
					ctx.fillStyle = `rgb(${pixels[p]} ${pixels[p + 1]} ${pixels[p + 2]})`;
				} else {
					ctx.fillStyle = palette[Math.round(l * (BUCKETS - 1))] ?? "";
				}
				ctx.fillText(char, col * cellW + tear, row * cellH);
			}
		}
	};

	const tick = (now: number) => {
		frame = 0;
		const flowing = options.variant === "flow" && running();
		if (flowing && last) time += (Math.min(now - last, 50) / 1000) * options.speed;
		last = now;
		render();
		if (flowing) frame = requestAnimationFrame(tick);
		else last = 0;
	};

	const tear = () => {
		if (destroyed) return;
		timer = 0;
		if (options.variant !== "glitch" || !running()) return;
		bands = new Map();
		for (let band = 0; band < 3; band++) {
			const start = Math.floor(Math.random() * rows);
			const offset = (Math.random() - 0.5) * options.fontSize * 8;
			const size = 1 + Math.floor(Math.random() * 3);
			for (let row = start; row < Math.min(rows, start + size); row++)
				bands.set(row, offset);
		}
		render();
		timer = window.setTimeout(heal, 130);
	};

	const heal = () => {
		if (destroyed) return;
		bands.clear();
		render();
		timer = window.setTimeout(tear, (500 + Math.random() * 600) / options.speed);
	};

	const wake = () => {
		if (destroyed) return;
		if (!frame) frame = requestAnimationFrame(tick);
		if (!timer && options.variant === "glitch" && running()) {
			timer = window.setTimeout(tear, 400 / options.speed);
		}
	};

	const reset = () => {
		if (destroyed) return;
		layout();
		wake();
	};

	const surface = watchSurface(container, {
		resize: reset,
		// Theme switches change the ramp and the surface brightness; resample both.
		theme: reset,
		wake,
		pointer: {
			move(x, y) {
				if (options.variant !== "flow") return;
				pointer.tx = x;
				pointer.ty = y;
				if (!pointer.active) {
					pointer.x = pointer.tx;
					pointer.y = pointer.ty;
				}
				pointer.active = true;
			},
			leave() {
				pointer.active = false;
			},
		},
	});
	document.fonts?.ready.then(reset);
	load();

	return {
		update(next) {
			const src = next.src !== options.src;
			options = next;
			bands.clear();
			window.clearTimeout(timer);
			timer = 0;
			if (src) load();
			reset();
		},
		destroy() {
			destroyed = true;
			cancelAnimationFrame(frame);
			window.clearTimeout(timer);
			if (image) image.onload = null;
			image = null;
			surface.destroy();
		},
	};
}
