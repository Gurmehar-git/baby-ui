import { tv, type VariantProps } from "tailwind-variants";

export const heatmapChart = tv({
	slots: {
		cell: "cursor-pointer outline-none",
		overlay: "pointer-events-none fill-foreground/10",
		axis: "fill-muted-foreground text-xs",
		active: "pointer-events-none fill-none stroke-foreground",
		legend: "flex items-center gap-1.5 text-muted-foreground text-xs",
		swatch:
			"size-3 shrink-0 cursor-pointer rounded-[3px] outline-none transition-opacity duration-[220ms] focus-visible:ring-2 focus-visible:ring-ring aria-pressed:ring-1 aria-pressed:ring-foreground/50",
	},
	variants: {
		shape: {
			square: {},
			rounded: {},
			circle: {},
		},
		align: {
			start: { legend: "justify-start" },
			center: { legend: "justify-center" },
			end: { legend: "justify-end" },
		},
	},
	defaultVariants: { shape: "rounded", align: "end" },
});

export type HeatmapShape = NonNullable<VariantProps<typeof heatmapChart>["shape"]>;
export type HeatmapLegendAlign = NonNullable<VariantProps<typeof heatmapChart>["align"]>;

/** Corner radius as a share of the cell size. */
export const SHAPE_RADIUS: Record<HeatmapShape, number> = {
	square: 0,
	rounded: 0.2,
	circle: 0.5,
};

/** Empty days are a faint foreground wash; levels 1 to 4 take scale steps 2 to 5. */
export const levelFill = (level: number) =>
	level === 0
		? "color-mix(in oklch, var(--foreground) 7%, transparent)"
		: `var(--chart-scale-${Math.min(5, level + 1)})`;
