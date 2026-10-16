import { tv, type VariantProps } from "tailwind-variants";

export const ogWordmark = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] items-center justify-center overflow-hidden bg-background font-sans text-foreground",
		mark: "relative flex flex-col items-center gap-6",
		wordmark: "flex items-center gap-6",
		logo: "h-[96px] w-[96px] shrink-0 rounded-[22px] object-cover",
		name: "line-clamp-1 max-w-[900px] font-heading font-semibold text-[112px] leading-[1.1] tracking-[-0.045em]",
		tagline: "line-clamp-1 max-w-[860px] text-[30px] text-muted-foreground",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
	},
	defaultVariants: { mode: "light" },
});

export type OgWordmarkMode = NonNullable<VariantProps<typeof ogWordmark>["mode"]>;
