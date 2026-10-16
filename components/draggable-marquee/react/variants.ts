import { tv, type VariantProps } from "tailwind-variants";

export const draggableMarquee = tv({
	slots: {
		root: "relative w-full cursor-grab touch-pan-y select-none overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing",
		track: "flex w-max will-change-transform",
		copy: "flex shrink-0 items-center [&_img]:pointer-events-none",
	},
	variants: {
		gap: {
			sm: { track: "gap-3", copy: "gap-3" },
			md: { track: "gap-6", copy: "gap-6" },
			lg: { track: "gap-10", copy: "gap-10" },
		},
		direction: {
			left: {},
			right: {},
		},
	},
	defaultVariants: { gap: "md", direction: "left" },
});

export type DraggableMarqueeGap = NonNullable<
	VariantProps<typeof draggableMarquee>["gap"]
>;
export type DraggableMarqueeDirection = NonNullable<
	VariantProps<typeof draggableMarquee>["direction"]
>;
