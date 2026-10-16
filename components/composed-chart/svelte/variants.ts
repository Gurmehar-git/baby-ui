import { tv, type VariantProps } from "tailwind-variants";

export const seriesBar = tv({
	base: "transition-opacity duration-[120ms] ease-[cubic-bezier(0,0,0.58,1)]",
	variants: {
		variant: {
			solid: "",
			soft: "[fill-opacity:0.35]",
			outline: "[fill-opacity:0.12] [stroke-width:1.5]",
		},
	},
	defaultVariants: { variant: "solid" },
});

export type SeriesBarVariant = NonNullable<VariantProps<typeof seriesBar>["variant"]>;
