import { tv, type VariantProps } from "tailwind-variants";

export const overviewCard = tv({
	slots: {
		root: "w-full gap-0 overflow-hidden py-0",
		header: "flex flex-wrap items-start justify-between gap-3 px-5 pt-4 pb-1",
		title: "font-medium text-muted-foreground text-sm",
		description: "mt-0.5 text-muted-foreground text-xs",
		body: "flex flex-col gap-3 px-5 pb-0",
		headline: "flex flex-wrap items-baseline gap-2",
		label: "text-muted-foreground text-xs",
		chart: "-mx-5 relative",
	},
	variants: {
		size: {
			default: { chart: "h-56" },
			lg: { chart: "h-80" },
		},
		/** A bare line needs headroom so its stroke is not clipped at the card edge. */
		chart: {
			area: { chart: "pt-0" },
			line: { chart: "pt-2" },
		},
	},
	defaultVariants: { size: "default", chart: "area" },
});

export type OverviewCardSize = NonNullable<VariantProps<typeof overviewCard>["size"]>;
export type OverviewCardChart = NonNullable<VariantProps<typeof overviewCard>["chart"]>;
