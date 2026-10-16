import { tv, type VariantProps } from "tailwind-variants";

export const ogPricing = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] items-stretch gap-[64px] overflow-hidden bg-background p-[72px] font-sans text-foreground",
		ledger:
			"absolute inset-0 bg-[linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:100%_45px]",
		glow: "absolute -right-[80px] top-[40px] h-[560px] w-[620px] rounded-full opacity-50 blur-[130px]",
		left: "relative flex w-[512px] shrink-0 flex-col",
		brand: "flex items-center gap-4 font-semibold text-[28px] tracking-tight",
		logo: "h-12 w-12 rounded-xl object-cover",
		plan: "mt-auto line-clamp-1 font-semibold text-[40px] tracking-tight",
		priceRow: "mt-3 flex items-end gap-6",
		price:
			"line-clamp-1 min-w-0 font-bold font-heading text-[168px] leading-[0.95] tracking-tighter",
		priceMeta: "mb-5 flex flex-col gap-1 text-[30px] text-muted-foreground",
		compare: "line-through",
		period: "font-medium",
		note: "mt-6 line-clamp-2 text-[24px] text-muted-foreground leading-snug",
		card: "relative flex w-[480px] flex-col gap-7 self-center rounded-[36px] bg-card p-12",
		popular:
			"absolute -top-[26px] left-12 flex items-center gap-2 rounded-full px-5 py-2 font-semibold text-[20px]",
		star: "h-5 w-5",
		feature: "flex items-center gap-5",
		tick: "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
		check: "h-6 w-6",
		featureText: "line-clamp-2 font-medium text-[26px] leading-snug",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
		tone: {
			chart: {
				glow: "bg-chart-1",
				plan: "text-chart-1",
				popular: "bg-chart-1 text-background",
				tick: "bg-chart-1 text-background",
			},
			primary: {
				glow: "bg-primary",
				plan: "text-primary",
				popular: "bg-primary text-primary-foreground",
				tick: "bg-primary text-primary-foreground",
			},
			neutral: {
				glow: "bg-muted-foreground",
				plan: "text-muted-foreground",
				popular: "bg-muted-foreground text-background",
				tick: "border border-border bg-muted text-foreground",
			},
		},
		popular: {
			true: { card: "border-[3px] [box-shadow:0_32px_96px_-12px_rgb(0_0_0/0.35)]" },
			false: { glow: "hidden", card: "border border-border" },
		},
	},
	compoundVariants: [
		{ popular: true, tone: "chart", class: { card: "border-chart-1" } },
		{ popular: true, tone: "primary", class: { card: "border-primary" } },
		{ popular: true, tone: "neutral", class: { card: "border-muted-foreground" } },
	],
	defaultVariants: { mode: "light", tone: "neutral", popular: false },
});

export type OgPricingMode = NonNullable<VariantProps<typeof ogPricing>["mode"]>;
export type OgPricingTone = NonNullable<VariantProps<typeof ogPricing>["tone"]>;
