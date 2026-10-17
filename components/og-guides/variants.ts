import { tv, type VariantProps } from "tailwind-variants";

export const ogGuides = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] flex-col overflow-hidden bg-background px-[128px] pt-[150px] font-sans text-foreground",
		// Edge guides 64px in, full length, so they cross at the corners like a layout grid.
		top: "absolute inset-x-0 top-[64px] h-px bg-border",
		bottom: "absolute inset-x-0 bottom-[64px] h-px bg-border",
		left: "absolute inset-y-0 left-[64px] w-px bg-border",
		right: "absolute inset-y-0 right-[64px] w-px bg-border",
		title:
			"relative line-clamp-2 max-w-[760px] font-heading font-semibold text-[60px] leading-[1.12] tracking-[-0.03em]",
		description:
			"relative mt-4 line-clamp-4 max-w-[780px] text-[34px] text-muted-foreground leading-[1.5]",
		logo: "absolute right-[112px] bottom-[112px] h-[52px] w-[52px] object-contain",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
	},
	defaultVariants: { mode: "dark" },
});

export type OgGuidesMode = NonNullable<VariantProps<typeof ogGuides>["mode"]>;
