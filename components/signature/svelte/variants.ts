import { tv, type VariantProps } from "tailwind-variants";

export const signature = tv({
	slots: {
		root: "relative inline-block whitespace-pre px-[0.1em] py-[0.25em] leading-none",
		ghost: "text-transparent",
		svg: "pointer-events-none absolute inset-0 size-full overflow-visible",
		text: "stroke-current",
		glyph: "signature-glyph",
	},
	variants: {
		variant: {
			ink: { text: "fill-current", glyph: "signature-ink" },
			outline: { text: "fill-none" },
		},
	},
	defaultVariants: { variant: "ink" },
});

export type SignatureVariant = NonNullable<VariantProps<typeof signature>["variant"]>;

/** Per-glyph timing vars: each glyph starts one `step` after the previous. */
export function signatureTiming(length: number, duration: number, delay: number) {
	return {
		"--signature-step": `${duration / Math.max(1, length)}s`,
		"--signature-delay": `${delay}s`,
	};
}
