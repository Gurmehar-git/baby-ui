import { tv, type VariantProps } from "tailwind-variants";

export const ogHairlines = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] flex-col items-center justify-center overflow-hidden bg-background font-sans text-foreground",
		// Hairline guides 64px in from every edge, running the full canvas so they cross at the corners.
		top: "absolute inset-x-0 top-[64px] h-px bg-border",
		bottom: "absolute inset-x-0 bottom-[64px] h-px bg-border",
		left: "absolute inset-y-0 left-[64px] w-px bg-border",
		right: "absolute inset-y-0 right-[64px] w-px bg-border",
		brand: "relative flex items-center gap-3",
		logo: "h-[44px] w-[44px] shrink-0 rounded-full object-contain",
		name: "line-clamp-1 max-w-[600px] font-semibold text-[32px] tracking-[-0.02em]",
		title:
			"relative mt-6 line-clamp-2 max-w-[1000px] text-center font-heading font-bold text-[76px] leading-[1.08] tracking-[-0.035em]",
		description:
			"relative mt-8 line-clamp-2 max-w-[900px] text-center text-[26px] text-muted-foreground leading-snug",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
	},
	defaultVariants: { mode: "light" },
});

export type OgHairlinesMode = NonNullable<VariantProps<typeof ogHairlines>["mode"]>;
