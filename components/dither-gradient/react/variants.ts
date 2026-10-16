import { tv, type VariantProps } from "tailwind-variants";

export const ditherGradient = tv({
	slots: {
		root: "inset-0 isolate overflow-hidden bg-background",
		canvas:
			"pointer-events-none absolute inset-0 block size-full [image-rendering:pixelated]",
		content: "relative z-10 size-full",
	},
	variants: {
		tone: { spectrum: {}, cool: {}, warm: {}, mono: {} },
		matrix: { bayer2: {}, bayer4: {}, bayer8: {} },
		position: {
			absolute: { root: "absolute" },
			fixed: { root: "fixed" },
		},
	},
	defaultVariants: { tone: "spectrum", matrix: "bayer4", position: "absolute" },
});

export type DitherGradientTone = NonNullable<VariantProps<typeof ditherGradient>["tone"]>;
export type DitherGradientMatrix = NonNullable<
	VariantProps<typeof ditherGradient>["matrix"]
>;
export type DitherGradientPosition = NonNullable<
	VariantProps<typeof ditherGradient>["position"]
>;
