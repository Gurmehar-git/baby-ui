import { tv, type VariantProps } from "tailwind-variants";

export const pricing02 = tv({
	slots: {
		root: "@container w-full bg-background py-16 text-foreground",
		inner: "mx-auto max-w-6xl px-4 @xl:px-6 @5xl:px-8",
		header: "grid gap-6 @3xl:grid-cols-12 @3xl:items-end",
		heading: "@3xl:col-span-6",
		eyebrow: "font-medium text-muted-foreground text-xs uppercase tracking-widest",
		title:
			"mt-4 max-w-xl whitespace-pre-line text-balance font-medium text-4xl leading-[1.02] tracking-tight @xl:text-5xl",
		aside: "flex flex-col items-start gap-5 @3xl:col-span-4 @3xl:col-start-9",
		description: "max-w-md text-muted-foreground text-sm leading-6",
		plans: "mt-12 grid gap-3 @3xl:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]",
		plan: "group relative isolate gap-0 overflow-hidden p-2 transition-[border-color,box-shadow] duration-(--duration-slow) ease-[var(--ease-ui-out)] hover:border-border-strong hover:shadow-lg motion-reduce:transition-none",
		glow: "pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_at_50%_-20%,color-mix(in_oklch,var(--foreground)_9%,transparent),transparent_66%)] opacity-0 transition-opacity duration-(--duration-slow) ease-[var(--ease-ui-out)] group-hover:opacity-100",
		panel: "flex min-h-60 flex-col rounded-xl p-5",
		name: "font-medium text-base",
		blurb: "mt-2 min-h-12 max-w-xs text-muted-foreground text-sm leading-6",
		price: "mt-4 flex min-h-10 items-end gap-1.5",
		amount:
			"inline-flex items-baseline font-medium text-4xl leading-none tracking-tight tabular-nums",
		digit: "pricing-digit inline-block",
		cadence: "pb-1 text-muted-foreground text-sm",
		cta: "mt-auto w-full rounded-lg",
		arrow:
			"transition-transform duration-(--duration-slow) ease-[var(--ease-ui-out)] group-hover:translate-x-0.5 motion-reduce:transition-none",
		list: "flex flex-1 flex-col px-4 pt-8 pb-5 @xl:px-5",
		listLabel: "font-medium text-xs text-muted-foreground uppercase tracking-widest",
		features: "mt-5 flex flex-col gap-4",
		feature: "flex items-center gap-2.5 text-foreground/80 text-sm",
		tick: "flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground",
		footnotes:
			"mt-5 flex flex-col gap-2 text-muted-foreground text-xs @xl:flex-row @xl:items-center @xl:justify-between",
	},
	variants: {
		variant: {
			soft: { panel: "border border-border bg-background shadow-sm" },
			outline: { panel: "border border-border border-dashed bg-transparent" },
		},
		featured: {
			true: {},
			false: {},
		},
	},
	compoundVariants: [
		{
			variant: "soft",
			featured: true,
			class: {
				panel:
					"bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--primary)_14%,var(--background))_0%,var(--background)_62%)]",
			},
		},
		{
			variant: "outline",
			featured: true,
			class: { panel: "border-primary/60 border-solid" },
		},
	],
	defaultVariants: { variant: "soft", featured: false },
});

export type Pricing02Variant = NonNullable<VariantProps<typeof pricing02>["variant"]>;
