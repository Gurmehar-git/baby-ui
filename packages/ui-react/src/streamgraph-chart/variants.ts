import { tv, type VariantProps } from "tailwind-variants";

// The variant is the stack offset: a flowing stream, a centred stack, or a flat baseline.
export const streamgraphChart = tv({
	slots: {
		layer:
			"fill-(--stream-color) stroke-background stroke-[0.75] transition-opacity duration-(--duration-fast) data-[dim=true]:opacity-30",
		label:
			"pointer-events-none fill-foreground/80 font-medium text-[11px] [paint-order:stroke] [stroke-linejoin:round] stroke-(--stream-color) stroke-[3]",
		cursor: "stroke-foreground/40",
		tick: "fill-muted-foreground text-[11px]",
	},
	variants: {
		variant: { wiggle: {}, silhouette: {}, zero: {} },
	},
	defaultVariants: { variant: "wiggle" },
});

export type StreamgraphVariant = NonNullable<
	VariantProps<typeof streamgraphChart>["variant"]
>;
