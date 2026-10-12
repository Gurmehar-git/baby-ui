import { tv, type VariantProps } from "tailwind-variants";

export const signaturePad = tv({
	slots: {
		root: "grid w-full gap-2",
		surface: [
			"relative aspect-[60/26] w-full cursor-crosshair touch-none select-none outline-none",
			"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		],
		// Clearing wipes the ink away left to right before the strokes are dropped.
		ink: "absolute inset-0 size-full [clip-path:inset(0_0_0_0)] transition-[clip-path] duration-300 ease-(--ease-ui-out) data-[wiping=true]:[clip-path:inset(0_0_0_100%)] motion-reduce:transition-none",
		stroke: "data-[tone=default]:fill-foreground data-[tone=primary]:fill-primary",
		baseline: "pointer-events-none absolute inset-x-[8%] bottom-[24%] h-px bg-border",
		hint: "pointer-events-none absolute bottom-[26%] left-[8%] text-muted-foreground text-sm transition-opacity duration-(--duration-base) data-[hidden=true]:opacity-0",
		signer:
			"pointer-events-none absolute bottom-[12%] left-[8%] text-muted-foreground text-xs",
		toolbar: "flex flex-wrap items-center justify-between gap-2",
		group: "flex items-center gap-1",
		swatch:
			"size-3 rounded-full data-[tone=default]:bg-foreground data-[tone=primary]:bg-primary",
	},
	variants: {
		/** `default` frames the pad on a bordered surface; `line` keeps only the baseline. */
		variant: {
			default: { surface: "rounded-2xl border border-border bg-background" },
			line: { surface: "rounded-lg" },
		},
	},
	defaultVariants: { variant: "default" },
});

export type SignaturePadVariant = NonNullable<
	VariantProps<typeof signaturePad>["variant"]
>;
