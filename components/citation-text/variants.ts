import { tv, type VariantProps } from "tailwind-variants";

export const citationText = tv({
	slots: {
		root: "text-pretty text-foreground/90 leading-7",
		segment:
			"rounded-[0.2em] box-decoration-clone transition-[background-color] duration-(--duration-fast) ease-(--ease-ui-out) data-[active]:bg-info/15 motion-reduce:transition-none",
		chip: "relative -top-[0.45em] mx-1 h-[1.4em] min-w-[1.4em] items-center justify-center rounded-[0.4em] border border-border bg-card px-[0.3em] align-baseline font-medium text-muted-foreground text-xs tabular-nums leading-none no-underline outline-none transition-[color,border-color,opacity,scale] duration-(--duration-base) ease-(--ease-ui-out) active:scale-(--press-scale-icon) hover:border-foreground/30 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring starting:opacity-0 motion-reduce:transition-none",
		card: "flex w-72 flex-col gap-2",
		cardHead: "flex min-w-0 items-center gap-2 text-muted-foreground text-xs",
		favicon:
			"grid size-4 shrink-0 place-items-center overflow-hidden rounded-[4px] bg-muted font-semibold text-foreground/70 text-xs",
		cardTitle: "line-clamp-2 font-medium text-foreground text-sm leading-snug",
		cardSnippet: "line-clamp-3 text-muted-foreground text-xs leading-relaxed",
		cardLink:
			"inline-flex items-center self-start rounded font-medium text-foreground text-xs underline decoration-border underline-offset-4 outline-none transition-colors hover:decoration-foreground focus-visible:ring-2 focus-visible:ring-ring",
		sources: "mt-4 grid grid-cols-[minmax(0,1fr)] gap-0.5 border-border border-t pt-3",
		sourcesLabel: "mb-1 font-medium text-muted-foreground text-xs",
		sourceList: "grid grid-cols-[minmax(0,1fr)] gap-0.5 *:min-w-0",
		source:
			"flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-none transition-colors duration-(--duration-fast) hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring data-[active]:bg-muted/60 motion-reduce:transition-none",
		sourceNumber:
			"grid size-5 shrink-0 place-items-center rounded-md bg-muted font-medium text-muted-foreground text-xs tabular-nums",
		sourceTitle: "min-w-0 truncate text-foreground/85",
		sourceDomain: "ms-auto shrink-0 text-muted-foreground text-xs",
	},
	variants: {
		chip: {
			number: {},
			domain: { chip: "px-[0.5em] tracking-tight" },
		},
	},
	defaultVariants: { chip: "number" },
});

export type CitationChip = NonNullable<VariantProps<typeof citationText>["chip"]>;
