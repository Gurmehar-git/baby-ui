import { tv, type VariantProps } from "tailwind-variants";

/** Two oversized blob layers drift against each other; the parent only shows their middle. */
export const animatedGradient = tv({
	slots: {
		root: "inset-0 isolate overflow-hidden bg-background",
		layer: "pointer-events-none absolute -inset-1/2 animated-gradient-drift",
		layerAlt: "pointer-events-none absolute -inset-1/2 animated-gradient-drift-alt",
		content: "relative z-10 size-full",
	},
	variants: {
		tone: {
			spectrum: {
				layer:
					"bg-[image:radial-gradient(circle_at_35%_38%,var(--chart-1),transparent_26%),radial-gradient(circle_at_66%_62%,var(--chart-5),transparent_24%)]",
				layerAlt:
					"bg-[image:radial-gradient(circle_at_62%_34%,var(--chart-4),transparent_22%),radial-gradient(circle_at_38%_66%,var(--chart-1),transparent_22%)]",
			},
			cool: {
				layer:
					"bg-[image:radial-gradient(circle_at_35%_38%,var(--chart-1),transparent_26%),radial-gradient(circle_at_66%_62%,var(--chart-3),transparent_24%)]",
				layerAlt:
					"bg-[image:radial-gradient(circle_at_62%_34%,var(--chart-scale-2),transparent_22%),radial-gradient(circle_at_38%_66%,var(--chart-scale-4),transparent_22%)]",
			},
			warm: {
				layer:
					"bg-[image:radial-gradient(circle_at_35%_38%,var(--chart-2),transparent_26%),radial-gradient(circle_at_66%_62%,var(--chart-5),transparent_24%)]",
				layerAlt:
					"bg-[image:radial-gradient(circle_at_62%_34%,var(--chart-4),transparent_22%),radial-gradient(circle_at_38%_66%,var(--chart-2),transparent_22%)]",
			},
			mono: {
				layer:
					"bg-[image:radial-gradient(circle_at_35%_38%,color-mix(in_oklab,var(--foreground)_22%,transparent),transparent_26%),radial-gradient(circle_at_66%_62%,color-mix(in_oklab,var(--muted-foreground)_30%,transparent),transparent_24%)]",
				layerAlt:
					"bg-[image:radial-gradient(circle_at_62%_34%,color-mix(in_oklab,var(--foreground)_14%,transparent),transparent_22%),radial-gradient(circle_at_38%_66%,color-mix(in_oklab,var(--muted-foreground)_24%,transparent),transparent_22%)]",
			},
		},
		position: {
			absolute: { root: "absolute" },
			fixed: { root: "fixed" },
		},
	},
	defaultVariants: { tone: "spectrum", position: "absolute" },
});

export type AnimatedGradientTone = NonNullable<
	VariantProps<typeof animatedGradient>["tone"]
>;
export type AnimatedGradientPosition = NonNullable<
	VariantProps<typeof animatedGradient>["position"]
>;
