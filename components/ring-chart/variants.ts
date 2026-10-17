import { tv, type VariantProps } from "tailwind-variants";

export const ringChart = tv({
	slots: {
		ring: "cursor-pointer transition-opacity duration-(--duration-fast) ease-[cubic-bezier(0,0,0.58,1)]",
		track: "fill-border",
		center:
			"pointer-events-none absolute flex flex-col items-center justify-center text-center",
		caption: "max-w-full truncate text-muted-foreground text-xs",
	},
	variants: {
		cap: {
			round: {},
			butt: {},
		},
		track: {
			true: {},
			false: { track: "hidden" },
		},
	},
	defaultVariants: { cap: "round", track: true },
});

export type RingCap = NonNullable<VariantProps<typeof ringChart>["cap"]>;
