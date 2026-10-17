import { tv, type VariantProps } from "tailwind-variants";

const TONES =
	"data-[tone=default]:fill-foreground data-[tone=primary]:fill-primary data-[tone=violet]:fill-violet";

export const signaturePad = tv({
	slots: {
		root: "grid w-full min-w-0 gap-2.5",
		surface: [
			"relative isolate aspect-[60/26] w-full cursor-crosshair touch-none select-none overflow-hidden outline-none transition-[border-color] duration-(--duration-fast)",
			"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		],
		// Clearing wipes the ink away left to right before the strokes are dropped.
		ink: "absolute inset-0 size-full overflow-visible [clip-path:inset(0_0_0_0)] data-[wiping=true]:[clip-path:inset(0_0_0_100%)] data-[wiping=true]:transition-[clip-path] data-[wiping=true]:duration-[560ms] data-[wiping=true]:ease-in-out motion-reduce:transition-none",
		// Redone and replayed strokes fade in; a stroke just drawn is already there.
		stroke: `${TONES} transition-opacity duration-(--duration-base) starting:opacity-0 data-[fresh=true]:transition-none`,
		nib: `${TONES} opacity-35`,
		// The squeegee edge that crosses the pad while the ink is cut away behind it.
		sweep: [
			"pointer-events-none absolute inset-y-0 left-0 w-7 -translate-x-full bg-linear-to-r from-transparent to-foreground/5 opacity-0",
			"after:absolute after:inset-y-[8%] after:right-0 after:w-0.5 after:rounded-full after:bg-foreground/50",
			"data-[wiping=true]:left-full data-[wiping=true]:opacity-100 data-[wiping=true]:transition-[left] data-[wiping=true]:duration-[560ms] data-[wiping=true]:ease-in-out motion-reduce:hidden",
		],
		baseline:
			"pointer-events-none absolute inset-x-[7%] top-[72%] border-border-strong border-t-[1.5px] border-dashed",
		mark: "pointer-events-none absolute top-[72%] left-[7%] size-3.5 -translate-y-[calc(100%+6px)] text-muted-foreground",
		hint: [
			"pointer-events-none absolute top-[72%] left-1/2 -translate-x-1/2 -translate-y-[calc(100%+8px)] whitespace-nowrap text-lg text-muted-foreground",
			"transition-[opacity,translate,scale,filter] duration-(--duration-base) ease-(--ease-ui-out)",
			"data-[hidden=true]:-translate-y-[calc(100%+2px)] data-[hidden=true]:scale-97 data-[hidden=true]:opacity-0 data-[hidden=true]:blur-[2px] motion-reduce:transition-none",
		],
		signer:
			"pointer-events-none absolute top-[calc(72%+8px)] left-[7%] text-muted-foreground text-xs",
		toolbar: "flex flex-wrap items-center justify-between gap-2",
		group: "flex items-center gap-0.5",
		divider: "mx-1.5 h-5 w-px bg-border",
		swatch:
			"size-4 rounded-full data-[tone=default]:bg-foreground data-[tone=primary]:bg-primary data-[tone=violet]:bg-violet",
		weight: "rounded-full bg-current",
		icon: "size-[18px] fill-none stroke-current stroke-[1.75] [stroke-linecap:round] [stroke-linejoin:round]",
		exports: "flex items-center justify-end gap-1.5",
		exportLabel: "mr-1 text-muted-foreground text-xs",
		// Swapped faces share one cell and rise in, e.g. Download to Saved or Play to Stop.
		swap: "col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5 transition-[opacity,translate] duration-(--duration-fast) ease-(--ease-ui-out) starting:translate-y-1 starting:opacity-0 motion-reduce:transition-none",
	},
	variants: {
		/** `default` frames the pad on a bordered surface; `line` keeps only the baseline. */
		variant: {
			default: {
				surface:
					"rounded-2xl border border-border bg-background data-[drawing=true]:border-border-strong",
			},
			line: { surface: "rounded-lg" },
		},
	},
	defaultVariants: { variant: "default" },
});

export type SignaturePadVariant = NonNullable<
	VariantProps<typeof signaturePad>["variant"]
>;
