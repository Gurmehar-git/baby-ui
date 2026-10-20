import { tv, type VariantProps } from "tailwind-variants";

export const paymentMethodCard = tv({
	slots: {
		root: "flex w-full flex-col text-card-foreground",
		title: "font-semibold text-foreground text-sm tracking-tight",
		content: "flex flex-wrap items-center gap-x-3 gap-y-2",
		mark: "flex h-8 w-14 shrink-0 select-none items-center justify-center rounded-md border border-border font-bold text-foreground text-xs italic tracking-wide",
		details: "flex min-w-0 flex-1 flex-col gap-0.5",
		primary:
			"flex min-w-0 flex-wrap items-center gap-2 font-medium text-foreground text-sm",
		secondary: "truncate text-muted-foreground text-xs tabular-nums",
		action: "shrink-0",
		// Folds on grid rows with its spacing inside the clip, so a hidden error takes no room.
		errorFold: [
			"mt-0! grid grid-rows-[0fr] opacity-0 data-[open=true]:grid-rows-[1fr] data-[open=true]:opacity-100",
			"transition-[grid-template-rows,opacity] duration-(--duration-base) ease-(--ease-ui-out) motion-reduce:transition-none",
		],
		errorClip: "min-h-0 overflow-hidden",
		error: "block text-destructive-strong text-xs",
	},
	variants: {
		variant: {
			card: {
				root: "rounded-xl border border-border bg-card p-5 *:not-first:mt-4",
				error: "pt-4",
			},
			inline: { root: "*:not-first:mt-2", error: "pt-2" },
		},
	},
	defaultVariants: { variant: "card" },
});

export type PaymentMethodCardVariant = NonNullable<
	VariantProps<typeof paymentMethodCard>["variant"]
>;
