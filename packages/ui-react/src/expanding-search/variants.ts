import { tv, type VariantProps } from "tailwind-variants";

// The root is the lane the field may grow into; only the shell and the panel take pointer events.
// The shell is both the button and the field: its width and corners spring together.
export const expandingSearch = tv({
	slots: {
		root: "pointer-events-none relative flex w-full data-[anchor=end]:justify-end",
		shell: [
			"group/shell pointer-events-auto relative w-(--es-h) max-w-full overflow-hidden rounded-[calc(var(--es-h)/2)] border bg-background text-muted-foreground",
			"transition-[width,border-radius,border-color,color,scale,box-shadow] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) motion-reduce:transition-none",
			"data-expanded:w-[min(var(--es-max),100%)] data-expanded:rounded-lg data-expanded:border-border-strong data-expanded:text-foreground",
			"not-data-expanded:hover:bg-muted not-data-expanded:hover:text-foreground not-data-expanded:has-[button:active]:scale-[0.97]",
			"has-[button:focus-visible]:ring-3 has-[button:focus-visible]:ring-ring/20 has-[input:focus]:border-ring has-[input:focus]:ring-3 has-[input:focus]:ring-ring/20",
		],
		trigger: "absolute inset-0 z-1 cursor-pointer rounded-[inherit] outline-none",
		icon: "pointer-events-none absolute top-1/2 left-[calc(var(--es-h)/2-8px)] size-4 -translate-y-1/2",
		input:
			"absolute inset-0 size-full bg-transparent pr-10 text-foreground outline-none transition-opacity duration-(--duration-fast) placeholder:text-muted-foreground not-group-data-expanded/shell:opacity-0 group-data-expanded/shell:delay-80 inert:pointer-events-none",
		clear:
			"absolute top-1/2 right-1.5 z-1 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-[opacity,scale,background-color] duration-(--duration-fast) hover:bg-muted hover:text-foreground starting:scale-60 starting:opacity-0 [&_svg]:size-4",
		popup: [
			"static z-50 w-(--anchor-width,var(--bits-combobox-anchor-width)) overflow-hidden rounded-xl border bg-popover text-foreground shadow-(--overlay-shadow) outline-none",
			"transition-[opacity,clip-path] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) [clip-path:inset(0_round_var(--radius-xl))]",
			"data-[starting-style]:opacity-0 data-[starting-style]:[clip-path:inset(0_0_100%_0_round_var(--radius-xl))] data-[ending-style]:opacity-0 data-[ending-style]:duration-(--duration-exit)",
			"starting:data-[state=open]:opacity-0 starting:data-[state=open]:[clip-path:inset(0_0_100%_0_round_var(--radius-xl))] data-[state=closed]:opacity-0 data-[state=closed]:duration-(--duration-exit)",
			"motion-reduce:transition-none",
		],
		list: "relative max-h-[min(22rem,60vh)] overflow-y-auto overscroll-contain p-1.5 scroll-area",
		pill: "pointer-events-none absolute inset-x-1.5 top-0 rounded-lg bg-foreground/6 opacity-0 transition-[translate,height,opacity] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) motion-reduce:transition-none",
		groupLabel: "px-3 pt-2 pb-1 font-medium text-muted-foreground text-xs",
		item: "group/item relative flex min-h-12 cursor-default select-none items-center gap-3 rounded-lg px-3 py-1.5 outline-none",
		title:
			"truncate text-sm [&_mark]:bg-transparent [&_mark]:font-medium [&_mark]:text-foreground",
		meta: "truncate text-muted-foreground text-xs",
		empty: "grid gap-0.5 px-3 pt-3 pb-3.5",
		emptyTitle: "font-medium text-sm [overflow-wrap:anywhere]",
		emptyHint: "text-muted-foreground text-xs",
	},
	variants: {
		size: {
			sm: { shell: "h-8 text-xs [--es-h:2rem]", input: "pl-8" },
			default: { shell: "h-9 text-sm [--es-h:2.25rem]", input: "pl-9" },
			lg: { shell: "h-11 text-sm [--es-h:2.75rem]", input: "pl-10" },
		},
		variant: {
			default: {},
			ghost: {
				shell: "not-data-expanded:border-transparent not-data-expanded:bg-transparent",
			},
		},
	},
	defaultVariants: { size: "default", variant: "default" },
});

export type ExpandingSearchSize = NonNullable<
	VariantProps<typeof expandingSearch>["size"]
>;
export type ExpandingSearchVariant = NonNullable<
	VariantProps<typeof expandingSearch>["variant"]
>;
