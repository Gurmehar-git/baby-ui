import { tv, type VariantProps } from "tailwind-variants";

// The engine builds the reels from these slots: a reel is as wide as its glyph, its window is
// taller than the line, and the strip of cells scrolls inside it.
export const slotText = tv({
	slots: {
		root: "relative inline-flex whitespace-pre tabular-nums",
		reels: "inline-flex",
		reel: "relative inline-block overflow-x-clip align-top transition-[width,opacity] duration-350 ease-(--ease-ui-out)",
		sizer: "invisible inline-block whitespace-pre",
		window:
			"absolute inset-x-0 top-1/2 h-[1.6em] -translate-y-1/2 overflow-hidden [mask-image:linear-gradient(transparent,black_22%,black_78%,transparent)]",
		track: "flex flex-col will-change-transform",
		cell: "block h-[1.6em] whitespace-pre text-center leading-[1.6em]",
	},
	variants: {
		size: {
			inherit: {},
			sm: { root: "text-2xl" },
			default: { root: "text-4xl" },
			lg: { root: "text-6xl" },
		},
		variant: {
			default: {},
			mono: { root: "font-mono" },
		},
	},
	defaultVariants: { size: "inherit", variant: "default" },
});

export type SlotTextSize = NonNullable<VariantProps<typeof slotText>["size"]>;
export type SlotTextVariant = NonNullable<VariantProps<typeof slotText>["variant"]>;
