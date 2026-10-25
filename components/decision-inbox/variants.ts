import { tv, type VariantProps } from "tailwind-variants";

/** `tray` sets the status line in a grey rim above a raised list; `plain` keeps one bordered
 * card. An answered row shows its answer for a beat, then folds away on grid rows. */
export const decisionInbox = tv({
	slots: {
		root: "w-full max-w-110 text-foreground [--decision-inbox-hold:1s]",
		header: [
			"flex items-center gap-2 font-medium text-sm transition-colors duration-(--duration-slow) [&_svg]:size-4 [&_svg]:shrink-0",
			"text-warning-strong data-[clear]:text-success-strong",
		],
		list: "overflow-hidden",
		row: [
			"grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-(--duration-collapse) ease-(--ease-ui-out) motion-reduce:transition-none",
			"data-[answered]:grid-rows-[0fr] data-[answered]:opacity-0 data-[answered]:delay-(--decision-inbox-hold)",
		],
		rowClip: "min-h-0 overflow-hidden",
		item: "border-border px-5 pt-4 pb-3.5 data-[collapsed]:pb-4 [[data-slot=decision-inbox-row]:not(:first-child)_&]:border-t",
		title: [
			"m-0 block w-full text-start font-medium text-sm",
			"[button&]:rounded-sm [button&]:text-muted-foreground [button&]:outline-none [button&]:transition-colors [button&]:duration-(--duration-fast)",
			"[button&]:hover:text-foreground [button&]:focus-visible:ring-2 [button&]:focus-visible:ring-ring",
		],
		body: [
			"grid grid-rows-[0fr] transition-[grid-template-rows] duration-(--duration-collapse) ease-(--ease-ui-out) data-[open]:grid-rows-[1fr] motion-reduce:transition-none",
		],
		// Room around the buttons so the fold's clip never cuts their focus ring.
		bodyClip: "-mx-1 -mb-1 min-h-0 overflow-hidden px-1 pb-1",
		detail: "m-0 mt-1 text-muted-foreground text-sm",
		actions: "mt-3 flex min-h-8 items-center gap-2",
		done: "pop-in inline-flex h-8 items-center gap-1.5 font-medium text-sm text-success-strong outline-none [&_svg]:size-4",
		empty: [
			"m-0 grid grid-rows-[0fr] px-5 text-center text-muted-foreground text-sm opacity-0 transition-[grid-template-rows,opacity] duration-(--duration-collapse)",
			"data-[shown]:grid-rows-[1fr] data-[shown]:opacity-100 data-[shown]:delay-(--decision-inbox-hold) motion-reduce:transition-none",
		],
		emptyClip: "min-h-0 overflow-hidden",
		emptyText: "block py-6",
	},
	variants: {
		variant: {
			tray: {
				root: "rounded-2xl bg-card p-1.5",
				header: "px-4.5 pt-2.5 pb-2.5",
				list: "rounded-xl bg-background shadow-surface dark:bg-popover",
			},
			plain: {
				root: "overflow-hidden rounded-2xl border border-border bg-background",
				header: "border-border border-b px-5 py-3.5",
				list: "",
			},
		},
	},
	defaultVariants: { variant: "tray" },
});

export type DecisionInboxVariant = NonNullable<
	VariantProps<typeof decisionInbox>["variant"]
>;
