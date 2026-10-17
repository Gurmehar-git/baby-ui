import { tv, type VariantProps } from "tailwind-variants";

export const ogPaperWindow = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] overflow-hidden bg-background font-sans text-foreground",
		image: "absolute inset-0 h-full w-full object-cover",
		// The window runs off the bottom edge, so it reads as a page lying on the artwork.
		paper:
			"absolute top-[92px] left-[132px] flex h-[640px] w-[940px] flex-col rounded-[30px] bg-[color-mix(in_oklab,var(--warning)_5%,var(--background))] px-[52px] pt-[34px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.5)]",
		lights: "flex gap-[10px]",
		light: "h-[16px] w-[16px] rounded-full",
		brand: "mt-[44px] flex items-center gap-4",
		logo: "h-[84px] w-[84px] shrink-0 object-contain",
		name: "line-clamp-1 max-w-[700px] font-heading font-bold text-[96px] leading-none tracking-[-0.05em]",
		title:
			"mt-5 line-clamp-3 max-w-[820px] font-serif text-[78px] leading-[1.06] tracking-[-0.01em]",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
	},
	defaultVariants: { mode: "light" },
});

export type OgPaperWindowMode = NonNullable<VariantProps<typeof ogPaperWindow>["mode"]>;

/** Close, minimise and zoom, from the status tokens so they follow the theme. */
export const ogPaperWindowLight = tv({
	variants: {
		button: {
			close: "bg-destructive",
			minimise: "bg-warning",
			zoom: "bg-success",
		},
	},
});

export const OG_PAPER_WINDOW_LIGHTS = ["close", "minimise", "zoom"] as const;
