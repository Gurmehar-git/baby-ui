import { tv, type VariantProps } from "tailwind-variants";

export const sparkline = tv({
	slots: {
		root: "m-0 grid min-w-0 gap-3 text-foreground",
		caption: "flex min-w-0 items-baseline gap-2 text-muted-foreground text-sm",
		label: "min-w-0 flex-1 truncate",
		value: "font-semibold text-foreground tabular-nums",
		aside: "tabular-nums",
		plot: "relative min-w-0 touch-pan-y rounded-sm outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-8 focus-visible:ring-offset-background",
		chart: "block h-auto w-full overflow-visible",
		baseline: "stroke-border",
		area: "fill-current/9 stroke-none",
		line: "fill-none stroke-current stroke-[2.5] transition-[stroke] duration-(--duration-base) [stroke-dasharray:1] [stroke-linecap:round] [stroke-linejoin:round]",
		trail:
			"fill-none stroke-border-strong stroke-[2.5] opacity-0 transition-opacity duration-(--duration-fast) [stroke-linecap:round] [stroke-linejoin:round] data-[on=true]:opacity-100",
		cursor:
			"stroke-border-strong opacity-0 transition-opacity duration-(--duration-fast) data-[on=true]:opacity-100",
		dot: "fill-none stroke-current stroke-0 opacity-0 transition-[opacity,stroke-width] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) [stroke-linecap:round] data-[landed=true]:stroke-[7] data-[landed=true]:opacity-100 data-[scrub=true]:stroke-[10]",
	},
	variants: {
		variant: {
			default: { aside: "text-primary", chart: "text-primary" },
			success: { aside: "text-success-strong", chart: "text-success" },
			warning: { aside: "text-warning-strong", chart: "text-warning" },
			destructive: { aside: "text-destructive", chart: "text-destructive" },
		},
	},
	defaultVariants: { variant: "default" },
});

export type SparklineVariant = NonNullable<VariantProps<typeof sparkline>["variant"]>;
