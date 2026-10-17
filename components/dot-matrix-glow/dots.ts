import type { DotMatrixGlowShape, DotMatrixGlowTone } from "./variants";

export type DotOptions = {
	shape: DotMatrixGlowShape;
	tone: DotMatrixGlowTone;
	/** Grid pitch in CSS px. */
	gap: number;
	/** Resting dot radius in CSS px. */
	dotSize: number;
	/** Pointer influence radius in CSS px. */
	glowRadius: number;
	/** Pointer down sends a ring outward. */
	ripple: boolean;
	/** Slow shimmer across the whole grid; keeps the loop running while visible. */
	ambient: boolean;
};

type Rgb = [number, number, number];
type Ripple = { x: number; y: number; born: number };

const RAMPS: Record<DotMatrixGlowTone, string[]> = {
	primary: ["--primary"],
	spectrum: ["--chart-1", "--chart-5", "--chart-4"],
	mono: ["--foreground"],
};

const BASE_ALPHA = 0.16;
const MAX_SCALE = 1.9;
const LIGHT_UP = 0.35;
const FADE = 0.09;
const RIPPLE_SPEED = 0.55;
const RIPPLE_LIFE = 1400;
const RIPPLE_WIDTH = 34;
const AMBIENT_LEVEL = 0.22;

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

function mix(colors: Rgb[], at: number): string {
	const last = colors.length - 1;
	const pos = Math.min(Math.max(at, 0), 1) * last;
	const i = Math.min(Math.floor(pos), Math.max(0, last - 1));
	const f = pos - i;
	const a = colors[i] ?? [0, 0, 0];
	const b = colors[Math.min(last, i + 1)] ?? a;
	return `rgb(${a[0] + (b[0] - a[0]) * f} ${a[1] + (b[1] - a[1]) * f} ${a[2] + (b[2] - a[2]) * f})`;
}

function mark(
	ctx: CanvasRenderingContext2D,
	shape: DotMatrixGlowShape,
	x: number,
	y: number,
	r: number,
) {
	if (shape === "square") {
		ctx.rect(x - r, y - r, r * 2, r * 2);
	} else if (shape === "plus") {
		const arm = r * 1.6;
		const t = Math.max(0.6, r * 0.55);
		ctx.rect(x - arm, y - t / 2, arm * 2, t);
		ctx.rect(x - t / 2, y - arm, t, arm * 2);
	} else {
		ctx.moveTo(x + r, y);
		ctx.arc(x, y, r, 0, Math.PI * 2);
	}
}

/** A dot grid that brightens near the pointer, rings outward on press and can shimmer.
 * The loop runs only while something changes, never offscreen or in a hidden tab. */
