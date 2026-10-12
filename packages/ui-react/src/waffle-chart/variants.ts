import { tv, type VariantProps } from "tailwind-variants";

// Cells move on a CSS transform transition with a per-cell delay, so a new dataset flows across the grid.
export const waffleChart = tv({
	slots: {
		cell: [
			"[transform-box:fill-box] origin-center transition-[transform,opacity,fill,stroke] delay-(--waffle-delay) duration-(--duration-collapse) ease-(--ease-out-quart) motion-reduce:transition-none",
			"data-[empty=true]:opacity-0",
		],
		cursor: "pointer-events-none fill-none stroke-2 stroke-foreground/55",
	},
	variants: {
		variant: { mixed: {}, square: {}, round: {} },
	},
	defaultVariants: { variant: "mixed" },
});

export type WaffleVariant = NonNullable<VariantProps<typeof waffleChart>["variant"]>;
