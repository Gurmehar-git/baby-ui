import { tv, type VariantProps } from "tailwind-variants";

/** `tray` sets the heading in a grey rim above a raised list; `plain` keeps one card with the
 * heading as its first row. Rows rise in once, a beat apart. */
export const changeSummary = tv({
	slots: {
		root: "@container/change w-full max-w-120 text-foreground",
		header: "flex items-center justify-between gap-3",
		title:
			"inline-flex min-w-0 items-center gap-2 font-medium text-sm [&_svg]:size-4 [&_svg]:shrink-0",
		period: "shrink-0 text-muted-foreground text-xs",
		list: [
			"m-0 overflow-hidden",
			"[&>:nth-child(2)]:[animation-delay:60ms] [&>:nth-child(3)]:[animation-delay:120ms] [&>:nth-child(4)]:[animation-delay:180ms]",
			"[&>:nth-child(5)]:[animation-delay:240ms] [&>:nth-child(n+6)]:[animation-delay:300ms]",
		],
		item: [
			"card-fade-up grid min-h-13 grid-cols-[minmax(0,4fr)_minmax(0,6fr)] items-center gap-4 px-5 not-first:border-border not-first:border-t",
			"@max-[25rem]/change:grid-cols-1 @max-[25rem]/change:gap-1 @max-[25rem]/change:px-4 @max-[25rem]/change:py-3",
		],
		label: "truncate font-medium text-sm @max-[25rem]/change:whitespace-normal",
		change:
			"m-0 flex min-w-0 items-center gap-2 text-muted-foreground text-sm @max-[25rem]/change:items-start",
		changeText: "truncate @max-[25rem]/change:whitespace-normal",
	},
	variants: {
		variant: {
			tray: {
				root: "rounded-2xl bg-card p-1.5",
				header: "px-4 pt-2 pb-2.5",
				title: "text-primary",
				list: "rounded-xl bg-background shadow-surface dark:bg-popover",
			},
			plain: {
				root: "overflow-hidden rounded-2xl border border-border bg-background",
				header: "border-border border-b px-5 py-3.5",
				title: "text-foreground [&_svg]:text-muted-foreground",
				list: "",
			},
		},
	},
	defaultVariants: { variant: "tray" },
});

/** The trend mark beside each change: an arrow for a move, a dash for none. */
export const changeSummaryTrend = tv({
	base: "grid size-5 shrink-0 place-items-center rounded-md [&_svg]:size-3",
	variants: {
		tone: {
			positive: "bg-success/12 text-success-strong",
			negative: "bg-destructive/10 text-destructive-strong",
			neutral: "bg-muted text-muted-foreground",
		},
	},
	defaultVariants: { tone: "neutral" },
});

export type ChangeSummaryVariant = NonNullable<
	VariantProps<typeof changeSummary>["variant"]
>;
export type ChangeSummaryTone = NonNullable<
	VariantProps<typeof changeSummaryTrend>["tone"]
>;
export type ChangeSummaryDirection = "up" | "down";
