import { tv, type VariantProps } from "tailwind-variants";

export const timelineScale = tv({
	slots: {
		root: "group/timeline-scale relative grid min-w-0 text-foreground [--timeline-item-size:18rem]",
		header:
			"z-2 flex min-w-0 shrink-0 items-center justify-between gap-3 bg-background px-4 py-3 text-muted-foreground text-xs tabular-nums",
		viewport: [
			"min-w-0 overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]",
			"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
		],
		track: "relative flex min-w-0 list-none p-0",
		rail: "pointer-events-none absolute border-dashed border-border-strong",
		item: "group/timeline-scale-item relative shrink-0 snap-center",
		itemTrigger: [
			"relative grid w-full cursor-pointer gap-3 rounded-xl text-left outline-none",
			"transition-[scale,opacity,background-color] duration-(--duration-fast) ease-(--ease-out-quad)",
			"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
			"active:scale-(--press-scale) motion-reduce:transition-none",
		],
		tick: "pointer-events-none absolute z-1 block bg-border-strong transition-[scale,background-color] duration-(--duration-fast) group-data-[active]/timeline-scale-item:bg-foreground",
		date: "relative z-1 whitespace-nowrap text-muted-foreground text-xs tabular-nums",
		year: "pointer-events-none absolute font-medium text-foreground/[0.06] leading-none tracking-tighter tabular-nums",
		content: "relative z-1 min-w-0",
	},
	variants: {
		orientation: {
			horizontal: {
				root: "grid-cols-[minmax(0,1fr)_auto] items-stretch",
				header: "col-span-2",
				viewport:
					"col-start-1 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory touch-pan-y",
				track:
					"w-max items-start gap-5 py-5 [padding-inline:max(--spacing(4),calc(50%-var(--timeline-item-size)/2))]",
				rail: "inset-x-0 top-13 border-t",
				item: "w-(--timeline-item-size)",
				itemTrigger:
					"min-h-48 origin-center bg-background p-4 opacity-45 scale-90 hover:opacity-75 group-data-[active]/timeline-scale-item:opacity-100 group-data-[active]/timeline-scale-item:scale-100",
				tick: "top-8 left-1/2 h-8 w-px -translate-x-1/2 -translate-y-1/2 scale-y-65 group-data-[active]/timeline-scale-item:scale-y-100",
				date: "pt-10",
				year: "top-2 left-1/2 -translate-x-1/2 text-6xl",
			},
			// Below @md the date stacks over the content so neither column squeezes into one-word lines.
			vertical: {
				root: "@container/timeline-scale grid-cols-[minmax(0,1fr)]",
				header: "border-b",
				viewport: "overflow-y-auto",
				track: "flex-col gap-0 py-3",
				rail: "inset-y-0 left-6 border-l @md/timeline-scale:left-[8.75rem]",
				item: "w-full",
				itemTrigger: [
					"grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-1 rounded-lg py-3 pr-4 pl-11 opacity-70",
					"@md/timeline-scale:grid-cols-[7rem_minmax(0,1fr)] @md/timeline-scale:pl-4",
					"hover:bg-foreground/[0.04] group-data-[active]/timeline-scale-item:bg-foreground/[0.04] group-data-[active]/timeline-scale-item:opacity-100",
				],
				tick: "top-5 left-6 h-px w-3 -translate-x-1/2 scale-x-65 group-data-[active]/timeline-scale-item:scale-x-100 @md/timeline-scale:left-[8.75rem]",
				date: "leading-5 @md/timeline-scale:col-start-1 @md/timeline-scale:row-start-1 @md/timeline-scale:text-right",
				year: "hidden",
				content: "@md/timeline-scale:col-start-2 @md/timeline-scale:row-start-1",
			},
		},
		variant: {
			default: {},
			card: {
				root: "overflow-hidden rounded-2xl border bg-background shadow-xs",
				header: "border-b",
				itemTrigger: "border bg-card shadow-xs",
			},
		},
	},
	defaultVariants: { orientation: "horizontal", variant: "default" },
});

export type TimelineOrientation = NonNullable<
	VariantProps<typeof timelineScale>["orientation"]
>;
export type TimelineScaleVariant = NonNullable<
	VariantProps<typeof timelineScale>["variant"]
>;
