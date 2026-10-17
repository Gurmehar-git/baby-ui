import { tv, type VariantProps } from "tailwind-variants";

// New days and rows open from 0fr via @starting-style; overflow-clip (not hidden) keeps day labels sticky.
const OPEN =
	"grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-(--duration-collapse) ease-(--ease-out-quad) data-[fresh]:starting:grid-rows-[0fr] data-[fresh]:starting:opacity-0 motion-reduce:transition-none";

export const timeline = tv({
	slots: {
		root: "relative grid min-w-0 text-foreground [--tl-marker:--spacing(7)] [--tl-top:--spacing(2)]",
		scroller: [
			"min-w-0 [overflow-anchor:none]",
			"data-[scrolls]:max-h-(--tl-height) data-[scrolls]:overflow-y-auto data-[scrolls]:overscroll-contain",
			"data-[more]:[mask-image:linear-gradient(to_bottom,#000_calc(100%-2.25rem),transparent)]",
		],
		group: OPEN,
		groupInner: "min-h-0 overflow-clip [overflow-clip-margin:4px]",
		day: "sticky top-0 z-2 flex items-baseline justify-between gap-3 bg-(--tl-surface) py-2 pr-3 font-medium text-sm",
		count: "font-normal text-muted-foreground text-xs tabular-nums",
		list: "mb-3 list-none p-0",
		item: ["group/row", OPEN],
		itemInner:
			"relative min-h-0 overflow-clip pl-[calc(var(--tl-marker)+--spacing(2))] [overflow-clip-margin:4px]",
		marker: [
			"absolute top-(--tl-top) left-0 z-1 grid size-(--tl-marker) place-items-center rounded-full",
			"transition-[scale,opacity] delay-(--tl-delay) duration-(--duration-spring-bouncy) ease-(--ease-spring-bouncy)",
			"motion-safe:scale-40 motion-safe:opacity-0 group-data-[shown]/row:scale-100 group-data-[shown]/row:opacity-100",
		],
		node: [
			"border border-foreground/10 bg-(--tl-surface) text-muted-foreground [&_svg]:size-3.5",
			"data-[tone=success]:bg-success/10 data-[tone=success]:text-success-strong",
			"data-[tone=destructive]:bg-destructive/10 data-[tone=destructive]:text-destructive",
		],
		segment: [
			"absolute top-[calc(var(--tl-top)+var(--tl-marker)+--spacing(1))] bottom-[calc(--spacing(1)-var(--tl-top))] left-[calc(var(--tl-marker)/2-0.5px)] w-px origin-top bg-border-strong",
			"transition-[scale] delay-[calc(var(--tl-delay,0s)+0.1s)] duration-(--duration-collapse) ease-(--ease-out-quart)",
			"motion-safe:scale-y-0 group-data-[shown]/row:scale-y-100",
		],
		trigger:
			"grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 rounded-lg px-3 py-3 text-left font-normal text-sm hover:text-foreground [&>[data-slot=collapsible-icon]]:order-last [&>[data-slot=collapsible-icon]]:mt-[3px]",
		expandable: "grid-cols-[minmax(0,1fr)_auto_auto] hover:bg-muted",
		text: "grid min-w-0 gap-0.5",
		title: "text-muted-foreground text-sm leading-5",
		actor: "font-medium text-foreground",
		meta: "text-muted-foreground text-xs",
		time: "flex min-w-11 justify-end whitespace-nowrap text-muted-foreground text-xs tabular-nums leading-5",
		detail: "px-3 pb-4 text-muted-foreground text-sm",
	},
	variants: {
		variant: {
			default: { root: "[--tl-surface:var(--color-background)]" },
			card: {
				root: "rounded-xl border bg-background p-2 pb-0 [--tl-surface:var(--color-background)]",
			},
		},
	},
	defaultVariants: { variant: "default" },
});

export type TimelineVariant = NonNullable<VariantProps<typeof timeline>["variant"]>;
