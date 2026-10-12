import { tv, type VariantProps } from "tailwind-variants";

export const textReel = tv({
	slots: {
		root: "flex min-w-0 flex-col items-center gap-2 font-bold text-foreground tracking-tight",
		prefix: "font-normal text-xs text-muted-foreground uppercase tracking-widest",
		viewport: "relative w-full overflow-hidden motion-reduce:mask-none",
		track: "flex will-change-transform",
		copy: "flex",
		item: "whitespace-nowrap",
	},
	variants: {
		/** Vertical rolls a column like a slot reel; horizontal drifts one marquee band. */
		orientation: {
			vertical: {
				viewport:
					"h-[2.2em] text-center mask-[linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]",
				track: "absolute inset-x-0 top-0 flex-col leading-[1.1]",
				copy: "flex-col",
				item: "py-1.5",
			},
			horizontal: {
				viewport:
					"mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
				track: "w-max",
				copy: "shrink-0",
				item: "pr-[1em]",
			},
		},
		size: {
			sm: { root: "text-2xl" },
			default: { root: "text-4xl" },
			lg: { root: "text-6xl" },
		},
	},
	defaultVariants: { orientation: "vertical", size: "default" },
});

export type TextReelOrientation = NonNullable<
	VariantProps<typeof textReel>["orientation"]
>;
export type TextReelSize = NonNullable<VariantProps<typeof textReel>["size"]>;
