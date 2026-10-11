import { tv, type VariantProps } from "tailwind-variants";

export const gradientText = tv({
	base: "gradient-text-animate inline-block bg-[length:200%_auto] bg-clip-text text-transparent",
	variants: {
		tone: {
			primary: "bg-gradient-to-r from-primary via-primary to-primary",
			muted: "bg-gradient-to-r from-foreground via-muted-foreground to-foreground",
		},
	},
	defaultVariants: { tone: "primary" },
});

export type GradientTextTone = NonNullable<VariantProps<typeof gradientText>["tone"]>;
