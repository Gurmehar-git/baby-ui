import { tv, type VariantProps } from "tailwind-variants";

export const particleText = tv({
	slots: {
		root: "relative flex w-full touch-none items-center justify-center font-bold text-foreground",
		canvas: "block size-full",
		srOnly: "sr-only",
	},
	variants: {
		shape: {
			circle: {},
			square: {},
		},
		size: {
			sm: { root: "h-40" },
			default: { root: "h-64" },
			lg: { root: "h-96" },
		},
	},
	defaultVariants: { shape: "circle", size: "default" },
});

export type ParticleTextShape = NonNullable<VariantProps<typeof particleText>["shape"]>;
export type ParticleTextSize = NonNullable<VariantProps<typeof particleText>["size"]>;

export type ParticleOptions = {
	text: string;
	/** Largest font size in px; shrinks to fit narrow containers. */
	fontSize: number;
	particleSize: number;
	/** Sampling step in px: lower means more particles. */
	density: number;
	/** Push strength for particles inside `radius`. */
	strength: number;
	radius: number;
	/** Spring pull back to each particle's home, per frame. */
	returnSpeed: number;
	shape: ParticleTextShape;
};

type Particle = { x: number; y: number; ox: number; oy: number; vx: number; vy: number };

const FRICTION = 0.85;
const REST = 0.05;

/**
 * Samples `text` into particles and runs their physics only while something is moving:
 * the loop stops once no particle moved this frame and wakes on pointer movement.
 */
export function mountParticles(
	container: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: ParticleOptions,
): { update: (next: ParticleOptions) => void; destroy: () => void } {
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	let options = initial;
	let particles: Particle[] = [];
	let pointer: { x: number; y: number } | null = null;
	let frame = 0;
	let width = 0;
	let height = 0;
	let color = "#000";
	let destroyed = false;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");

	const sample = () => {
		if (!ctx) return;
		const dpr = window.devicePixelRatio || 1;
		width = container.clientWidth;
		height = container.clientHeight;
		canvas.width = Math.max(1, Math.round(width * dpr));
		canvas.height = Math.max(1, Math.round(height * dpr));
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		const style = getComputedStyle(container);
		color = style.color;
		const size = Math.min(options.fontSize, width * 0.15);
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = "#000";
		ctx.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(options.text, width / 2, height / 2);
		const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const step = Math.max(1, Math.floor(options.density * dpr));
		const settled = reduced.matches;
		particles = [];
		for (let y = 0; y < data.height; y += step) {
			for (let x = 0; x < data.width; x += step) {
				if ((data.data[(y * data.width + x) * 4 + 3] ?? 0) <= 128) continue;
				const ox = x / dpr;
				const oy = y / dpr;
				// Start slightly scattered so the text assembles, unless motion is reduced.
				const spread = settled ? 0 : 24;
				particles.push({
					x: ox + (Math.random() - 0.5) * spread,
					y: oy + (Math.random() - 0.5) * spread,
					ox,
					oy,
					vx: 0,
					vy: 0,
				});
			}
		}
	};

	const draw = () => {
		if (!ctx) return;
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = color;
		const r = options.particleSize;
		if (options.shape === "square") {
			for (const p of particles) ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
			return;
		}
		ctx.beginPath();
		for (const p of particles) {
			ctx.moveTo(p.x + r, p.y);
			ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
		}
		ctx.fill();
	};

	const step = () => {
		let moving = false;
		for (const p of particles) {
			if (pointer) {
				const dx = pointer.x - p.x;
				const dy = pointer.y - p.y;
				const d = Math.hypot(dx, dy);
				if (d > 0 && d < options.radius) {
					const force = ((options.radius - d) / options.radius) * options.strength;
					p.vx -= (dx / d) * force;
					p.vy -= (dy / d) * force;
				}
			}
			p.vx = (p.vx + (p.ox - p.x) * options.returnSpeed) * FRICTION;
			p.vy = (p.vy + (p.oy - p.y) * options.returnSpeed) * FRICTION;
			p.x += p.vx;
			p.y += p.vy;
			// A resting pointer holds particles off home, so only velocity counts while it is set.
			if (Math.abs(p.vx) > REST || Math.abs(p.vy) > REST) moving = true;
			else if (!pointer && (Math.abs(p.x - p.ox) > REST || Math.abs(p.y - p.oy) > REST))
				moving = true;
		}
		draw();
		frame = moving ? requestAnimationFrame(step) : 0;
	};

	const wake = () => {
		if (reduced.matches) return draw();
		if (!frame) frame = requestAnimationFrame(step);
	};

	const reset = () => {
		if (destroyed) return;
		sample();
		wake();
	};

	const onMove = (event: PointerEvent) => {
		if (reduced.matches) return;
		const box = canvas.getBoundingClientRect();
		pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
		wake();
	};
	const onLeave = () => {
		pointer = null;
		wake();
	};
	const onReducedChange = () => {
		cancelAnimationFrame(frame);
		frame = 0;
		pointer = null;
		reset();
	};

	canvas.addEventListener("pointermove", onMove);
	canvas.addEventListener("pointerleave", onLeave);
	canvas.addEventListener("pointercancel", onLeave);
	reduced.addEventListener("change", onReducedChange);
	const resize = new ResizeObserver(reset);
	resize.observe(container);
	// Theme switches change `color`; resample so the particles follow.
	const theme = new MutationObserver(reset);
	theme.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class", "style"],
	});
	document.fonts?.ready.then(reset);

	return {
		update(next) {
			options = next;
			reset();
		},
		destroy() {
			destroyed = true;
			cancelAnimationFrame(frame);
			reduced.removeEventListener("change", onReducedChange);
			resize.disconnect();
			theme.disconnect();
			canvas.removeEventListener("pointermove", onMove);
			canvas.removeEventListener("pointerleave", onLeave);
			canvas.removeEventListener("pointercancel", onLeave);
		},
	};
}
