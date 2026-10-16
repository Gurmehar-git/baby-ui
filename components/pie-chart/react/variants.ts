import { tv, type VariantProps } from "tailwind-variants";

export const pieChart = tv({
	slots: {
		slice:
			"cursor-pointer outline-none transition-opacity duration-(--duration-fast) ease-[cubic-bezier(0,0,0.58,1)]",
		label:
			"pointer-events-none fill-foreground stroke-background font-medium text-xs tabular-nums transition-opacity duration-300 [paint-order:stroke] [stroke-width:3px]",
		center:
			"pointer-events-none absolute flex flex-col items-center justify-center text-center",
		caption: "max-w-full truncate text-muted-foreground text-xs",
	},
	variants: {
		variant: {
			pie: { center: "hidden" },
			donut: {},
		},
		hover: {
			translate: {},
			grow: {},
		},
	},
	defaultVariants: { variant: "donut", hover: "translate" },
});

export type PieVariant = NonNullable<VariantProps<typeof pieChart>["variant"]>;
export type PieHover = NonNullable<VariantProps<typeof pieChart>["hover"]>;

/** Donut hole as a share of the outer radius. */
export const PIE_INNER_RATIO: Record<PieVariant, number> = { pie: 0, donut: 0.62 };
