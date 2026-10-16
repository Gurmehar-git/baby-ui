import { tv, type VariantProps } from "tailwind-variants";

export const splitText = tv({
	base: "relative mx-auto w-fit max-w-full font-black uppercase",
	variants: {
		size: {
			sm: "text-2xl md:text-3xl",
			default: "text-4xl md:text-5xl",
			lg: "text-[clamp(2.25rem,8vw,8rem)]",
		},
	},
	defaultVariants: { size: "lg" },
});

export type SplitTextSize = NonNullable<VariantProps<typeof splitText>["size"]>;
