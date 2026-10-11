import { tv, type VariantProps } from "tailwind-variants";
import { controlSize, fieldFrame, fieldText } from "../lib/control";

export const input = tv({
	base: [fieldFrame(), "w-full min-w-0 placeholder:text-muted-foreground"],
	variants: {
		size: {
			xs: [controlSize({ size: "xs" }), fieldText({ size: "xs" }), "px-2"],
			sm: [controlSize({ size: "sm" }), fieldText({ size: "sm" }), "px-2.5"],
			default: [controlSize({ size: "default" }), fieldText({ size: "default" }), "px-3"],
			lg: [controlSize({ size: "lg" }), fieldText({ size: "lg" }), "px-3.5"],
			xl: [controlSize({ size: "xl" }), fieldText({ size: "xl" }), "px-4"],
		},
	},
	defaultVariants: { size: "default" },
});

export type InputSize = NonNullable<VariantProps<typeof input>["size"]>;
