import { tv, type VariantProps } from "tailwind-variants";

export const maskText = tv({
	slots: {
		root: "relative inline-flex cursor-none items-center justify-center",
		base: "font-bold leading-snug text-foreground",
		reveal:
			"mask-text-reveal absolute inset-0 flex items-center justify-center font-bold leading-snug text-primary",
	},
	variants: {
		size: {
			sm: { base: "text-2xl", reveal: "text-2xl" },
			default: { base: "text-4xl", reveal: "text-4xl" },
			lg: { base: "text-6xl", reveal: "text-6xl" },
		},
	},
	defaultVariants: { size: "default" },
});

export type MaskTextSize = NonNullable<VariantProps<typeof maskText>["size"]>;
