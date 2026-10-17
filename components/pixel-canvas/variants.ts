import { tv, type VariantProps } from "tailwind-variants";

export const pixelCanvas = tv({
	slots: {
		root: "inset-0 isolate touch-pan-y overflow-hidden bg-background",
		canvas: "pointer-events-none absolute inset-0 block size-full",
		content: "relative z-10 size-full",
	},
	variants: {
		variant: { default: {}, rounded: {}, glow: {} },
		tone: { spectrum: {}, cool: {}, warm: {}, mono: {} },
		position: {
			absolute: { root: "absolute" },
			fixed: { root: "fixed" },
		},
	},
	defaultVariants: { variant: "default", tone: "spectrum", position: "absolute" },
});

export type PixelCanvasVariant = NonNullable<VariantProps<typeof pixelCanvas>["variant"]>;
export type PixelCanvasTone = NonNullable<VariantProps<typeof pixelCanvas>["tone"]>;
export type PixelCanvasPosition = NonNullable<
	VariantProps<typeof pixelCanvas>["position"]
>;
