import { tv, type VariantProps } from "tailwind-variants";

export const usageCard = tv({
	slots: {
		root: "w-full gap-0 overflow-hidden py-0",
		header: "px-5 pt-4 pb-1",
		title: "font-medium text-foreground text-sm",
		description: "mt-0.5 text-muted-foreground text-xs",
		body: "px-5 pb-5",
		// Overrides ChartContainer's own root: flex-direction only, so its flex-1/aspect sizing
		// chain to RingChart's plot stays intact (a wrapper div around RingChart breaks it).
		chart: "",
		// aspect-square is self-sizing from width alone, so RingChart renders even if the flex
		// row above never resolves a height.
		plot: "aspect-square shrink-0",
		legend: "min-w-0 flex-1 gap-2.5",
		headline: "flex items-baseline gap-1.5 tabular-nums",
		figure: "font-semibold text-foreground",
		caption: "min-w-0 truncate text-muted-foreground text-sm",
		track: "relative mt-3 h-2.5 w-full touch-pan-y rounded-full bg-muted",
		segment:
			"absolute inset-y-0 origin-left rounded-full bg-(--meter-color) transition-[left,width,transform,opacity] duration-500 ease-(--ease-ui-out) starting:scale-x-0 data-[dim=true]:opacity-35 motion-reduce:transition-none",
		hatch:
			"pointer-events-none absolute inset-y-0 right-0 rounded-r-full bg-[repeating-linear-gradient(135deg,color-mix(in_oklch,var(--background)_75%,transparent)_0_2px,transparent_2px_6px)] transition-[left,opacity] duration-300 ease-(--ease-ui-out) motion-reduce:transition-none",
		marker:
			"-inset-y-1 pointer-events-none absolute w-0.5 -translate-x-1/2 rounded-full bg-foreground transition-[left,opacity] duration-500 ease-(--ease-ui-out) motion-reduce:transition-none",
		items: "mt-4 flex flex-wrap gap-x-4 gap-y-2",
		item: "inline-flex items-center gap-1.5 rounded-sm text-muted-foreground text-xs outline-none transition-[color,opacity] duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-[active=true]:text-foreground data-[dim=true]:opacity-50",
		swatch: "size-2 shrink-0 rounded-full bg-(--meter-color)",
		amount: "text-foreground tabular-nums",
		srOnly: "sr-only",
	},
	variants: {
		layout: {
			side: {
				chart: "flex-row items-center",
				plot: "max-w-36",
				legend: "flex-col items-start",
			},
			stacked: {
				chart: "flex-col items-center",
				plot: "mx-auto max-w-52",
				legend: "justify-center",
			},
			/** One bar against a shared `limit`, with the free or over share as its own legend item. */
			meter: { body: "pt-2" },
		},
	},
	defaultVariants: { layout: "side" },
});

export type UsageCardLayout = NonNullable<VariantProps<typeof usageCard>["layout"]>;
