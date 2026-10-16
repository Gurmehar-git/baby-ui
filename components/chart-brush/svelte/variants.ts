import { tv, type VariantProps } from "tailwind-variants";

export const chartBrush = tv({
	slots: {
		root: "relative w-full shrink-0 touch-none select-none rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
		svg: "absolute inset-0 block overflow-visible",
		track: "fill-foreground/[0.03]",
		preview: "fill-none [stroke-linejoin:round] [stroke-width:1.5]",
		area: "stroke-none",
		shade: "fill-background/70",
		selection: "cursor-grab fill-transparent stroke-border-strong active:cursor-grabbing",
		handle: "fill-foreground/60",
		hit: "cursor-ew-resize fill-transparent",
	},
	variants: {
		variant: {
			line: { area: "hidden" },
			area: { preview: "opacity-60" },
		},
	},
	defaultVariants: { variant: "area" },
});

export type ChartBrushVariant = NonNullable<VariantProps<typeof chartBrush>["variant"]>;
