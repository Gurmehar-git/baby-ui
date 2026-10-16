import { tv, type VariantProps } from "tailwind-variants";

export const funnelChart = tv({
	slots: {
		cell: "cursor-pointer transition-opacity duration-(--duration-fast) ease-[cubic-bezier(0,0,0.58,1)]",
		ring: "[transform-box:fill-box] [transform-origin:center]",
		band: "fill-foreground/[0.03]",
		rule: "stroke-border",
		labels: "pointer-events-none absolute flex items-center",
		value: "whitespace-nowrap font-semibold text-foreground text-sm tabular-nums",
		percent:
			"rounded-full bg-foreground px-2.5 py-0.5 font-bold text-xs text-background tabular-nums shadow-sm",
		name: "line-clamp-2 max-w-full text-center font-medium text-muted-foreground text-xs [overflow-wrap:anywhere]",
		mark: "",
	},
	variants: {
		orientation: {
			horizontal: { labels: "flex-col justify-between py-[8%]" },
			vertical: { labels: "flex-row justify-between px-[8%]" },
		},
		labelLayout: {
			spread: {},
			grouped: { labels: "justify-center gap-1.5" },
		},
		pattern: {
			none: { mark: "hidden" },
			lines: { mark: "fill-none stroke-background/40 [stroke-width:2]" },
			dots: { mark: "fill-background/40" },
			grid: { mark: "fill-none stroke-background/40" },
		},
	},
	defaultVariants: { orientation: "horizontal", labelLayout: "spread", pattern: "none" },
});

export type FunnelOrientation = NonNullable<
	VariantProps<typeof funnelChart>["orientation"]
>;
export type FunnelLabelLayout = NonNullable<
	VariantProps<typeof funnelChart>["labelLayout"]
>;

export type FunnelPattern = NonNullable<VariantProps<typeof funnelChart>["pattern"]>;

/** One 8px tile per pattern, drawn over the stage colour on the innermost ring. */
export const FUNNEL_PATTERN_TILE: Record<FunnelPattern, string> = {
	none: "",
	lines: "M0,8L8,0M-2,2L2,-2M6,10L10,6",
	dots: "M2.5,4a1.5,1.5 0 1,0 3,0a1.5,1.5 0 1,0 -3,0",
	grid: "M0,0.5H8M0.5,0V8",
};

export const funnelEdges = tv({
	base: "",
	variants: {
		edges: { curved: "[stroke-linejoin:round]", straight: "[stroke-linejoin:miter]" },
	},
	defaultVariants: { edges: "curved" },
});

export type FunnelEdges = NonNullable<VariantProps<typeof funnelEdges>["edges"]>;
