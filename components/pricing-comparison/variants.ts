import { tv, type VariantProps } from "tailwind-variants";

export const pricingComparison = tv({
	slots: {
		root: "@container w-full text-foreground",
		toolbar: "mb-4 flex items-center justify-end",
		table:
			"hidden w-full table-fixed border-separate border-spacing-0 text-sm @2xl:table",
		head: "sticky top-[var(--pricing-comparison-top,0px)] z-10 bg-background",
		corner:
			"border-border border-b bg-background text-left align-bottom font-normal text-muted-foreground",
		planHead: "border-border border-b bg-background text-center align-bottom font-medium",
		highlight: "border-x border-x-foreground/20",
		highlightTop: "rounded-t-xl border-t border-t-foreground/20",
		highlightEnd: "rounded-b-xl border-b border-b-foreground/20",
		groupButton: [
			"group -mx-1.5 flex w-[calc(100%+0.75rem)] items-center gap-1.5 rounded-md px-1.5 py-0.5 text-left font-medium text-foreground outline-none",
			"transition-[background-color,scale] [transition-duration:var(--duration-instant),var(--duration-slow)] ease-(--ease-ui-out) hover:bg-foreground/[0.05] active:scale-[var(--press-scale-row)] motion-reduce:transition-none",
			"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		],
		chevron:
			"size-4 shrink-0 text-muted-foreground transition-transform duration-(--duration-base) ease-(--ease-ui-out) group-aria-expanded:rotate-90 motion-reduce:transition-none",
		collapse: [
			"grid grid-rows-[0fr] transition-[grid-template-rows] duration-[var(--duration-exit)] ease-[var(--ease-ui-out)]",
			"data-[state=open]:grid-rows-[1fr] data-[state=open]:duration-[var(--duration-dropdown)] motion-reduce:transition-none",
		],
		collapseInner: "min-h-0 overflow-hidden",
		cell: "border-border border-t",
		feature: "text-foreground/90",
		hint: "mt-0.5 block text-muted-foreground text-xs",
		value: "flex items-center justify-center text-center tabular-nums",
		check: "size-4 text-foreground",
		cross: "size-4 text-muted-foreground/50",
		empty: "py-8 text-center text-muted-foreground text-sm",
		mobile: "@2xl:hidden",
		mobileGroupLabel: "mt-6 mb-1 font-medium text-sm first:mt-0",
		mobileRow: "flex items-start justify-between gap-4 border-border border-t text-sm",
		mobileValue: "flex shrink-0 items-center text-right tabular-nums",
	},
	variants: {
		density: {
			compact: {
				corner: "px-3 py-2",
				planHead: "px-3 py-2",
				cell: "px-3 py-2",
				mobileRow: "py-2",
			},
			comfortable: {
				corner: "px-4 py-3.5",
				planHead: "px-4 py-3.5",
				cell: "px-4 py-3.5",
				mobileRow: "py-3",
			},
		},
	},
	defaultVariants: { density: "comfortable" },
});

export type PricingComparisonDensity = NonNullable<
	VariantProps<typeof pricingComparison>["density"]
>;
