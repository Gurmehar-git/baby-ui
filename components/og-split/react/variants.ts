import { tv, type VariantProps } from "tailwind-variants";

export const ogSplit = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] items-center overflow-hidden bg-background pl-[80px] font-sans text-foreground",
		panel:
			"absolute top-0 left-[540px] h-full w-[700px] rounded-l-[315px] border-border border-l object-cover",
		mark: "relative flex max-w-[440px] flex-col items-start gap-6",
		wordmark: "flex items-center gap-6",
		logo: "h-[84px] w-[84px] shrink-0 rounded-[22px] object-cover",
		name: "line-clamp-1 max-w-[340px] font-heading font-semibold text-[84px] leading-[1.1] tracking-[-0.045em]",
		tagline: "line-clamp-2 max-w-[420px] text-[26px] text-muted-foreground leading-snug",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
	},
	defaultVariants: { mode: "dark" },
});

export type OgSplitMode = NonNullable<VariantProps<typeof ogSplit>["mode"]>;
