import { tv, type VariantProps } from "tailwind-variants";

export const ogScatter = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] items-center justify-center overflow-hidden bg-[color-mix(in_oklab,var(--foreground)_3%,var(--background))] font-sans text-foreground",
		tile: "absolute overflow-hidden rounded-[28px] object-cover shadow-[0_28px_56px_-28px_rgb(0_0_0/0.45)]",
		softTile: "blur-[3px]",
		mark: "relative flex flex-col items-center gap-6",
		wordmark: "flex items-center gap-6",
		logo: "h-[96px] w-[96px] shrink-0 rounded-[22px] object-cover",
		name: "line-clamp-1 max-w-[560px] font-heading font-semibold text-[104px] leading-[1.1] tracking-[-0.045em]",
		tagline: "line-clamp-1 max-w-[520px] text-[28px] text-muted-foreground",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
	},
	defaultVariants: { mode: "light" },
});

export type OgScatterMode = NonNullable<VariantProps<typeof ogScatter>["mode"]>;

/** Tile slots around the centred wordmark; images cycle through them, `soft` ones blur. */
export const OG_SCATTER_TILES = [
	{ left: 64, top: 52, width: 250, height: 240, soft: true },
	{ left: 352, top: -64, width: 200, height: 160, soft: false },
	{ left: 668, top: -44, width: 260, height: 214, soft: true },
	{ left: 968, top: 44, width: 290, height: 380, soft: false },
	{ left: -44, top: 372, width: 300, height: 260, soft: false },
	{ left: 334, top: 474, width: 290, height: 200, soft: true },
	{ left: 704, top: 502, width: 230, height: 170, soft: false },
];
