import { tv, type VariantProps } from "tailwind-variants";

export const projectionLine = tv({
	slots: {
		line: "fill-none [stroke-linecap:round]",
		marker:
			"transition-opacity duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-box:fill-box] [transform-origin:center]",
	},
	variants: {
		variant: {
			dashed: { line: "[stroke-dasharray:6_4]" },
			dotted: { line: "[stroke-dasharray:0.5_5]" },
			gradient: { line: "[stroke-dasharray:6_4]" },
		},
		curve: {
			linear: {},
			bezier: {},
		},
	},
	defaultVariants: { variant: "dashed", curve: "linear" },
});

export type ProjectionLineVariant = NonNullable<
	VariantProps<typeof projectionLine>["variant"]
>;
export type ProjectionLineCurve = NonNullable<
	VariantProps<typeof projectionLine>["curve"]
>;
