import { tv, type VariantProps } from "tailwind-variants";

export const prismGradient = tv({
	slots: {
		root: "inset-0 isolate overflow-hidden bg-background",
		fallback:
			"pointer-events-none absolute inset-0 transition-opacity duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)]",
		canvas:
			"pointer-events-none absolute inset-0 block size-full transition-opacity duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)]",
		content: "relative z-10 size-full",
	},
	variants: {
		tone: {
			chart: {
				fallback:
					"bg-[radial-gradient(circle_at_55%_45%,var(--chart-1)_0%,var(--background)_48%,var(--foreground)_100%)]",
			},
			accent: {
				fallback:
					"bg-[radial-gradient(circle_at_55%_45%,var(--primary)_0%,var(--background)_48%,var(--foreground)_100%)]",
			},
			violet: {
				fallback:
					"bg-[radial-gradient(circle_at_55%_45%,var(--violet)_0%,var(--background)_48%,var(--foreground)_100%)]",
			},
			mono: {
				fallback:
					"bg-[radial-gradient(circle_at_55%_45%,var(--muted-foreground)_0%,var(--background)_48%,var(--foreground)_100%)]",
			},
		},
		speed: { slow: {}, normal: {}, fast: {} },
		position: {
			absolute: { root: "absolute" },
			fixed: { root: "fixed" },
		},
		webgl: {
			true: { fallback: "opacity-0" },
			false: { canvas: "opacity-0" },
		},
	},
	defaultVariants: { tone: "chart", speed: "normal", position: "absolute", webgl: false },
});

export type PrismGradientTone = NonNullable<VariantProps<typeof prismGradient>["tone"]>;
export type PrismGradientSpeed = NonNullable<VariantProps<typeof prismGradient>["speed"]>;
export type PrismGradientPosition = NonNullable<
	VariantProps<typeof prismGradient>["position"]
>;

/** Shader colours per tone: base, band, highlight. */
export const PRISM_GRADIENT_COLORS: Record<PrismGradientTone, readonly string[]> = {
	chart: ["var(--background)", "var(--chart-1)", "var(--foreground)"],
	accent: ["var(--background)", "var(--primary)", "var(--foreground)"],
	violet: ["var(--background)", "var(--violet)", "var(--foreground)"],
	mono: ["var(--background)", "var(--muted-foreground)", "var(--foreground)"],
};

/** Time multiplier per speed. */
export const PRISM_GRADIENT_SPEED: Record<PrismGradientSpeed, number> = {
	slow: 0.5,
	normal: 1,
	fast: 2,
};
