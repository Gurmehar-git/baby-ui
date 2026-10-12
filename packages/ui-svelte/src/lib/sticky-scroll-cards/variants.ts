import { tv, type VariantProps } from "tailwind-variants";

export const stickyScrollCards = tv({
	slots: {
		root: "@container relative w-full",
		stack:
			"relative flex w-full flex-col items-center [view-timeline-name:--sticky-scroll]",
		hint: "pointer-events-none absolute top-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3",
		hintText: "text-xs font-medium uppercase tracking-widest text-muted-foreground",
		hintLine: "h-12 w-px bg-gradient-to-b from-foreground/30 to-transparent",
		section: "sticky top-0 grid w-full place-items-center",
		card: "sticky-scroll-card relative m-0 origin-top rotate-[var(--sticky-scroll-rotate)] overflow-hidden motion-reduce:rotate-none rounded-md border border-border bg-card text-card-foreground shadow-xl",
		image: "block h-[clamp(160px,42cqw,290px)] w-[min(78cqw,460px)] object-cover",
		caption: "",
	},
	variants: {
		/** Height of the component's own scroll box; `auto` rides the nearest scrolling ancestor. */
		size: {
			sm: {
				root: "h-96 overflow-y-auto overscroll-contain rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
				stack: "pt-48 pb-96",
				section: "h-96",
			},
			default: {
				root: "h-[32rem] overflow-y-auto overscroll-contain rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
				stack: "pt-64 pb-[32rem]",
				section: "h-[32rem]",
			},
			lg: {
				root: "h-[40rem] overflow-y-auto overscroll-contain rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
				stack: "pt-80 pb-[40rem]",
				section: "h-[40rem]",
			},
			auto: { stack: "pt-[50svh] pb-[100svh]", section: "h-svh" },
		},
		/** A framed print with a caption strip, or a full-bleed photo with the caption on top. */
		variant: {
			polaroid: {
				card: "p-2.5 pb-0",
				image: "rounded-sm",
				caption:
					"grid h-11 place-items-center px-4 text-xs font-medium uppercase tracking-widest text-muted-foreground",
			},
			plain: {
				caption:
					"absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/85 to-transparent px-4 pt-10 pb-3 text-sm font-medium text-foreground",
			},
		},
	},
	defaultVariants: { size: "default", variant: "polaroid" },
});

export type StickyScrollCardsSize = NonNullable<
	VariantProps<typeof stickyScrollCards>["size"]
>;
export type StickyScrollCardsVariant = NonNullable<
	VariantProps<typeof stickyScrollCards>["variant"]
>;

export interface StickyScrollCardItem {
	title: string;
	src: string;
	/** Image alt text; defaults to the title. */
	alt?: string;
}

const TILT_PATTERN = [-1.25, 0.85, -0.65, 1.35, -0.9];

/** Per-card scrub start (0 to 1 of the stack's scroll), resting scale, tilt and offset. */
export function cardLayout(index: number, total: number, tilt: number) {
	return {
		start: total > 1 ? index / (total + 1) : 0,
		rest: Math.max(0.56, 1 - (total - index - 1) * 0.095),
		rotate: (TILT_PATTERN[index % TILT_PATTERN.length] ?? 0) * tilt,
		offset: (index - (total - 1) / 2) * 20,
	};
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
 * Without CSS view timelines, writes the stack's progress from "start start" to "end end" to
 * `--sticky-scroll-progress`, which scrubs each card's paused keyframes.
 */
export function scrubStack(root: HTMLElement, stack: HTMLElement): () => void {
	if (typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()"))
		return () => {};
	const port = scrollPort(root);
	let frame = 0;
	const update = () => {
		frame = 0;
		const view = port?.getBoundingClientRect() ?? { top: 0, height: window.innerHeight };
		const rect = stack.getBoundingClientRect();
		const progress = (view.top - rect.top) / Math.max(1, rect.height - view.height);
		stack.style.setProperty(
			"--sticky-scroll-progress",
			String(Math.min(1, Math.max(0, progress))),
		);
	};
	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(update);
	};
	const target: HTMLElement | Window = port ?? window;
	const resize = new ResizeObserver(schedule);
	update();
	target.addEventListener("scroll", schedule, { passive: true });
	resize.observe(stack);
	return () => {
		target.removeEventListener("scroll", schedule);
		resize.disconnect();
		cancelAnimationFrame(frame);
	};
}
