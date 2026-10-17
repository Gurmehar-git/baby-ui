import { tv, type VariantProps } from "tailwind-variants";

export const dotMatrixGlow = tv({
	slots: {
		root: "inset-0 isolate touch-pan-y overflow-hidden bg-background",
		canvas: "pointer-events-none absolute inset-0 block size-full",
		content: "relative z-10 size-full",
	},
	variants: {
		shape: { dot: {}, square: {}, plus: {} },
		size: { sm: {}, default: {}, lg: {} },
		tone: { primary: {}, spectrum: {}, mono: {} },
		position: {
			absolute: { root: "absolute" },
			fixed: { root: "fixed" },
		},
	},
	defaultVariants: {
		shape: "dot",
		size: "default",
		tone: "primary",
		position: "absolute",
	},
});

export type DotMatrixGlowShape = NonNullable<VariantProps<typeof dotMatrixGlow>["shape"]>;
export type DotMatrixGlowSize = NonNullable<VariantProps<typeof dotMatrixGlow>["size"]>;
export type DotMatrixGlowTone = NonNullable<VariantProps<typeof dotMatrixGlow>["tone"]>;
export type DotMatrixGlowPosition = NonNullable<
	VariantProps<typeof dotMatrixGlow>["position"]
>;

/** Grid pitch and dot radius, in CSS px, for each density preset. */
export const DOT_MATRIX_SIZE: Record<DotMatrixGlowSize, { gap: number; dot: number }> = {
	sm: { gap: 14, dot: 1.25 },
	default: { gap: 20, dot: 1.6 },
	lg: { gap: 28, dot: 2.2 },
};
