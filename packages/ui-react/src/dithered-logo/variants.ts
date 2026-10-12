import { tv, type VariantProps } from "tailwind-variants";

export const ditheredLogo = tv({
	slots: {
		root: "relative isolate w-full touch-none overflow-hidden",
		canvas: "absolute inset-0 block size-full",
	},
	variants: {
		variant: { solid: {}, inverted: {} },
		tone: {
			foreground: { root: "text-foreground" },
			primary: { root: "text-primary" },
			muted: { root: "text-muted-foreground" },
			chart: { root: "text-chart-1" },
		},
		size: {
			sm: { root: "h-40" },
			default: { root: "h-64" },
			lg: { root: "h-96" },
		},
	},
	defaultVariants: { variant: "solid", tone: "foreground", size: "default" },
});

export type DitheredLogoVariant = NonNullable<
	VariantProps<typeof ditheredLogo>["variant"]
>;
export type DitheredLogoTone = NonNullable<VariantProps<typeof ditheredLogo>["tone"]>;
export type DitheredLogoSize = NonNullable<VariantProps<typeof ditheredLogo>["size"]>;
