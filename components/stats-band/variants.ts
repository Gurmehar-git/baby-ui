import { tv, type VariantProps } from "tailwind-variants";

export const statsBand = tv({
	slots: {
		root: "group/band @container/stats w-full bg-background text-foreground",
		inner: "mx-auto w-full max-w-280 px-4 py-16 @xl/stats:px-8",
		header:
			"mb-12 grid gap-4 @3xl/stats:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] @3xl/stats:items-end @3xl/stats:gap-12",
		title:
			"max-w-[16ch] text-balance font-semibold text-3xl tracking-tight @3xl/stats:text-4xl",
		description:
			"max-w-[34ch] text-pretty text-base text-muted-foreground leading-normal @3xl/stats:justify-self-end",
		stats:
			"grid grid-cols-1 gap-x-10 gap-y-12 @xl/stats:grid-cols-2 @4xl/stats:grid-cols-[repeat(var(--count),minmax(0,1fr))]",
		// Hover or focus hands the visual the accent and swaps the detail for its context line.
		stat: [
			"group/stat flex min-w-0 flex-col outline-none [--ink:var(--muted-foreground)] [--soft:var(--border)]",
			"hover:[--ink:var(--primary)] hover:[--soft:color-mix(in_oklch,var(--primary)_40%,var(--background))]",
			"focus-visible:[--ink:var(--primary)] focus-visible:[--soft:color-mix(in_oklch,var(--primary)_40%,var(--background))]",
			"translate-y-2 opacity-0 transition-[opacity,translate] delay-[calc(var(--i)*90ms)] duration-500 ease-(--ease-ui-out) group-data-[seen=true]/band:translate-y-0 group-data-[seen=true]/band:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
		],
		figure:
			"order-first mb-5 flex items-baseline font-semibold text-4xl tabular-nums tracking-tight @3xl/stats:text-5xl",
		affix: "text-[0.6em] text-muted-foreground",
		label: "font-medium text-sm",
		caption: "mt-0.5 grid text-muted-foreground text-sm leading-normal",
		detail:
			"col-start-1 row-start-1 transition-[opacity,translate] duration-(--duration-base) group-data-[context=true]/stat:group-hover/stat:-translate-y-1 group-data-[context=true]/stat:group-hover/stat:opacity-0 group-data-[context=true]/stat:group-focus-visible/stat:opacity-0",
		context:
			"col-start-1 row-start-1 translate-y-1 text-foreground/80 opacity-0 transition-[opacity,translate] duration-(--duration-base) group-hover/stat:translate-y-0 group-hover/stat:opacity-100 group-focus-visible/stat:translate-y-0 group-focus-visible/stat:opacity-100",
		visual: "mt-auto flex h-22 flex-col justify-end pt-8 [&>*]:h-full",
		bars: "flex items-end gap-0.75 data-[dense=true]:h-[56%] data-[dense=true]:gap-0",
		bar: "h-full flex-1 origin-bottom scale-y-(--h) rounded-[1px] bg-(--soft) transition-[background-color,scale] delay-[0ms,calc(var(--j)*420ms+600ms)] duration-[200ms,560ms] ease-(--ease-ui-out) group-data-[seen=false]/band:scale-y-0 data-[ink=true]:bg-(--ink) in-data-[dense=true]:rounded-none in-data-[dense=true]:[clip-path:inset(0_22%_0_22%)] motion-reduce:transition-none",
		map: "h-full w-auto self-start overflow-visible [clip-path:inset(0_-4px_0_0)] transition-[clip-path] delay-600 duration-1000 ease-(--ease-ui-in-out) group-data-[seen=false]/band:[clip-path:inset(0_100%_0_0)] motion-reduce:transition-none",
		land: "fill-(--soft) transition-[fill] duration-(--duration-base)",
		lit: "fill-(--ink) transition-[fill] duration-(--duration-base)",
	},
	variants: {
		variant: {
			plain: {},
			// A hairline grid, ruled above and below.
			divided: {
				stats: "gap-0 border-border border-y",
				stat: "border-border border-b p-6 last:border-b-0 @xl/stats:border-r @xl/stats:[&:nth-child(2n)]:border-r-0 @4xl/stats:border-b-0 @4xl/stats:[&:nth-child(2n)]:border-r @4xl/stats:last:border-r-0",
			},
		},
	},
	defaultVariants: { variant: "plain" },
});

export type StatsBandVariant = NonNullable<VariantProps<typeof statsBand>["variant"]>;
