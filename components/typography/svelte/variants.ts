import { tv, type VariantProps } from "tailwind-variants";

export const typography = tv({
	variants: {
		variant: {
			h1: "font-heading text-4xl font-semibold tracking-tight",
			h2: "font-heading text-2xl font-semibold tracking-tight",
			h3: "font-heading text-lg font-semibold tracking-tight",
			body: "text-base leading-relaxed",
			lead: "text-lg text-muted-foreground leading-relaxed",
			small: "text-sm",
			muted: "text-sm text-muted-foreground",
			code: "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em]",
		},
	},
	defaultVariants: { variant: "body" },
});

export type TypographyVariant = NonNullable<VariantProps<typeof typography>["variant"]>;

/** Default tag per variant; overridden by the `as` prop. */
export const TYPOGRAPHY_TAG: Record<TypographyVariant, string> = {
	h1: "h1",
	h2: "h2",
	h3: "h3",
	body: "p",
	lead: "p",
	small: "p",
	muted: "p",
	code: "code",
};
