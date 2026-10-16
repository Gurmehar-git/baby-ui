import { tv, type VariantProps } from "tailwind-variants";

/** Glyphs take the root's font family and weight; override with any `font-*` class. */
export const asciiEffect = tv({
	slots: {
		root: "inset-0 isolate overflow-hidden bg-background font-mono text-foreground",
		canvas: "pointer-events-none absolute inset-0 block size-full",
		content: "relative z-10 size-full",
	},
	variants: {
		variant: { image: {}, flow: {}, glitch: {} },
		tone: { mono: {}, spectrum: {}, cool: {}, warm: {}, source: {} },
		dither: { none: {}, bayer: {}, "floyd-steinberg": {} },
		fit: { cover: {}, contain: {} },
		position: {
			absolute: { root: "absolute" },
			fixed: { root: "fixed" },
		},
	},
	defaultVariants: {
		variant: "image",
		tone: "mono",
		dither: "floyd-steinberg",
		fit: "cover",
		position: "absolute",
	},
});

export type AsciiEffectVariant = NonNullable<VariantProps<typeof asciiEffect>["variant"]>;
export type AsciiEffectTone = NonNullable<VariantProps<typeof asciiEffect>["tone"]>;
export type AsciiEffectDither = NonNullable<VariantProps<typeof asciiEffect>["dither"]>;
export type AsciiEffectFit = NonNullable<VariantProps<typeof asciiEffect>["fit"]>;
export type AsciiEffectPosition = NonNullable<
	VariantProps<typeof asciiEffect>["position"]
>;
