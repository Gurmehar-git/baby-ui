import { tv, type VariantProps } from "tailwind-variants";

// The root is the size container, so slide width, centring padding and controls share one measure.
export const carousel = tv({
	slots: {
		root: "@container grid w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-4 [--carousel-gap:1rem]",
		// Only the x axis clips, so focus rings inside the active slide are never cut at top or bottom.
		viewport:
			"relative min-w-0 cursor-grab touch-pan-y overflow-x-clip overflow-y-visible rounded-xl outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background data-dragging:cursor-grabbing",
		// Before hydration the start slide is placed with CSS, so nothing moves on first paint.
		track:
			"flex select-none gap-(--carousel-gap) px-[calc((100cqw-var(--carousel-slide))/2)] [&:not([data-measured])]:translate-x-[calc(var(--carousel-start)*-1*(var(--carousel-slide)+var(--carousel-gap)))]",
		slide:
			"w-(--carousel-slide) min-w-0 flex-[0_0_var(--carousel-slide)] origin-center will-change-[transform,opacity] [&_img]:[-webkit-user-drag:none]",
		controls:
			"flex min-w-0 items-center gap-2 px-[calc((100cqw-var(--carousel-slide))/2)] @max-[340px]:gap-1 @max-[340px]:px-[max(0px,calc((100cqw-var(--carousel-slide))/2-0.5rem))]",
		tabs: "flex min-w-0 items-center",
		tab: "group/dot grid h-8 flex-none cursor-pointer place-items-center rounded-full px-[5px] outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-ring @max-[340px]:px-1",
		// The fill fades in as the pill forms; the drain covers it from the right while rotation runs.
		dot: "relative block h-1.5 w-[calc(6px+16px*var(--emphasis,0))] overflow-hidden rounded-full bg-border-strong transition-colors duration-(--duration-fast) group-hover/dot:bg-muted-foreground motion-reduce:transition-none",
		dotFill: "absolute inset-0 bg-foreground opacity-[var(--emphasis,0)]",
		dotDrain: "absolute inset-0 origin-right scale-x-[var(--drain,0)] bg-border-strong",
		arrows: "ml-auto flex flex-none gap-2 @max-[340px]:gap-1",
		control: "rounded-full aria-disabled:cursor-default aria-disabled:opacity-50",
		play: "",
		// Button wraps children in a flex face, so the two icons stack in their own cell.
		iconStack: "grid place-items-center",
		icon: "col-start-1 row-start-1 size-4 transition-[opacity,scale,filter] duration-(--duration-fast) ease-[var(--ease-ui-out)] data-[on=false]:scale-60 data-[on=false]:opacity-0 data-[on=false]:blur-[2px] motion-reduce:transition-none",
	},
	variants: {
		projection: {
			linear: {},
			concave: {
				viewport:
					"h-[min(42cqw,22rem)] rounded-3xl border border-border/60 bg-muted/20 [clip-path:inset(0_round_1.5rem)]",
				track: "relative h-full px-0",
			},
			convex: {
				viewport:
					"h-[min(42cqw,22rem)] rounded-3xl border border-border/60 bg-muted/20 [clip-path:inset(0_round_1.5rem)]",
				track: "relative h-full px-0",
			},
		},
		variant: {
			default: {},
			flat: {},
			// Controls float over the slide; `contents` lets each one position against the root.
			inset: {
				root: "relative",
				controls: "contents",
				tabs: "absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-background/75 px-1 shadow-sm backdrop-blur-md",
				arrows:
					"pointer-events-none absolute inset-x-[calc((100cqw-var(--carousel-slide))/2+0.5rem)] top-1/2 z-10 ml-0 -translate-y-1/2 justify-between [&>*]:pointer-events-auto",
				play: "absolute top-3 right-[calc((100cqw-var(--carousel-slide))/2+0.5rem)] z-10",
			},
		},
		size: {
			sm: { root: "[--carousel-slide:min(70cqw,260px)]" },
			default: { root: "[--carousel-slide:min(80cqw,340px)]" },
			lg: { root: "[--carousel-slide:min(86cqw,480px)]" },
		},
	},
	defaultVariants: { projection: "linear", variant: "default", size: "default" },
});

export type CarouselProjection = NonNullable<VariantProps<typeof carousel>["projection"]>;
export type CarouselVariant = NonNullable<VariantProps<typeof carousel>["variant"]>;
export type CarouselSize = NonNullable<VariantProps<typeof carousel>["size"]>;
/** Which controls render under (or over) the slides. */
export type CarouselControls = "full" | "dots" | "arrows" | "none";
