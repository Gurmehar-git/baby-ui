import { tv, type VariantProps } from "tailwind-variants";

export const faqSection = tv({
	slots: {
		root: "@container/faq w-full bg-background text-foreground",
		stack: "mx-auto grid w-full max-w-180 gap-8 px-6 py-20",
		intro: "grid gap-3",
		title: "text-balance font-semibold text-3xl tracking-tight",
		description: "max-w-120 text-pretty text-base text-muted-foreground leading-relaxed",
		list: "divide-y-0 rounded-none border-0 border-border border-t",
		// Filtered or off-topic rows fold away on grid rows instead of popping out.
		row: "grid grid-rows-[1fr] border-border border-b opacity-100 transition-[grid-template-rows,opacity,border-color] duration-(--duration-collapse) ease-(--ease-out-quad) data-[hidden=true]:grid-rows-[0fr] data-[hidden=true]:border-transparent data-[hidden=true]:opacity-0 motion-reduce:transition-none",
		rowInner: "min-h-0 overflow-hidden",
		trigger: "min-h-16 px-1 py-4 text-base hover:bg-transparent",
		answer: "pr-10 pb-5 pl-1 text-base leading-relaxed",
		hint: "pr-10 pb-4 pl-1 text-muted-foreground text-sm leading-relaxed",
		mark: "rounded-sm bg-primary/15 px-px text-inherit",
		contact:
			"flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-background px-5 py-4 text-left outline-none transition-[background-color,scale] duration-(--duration-fast) hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99] motion-reduce:transition-none",
		contactText: "grid min-w-0 gap-0.5",
		contactLabel: "font-medium text-sm",
		contactDescription: "text-muted-foreground text-sm",
		contactArrow:
			"size-4 shrink-0 text-muted-foreground transition-transform duration-(--duration-fast) [*:hover>&]:translate-x-0.5",
		grid: "mx-auto grid w-full max-w-280 gap-10 px-6 py-20 @3xl/faq:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] @3xl/faq:gap-16",
		rail: "grid content-start gap-8",
		topics: "h-auto w-full flex-col items-stretch",
		topic: "w-full justify-between",
		count: "text-muted-foreground text-xs tabular-nums",
		// Every topic's list shares one cell; only the active one is open, so height eases between them.
		stage: "grid content-start",
		panel:
			"col-start-1 row-start-1 grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-(--duration-collapse) ease-(--ease-out-quad) data-[active=true]:grid-rows-[1fr] data-[active=true]:opacity-100 motion-reduce:transition-none",
		panelInner: "min-h-0 overflow-hidden",
		searchRow: "grid gap-2",
		resultCount: "text-muted-foreground text-sm tabular-nums",
		empty:
			"grid justify-items-center gap-3 py-6 text-center text-muted-foreground text-sm transition-opacity duration-(--duration-fast) starting:opacity-0",
	},
	variants: {
		variant: {
			accordion: { intro: "justify-items-center text-center" },
			columns: {},
			search: { intro: "justify-items-center text-center" },
		},
	},
	defaultVariants: { variant: "accordion" },
});

export type FaqSectionVariant = NonNullable<VariantProps<typeof faqSection>["variant"]>;
