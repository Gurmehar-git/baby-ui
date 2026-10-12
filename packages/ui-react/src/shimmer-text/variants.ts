import { tv, type VariantProps } from "tailwind-variants";

export const shimmerText = tv({
	base: "shimmer-text relative inline-block",
	variants: {
		// `bell` brightens through soft shoulders instead of a straight ramp.
		variant: {
			default: "",
			bell: "shimmer-text-bell",
		},
		size: {
			inherit: "",
			sm: "text-sm",
			default: "text-base",
			lg: "text-xl",
		},
	},
	defaultVariants: { variant: "default", size: "inherit" },
});

export type ShimmerTextSize = NonNullable<VariantProps<typeof shimmerText>["size"]>;
export type ShimmerTextVariant = NonNullable<VariantProps<typeof shimmerText>["variant"]>;
