import { tv, type VariantProps } from "tailwind-variants";

export const imageTrail = tv({
	slots: {
		root: "relative isolate h-96 w-full touch-pan-y overflow-hidden",
		layer: "pointer-events-none absolute inset-0 isolate",
		item: "image-trail-item absolute top-0 left-0 rounded-lg object-cover opacity-0 shadow-lg will-change-transform",
		content: "relative flex size-full items-center justify-center",
	},
	variants: {
		variant: {
			fade: { root: "image-trail--fade" },
			fall: { root: "image-trail--fall" },
			shrink: { root: "image-trail--shrink" },
		},
		size: {
			sm: { item: "h-32 w-24" },
			default: { item: "h-48 w-36" },
			lg: { item: "h-64 w-48" },
		},
	},
	defaultVariants: { variant: "fall", size: "default" },
});

export type ImageTrailVariant = NonNullable<VariantProps<typeof imageTrail>["variant"]>;
export type ImageTrailSize = NonNullable<VariantProps<typeof imageTrail>["size"]>;

export type ImageTrailOptions = {
	/** Pointer travel in px between two spawned images. */
	threshold: number;
	/** Lifetime of one image, in ms. */
	duration: number;
};

/**
 * Spawns pooled images round-robin as the pointer travels; motion is CSS keyframes only,
 * so nothing runs while the pointer is still.
 */
export function mountImageTrail(
	container: HTMLElement,
	initial: ImageTrailOptions,
): { update: (next: ImageTrailOptions) => void; destroy: () => void } {
	let options = initial;
	let last: { x: number; y: number } | null = null;
	let next = 0;
	let z = 1;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");

	const spawn = (from: { x: number; y: number }, to: { x: number; y: number }) => {
		const pool = container.querySelectorAll<HTMLElement>(
			'[data-slot="image-trail-item"]',
		);
		if (!pool.length) return;
		const img = pool[next % pool.length] as HTMLElement;
		next = (next + 1) % pool.length;
		z += 1;
		img.style.zIndex = String(z);
		img.style.setProperty("--image-trail-x0", `${from.x}px`);
		img.style.setProperty("--image-trail-y0", `${from.y}px`);
		img.style.setProperty("--image-trail-x", `${to.x}px`);
		img.style.setProperty("--image-trail-y", `${to.y}px`);
		img.style.setProperty("--image-trail-drop", `${container.clientHeight}px`);
		img.removeAttribute("data-active");
		// Reading layout between toggles restarts the CSS animation on a reused element.
		void img.offsetWidth;
		img.setAttribute("data-active", "");
	};

	const point = (event: PointerEvent) => {
		const box = container.getBoundingClientRect();
		return { x: event.clientX - box.left, y: event.clientY - box.top };
	};

	const onMove = (event: PointerEvent) => {
		if (reduced.matches) return;
		const p = point(event);
		if (!last) {
			last = p;
			return;
		}
		if (Math.hypot(p.x - last.x, p.y - last.y) < options.threshold) return;
		spawn(last, p);
		last = p;
	};
	const onLeave = () => {
		last = null;
	};

	const apply = () => {
		container.style.setProperty(
			"--image-trail-duration",
			`${Math.max(200, options.duration)}ms`,
		);
	};
	apply();

	container.addEventListener("pointerdown", onMove);
	container.addEventListener("pointermove", onMove);
	container.addEventListener("pointerleave", onLeave);
	container.addEventListener("pointercancel", onLeave);

	return {
		update(nextOptions) {
			options = nextOptions;
			apply();
		},
		destroy() {
			container.removeEventListener("pointerdown", onMove);
			container.removeEventListener("pointermove", onMove);
			container.removeEventListener("pointerleave", onLeave);
			container.removeEventListener("pointercancel", onLeave);
		},
	};
}