export function mountDots(
	container: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: DotOptions,
): { update: (next: DotOptions) => void; destroy: () => void } {
	const ctx = canvas.getContext("2d");
	const base = document.createElement("canvas");
	const baseCtx = base.getContext("2d");
	const probe = document
		.createElement("canvas")
		.getContext("2d", { willReadFrequently: true });
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	let options = initial;
	let glow: Rgb[] = [];
	let cols = 0;
	let rows = 0;
	let width = 0;
	let height = 0;
	let offsetX = 0;
	let offsetY = 0;
	let level = new Float32Array(0);
	let pointer: { x: number; y: number } | null = null;
	let ripples: Ripple[] = [];
	let visible = true;
	let frame = 0;
	let last = 0;

	const pitch = () => Math.max(6, options.gap);

	const layout = () => {
		if (!ctx || !baseCtx || !probe) return;
		// Capped at 2: denser canvases cost fill rate without a visible gain.
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		width = container.clientWidth;
		height = container.clientHeight;
		canvas.width = base.width = Math.max(1, Math.round(width * dpr));
		canvas.height = base.height = Math.max(1, Math.round(height * dpr));
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		baseCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
		const size = pitch();
		const nextCols = Math.floor(width / size) + 1;
		const nextRows = Math.floor(height / size) + 1;
		offsetX = (width - (nextCols - 1) * size) / 2;
		offsetY = (height - (nextRows - 1) * size) / 2;
		if (nextCols !== cols || nextRows !== rows) {
			cols = nextCols;
			rows = nextRows;
			level = new Float32Array(cols * rows);
		}
		glow = readColors(container, RAMPS[options.tone], probe);
		const style = getComputedStyle(container);
		baseCtx.clearRect(0, 0, width, height);
		baseCtx.globalAlpha = BASE_ALPHA;
		baseCtx.fillStyle =
			style.getPropertyValue("--muted-foreground").trim() || style.color;
		baseCtx.beginPath();
		for (let x = 0; x < cols; x++) {
			for (let y = 0; y < rows; y++)
				mark(
					baseCtx,
					options.shape,
					offsetX + x * size,
					offsetY + y * size,
					options.dotSize,
				);
		}
		baseCtx.fill();
	};

	const animated = () => !reduced.matches;
	const running = () => visible && !document.hidden;

	const step = (now: number) => {
		const size = pitch();
		const snap = !animated();
		const ringsOn = options.ripple && animated();
		ripples = ringsOn ? ripples.filter((r) => now - r.born < RIPPLE_LIFE) : [];
		const shimmer = options.ambient && animated();
		let changed = ripples.length > 0 || shimmer;
		for (let x = 0; x < cols; x++) {
			for (let y = 0; y < rows; y++) {
				const i = x * rows + y;
				const px = offsetX + x * size;
				const py = offsetY + y * size;
				let target = 0;
				if (pointer) {
					const d = Math.hypot(pointer.x - px, pointer.y - py);
					if (d < options.glowRadius) {
						const t = 1 - d / options.glowRadius;
						target = t * t * (3 - 2 * t);
					}
				}
				for (const r of ripples) {
					const age = now - r.born;
					const band =
						(Math.hypot(r.x - px, r.y - py) - age * RIPPLE_SPEED) / RIPPLE_WIDTH;
					target = Math.max(target, Math.exp(-band * band) * (1 - age / RIPPLE_LIFE));
				}
				if (options.ambient) {
					const t = shimmer ? now * 0.0006 : 0;
					const wave = Math.sin(px * 0.018 + t + Math.sin(py * 0.014 - t * 0.7) * 1.6);
					target = Math.max(target, AMBIENT_LEVEL * (0.5 + 0.5 * wave) ** 2);
				}
				const v = level[i] ?? 0;
				let next = snap ? target : v + (target - v) * (target > v ? LIGHT_UP : FADE);
				if (next < 0.004 && target === 0) next = 0;
				level[i] = next;
				if (Math.abs(next - v) > 0.002) changed = true;
			}
		}
		return changed;
	};

	const draw = () => {
		if (!ctx) return;
		const size = pitch();
		ctx.clearRect(0, 0, width, height);
		ctx.globalAlpha = 1;
		ctx.drawImage(base, 0, 0, width, height);
		for (let x = 0; x < cols; x++) {
			for (let y = 0; y < rows; y++) {
				const v = level[x * rows + y] ?? 0;
				if (v <= 0.01) continue;
				ctx.fillStyle = mix(glow, v);
				ctx.globalAlpha = Math.min(1, v * 1.1);
				ctx.beginPath();
				const r = options.dotSize * (1 + (MAX_SCALE - 1) * v);
				mark(ctx, options.shape, offsetX + x * size, offsetY + y * size, r);
				ctx.fill();
			}
		}
		ctx.globalAlpha = 1;
	};

	const tick = (now: number) => {
		frame = 0;
		const changed = step(now);
		last = now;
		draw();
		if (running() && changed && animated()) frame = requestAnimationFrame(tick);
		else last = 0;
	};

	const wake = () => {
		if (!frame && running()) frame = requestAnimationFrame(tick);
	};

	const reset = () => {
		layout();
		// One synchronous pass so a static frame exists even while the loop is parked.
		step(last || performance.now());
		draw();
		wake();
	};

	const local = (event: PointerEvent) => {
		const box = container.getBoundingClientRect();
		return { x: event.clientX - box.left, y: event.clientY - box.top };
	};
	const onMove = (event: PointerEvent) => {
		pointer = local(event);
		if (!animated()) reset();
		else wake();
	};
	const onDown = (event: PointerEvent) => {
		if (!options.ripple || !animated()) return;
		ripples = [...ripples.slice(-4), { ...local(event), born: performance.now() }];
		wake();
	};
	const onLeave = () => {
		pointer = null;
		if (!animated()) reset();
		else wake();
	};

	container.addEventListener("pointermove", onMove);
	container.addEventListener("pointerdown", onDown);
	container.addEventListener("pointerleave", onLeave);
	container.addEventListener("pointercancel", onLeave);
	const resize = new ResizeObserver(reset);
	resize.observe(container);
	// Theme switches change the dot and glow tokens; resample them.
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
			container.removeEventListener("pointermove", onMove);
			container.removeEventListener("pointerdown", onDown);
			container.removeEventListener("pointerleave", onLeave);
			container.removeEventListener("pointercancel", onLeave);
			resize.disconnect();
			theme.disconnect();
			intersection.disconnect();
			document.removeEventListener("visibilitychange", wake);
			reduced.removeEventListener("change", reset);
		},
	};
}
