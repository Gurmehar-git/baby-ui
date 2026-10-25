import { tv, type VariantProps } from "tailwind-variants";

/** `card` frames the menu in a bordered surface; `plain` drops the frame to sit inside a popover
 * or sidebar. Picked filters fold in as chips; groups open on the accordion's grid rows. */
export const filterMenu = tv({
	slots: {
		root: "flex w-full max-w-90 flex-col text-foreground",
		header: "flex items-center justify-between gap-3 px-4 pt-3 pb-1",
		title: "m-0 font-semibold text-sm",
		chips: [
			"grid grid-rows-[0fr] transition-[grid-template-rows] duration-(--duration-collapse) ease-(--ease-ui-out) data-[shown]:grid-rows-[1fr] motion-reduce:transition-none",
		],
		chipsClip: "min-h-0 overflow-hidden",
		chipList: "flex flex-wrap gap-1.5 px-4 pt-2 pb-3",
		chip: "pop-in gap-1 ps-2.5 pe-1",
		chipRemove: [
			"grid size-4 place-items-center rounded-full text-muted-foreground outline-none [&_svg]:size-3",
			"transition-[background-color,color,scale] duration-(--duration-fast) hover:bg-foreground/[0.08] hover:text-foreground active:scale-(--press-scale-icon) focus-visible:ring-2 focus-visible:ring-ring",
		],
		groups: "px-1.5 pb-1.5",
		item: "border-0",
		trigger: "gap-2 px-2.5",
		groupLabel: "min-w-0 flex-1 truncate text-start",
		groupCount: "text-muted-foreground text-xs tabular-nums",
		groupPicked:
			"rounded-full bg-primary/10 px-1.5 font-medium text-primary-hover text-xs tabular-nums empty:hidden",
		options: "flex flex-col gap-1.5 px-2.5 pt-1 pb-2.5",
	},
	variants: {
		variant: {
			card: { root: "rounded-2xl border border-border bg-background" },
			plain: { root: "" },
		},
	},
	defaultVariants: { variant: "card" },
});

export type FilterMenuVariant = NonNullable<VariantProps<typeof filterMenu>["variant"]>;
