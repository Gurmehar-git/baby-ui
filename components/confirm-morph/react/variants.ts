import { tv, type VariantProps } from "tailwind-variants";

// Only the pill's width moves: every face sits at its natural width on the leading edge, so text
// never squeezes, and the inactive faces leave the flow.
export const confirmMorph = tv({
	slots: {
		root: "relative inline-flex max-w-full align-middle text-foreground outline-none [-webkit-tap-highlight-color:transparent]",
		surface:
			"relative inline-grid max-w-full justify-start overflow-clip rounded-full border bg-background shadow-xs transition-[width] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) motion-reduce:transition-none",
		face: "group/face col-start-1 row-start-1 flex h-full w-max items-center gap-0.5 whitespace-nowrap px-1 transition-[opacity,filter] duration-(--duration-instant) data-[on=false]:pointer-events-none data-[on=false]:absolute data-[on=false]:top-0 data-[on=false]:left-0 data-[on=false]:opacity-0 data-[on=false]:blur-[2px] data-[face=idle]:px-0 motion-reduce:transition-none",
		// Parts arrive in reading order; a leaving face keeps them until it has faded.
		part: "inline-flex h-full items-center transition-[opacity,filter] delay-[calc(50ms+var(--i,0)*40ms)] duration-260 ease-(--ease-ui-out) group-data-[on=false]/face:opacity-0 group-data-[on=false]/face:blur-[3px] group-data-[on=false]/face:delay-(--duration-instant) group-data-[on=false]/face:duration-0 motion-reduce:transition-none",
		trigger:
			"inline-flex h-full items-center gap-2 rounded-full pr-4 pl-3.5 font-medium outline-none transition-colors duration-(--duration-fast) hover:bg-foreground/5 focus-visible:bg-foreground/6 active:bg-foreground/9 disabled:cursor-not-allowed disabled:text-muted-foreground [&_svg]:size-4 [&_svg]:text-muted-foreground",
		prompt: "max-w-64 truncate pr-2 pl-3 font-medium tabular-nums",
		action: "rounded-full px-3 outline-none focus-visible:ring-0",
		secondary:
			"text-muted-foreground hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground",
		hold: "overflow-clip select-none [-webkit-touch-callout:none] data-holding:scale-[0.97]",
		fill: "pointer-events-none absolute inset-0 flex items-center justify-center rounded-[inherit]",
		status: "gap-2 pr-2.5 pl-3 font-medium tabular-nums [&>svg]:size-4 [&>svg]:flex-none",
		muted: "text-muted-foreground",
		check: "size-4.5 fill-success stroke-background",
		tick: "transition-[stroke-dashoffset] delay-150 duration-300 ease-(--ease-ui-out) [stroke-dasharray:1] [stroke-dashoffset:1] group-data-[on=true]/face:[stroke-dashoffset:0] motion-reduce:transition-none",
		ring: "size-4 -rotate-90",
		ringTrack: "stroke-border",
		ringFill: "[stroke-dasharray:1]",
		alert: "text-destructive",
	},
	variants: {
		variant: {
			destructive: {
				ringFill: "stroke-destructive",
				fill: "bg-destructive text-destructive-foreground",
			},
			default: {
				ringFill: "stroke-primary",
				fill: "bg-(--primary-hover) text-primary-foreground",
			},
		},
		size: {
			sm: { surface: "h-8 text-xs", action: "h-6" },
			default: { surface: "h-9 text-sm", action: "h-7" },
			lg: { surface: "h-11 text-base", action: "h-9 px-4" },
		},
	},
	defaultVariants: { variant: "destructive", size: "default" },
});

export type ConfirmMorphVariant = NonNullable<
	VariantProps<typeof confirmMorph>["variant"]
>;
export type ConfirmMorphSize = NonNullable<VariantProps<typeof confirmMorph>["size"]>;
