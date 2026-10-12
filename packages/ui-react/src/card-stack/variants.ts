import { tv, type VariantProps } from "tailwind-variants";

export const cardStack = tv({
	slots: {
		root: "grid w-full justify-items-center gap-5",
		// The stage reserves the top card plus the edges peeking below, so nothing reflows as cards go.
		stage:
			"group/stack relative isolate h-[calc(var(--card-height)+24px)] w-[min(100%,var(--card-width))] outline-none",
		// Each slot scales from its bottom edge, so the cards behind show a thin, even edge below.
		slot: "pointer-events-none absolute inset-x-0 top-0 h-(--card-height) origin-bottom [transform:translateY(calc(var(--d,0)*12px))_scale(calc(1-var(--d,0)*0.05))]",
		card: "pointer-events-auto absolute inset-0 touch-pan-y select-none rounded-2xl [-webkit-tap-highlight-color:transparent] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:shadow-overlay before:transition-opacity before:duration-(--duration-fast) data-dragging:cursor-grabbing data-dragging:before:opacity-100 data-flying:before:opacity-100 data-top:cursor-grab not-data-top:pointer-events-none group-focus-visible/stack:data-top:outline-2 group-focus-visible/stack:data-top:outline-ring group-focus-visible/stack:data-top:outline-offset-3 motion-reduce:before:transition-none",
		face: "relative h-full overflow-hidden rounded-[inherit] border border-border bg-background text-foreground",
		shade:
			"pointer-events-none absolute inset-0 bg-black/[0.035] opacity-0 dark:bg-black/20",
		// Cards returning to the back of the stack carry no verdict.
		stamp:
			"pointer-events-none absolute top-4 inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-popover pr-3 pl-2.5 font-medium text-foreground text-sm opacity-0 data-[side=left]:right-4 data-[side=right]:left-4 data-[side=right]:border-success/30 data-[side=right]:bg-success/10 [[data-stack-card]:not([data-top]):not([data-flying])_&]:invisible [&_svg]:size-4 data-[side=left]:[&_svg]:text-muted-foreground data-[side=right]:[&_svg]:text-success",
		empty:
			"absolute inset-x-0 top-0 grid h-(--card-height) place-content-center justify-items-center gap-3 rounded-2xl border border-border bg-background p-6 text-center group-focus-visible/stack:outline-2 group-focus-visible/stack:outline-ring group-focus-visible/stack:outline-offset-3 card-fade-up",
		emptyTitle: "m-0 font-medium text-base text-foreground",
		controls: "flex flex-wrap justify-center gap-2 max-[26rem]:flex-nowrap",
		// On the narrowest screens Undo keeps its icon and accessible name, so the controls stay on one row.
		undoLabel: "max-[22.5rem]:sr-only",
	},
	variants: {
		// Server and first paint only; the engine writes the same transforms afterwards.
		variant: {
			stack: {},
			fan: {
				slot: "origin-[50%_120%] [transform:translateX(calc(var(--d,0)*10px))_rotate(calc(var(--d,0)*4deg))_scale(calc(1-var(--d,0)*0.03))]",
			},
			flat: { slot: "[transform:none]", stage: "h-(--card-height)" },
		},
		size: {
			sm: { root: "[--card-height:15rem] [--card-width:16rem]" },
			default: {
				root: "[--card-height:19rem] [--card-width:20rem] max-[26rem]:[--card-height:17.5rem]",
			},
			lg: {
				root: "[--card-height:23rem] [--card-width:24rem] max-[26rem]:[--card-height:19rem]",
			},
		},
	},
	defaultVariants: { variant: "stack", size: "default" },
});

export type CardStackVariant = NonNullable<VariantProps<typeof cardStack>["variant"]>;
export type CardStackSize = NonNullable<VariantProps<typeof cardStack>["size"]>;
