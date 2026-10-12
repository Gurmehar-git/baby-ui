import { tv, type VariantProps } from "tailwind-variants";

export const chartMarkers = tv({
	slots: {
		group: "-translate-x-1/2 -translate-y-1/2 absolute z-20",
		disc: "relative grid size-full place-items-center overflow-hidden rounded-full font-medium text-foreground outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-ring",
		badge:
			"-top-2 -right-2 pointer-events-none absolute grid h-[18px] min-w-[18px] place-items-center rounded-full bg-foreground px-1 font-semibold text-xs text-background tabular-nums",
		fan: "pointer-events-none absolute top-1/2 left-1/2 size-full",
		fanItem: "-translate-x-1/2 -translate-y-1/2 absolute top-0 left-0",
		dot: "-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 size-1/2 rounded-full bg-border-strong",
		guide: "fill-none stroke-border-strong [stroke-dasharray:4_4] [stroke-linecap:round]",
		tooltip: "mt-2 grid gap-2 border-border border-t pt-2",
		tooltipRow: "flex items-start gap-2 text-xs",
		tooltipTitle: "font-medium text-foreground",
		tooltipText: "text-muted-foreground",
	},
	variants: {
		size: {
			sm: { group: "size-[22px] text-xs" },
			default: { group: "size-7 text-sm" },
			lg: { group: "size-[34px] text-base" },
		},
		appearance: {
			solid: { disc: "border border-border-strong bg-card shadow-md" },
			outline: { disc: "border-2 border-foreground/50 bg-background" },
		},
	},
	defaultVariants: { size: "default", appearance: "solid" },
});

export type ChartMarkerSize = NonNullable<VariantProps<typeof chartMarkers>["size"]>;
export type ChartMarkerAppearance = NonNullable<
	VariantProps<typeof chartMarkers>["appearance"]
>;

export const MARKER_PX: Record<ChartMarkerSize, number> = { sm: 22, default: 28, lg: 34 };
