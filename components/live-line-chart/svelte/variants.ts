import { tv, type VariantProps } from "tailwind-variants";

export const liveLine = tv({
	slots: {
		series: "transition-opacity duration-[400ms] ease-[cubic-bezier(0.42,0,0.58,1)]",
		line: "fill-none [stroke-linecap:round]",
		guide: "[stroke-dasharray:4_4]",
		tip: "transition-opacity duration-300 ease-[cubic-bezier(0.42,0,0.58,1)]",
		dot: "fill-current stroke-background [stroke-width:2]",
		ring: "fill-none stroke-current [stroke-width:1.5]",
		badge: "fill-popover/95 stroke-border",
		badgeText: "fill-popover-foreground font-medium font-mono text-xs tabular-nums",
		arrow: "fill-current",
	},
	variants: {
		curve: {
			monotone: { line: "[stroke-linejoin:round]" },
			linear: { line: "[stroke-linejoin:bevel]" },
			step: { line: "[stroke-linejoin:miter]" },
		},
		momentum: {
			up: { tip: "text-chart-positive" },
			down: { tip: "text-chart-negative" },
			flat: { tip: "text-muted-foreground" },
		},
		tint: {
			dot: { series: "text-(--series)" },
			line: {},
		},
	},
	compoundVariants: [
		{ tint: "line", momentum: "up", class: { series: "text-chart-positive" } },
		{ tint: "line", momentum: "down", class: { series: "text-chart-negative" } },
		{ tint: "line", momentum: "flat", class: { series: "text-muted-foreground" } },
	],
	defaultVariants: { curve: "monotone", momentum: "flat", tint: "dot" },
});

export type LiveLineCurve = NonNullable<VariantProps<typeof liveLine>["curve"]>;
export type LiveMomentum = NonNullable<VariantProps<typeof liveLine>["momentum"]>;
export type LiveLineTint = NonNullable<VariantProps<typeof liveLine>["tint"]>;

export const liveAxis = tv({
	slots: {
		tick: "fill-muted-foreground text-xs tabular-nums",
		timeLabel:
			"transition-opacity duration-(--duration-fast) ease-[cubic-bezier(0,0,0.58,1)]",
	},
	variants: {
		position: {
			left: { tick: "[text-anchor:end]" },
			right: { tick: "[text-anchor:start]" },
		},
	},
	defaultVariants: { position: "left" },
});

export type LiveAxisPosition = NonNullable<VariantProps<typeof liveAxis>["position"]>;
