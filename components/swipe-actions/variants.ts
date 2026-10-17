import { tv, type VariantProps } from "tailwind-variants";

// Each action spans the full row from the edge it hides behind and slides in by transform; the
// engine shares the revealed space between them and stretches one across the row on a full swipe.
export const swipeActions = tv({
	slots: {
		root: "overflow-hidden has-[>ul:empty]:hidden",
		list: "m-0 -mb-px list-none p-0 outline-none",
		row: [
			"group/row grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-(--duration-collapse) ease-(--ease-ui-out) starting:grid-rows-[0fr] starting:opacity-0",
			"data-removing:grid-rows-[0fr] data-removing:opacity-0 data-removing:[transition-delay:0s,120ms] motion-reduce:transition-none",
		],
		clip: "relative isolate min-h-0 overflow-hidden",
		content: [
			"relative z-10 flex items-center gap-2 bg-background pr-2 touch-pan-y select-none [-webkit-touch-callout:none]",
			"after:pointer-events-none after:absolute after:right-0 after:bottom-0 after:left-4 after:h-px after:bg-border",
			"pointer-fine:cursor-grab group-data-dragging/row:cursor-grabbing",
		],
		body: "min-w-0 flex-auto",
		more: "grid size-8 flex-none place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground data-popup-open:bg-muted data-[state=open]:bg-muted [&_svg]:size-4.5",
		layer:
			"group/layer absolute inset-y-0 w-full cursor-pointer outline-none data-[side=leading]:right-full data-[side=trailing]:left-full bg-[color-mix(in_oklab,var(--foreground)_20%,var(--background))] text-foreground data-[tone=primary]:bg-primary data-[tone=primary]:text-primary-foreground data-[tone=destructive]:bg-destructive data-[tone=destructive]:text-destructive-foreground",
		glyph:
			"absolute inset-y-0 w-0 group-data-[side=leading]/layer:right-0 group-data-[side=trailing]/layer:left-0",
		face: "absolute inset-y-0 -left-[38px] flex w-[76px] flex-col items-center justify-center gap-0.5",
		icon: "grid place-items-center [&_svg]:size-5",
		label: "whitespace-nowrap font-medium text-xs",
		item: "justify-start gap-2.5 [&_svg]:size-4",
	},
	variants: {
		variant: {
			default: { root: "rounded-xl border bg-background" },
			ghost: {},
		},
		size: {
			sm: { content: "min-h-13 py-2 pl-3" },
			default: { content: "min-h-16 py-3 pl-4" },
		},
	},
	defaultVariants: { variant: "default", size: "default" },
});

export type SwipeActionsVariant = NonNullable<
	VariantProps<typeof swipeActions>["variant"]
>;
export type SwipeActionsSize = NonNullable<VariantProps<typeof swipeActions>["size"]>;
