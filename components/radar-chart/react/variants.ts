import { tv, type VariantProps } from "tailwind-variants";

export const radar = tv({
	slots: {
		ring: "fill-none stroke-border-strong",
		axis: "stroke-border-strong",
		level: "fill-muted-foreground text-xs tabular-nums",
		label: "fill-muted-foreground font-medium text-xs",
		area: "cursor-pointer transition-opacity duration-(--duration-fast) ease-[cubic-bezier(0,0,0.58,1)]",
		shape:
			"[stroke-linejoin:round] transition-[fill-opacity,stroke-width] duration-(--duration-base) ease-[cubic-bezier(0,0,0.58,1)]",
		marker:
			"stroke-background transition-transform duration-(--duration-base) ease-[cubic-bezier(0,0,0.58,1)]",
	},
	variants: {
		grid: {
			polygon: { ring: "[stroke-linejoin:miter]" },
			circle: { ring: "[stroke-linejoin:round]" },
		},
		variant: {
			filled: { shape: "fill-current" },
			outline: { shape: "fill-none" },
		},
	},
	defaultVariants: { grid: "polygon", variant: "filled" },
});

export type RadarGridShape = NonNullable<VariantProps<typeof radar>["grid"]>;
export type RadarVariant = NonNullable<VariantProps<typeof radar>["variant"]>;
