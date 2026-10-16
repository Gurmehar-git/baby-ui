import { tv, type VariantProps } from "tailwind-variants";

export const ogShowcase = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] flex-col overflow-hidden bg-background p-[72px] font-sans text-foreground",
		brand: "relative flex items-center gap-4",
		logo: "h-[72px] w-[72px] shrink-0 rounded-2xl object-cover",
		site: "line-clamp-1 max-w-[480px] font-semibold text-[32px] tracking-tight",
		title:
			"relative mt-auto line-clamp-4 max-w-[560px] font-heading font-semibold text-[84px] leading-[1.02] tracking-[-0.045em]",
		description:
			"relative mt-5 line-clamp-2 max-w-[520px] text-[24px] text-muted-foreground leading-snug",
		column: "absolute flex w-[214px] flex-col gap-4",
		frame: "flex overflow-hidden rounded-[34px] border border-border bg-muted p-2.5",
		shot: "h-full w-full rounded-[26px] object-cover object-top",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
	},
	defaultVariants: { mode: "light" },
});

export type OgShowcaseMode = NonNullable<VariantProps<typeof ogShowcase>["mode"]>;

/** Two offset columns of framed shots; heights in px, images cycle through them. */
export const OG_SHOWCASE_COLUMNS = [
	{ left: 676, top: -36, heights: [300, 150, 300] },
	{ left: 906, top: -8, heights: [150, 300, 240] },
];
