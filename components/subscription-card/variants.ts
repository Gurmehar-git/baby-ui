import { tv, type VariantProps } from "tailwind-variants";

// Folds on grid-template-rows; spacing sits inside the clip so a closed fold leaves no gap.
const FOLD = [
	"grid grid-rows-[0fr] opacity-0 data-[open=true]:grid-rows-[1fr] data-[open=true]:opacity-100",
	"transition-[grid-template-rows,opacity] duration-(--duration-base) ease-(--ease-ui-out) motion-reduce:transition-none",
];

export const subscriptionCard = tv({
	slots: {
		root: "flex w-full flex-col rounded-xl border border-border bg-card text-card-foreground",
		header: "flex min-w-0 flex-col gap-1.5",
		titleRow: "flex min-w-0 flex-wrap items-center gap-2",
		title: "truncate font-semibold text-foreground tracking-tight",
		price: "flex items-baseline gap-1.5",
		amount: "font-semibold text-foreground tabular-nums tracking-tight",
		interval: "text-muted-foreground text-sm",
		schedule: "text-muted-foreground text-sm",
		alertFold: ["mt-0!", ...FOLD],
		clip: "min-h-0 overflow-hidden",
		alertSpace: "",
		alert:
			"flex flex-col gap-3 rounded-lg border border-destructive/30 px-3.5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between",
		alertText: "text-foreground",
		seats: "flex flex-col",
		seatsHintFold: FOLD,
		seatsHint: "block pt-1.5 text-muted-foreground text-xs",
		footer: "flex flex-wrap items-center gap-2 empty:hidden",
		cancel: "ml-auto text-destructive-strong",
		resume: "ml-auto",
	},
	variants: {
		variant: {
			card: {
				root: "p-5 *:not-first:mt-5",
				title: "text-base",
				amount: "text-3xl",
				alertSpace: "pt-5",
				footer: "border-border border-t pt-4",
			},
			compact: {
				root: "p-4 *:not-first:mt-3",
				title: "text-sm",
				amount: "text-xl",
				alertSpace: "pt-3",
			},
		},
	},
	defaultVariants: { variant: "card" },
});

export type SubscriptionCardVariant = NonNullable<
	VariantProps<typeof subscriptionCard>["variant"]
>;
