import { tv, type VariantProps } from "tailwind-variants";

export const ogProductShop = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] overflow-hidden bg-background font-sans text-foreground",
		content: "relative flex min-w-0 flex-1 flex-col py-[64px] pr-[40px] pl-[64px]",
		store: "flex items-center gap-4 font-semibold text-[26px] tracking-tight",
		logo: "h-11 w-11 shrink-0 rounded-xl object-cover",
		storeName: "line-clamp-1",
		body: "mt-auto flex flex-col gap-5",
		name: "line-clamp-3 font-bold font-heading text-[56px] leading-[1.05] tracking-tight",
		rating: "flex items-center gap-3 text-[24px]",
		stars: "flex items-center gap-1",
		star: "",
		score: "font-semibold",
		reviews: "line-clamp-1 text-muted-foreground",
		priceRow: "mt-4 flex items-end gap-5",
		price: "font-bold font-heading text-[76px] leading-none tracking-tight tabular-nums",
		compare:
			"pb-2 text-[32px] text-muted-foreground leading-none line-through tabular-nums",
		stock: "mt-8 flex items-center gap-3 text-[24px] text-muted-foreground",
		stockDot: "h-3 w-3 shrink-0 rounded-full bg-success",
		stockText: "line-clamp-1",
		panel:
			"relative m-[24px] flex w-[520px] shrink-0 items-center justify-center overflow-hidden rounded-[40px]",
		ring: "absolute h-[500px] w-[500px] rounded-full border-2",
		disc: "absolute h-[380px] w-[380px] rounded-full",
		image: "relative h-[400px] w-[400px] object-contain",
		badge:
			"absolute top-[28px] left-[28px] line-clamp-1 max-w-[300px] rounded-full border border-border bg-background px-5 py-2 font-semibold text-[22px]",
		sticker:
			"absolute top-[28px] right-[28px] flex h-[112px] w-[112px] items-center justify-center rounded-full font-bold text-[30px] tracking-tight",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
		tone: {
			chart: {
				panel: "bg-chart-1/10",
				ring: "border-chart-1/25",
				disc: "bg-chart-1/20",
				sticker: "bg-chart-1 text-background",
			},
			primary: {
				panel: "bg-primary/10",
				ring: "border-primary/25",
				disc: "bg-primary/20",
				sticker: "bg-primary text-primary-foreground",
			},
			neutral: {
				panel: "bg-muted",
				ring: "border-border",
				disc: "bg-foreground/10",
				sticker: "bg-foreground text-background",
			},
		},
		star: {
			full: { star: "text-warning" },
			half: { star: "text-warning" },
			empty: { star: "text-border-strong" },
		},
	},
	defaultVariants: { mode: "light", tone: "neutral", star: "full" },
});

export type OgProductShopMode = NonNullable<VariantProps<typeof ogProductShop>["mode"]>;
export type OgProductShopTone = NonNullable<VariantProps<typeof ogProductShop>["tone"]>;
export type OgProductShopStar = NonNullable<VariantProps<typeof ogProductShop>["star"]>;
