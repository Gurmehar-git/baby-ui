import { tv, type VariantProps } from "tailwind-variants";

export const ogAppTile = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] flex-col justify-between overflow-hidden bg-[color-mix(in_oklab,var(--foreground)_2%,var(--background))] px-[112px] pt-[132px] pb-[96px] font-sans text-foreground",
		glow: "absolute top-[96px] left-[200px] h-[300px] w-[360px] rounded-full opacity-35 blur-[90px]",
		tile: "relative flex h-[200px] w-[200px] items-center justify-center rounded-[44px] bg-background shadow-[0_24px_48px_-24px_rgb(0_0_0/0.25)] ring-1 ring-border",
		logo: "h-[84px] w-[84px] object-contain",
		body: "relative flex flex-col gap-5",
		title:
			"line-clamp-1 max-w-[960px] font-heading font-semibold text-[64px] leading-[1.1] tracking-[-0.03em]",
		description:
			"line-clamp-2 max-w-[960px] text-[34px] text-muted-foreground leading-snug",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
		tone: {
			chart: { glow: "bg-chart-4" },
			primary: { glow: "bg-primary" },
			neutral: { glow: "bg-foreground/40" },
		},
	},
	defaultVariants: { mode: "light", tone: "chart" },
});

export type OgAppTileMode = NonNullable<VariantProps<typeof ogAppTile>["mode"]>;
export type OgAppTileTone = NonNullable<VariantProps<typeof ogAppTile>["tone"]>;
