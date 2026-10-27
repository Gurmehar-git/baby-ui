import { tv, type VariantProps } from "tailwind-variants";

export const aspectRatio = tv({
	slots: {
		root: "relative w-full min-w-0 overflow-hidden",
		content: "absolute inset-0",
		image: "block size-full",
	},
	variants: {
		motion: {
			smooth: {
				root: "transition-[aspect-ratio] duration-(--duration-overlay) ease-(--ease-drawer)",
			},
			spring: {
				root: "transition-[aspect-ratio] duration-(--duration-spring-bouncy) ease-(--ease-spring-bouncy)",
			},
			none: {},
		},
		fit: {
			cover: { image: "object-cover" },
			contain: { image: "object-contain" },
		},
	},
	defaultVariants: { motion: "smooth", fit: "cover" },
});

export type AspectRatioMotion = NonNullable<VariantProps<typeof aspectRatio>["motion"]>;
export type AspectRatioFit = NonNullable<VariantProps<typeof aspectRatio>["fit"]>;
