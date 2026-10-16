import { tv, type VariantProps } from "tailwind-variants";

export const ogProductLaunch = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] overflow-hidden p-[88px] font-sans text-foreground",
		shot: "absolute flex rounded-[36px] [box-shadow:0_32px_96px_-8px_rgb(0_0_0/0.35)]",
		frame: "flex h-full w-full overflow-hidden rounded-[36px]",
		image: "h-full w-full object-cover object-top",
		content: "relative flex h-full flex-col gap-8",
		brand: "flex items-center gap-4 font-semibold text-[26px] tracking-tight",
		logo: "h-11 w-11 rounded-xl object-cover",
		brandName: "line-clamp-1",
		body: "flex flex-col",
		badge:
			"line-clamp-1 max-w-full self-start rounded-full px-5 py-2 font-semibold text-[22px]",
		name: "font-bold font-heading leading-[1] tracking-tighter",
		tagline: "text-muted-foreground leading-snug",
		url: "line-clamp-1 font-medium text-[24px] text-muted-foreground",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
		tone: {
			chart: {
				root: "bg-[linear-gradient(135deg,var(--background)_30%,color-mix(in_oklch,var(--chart-1)_30%,var(--background)))]",
				frame: "bg-[color-mix(in_oklch,var(--chart-1)_20%,var(--background))]",
				badge: "bg-chart-1 text-background",
			},
			primary: {
				root: "bg-[linear-gradient(135deg,var(--background)_30%,color-mix(in_oklch,var(--primary)_30%,var(--background)))]",
				frame: "bg-[color-mix(in_oklch,var(--primary)_20%,var(--background))]",
				badge: "bg-primary text-primary-foreground",
			},
			neutral: {
				root: "bg-[linear-gradient(135deg,var(--background)_30%,color-mix(in_oklch,var(--foreground)_8%,var(--background)))]",
				frame: "bg-[color-mix(in_oklch,var(--foreground)_10%,var(--background))]",
				badge:
					"bg-[color-mix(in_oklch,var(--foreground)_10%,var(--background))] text-foreground",
			},
		},
		layout: {
			split: {
				shot: "top-[120px] left-[620px] h-[560px] w-[680px]",
				content: "w-[470px]",
				body: "mt-auto gap-5",
				name: "line-clamp-2 text-[80px]",
				tagline: "line-clamp-2 text-[28px]",
				url: "mt-1",
			},
			stacked: {
				root: "justify-center pt-[80px]",
				shot: "top-[336px] left-[140px] h-[400px] w-[920px]",
				content: "w-full items-center text-center",
				brand: "hidden",
				body: "items-center gap-4",
				badge: "self-center",
				name: "line-clamp-1 max-w-[1000px] text-[80px]",
				tagline: "line-clamp-1 max-w-[900px] text-[30px]",
				url: "hidden",
			},
		},
	},
	defaultVariants: { mode: "light", tone: "neutral", layout: "split" },
});

export type OgProductLaunchMode = NonNullable<
	VariantProps<typeof ogProductLaunch>["mode"]
>;
export type OgProductLaunchTone = NonNullable<
	VariantProps<typeof ogProductLaunch>["tone"]
>;
export type OgProductLaunchLayout = NonNullable<
	VariantProps<typeof ogProductLaunch>["layout"]
>;
