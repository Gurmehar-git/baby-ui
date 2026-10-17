export type MagnetLinesOptions = {
	/** Degrees added to every line's pointer angle. */
	baseAngle: number;
};

const LINE = '[data-slot="magnet-lines-line"]';

/** Turns every line in `root` toward the pointer by writing `--ml-angle`; CSS eases it. */
export function mountMagnetLines(root: HTMLElement, initial: MagnetLinesOptions) {
	let opts = initial;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	let lines: HTMLElement[] = [];
	let centers: { x: number; y: number }[] = [];
	let angles: number[] = [];
	let pointer: { x: number; y: number } | null = null;
	let visible = true;
	let frame = 0;

	const measure = () => {
		const next = Array.from(root.querySelectorAll<HTMLElement>(LINE));
		if (next.length !== lines.length) angles = [];
		lines = next;
		centers = lines.map((line) => ({
			x: line.offsetLeft + line.offsetWidth / 2,
			y: line.offsetTop + line.offsetHeight / 2,
		}));
	};

	const clear = () => {
		angles = [];
		for (const line of lines) line.style.removeProperty("--ml-angle");
	};

	const paint = () => {
		frame = 0;
		if (!pointer || reduced.matches) return;
		const rect = root.getBoundingClientRect();
		const px = pointer.x - rect.left;
		const py = pointer.y - rect.top;
		lines.forEach((line, i) => {
			const c = centers[i];
			if (!c) return;
			const raw = (Math.atan2(py - c.y, px - c.x) * 180) / Math.PI + opts.baseAngle;
			const prev = angles[i] ?? opts.baseAngle;
			// Lines look the same after a half turn, so take the shortest step modulo 180.
			const next = prev + ((((raw - prev) % 180) + 270) % 180) - 90;
			angles[i] = next;
			line.style.setProperty("--ml-angle", `${next.toFixed(2)}deg`);
		});
	};

	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(paint);
	};

	const onMove = (e: PointerEvent) => {
		pointer = { x: e.clientX, y: e.clientY };
		if (visible && !reduced.matches) schedule();
	};

	const onReduced = () => {
		if (reduced.matches) clear();
		else schedule();
	};

	const sizes = new ResizeObserver(() => {
		measure();
		schedule();
	});
	const seen = new IntersectionObserver(([entry]) => {
		visible = entry?.isIntersecting ?? true;
		if (visible) schedule();
	});
	sizes.observe(root);
	seen.observe(root);
	reduced.addEventListener("change", onReduced);
	window.addEventListener("pointermove", onMove, { passive: true });
	measure();

	return {
		update(next: MagnetLinesOptions) {
			opts = next;
			measure();
			schedule();
		},
		destroy() {
			cancelAnimationFrame(frame);
			sizes.disconnect();
			seen.disconnect();
			reduced.removeEventListener("change", onReduced);
			window.removeEventListener("pointermove", onMove);
		},
	};
}
