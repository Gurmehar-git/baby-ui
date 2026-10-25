import { tv, type VariantProps } from "tailwind-variants";

/** `tray` frames the tip card in a grey rim with the heading and footer; `plain` is one bordered
 * card. Tips rise in once, a beat apart, and a taken tip settles to a quiet done state. */
export const tipsPanel = tv({
	slots: {
		root: "w-full max-w-190 text-foreground",
		header: "flex items-baseline justify-between gap-3",
		title: "m-0 font-semibold text-base tracking-tight",
		progress: "text-muted-foreground text-xs tabular-nums",
		body: "@container/tips max-h-(--tips-panel-max-height,26rem) overflow-y-auto overscroll-contain",
		grid: [
			"m-0 grid list-none grid-cols-3 gap-3 p-3.5 @max-[35rem]/tips:grid-cols-2 @max-[24rem]/tips:grid-cols-1",
			"[&>:nth-child(2)]:[animation-delay:50ms] [&>:nth-child(3)]:[animation-delay:100ms] [&>:nth-child(4)]:[animation-delay:150ms]",
			"[&>:nth-child(5)]:[animation-delay:200ms] [&>:nth-child(n+6)]:[animation-delay:250ms]",
		],
		tip: [
			"card-fade-up flex min-w-0 flex-col items-start rounded-xl border border-border px-4 pt-4 pb-3.5",
			"transition-[background-color,border-color] duration-(--duration-slow) ease-(--ease-ui-out) data-[done]:bg-muted/50 motion-reduce:transition-none",
		],
		tipTitle: "m-0 font-medium text-sm",
		tipDescription: "m-0 mt-1.5 mb-3.5 flex-1 text-muted-foreground text-sm leading-5",
		done: "pop-in inline-flex h-8 items-center gap-1.5 rounded-md font-medium text-primary text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4",
		footer: "flex items-center gap-2",
	},
	variants: {
		variant: {
			tray: {
				root: "rounded-2xl bg-card p-1.5",
				header: "px-4.5 pt-3 pb-3",
				body: "rounded-xl bg-background shadow-surface dark:bg-popover",
				footer: "px-2 pt-2 pb-1",
			},
			plain: {
				root: "overflow-hidden rounded-2xl border border-border bg-background",
				header: "border-border border-b px-5 py-3.5",
				body: "",
				footer: "border-border border-t px-3.5 py-3",
			},
		},
	},
	defaultVariants: { variant: "tray" },
});

export type TipsPanelVariant = NonNullable<VariantProps<typeof tipsPanel>["variant"]>;
