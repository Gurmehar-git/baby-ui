import { tv, type VariantProps } from "tailwind-variants";

export const topographicLines = tv({
	slots: {
		root: "inset-0 isolate overflow-hidden bg-background",
		canvas: "pointer-events-none absolute inset-0 block size-full",
		content: "relative z-10 size-full",
	},
	variants: {
		variant: { lines: {}, filled: {} },
		tone: { mono: {}, primary: {} },
		position: {
			absolute: { root: "absolute" },
			fixed: { root: "fixed" },
		},
	},
	defaultVariants: { variant: "lines", tone: "mono", position: "absolute" },
});

export type TopographicLinesVariant = NonNullable<
	VariantProps<typeof topographicLines>["variant"]
>;
export type TopographicLinesTone = NonNullable<
	VariantProps<typeof topographicLines>["tone"]
>;
export type TopographicLinesPosition = NonNullable<
	VariantProps<typeof topographicLines>["position"]
>;
