import { tv, type VariantProps } from "tailwind-variants";

export const rippleTransition = tv({
	slots: {
		root: "relative isolate aspect-[4/3] w-full overflow-hidden bg-muted",
		layer: "pointer-events-none absolute inset-0",
		image: "size-full select-none object-cover",
		rings: "pointer-events-none absolute inset-0 z-20",
		ring: "ripple-transition-ring absolute top-[var(--rt-y)] left-[var(--rt-x)] -translate-1/2 rounded-full border-background/70 shadow-[0_0_24px_color-mix(in_oklch,var(--background)_55%,transparent)]",
		trigger:
			"absolute inset-0 z-30 cursor-pointer rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
	},
	variants: {
		state: {
			idle: { layer: "invisible" },
			current: { layer: "z-0" },
			leave: { layer: "ripple-transition-leave z-0" },
			enter: { layer: "ripple-transition-enter z-10" },
		},
		rings: {
			none: { rings: "hidden" },
			single: { ring: "border-2" },
			echo: { ring: "border" },
		},
		radius: {
			none: { root: "rounded-none" },
			md: { root: "rounded-md" },
			xl: { root: "rounded-2xl" },
		},
	},
	defaultVariants: { state: "idle", rings: "single", radius: "xl" },
});

export type RippleTransitionRings = NonNullable<
	VariantProps<typeof rippleTransition>["rings"]
>;
export type RippleTransitionRadius = NonNullable<
	VariantProps<typeof rippleTransition>["radius"]
>;
export type RippleTransitionState = NonNullable<
	VariantProps<typeof rippleTransition>["state"]
>;

/** Rings drawn per transition. */
export const RIPPLE_TRANSITION_RING_COUNT: Record<RippleTransitionRings, number> = {
	none: 0,
	single: 1,
	echo: 3,
};
