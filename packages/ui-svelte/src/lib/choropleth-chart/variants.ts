import { tv, type VariantProps } from "tailwind-variants";

export const choroplethChart = tv({
	slots: {
		svg: "absolute inset-0 block touch-none",
		feature: "stroke-background [stroke-width:0.5] [vector-effect:non-scaling-stroke]",
		graticule:
			"fill-none stroke-border [stroke-width:0.5] [vector-effect:non-scaling-stroke]",
		legend: "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground",
		swatch: "size-2.5 shrink-0 rounded-[3px]",
		scale: "flex items-center gap-1.5 tabular-nums",
		controls: "absolute top-2 right-2 z-10 flex flex-col gap-1",
		control:
			"grid size-7 place-items-center rounded-md border border-border bg-card/80 text-foreground text-sm backdrop-blur transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40",
	},
	variants: {
		projection: {
			mercator: {},
			equalEarth: {},
			naturalEarth: {},
		},
		zoomable: {
			true: { svg: "cursor-grab active:cursor-grabbing" },
			false: {},
		},
	},
	defaultVariants: { projection: "equalEarth", zoomable: false },
});

export type ChoroplethProjection = NonNullable<
	VariantProps<typeof choroplethChart>["projection"]
>;
