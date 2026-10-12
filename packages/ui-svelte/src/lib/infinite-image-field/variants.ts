import { tv, type VariantProps } from "tailwind-variants";

export type InfiniteImageItem = {
	/** Image URL; remote images need CORS headers for the gallery's WebGL textures. */
	src: string;
	alt: string;
	title?: string;
	/** Short right-aligned caption, e.g. a year. */
	caption?: string;
};

export const infiniteImageField = tv({
	slots: {
		root: "relative isolate w-full overflow-hidden rounded-xl border border-border bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring",
		canvas: "pointer-events-none absolute inset-0 block size-full",
		vignette:
			"pointer-events-none absolute inset-0 bg-radial from-transparent from-55% to-background/70",
		status: "absolute inset-0 grid place-items-center",
		hint: "pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-muted-foreground/70 text-xs uppercase tracking-widest",
		fallback:
			"grid h-full auto-rows-max grid-cols-2 gap-3 overflow-auto p-3 sm:grid-cols-3",
		fallbackImage: "aspect-square w-full rounded-md object-cover",
		fallbackCaption:
			"mt-1 flex justify-between gap-2 font-mono text-muted-foreground text-xs uppercase",
	},
	variants: {
		/** Drift follows the pointer; fisheye and gallery pan by drag, through a 2D or WebGL lens. */
		variant: {
			drift: {},
			fisheye: {
				root: "cursor-grab touch-none select-none data-[dragging=true]:cursor-grabbing",
			},
			gallery: {
				root: "cursor-grab touch-none select-none text-muted-foreground active:cursor-grabbing",
				canvas:
					"transition-opacity duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)]",
			},
		},
		shape: { square: {}, rounded: {} },
		layout: { grid: {}, staggered: {} },
		size: {
			sm: { root: "h-64" },
			default: { root: "h-96" },
			lg: { root: "h-[32rem]" },
		},
	},
	defaultVariants: {
		variant: "drift",
		shape: "rounded",
		layout: "grid",
		size: "default",
	},
});

export type InfiniteImageFieldVariant = NonNullable<
	VariantProps<typeof infiniteImageField>["variant"]
>;
export type InfiniteImageFieldShape = NonNullable<
	VariantProps<typeof infiniteImageField>["shape"]
>;
export type InfiniteImageFieldLayout = NonNullable<
	VariantProps<typeof infiniteImageField>["layout"]
>;
export type InfiniteImageFieldSize = NonNullable<
	VariantProps<typeof infiniteImageField>["size"]
>;

/** Tile corner radius per shape, as a share of the tile's shorter side. */
export const SHAPE_RADIUS: Record<InfiniteImageFieldShape, number> = {
	square: 0,
	rounded: 0.08,
};

/** Lens strength when `lens` is unset: fisheye magnification, gallery barrel distortion. */
export const DEFAULT_LENS: Record<InfiniteImageFieldVariant, number> = {
	drift: 0,
	fisheye: 0.8,
	gallery: 0.08,
};
