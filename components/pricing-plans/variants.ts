import { tv, type VariantProps } from "tailwind-variants";

export const pricingPlans = tv({
	slots: {
		root: "@container flex w-full flex-col gap-6 text-foreground",
		bar: "flex flex-wrap items-center justify-center gap-3",
		// Equal columns, so one thumb slides between them by its own width.
		cycles:
			"relative inline-grid auto-cols-fr grid-flow-col rounded-full border border-border p-0.5",
		thumb:
			"pointer-events-none absolute inset-y-0.5 left-0.5 rounded-full bg-foreground transition-[translate] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) motion-reduce:transition-none",
		cycle: [
			"relative z-1 cursor-pointer select-none rounded-full px-3.5 py-1.5 text-center font-medium text-muted-foreground text-sm",
			"transition-colors duration-(--duration-fast) ease-(--ease-ui-out) hover:text-foreground motion-reduce:transition-none",
			"has-checked:text-background has-checked:hover:text-background",
			"has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background",
		],
		saveNote: "text-muted-foreground text-xs tabular-nums",
		grid: "grid",
		plan: "flex min-w-0 flex-col",
		head: "flex items-center justify-between gap-2",
		name: "font-medium text-foreground",
		description: "mt-1 text-muted-foreground",
		price: "flex items-end gap-1",
		amount: "font-semibold leading-none tracking-tight tabular-nums",
		cadence: "pb-0.5 text-muted-foreground text-sm",
		note: "mt-2 flex min-h-5 flex-wrap items-center gap-x-2 text-muted-foreground text-xs tabular-nums",
		save: "font-medium text-foreground",
		cta: "w-full",
		features: "flex flex-col text-sm",
		feature: "flex items-start gap-2 text-foreground/85",
		check: "mt-0.5 size-4 shrink-0 text-foreground",
	},
	variants: {
		layout: {
			cards: {
				grid: "grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4",
				plan: "rounded-2xl border border-border bg-background data-highlighted:border-foreground/40 data-highlighted:shadow-(--surface-shadow)",
			},
			columns: {
				grid: "divide-y divide-border overflow-hidden rounded-2xl border border-border @3xl:auto-cols-fr @3xl:grid-flow-col @3xl:divide-x @3xl:divide-y-0",
				plan: "data-highlighted:shadow-[inset_0_2px_0_0_var(--foreground)]",
			},
		},
		size: {
			sm: {
				plan: "gap-4 p-4",
				description: "text-xs",
				amount: "text-3xl",
				features: "gap-1.5",
			},
			default: {
				plan: "gap-5 p-5 @md:p-6",
				description: "text-sm",
				amount: "text-4xl",
				features: "gap-2",
			},
		},
	},
	defaultVariants: { layout: "cards", size: "default" },
});

export type PricingPlansLayout = NonNullable<VariantProps<typeof pricingPlans>["layout"]>;
export type PricingPlansSize = NonNullable<VariantProps<typeof pricingPlans>["size"]>;
