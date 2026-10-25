import { tv, type VariantProps } from "tailwind-variants";

/** `tray` sets the record in a grey rim above the raised email; `plain` keeps one bordered card.
 * Sending or discarding folds the email into a one-line receipt on grid rows. */
export const emailDraft = tv({
	slots: {
		root: "@container w-full max-w-120 text-foreground text-sm",
		header: "flex flex-wrap items-center gap-x-2 gap-y-0.5",
		title: "m-0 shrink-0 font-medium text-base leading-6",
		amount: "ms-auto shrink-0 font-medium text-base tabular-nums leading-6",
		description: "m-0 basis-full text-muted-foreground text-xs",
		panel: "",
		content: [
			"grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-(--duration-collapse) ease-(--ease-ui-out) motion-reduce:transition-none",
			"data-[folded]:grid-rows-[0fr] data-[folded]:opacity-0",
		],
		contentClip: "min-h-0 overflow-hidden",
		contentBody:
			"transition-opacity duration-(--duration-base) data-[sending]:pointer-events-none data-[sending]:opacity-60",
		fields:
			"flex min-w-0 items-center justify-between gap-3 border-border border-b py-2 ps-4 pe-3",
		to: "flex min-w-0 items-center gap-2",
		toLabel: "shrink-0 text-muted-foreground",
		attachment:
			"flex min-w-0 items-center gap-1.5 text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0",
		attachmentName: "min-w-0 truncate",
		message: "px-4 pt-3.5 pb-0.5",
		text: [
			"-mx-1.5 -my-1 m-0 cursor-text rounded-md px-1.5 py-1 text-foreground leading-5 transition-colors duration-(--duration-fast) hover:bg-foreground/[0.03]",
			"[&_a]:font-medium [&_a]:underline [&_a]:decoration-foreground/30 [&_a]:underline-offset-3 [&_a]:transition-[text-decoration-color] [&_a:hover]:decoration-current",
		],
		editor: "-mx-1.5 -my-1 w-[calc(100%+0.75rem)] min-h-0 px-1.5 py-1 leading-5",
		options: "flex items-center gap-1 py-3.5 ps-4 pe-3",
		hint: "ms-auto hidden shrink-0 whitespace-nowrap text-muted-foreground text-xs @[28rem]:inline",
		receipt: [
			"grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-(--duration-collapse) ease-(--ease-ui-out) motion-reduce:transition-none",
			"data-[shown]:grid-rows-[1fr] data-[shown]:opacity-100",
		],
		receiptClip: "min-h-0 overflow-hidden",
		receiptBody: "flex items-center gap-2.5 py-2 ps-4 pe-3 text-muted-foreground",
		receiptIcon: [
			"grid size-6 shrink-0 place-items-center rounded-md bg-foreground/[0.06] [&_svg]:size-3.5",
			"data-[tone=success]:bg-[color-mix(in_oklch,var(--success)_15%,transparent)] data-[tone=success]:text-success-strong",
		],
		receiptText: "min-w-0 flex-1 truncate [&_b]:font-medium [&_b]:text-foreground",
		footer: "flex min-h-12 items-center gap-2 border-border border-t py-2.5 ps-4 pe-2.5",
		author: "min-w-0 truncate",
		actions: [
			"ms-auto grid shrink-0 grid-cols-[1fr] transition-[grid-template-columns,opacity] duration-(--duration-collapse) ease-(--ease-ui-out) motion-reduce:transition-none",
			"data-[folded]:grid-cols-[0fr] data-[folded]:opacity-0",
		],
		actionsClip: "-m-1 min-w-0 overflow-hidden",
		actionsBody: "flex justify-end gap-2 p-1",
		icon: "fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.6]",
	},
	variants: {
		variant: {
			tray: {
				root: "rounded-2xl bg-card p-1.5",
				header: "px-3.5 pt-2 pb-2.5",
				panel: "overflow-hidden rounded-xl bg-background shadow-surface dark:bg-popover",
			},
			plain: {
				root: "overflow-hidden rounded-2xl border border-border bg-background",
				header: "border-border border-b px-4 py-3",
				panel: "",
			},
		},
	},
	defaultVariants: { variant: "tray" },
});

export type EmailDraftVariant = NonNullable<VariantProps<typeof emailDraft>["variant"]>;
export type EmailDraftStatus = "draft" | "sending" | "sent" | "discarded";
