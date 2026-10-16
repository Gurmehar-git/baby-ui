import { tv, type VariantProps } from "tailwind-variants";

export const circularText = tv({
	base: "circular-text relative mx-auto flex aspect-square overflow-hidden origin-center items-center justify-center rounded-full text-center font-bold text-foreground",
	variants: {
		direction: {
			clockwise: "",
			counterclockwise: "",
		},
	},
	defaultVariants: { direction: "clockwise" },
});

export type CircularTextDirection = NonNullable<
	VariantProps<typeof circularText>["direction"]
>;
