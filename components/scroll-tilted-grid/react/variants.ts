import { tv, type VariantProps } from "tailwind-variants";

export const scrollTiltedGrid = tv({
	slots: {
		root: "@container relative w-full",
		grid: "mx-auto grid w-full max-w-5xl grid-cols-2 items-start gap-x-4 gap-y-16 px-4 @xl:gap-x-10 @xl:gap-y-28 @xl:px-10 @3xl:gap-x-16",
		figure: "m-0 [view-timeline-name:--scroll-tilted]",
		tile: "scroll-tilted-tile relative w-full overflow-hidden border border-border bg-muted shadow-2xl",
		image: "scroll-tilted-image block size-full object-cover",
		sheen:
			"pointer-events-none absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-foreground/10",
	},
	variants: {
		/** Height of the component's own scroll box; `auto` rides the nearest scrolling ancestor. */
		size: {
			sm: {
				root: "h-96 overflow-y-auto overscroll-contain rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
				grid: "py-48",
			},
			default: {
				root: "h-[32rem] overflow-y-auto overscroll-contain rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
				grid: "py-64",
			},
			lg: {
				root: "h-[40rem] overflow-y-auto overscroll-contain rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
				grid: "py-80",
			},
			auto: { root: "overflow-hidden", grid: "py-[18vh]" },
		},
		aspect: {
			portrait: { tile: "aspect-[4/5]" },
			square: { tile: "aspect-square" },
			landscape: { tile: "aspect-[4/3]" },
		},
		radius: {
			none: { tile: "rounded-none" },
			sm: { tile: "rounded-sm" },
			md: { tile: "rounded-md" },
			lg: { tile: "rounded-2xl" },
		},
		side: {
			left: {},
			right: { figure: "pt-12 @xl:pt-24" },
		},
	},
	defaultVariants: { size: "default", aspect: "portrait", radius: "sm", side: "left" },
});

export type ScrollTiltedGridSize = NonNullable<
	VariantProps<typeof scrollTiltedGrid>["size"]
>;
export type ScrollTiltedGridAspect = NonNullable<
	VariantProps<typeof scrollTiltedGrid>["aspect"]
>;
export type ScrollTiltedGridRadius = NonNullable<
	VariantProps<typeof scrollTiltedGrid>["radius"]
>;

export interface ScrollTiltedGridImage {
	src: string;
	alt: string;
}

/** The element whose scrolling drives `el`: itself when it scrolls, else the nearest ancestor. */
export function scrollPort(el: HTMLElement): HTMLElement | null {
	for (let node: HTMLElement | null = el; node; node = node.parentElement) {
		const overflow = getComputedStyle(node).overflowY;
		if (overflow === "auto" || overflow === "scroll") return node;
	}
	return null;
}

/**
 * Without CSS view timelines, writes each tile's view progress (0 entering at the bottom, 1
 * leaving at the top) to `--scroll-tilted-progress`, which scrubs the paused keyframes.
 */
export function scrubTiles(root: HTMLElement): () => void {
	if (typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()"))
		return () => {};
	const port = scrollPort(root);
	let frame = 0;
	const update = () => {
		frame = 0;
		const view = port?.getBoundingClientRect() ?? { top: 0, height: window.innerHeight };
		for (const tile of root.querySelectorAll<HTMLElement>("[data-scroll-tilted-tile]")) {
			const rect = tile.getBoundingClientRect();
			const progress = (view.top + view.height - rect.top) / (view.height + rect.height);
			tile.style.setProperty(
				"--scroll-tilted-progress",
				String(Math.min(1, Math.max(0, progress))),
			);
		}
	};
	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(update);
	};
	const target: HTMLElement | Window = port ?? window;
	const resize = new ResizeObserver(schedule);
	update();
	target.addEventListener("scroll", schedule, { passive: true });
	resize.observe(root);
	return () => {
		target.removeEventListener("scroll", schedule);
		resize.disconnect();
		cancelAnimationFrame(frame);
	};
}
