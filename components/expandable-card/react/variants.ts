import { tv, type VariantProps } from "tailwind-variants";

// The card's width and the panel's height share one spring, so close is the exact mirror of open.
// The panel's content keeps the open width throughout, so nothing reflows while the box moves.
export const expandableCard = tv({
	slots: {
		track: "@container flex w-full min-w-0 justify-center",
		card: [
			"w-[min(var(--ec-w),100%)] overflow-hidden rounded-xl border bg-background",
			"transition-[width] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) motion-reduce:transition-none",
			"data-open:w-[min(var(--ec-xw),100%)] data-[state=open]:w-[min(var(--ec-xw),100%)]",
		],
		// The chevron comes first from Collapsible; row-reverse moves it to the trailing edge.
		trigger:
			"min-h-16 flex-row-reverse justify-between gap-5 rounded-none px-5 py-4 hover:bg-muted hover:text-foreground active:bg-muted [&>[data-slot=collapsible-icon]]:size-4",
		title: "block font-medium text-sm",
		description:
			"relative mt-1 block font-normal text-muted-foreground text-xs tabular-nums",
		// A changed word rises in as it mounts; unchanged words keep their keys and hold still.
		word: "inline-block whitespace-pre transition-[opacity,translate,filter] duration-(--duration-base) ease-(--ease-ui-out) starting:translate-y-[0.35em] starting:opacity-0 starting:blur-[2px] motion-reduce:transition-none",
		panel:
			"w-[calc(min(var(--ec-xw),100cqw)-2px)] bg-muted px-5 pt-4 pb-5 text-muted-foreground text-sm shadow-[inset_0_1px_0_var(--border)]",
	},
	variants: {
		variant: {
			default: { card: "shadow-xs" },
			outline: {},
		},
		size: {
			sm: { trigger: "min-h-13 px-4 py-3", panel: "px-4 pt-3 pb-4" },
			default: {},
		},
	},
	defaultVariants: { variant: "default", size: "default" },
});

export type ExpandableCardVariant = NonNullable<
	VariantProps<typeof expandableCard>["variant"]
>;
export type ExpandableCardSize = NonNullable<VariantProps<typeof expandableCard>["size"]>;
