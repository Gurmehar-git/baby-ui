import { readColors, watchSurface } from "../lib/surface";
import type { PixelCanvasTone, PixelCanvasVariant } from "./variants";

export type PixelOptions = {
	variant: PixelCanvasVariant;
	tone: PixelCanvasTone;
	/** Cell pitch in CSS px, including the 1px gutter. */
	gap: number;
	/** Fade rate per frame once the pointer moves on, 0 to 1. */
	decay: number;
	/** Pointer influence radius, in px. */
	radius: number;
};

type Rgb = [number, number, number];

const RAMPS: Record<PixelCanvasTone, string[]> = {
	spectrum: ["--chart-1", "--chart-5", "--chart-4"],
	cool: ["--chart-scale-4", "--chart-1", "--chart-3"],
	warm: ["--chart-2", "--chart-5", "--chart-4"],
	mono: ["--muted-foreground", "--foreground"],
};

const GRID_ALPHA = 0.1;
const LIGHT_UP = 0.3;

function ramp(colors: Rgb[], amount: number): string {
	const last = colors.length - 1;
	const at = (amount % 1) * last;
	const i = Math.min(Math.floor(at), Math.max(0, last - 1));
	const f = at - i;
	const a = colors[i] ?? [0, 0, 0];
	const b = colors[Math.min(last, i + 1)] ?? a;
	return `rgb(${a[0] + (b[0] - a[0]) * f} ${a[1] + (b[1] - a[1]) * f} ${a[2] + (b[2] - a[2]) * f})`;
}

/**
 * A faint cell grid that lights up around the pointer and fades behind it. The loop runs only
 * while some cell is still changing, and never offscreen or while the tab is hidden.
 */
export function mountPixels(
	container: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: PixelOptions,
): { update: (next: PixelOptions) => void; destroy: () => void } {
	const ctx = canvas.getContext("2d");
	const base = document.createElement("canvas");
	const baseCtx = base.getContext("2d");
	const probe = document
		.createElement("canvas")
		.getContext("2d", { willReadFrequently: true });
	let options = initial;
	let colors: Rgb[] = [];
	let cols = 0;
	let rows = 0;
	let width = 0;
	let height = 0;
	let intensity = new Float32Array(0);
	let phase = new Float32Array(0);
	let pointer: { x: number; y: number } | null = null;
	let frame = 0;
	let last = 0;

	const pitch = () => Math.max(4, options.gap);

	const layout = () => {
		if (!ctx || !baseCtx || !probe) return;
		const dpr = window.devicePixelRatio || 1;
		width = container.clientWidth;
		height = container.clientHeight;
		canvas.width = base.width = Math.max(1, Math.round(width * dpr));
		canvas.height = base.height = Math.max(1, Math.round(height * dpr));
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		baseCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
		const size = pitch();
		const nextCols = Math.ceil(width / size);
		const nextRows = Math.ceil(height / size);
		if (nextCols !== cols || nextRows !== rows) {
			cols = nextCols;
			rows = nextRows;
			intensity = new Float32Array(cols * rows);
			phase = Float32Array.from({ length: cols * rows }, () => Math.random());
		}
		const style = getComputedStyle(container);
		colors = readColors(container, RAMPS[options.tone], probe);
		baseCtx.clearRect(0, 0, width, height);
		baseCtx.globalAlpha = GRID_ALPHA;
		baseCtx.fillStyle =
			style.getPropertyValue("--muted-foreground").trim() || style.color;
		for (let x = 0; x < cols; x++) {
			for (let y = 0; y < rows; y++)
				baseCtx.fillRect(x * size, y * size, size - 1, size - 1);
		}
	};

	const step = (delta: number) => {
		const size = pitch();
		const snap = surface.reducedMotion();
		let changed = false;
		for (let x = 0; x < cols; x++) {
			for (let y = 0; y < rows; y++) {
				const i = x * rows + y;
				let target = 0;
				if (pointer) {
					const d = Math.hypot(
						pointer.x - (x + 0.5) * size,
						pointer.y - (y + 0.5) * size,
					);
					if (d < options.radius) target = (1 - d / options.radius) ** 1.5;
				}
				const v = intensity[i] ?? 0;
				const rate = target > v ? LIGHT_UP : options.decay;
				let next = snap ? target : v + (target - v) * rate;
				if (next < 0.01 && target === 0) next = 0;
				intensity[i] = next;
				if (Math.abs(next - v) > 0.001) {
					changed = true;
					phase[i] = ((phase[i] ?? 0) + 0.001 * (delta / 16)) % 1;
				}
			}
		}
		return changed;
	};

	const draw = () => {
		if (!ctx) return;
		const size = pitch();
		const cell = size - 1;
		ctx.clearRect(0, 0, width, height);
		ctx.globalAlpha = 1;
		ctx.drawImage(base, 0, 0, width, height);
		for (let x = 0; x < cols; x++) {
			for (let y = 0; y < rows; y++) {
				const i = x * rows + y;
				const v = intensity[i] ?? 0;
				if (v <= 0) continue;
				const px = x * size;
				const py = y * size;
				ctx.fillStyle = ramp(colors, (phase[i] ?? 0) + v);
				if (options.variant === "glow" && v > 0.2) {
					for (let g = 2; g > 0; g--) {
						ctx.globalAlpha = (v * 0.15) / g;
						ctx.fillRect(px - g * 2, py - g * 2, cell + g * 4, cell + g * 4);
					}
				}
				ctx.globalAlpha = v * 0.9;
				if (options.variant === "rounded") {
					ctx.beginPath();
					ctx.roundRect(px, py, cell, cell, cell * 0.3);
					ctx.fill();
				} else {
					ctx.fillRect(px, py, cell, cell);
				}
			}
		}
		ctx.globalAlpha = 1;
	};

	const tick = (now: number) => {
		frame = 0;
		const changed = step(last ? Math.min(now - last, 50) : 16);
		last = now;
		draw();
		if (surface.live() && changed) frame = requestAnimationFrame(tick);
		else last = 0;
	};

	const wake = () => {
		if (!frame) frame = requestAnimationFrame(tick);
	};

	const reset = () => {
		layout();
		wake();
	};

	const surface = watchSurface(container, {
		resize: reset,
		// Theme switches change the grid and ramp tokens; resample them.
		theme: reset,
		wake,
		pointer: {
			move(x, y) {
				pointer = { x, y };
				wake();
			},
			leave() {
				pointer = null;
				wake();
			},
		},
	});

	return {
		update(next) {
			options = next;
			reset();
		},
		destroy() {
			cancelAnimationFrame(frame);
			surface.destroy();
		},
	};
}
