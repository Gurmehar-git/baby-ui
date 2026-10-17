import { tv, type VariantProps } from "tailwind-variants";

export const sunburstChart = tv({
	slots: {
		breadcrumb: "flex min-h-7 flex-wrap items-center gap-1 text-xs",
		crumb:
			"rounded-md px-1.5 py-1 font-medium text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:text-foreground",
		separator: "text-muted-foreground/60",
		segment: "transition-opacity duration-[160ms] ease-[cubic-bezier(0,0,0.58,1)]",
		path: "stroke-background [stroke-linejoin:round] [stroke-width:1px]",
		label:
			"pointer-events-none fill-foreground stroke-background font-semibold text-xs [paint-order:stroke] [stroke-linejoin:round] [stroke-width:2.5px]",
		hub: "stroke-background [stroke-width:1px]",
		center:
			"pointer-events-none absolute flex flex-col items-center justify-center overflow-hidden text-center",
		value: "font-semibold text-foreground text-sm tabular-nums",
		caption: "max-w-full truncate px-1 text-muted-foreground text-xs",
	},
	variants: {
		variant: {
			sunburst: { hub: "fill-background", center: "hidden" },
			donut: { hub: "fill-card" },
		},
	},
	defaultVariants: { variant: "sunburst" },
});

export type SunburstVariant = NonNullable<VariantProps<typeof sunburstChart>["variant"]>;

/** Donut keeps a hub with the focus total even at the root. */
export const SUNBURST_HUB: Record<SunburstVariant, boolean> = {
	sunburst: false,
	donut: true,
};
