import { tv, type VariantProps } from "tailwind-variants";

/**
 * A dense inspector: groups split by hairlines, each with an eyebrow label, an optional action
 * and rows of compact Fields. `card` lifts it onto the card surface.
 */
export const propertyPanel = tv({
	slots: {
		root: "flex w-full flex-col divide-y divide-border/60 text-xs",
		// Padding lives on the parts, so the collapse clip sits clear of the controls' focus rings.
		group: "relative flex flex-col pt-3.5",
		label:
			"flex min-h-5 min-w-0 items-center gap-1.5 px-4 text-muted-foreground text-xs uppercase tracking-wider",
		trigger: [
			"w-full rounded-sm py-0 font-normal text-muted-foreground text-xs uppercase tracking-wider outline-none",
			"hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset [&>svg]:size-3",
		],
		action: "absolute end-4 top-3.5 flex h-5 items-center gap-1",
		content: "flex flex-col gap-3 px-4 pt-3 pb-4 text-foreground text-xs",
		// PropertyPanelControls rows: one label column, then a full-width control of one height.
		switchCell: "ms-auto",
		row: "min-h-8",
		sliderCell: "flex h-8 min-w-0 flex-1 items-center gap-2.5",
		sliderValue:
			"w-9 shrink-0 text-right font-mono text-muted-foreground text-xs tabular-nums",
		fill: "w-full",
		// The segmented group keeps the row height: sm items centred in an h-8 rim.
		segmented: "h-8 w-full items-center",
		segment: "flex-1",
	},
	variants: {
		variant: {
			default: {},
			card: { root: "rounded-xl bg-card" },
		},
	},
	defaultVariants: { variant: "default" },
});

export type PropertyPanelVariant = NonNullable<
	VariantProps<typeof propertyPanel>["variant"]
>;
