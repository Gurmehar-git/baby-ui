import { tv, type VariantProps } from "tailwind-variants";

export const comparisonTable = tv({
	slots: {
		root: "@container/compare w-full bg-background text-foreground",
		inner: "mx-auto w-full max-w-280 px-4 py-16 @xl/compare:px-8",
		header: "mb-8 flex flex-wrap items-end justify-between gap-6",
		heading: "grid gap-2",
		title: "text-balance font-semibold text-3xl tracking-tight",
		description: "max-w-136 text-pretty text-muted-foreground leading-relaxed",
		controls: "flex flex-wrap items-center gap-4",
		count: "text-muted-foreground text-sm tabular-nums",
		scroller: "overflow-x-auto overscroll-x-contain",
		table: "grid min-w-max",
		row: "grid grid-cols-subgrid col-span-full",
		headRow: "sticky z-2 border-border border-b bg-background",
		labelCell:
			"sticky left-0 z-1 flex min-w-44 flex-col justify-center gap-0.5 bg-background py-3 pr-6 text-sm",
		hint: "text-muted-foreground text-xs",
		cell: "flex min-w-32 flex-col items-center justify-center gap-1 px-4 py-3 text-center text-sm transition-colors duration-(--duration-fast) data-[highlight=true]:bg-primary/5 data-[selected=true]:bg-primary/10",
		colHead: "items-stretch gap-2 py-5",
		colName: "font-semibold text-base",
		colCaption: "text-muted-foreground text-xs",
		price: "font-semibold text-2xl tabular-nums tracking-tight",
		period: "text-muted-foreground text-xs",
		section:
			"col-span-full pt-6 pb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider",
		// Rows hidden by "differences only" fold on grid rows instead of popping out.
		fold: "col-span-full grid grid-cols-subgrid grid-rows-[1fr] border-border border-b opacity-100 transition-[grid-template-rows,opacity,border-color] duration-(--duration-collapse) ease-(--ease-out-quad) data-[hidden=true]:grid-rows-[0fr] data-[hidden=true]:border-transparent data-[hidden=true]:opacity-0 motion-reduce:transition-none",
		foldInner: "col-span-full grid min-h-0 grid-cols-subgrid overflow-hidden",
		check: "size-5 text-success",
		partial: "size-5 text-warning",
		missing: "size-5 text-muted-foreground/50",
		note: "text-muted-foreground text-xs",
		footnote: "mt-6 text-muted-foreground text-xs",
	},
	variants: {
		/** `plain` sits on the page; `card` frames the matrix in a bordered surface. */
		variant: {
			plain: {},
			card: { scroller: "rounded-2xl border border-border px-4", labelCell: "pl-2" },
		},
	},
	defaultVariants: { variant: "plain" },
});

export type ComparisonTableVariant = NonNullable<
	VariantProps<typeof comparisonTable>["variant"]
>;
