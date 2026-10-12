import { tv, type VariantProps } from "tailwind-variants";

// The label column opens from 0fr to 1fr, so the width animates without measuring; collapsed,
// each button is a square because its side padding plus the icon equals its height.
export const expandingButtonGroup = tv({
	slots: {
		root: "relative isolate inline-flex max-w-full flex-none items-center gap-0.5 rounded-full",
		item: [
			"group/item relative inline-flex flex-none items-center overflow-clip whitespace-nowrap rounded-full font-medium text-muted-foreground leading-none outline-none [-webkit-tap-highlight-color:transparent] touch-manipulation",
			"transition-[color,background-color] duration-(--duration-fast) focus-visible:ring-2 focus-visible:ring-ring",
			"data-expanded:bg-muted data-expanded:text-foreground",
			"data-[state=done]:bg-success/10 data-[state=done]:text-foreground",
			"aria-busy:cursor-progress aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
			"data-[variant=destructive]:data-expanded:bg-destructive/10 data-[variant=destructive]:data-expanded:text-destructive-strong",
		],
		icon: "relative grid flex-none place-items-center transition-[scale] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) group-active/item:scale-[0.86] group-aria-busy/item:animate-pulse group-aria-disabled/item:group-active/item:scale-100 group-data-[state=done]/item:text-success [&_svg]:size-full",
		glyph:
			"col-start-1 row-start-1 grid size-full place-items-center transition-[opacity,scale,filter] duration-(--duration-fast) ease-(--ease-ui-out) data-[on=false]:scale-55 data-[on=false]:opacity-0 data-[on=false]:blur-[2px] motion-reduce:transition-none",
		tick: "transition-[stroke-dashoffset] delay-60 duration-260 ease-(--ease-ui-out) [stroke-dasharray:1] [stroke-dashoffset:1] group-data-[state=done]/item:[stroke-dashoffset:0] motion-reduce:transition-none",
		columns:
			"grid grid-cols-[0fr] transition-[grid-template-columns] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) group-data-expanded/item:grid-cols-[1fr] motion-reduce:transition-none",
		label:
			"grid min-w-0 -translate-x-1.5 overflow-hidden opacity-0 blur-[2px] transition-[opacity,translate,filter] duration-(--duration-instant) group-data-expanded/item:translate-x-0 group-data-expanded/item:opacity-100 group-data-expanded/item:blur-none group-data-expanded/item:delay-40 group-data-expanded/item:duration-(--duration-base) motion-reduce:transition-none",
		// Both words share one cell, so the slot is as wide as the longer and a confirmation never resizes it.
		word: "col-start-1 row-start-1 transition-[opacity,translate,filter] duration-(--duration-base) ease-(--ease-ui-out) data-[on=false]:-translate-y-[0.4em] data-[on=false]:opacity-0 data-[on=false]:blur-[2px] motion-reduce:transition-none",
	},
	variants: {
		variant: {
			default: { root: "border bg-background p-[3px]" },
			ghost: { root: "" },
		},
		size: {
			sm: { item: "h-7 px-[7px] text-xs", icon: "size-3.5", word: "pr-1 pl-[5px]" },
			default: { item: "h-9 px-2.5 text-sm", icon: "size-4", word: "pr-1 pl-[7px]" },
		},
	},
	defaultVariants: { variant: "default", size: "default" },
});

export type ExpandingButtonGroupVariant = NonNullable<
	VariantProps<typeof expandingButtonGroup>["variant"]
>;
export type ExpandingButtonGroupSize = NonNullable<
	VariantProps<typeof expandingButtonGroup>["size"]
>;
