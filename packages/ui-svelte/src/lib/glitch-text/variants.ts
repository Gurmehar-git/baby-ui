import { tv, type VariantProps } from "tailwind-variants";

export const glitchText = tv({
	base: "glitch-text",
	variants: {
		size: {
			sm: "text-2xl",
			default: "text-4xl",
			lg: "text-6xl",
		},
	},
	defaultVariants: { size: "default" },
});

export type GlitchTextSize = NonNullable<VariantProps<typeof glitchText>["size"]>;
/** Not a styling variant: a raw CSS custom property, not a class swap. */
export type GlitchTextBlendMode = "screen" | "normal";
