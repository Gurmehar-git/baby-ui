import { tv, type VariantProps } from "tailwind-variants";

// The popup opens over its trigger: it starts clipped to the trigger's box, its lid repeats the
// trigger, and the clip springs out to the full list. Base UI and bits-ui name the anchor size differently.
export const morphSelect = tv({
	slots: {
		root: "inline-flex flex-col gap-1.5",
		label: "font-medium text-sm",
		trigger:
			"group/trigger inline-flex items-center justify-between gap-2 rounded-lg border border-input bg-popover font-medium text-foreground outline-none transition-[border-color,opacity] duration-(--duration-fast) hover:border-border-strong focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
		frame:
			"relative inline-grid min-w-0 overflow-clip transition-[width] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) motion-reduce:transition-none",
		// A new value rolls in as it mounts; @starting-style needs no exit bookkeeping.
		value:
			"col-start-1 row-start-1 flex w-max items-center gap-2 whitespace-nowrap transition-[opacity,translate,filter] duration-260 ease-(--ease-ui-out) starting:translate-y-[0.5em] starting:opacity-0 starting:blur-[3px] motion-reduce:transition-none",
		placeholder: "text-muted-foreground",
		chevron:
			"size-4 shrink-0 text-muted-foreground transition-[rotate] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) motion-reduce:transition-none",
		popup: [
			"group/popup static z-50 overflow-clip rounded-xl border border-border-strong bg-popover text-foreground shadow-(--overlay-shadow) outline-none",
			"w-(--ms-panel) min-w-(--ms-w) [--ms-h:var(--anchor-height,var(--bits-select-anchor-height))] [--ms-w:var(--anchor-width,var(--bits-select-anchor-width))]",
			"transition-[clip-path,box-shadow] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) [clip-path:inset(0_round_var(--radius-xl))]",
			"data-[closed]:[clip-path:inset(0_calc(100%-var(--ms-w))_calc(100%-var(--ms-h))_0_round_var(--radius-lg))] data-[starting-style]:[clip-path:inset(0_calc(100%-var(--ms-w))_calc(100%-var(--ms-h))_0_round_var(--radius-lg))]",
			"data-[state=closed]:[clip-path:inset(0_calc(100%-var(--ms-w))_calc(100%-var(--ms-h))_0_round_var(--radius-lg))] starting:data-[state=open]:[clip-path:inset(0_calc(100%-var(--ms-w))_calc(100%-var(--ms-h))_0_round_var(--radius-lg))]",
			"data-[closed]:shadow-none data-[starting-style]:shadow-none data-[state=closed]:shadow-none starting:data-[state=open]:shadow-none",
			"data-[closed]:duration-(--duration-exit) data-[state=closed]:duration-(--duration-exit) data-[closed]:ease-(--ease-ui-out) data-[state=closed]:ease-(--ease-ui-out)",
			"motion-reduce:transition-none",
		],
		lid: "flex h-(--ms-h) w-full cursor-default items-center justify-between gap-2 font-medium",
		list: "relative max-h-(--ms-list) overflow-y-auto overscroll-contain p-1 scroll-area transition-[opacity,filter,translate] delay-40 duration-200 ease-(--ease-ui-out) group-data-[closed]/popup:opacity-0 group-data-[state=closed]/popup:opacity-0 group-data-[starting-style]/popup:-translate-y-1.5 group-data-[starting-style]/popup:opacity-0 group-data-[starting-style]/popup:blur-[2px] starting:group-data-[state=open]/popup:-translate-y-1.5 starting:group-data-[state=open]/popup:opacity-0 group-data-[closed]/popup:delay-0 group-data-[state=closed]/popup:delay-0 motion-reduce:transition-none",
		pill: "pointer-events-none absolute inset-x-1 top-0 rounded-lg bg-accent opacity-0 transition-[translate,height,opacity] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) motion-reduce:transition-none",
		groupLabel: "px-2.5 pt-2 pb-1 font-medium text-muted-foreground text-xs",
		item: "relative flex w-full cursor-default select-none items-center gap-2 rounded-lg px-2.5 py-1.5 outline-none data-[disabled]:opacity-50",
		meta: "ml-auto text-muted-foreground text-xs tabular-nums",
		check: "menu-check size-3.5 shrink-0",
	},
	variants: {
		size: {
			sm: { trigger: "h-8 px-2.5 text-xs", lid: "px-2.5 text-xs", item: "text-xs" },
			default: { trigger: "h-9 px-3 text-sm", lid: "px-3 text-sm", item: "text-sm" },
			lg: { trigger: "h-10 px-3.5 text-sm", lid: "px-3.5 text-sm", item: "py-2 text-sm" },
		},
		variant: {
			default: {},
			ghost: {
				trigger:
					"border-transparent bg-transparent hover:border-transparent hover:bg-accent",
			},
		},
	},
	defaultVariants: { size: "default", variant: "default" },
});

export type MorphSelectSize = NonNullable<VariantProps<typeof morphSelect>["size"]>;
export type MorphSelectVariant = NonNullable<VariantProps<typeof morphSelect>["variant"]>;
