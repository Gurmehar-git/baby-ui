import { tv, type VariantProps } from "tailwind-variants";

// Buttons stay transparent: one shared highlight moves under their content, so there is only ever
// one moving surface. Its radius is concentric with the tray's.
export const floatingButtonGroup = tv({
	slots: {
		root: "group/tray relative isolate inline-flex flex-none flex-nowrap items-center rounded-xl border text-muted-foreground [-webkit-tap-highlight-color:transparent] data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
		highlight:
			"pointer-events-none absolute top-0 left-0 z-1 rounded-lg bg-foreground/7 opacity-0 transition-[translate,width,height,opacity,scale,background-color] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) data-appear:scale-94 data-pressing:scale-[0.965] data-pressing:bg-foreground/12 dark:bg-foreground/9 dark:data-pressing:bg-foreground/15 motion-reduce:transition-none",
		item: [
			"inline-flex flex-none cursor-default select-none items-center justify-center whitespace-nowrap rounded-lg font-medium leading-none outline-none transition-[color,background-color,opacity] duration-(--duration-fast) touch-manipulation",
			"data-active:text-foreground aria-pressed:bg-primary/12 aria-pressed:text-foreground dark:aria-pressed:bg-primary/16",
			"aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
			// A column left-aligns labelled rows; icon-only rows stay square and centred.
			"group-data-[orientation=vertical]/tray:not-data-icon-only:justify-start group-data-[orientation=vertical]/tray:data-icon-only:self-center",
		],
		// Ghosts of every label share one cell with the visible one, so the slot keeps the widest width.
		slot: "relative z-2 inline-grid items-center justify-items-center *:col-start-1 *:row-start-1 group-data-[orientation=vertical]/tray:justify-items-start",
		ghost: "invisible inline-flex items-center gap-1.5",
		phase:
			"inline-flex items-center gap-1.5 transition-[opacity,translate,filter] duration-(--duration-base) ease-(--ease-ui-out) starting:translate-y-1 starting:opacity-0 starting:blur-[2px] motion-reduce:transition-none",
		icon: "inline-flex size-4 flex-none [&_svg]:size-4",
		separator: "flex-none self-center rounded-full bg-foreground/12",
		kbd: "ml-2 text-background/60 tabular-nums",
	},
	variants: {
		variant: {
			default: {
				root: "border-foreground/3 bg-foreground/4.5 dark:border-foreground/5 dark:bg-foreground/6",
			},
			floating: { root: "bg-popover shadow-(--overlay-shadow)" },
		},
		size: {
			sm: {
				// Corners stay concentric: the tray tightens by its 3px pad, the rows follow.
				root: "gap-[3px] rounded-[9px] p-[3px]",
				item: "h-[30px] min-w-[30px] rounded-[5px] px-2.5 text-xs data-icon:not-data-icon-only:pl-2 data-icon-only:w-[30px] data-icon-only:px-0",
				highlight: "rounded-[5px]",
				separator:
					"h-[15px] w-px group-data-[orientation=vertical]/tray:h-px group-data-[orientation=vertical]/tray:w-[15px]",
			},
			default: {
				root: "gap-1 p-1",
				item: "h-9 min-w-9 px-3 text-sm data-icon:not-data-icon-only:pl-2.5 data-icon-only:w-9 data-icon-only:px-0",
				separator:
					"mx-0.5 h-[18px] w-px group-data-[orientation=vertical]/tray:mx-0 group-data-[orientation=vertical]/tray:my-0.5 group-data-[orientation=vertical]/tray:h-px group-data-[orientation=vertical]/tray:w-[18px]",
			},
		},
	},
	defaultVariants: { variant: "default", size: "default" },
});

export type FloatingButtonGroupVariant = NonNullable<
	VariantProps<typeof floatingButtonGroup>["variant"]
>;
export type FloatingButtonGroupSize = NonNullable<
	VariantProps<typeof floatingButtonGroup>["size"]
>;
