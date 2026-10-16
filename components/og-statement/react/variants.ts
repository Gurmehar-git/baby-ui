import { tv, type VariantProps } from "tailwind-variants";

export const ogStatement = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] flex-col justify-between overflow-hidden bg-[color-mix(in_oklab,var(--foreground)_3%,var(--background))] p-[72px] font-sans text-foreground",
		logo: "h-[64px] w-[64px] shrink-0 object-contain",
		title:
			"line-clamp-3 max-w-[980px] font-heading font-medium text-[76px] leading-[1.12] tracking-[-0.03em]",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
	},
	defaultVariants: { mode: "light" },
});

export type OgStatementMode = NonNullable<VariantProps<typeof ogStatement>["mode"]>;
