import { tv, type VariantProps } from "tailwind-variants";

export const invoiceList = tv({
	slots: {
		root: "@container flex w-full flex-col gap-3",
		table: "hidden @xl:block",
		cell: "py-0",
		grow: "grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-(--duration-collapse) ease-[var(--ease-ui-out)] motion-reduce:transition-none starting:grid-rows-[0fr] starting:opacity-0",
		growInner: "min-h-0 overflow-hidden",
		number: "font-mono text-muted-foreground text-xs",
		amount: "text-right tabular-nums",
		links: "flex items-center justify-end gap-3",
		link: "rounded-sm text-muted-foreground text-xs underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
		list: "flex flex-col divide-y divide-border rounded-xl border border-border @xl:hidden",
		item: "flex flex-col gap-1.5 px-4",
		itemTop: "flex items-baseline justify-between gap-3",
		itemTitle: "min-w-0 truncate font-medium text-foreground text-sm",
		itemMeta:
			"flex flex-wrap items-center gap-x-3 gap-y-1.5 text-muted-foreground text-xs",
		empty:
			"flex flex-col items-center gap-1 rounded-xl border border-border border-dashed px-6 py-10 text-center",
		emptyTitle: "font-medium text-foreground text-sm",
		emptyHint: "text-muted-foreground text-sm",
		footer: "flex justify-center",
	},
	variants: {
		density: {
			comfortable: { growInner: "py-2", item: "py-3.5" },
			compact: { growInner: "py-1", item: "py-2.5" },
		},
	},
	defaultVariants: { density: "comfortable" },
});

export type InvoiceListDensity = NonNullable<VariantProps<typeof invoiceList>["density"]>;
