import { tv, type VariantProps } from "tailwind-variants";

// The fill is a second, inverted copy of the face revealed by clip-path, so the text flips colour
// exactly at the fill's edge.
export const holdToConfirm = tv({
	slots: {
		root: "group/hold relative inline-flex touch-manipulation select-none items-center justify-center border bg-background font-medium outline-none transition-[background-color,border-color,opacity,scale] duration-(--duration-fast) ease-[var(--ease-ui-out)] [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-default data-holding:scale-[0.97] motion-reduce:transition-none",
		fill: "pointer-events-none absolute -inset-px flex items-center justify-center rounded-[inherit]",
		face: "inline-flex items-center gap-2 whitespace-nowrap",
		icon: "grid size-[1.125em] flex-none place-items-center [&_svg]:size-[1.125em]",
		// pathLength=1 lets one dash draw the tick from its short stroke once the hold completes.
		check:
			"transition-[stroke-dashoffset] delay-75 duration-300 ease-[var(--ease-ui-out)] [stroke-dasharray:1] [stroke-dashoffset:1] group-data-[state=done]/hold:[stroke-dashoffset:0] motion-reduce:transition-none",
	},
	variants: {
		variant: {
			default: {
				root: "border-border-strong text-foreground hover:bg-primary/5",
				fill: "bg-primary text-primary-foreground",
			},
			destructive: {
				root: "border-destructive/30 text-destructive-strong hover:bg-destructive/5",
				fill: "bg-destructive text-destructive-foreground",
			},
			secondary: {
				root: "border-border-strong text-foreground hover:bg-foreground/5",
				fill: "bg-foreground text-background",
			},
		},
		size: {
			sm: { root: "h-8 rounded-md px-3 text-xs" },
			default: { root: "h-9 rounded-lg px-5 text-sm" },
			lg: { root: "h-11 rounded-xl px-6 text-base" },
		},
	},
	defaultVariants: { variant: "default", size: "default" },
});

export type HoldToConfirmVariant = NonNullable<
	VariantProps<typeof holdToConfirm>["variant"]
>;
export type HoldToConfirmSize = NonNullable<VariantProps<typeof holdToConfirm>["size"]>;
