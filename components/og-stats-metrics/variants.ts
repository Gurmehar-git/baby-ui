import { tv, type VariantProps } from "tailwind-variants";

export const ogStatsMetrics = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] flex-col justify-between overflow-hidden bg-background p-[88px] font-sans text-foreground",
		area: "absolute right-0 bottom-0",
		header: "relative flex items-center justify-between gap-8",
		brand: "flex min-w-0 items-center gap-4 font-semibold text-[24px] tracking-tight",
		logo: "h-10 w-10 shrink-0 rounded-xl object-cover",
		site: "line-clamp-1",
		period: "shrink-0 font-medium text-[22px] text-muted-foreground",
		body: "relative mt-auto flex flex-col",
		label: "line-clamp-1 max-w-[900px] font-semibold text-[24px]",
		hero: "mt-2 flex items-center gap-7",
		value:
			"line-clamp-1 max-w-[760px] font-bold font-heading text-[168px] leading-[1] tracking-tighter tabular-nums",
		delta:
			"flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-[30px] tabular-nums",
		deltaIcon: "shrink-0",
		deltaText: "line-clamp-1 max-w-[260px]",
		headline:
			"mt-8 line-clamp-2 max-w-[680px] font-semibold text-[36px] leading-[1.15] tracking-tight",
		secondary:
			"mt-5 line-clamp-1 max-w-[680px] font-medium text-[24px] text-muted-foreground tabular-nums",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
		tone: {
			chart: { area: "text-chart-1", label: "text-chart-1" },
			primary: { area: "text-primary", label: "text-primary" },
			neutral: { area: "text-foreground/35", label: "text-muted-foreground" },
		},
		trend: {
			up: {
				delta:
					"bg-[color-mix(in_oklch,var(--chart-positive)_16%,var(--background))] text-chart-positive",
			},
			down: {
				delta:
					"bg-[color-mix(in_oklch,var(--chart-negative)_16%,var(--background))] text-chart-negative",
			},
		},
	},
	defaultVariants: { mode: "light", tone: "neutral", trend: "up" },
});

export type OgStatsMetricsMode = NonNullable<VariantProps<typeof ogStatsMetrics>["mode"]>;
export type OgStatsMetricsTone = NonNullable<VariantProps<typeof ogStatsMetrics>["tone"]>;
export type OgStatsMetricsTrend = NonNullable<
	VariantProps<typeof ogStatsMetrics>["trend"]
>;
