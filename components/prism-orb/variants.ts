import { tv, type VariantProps } from "tailwind-variants";

export const prismOrb = tv({
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
					"bg-[radial-gradient(circle_at_50%_45%,var(--foreground)_0%,var(--chart-1)_18%,var(--background)_40%),radial-gradient(ellipse_at_70%_80%,var(--chart-4),transparent_55%)]",
			},
			accent: {
				fallback:
					"bg-[radial-gradient(circle_at_50%_45%,var(--foreground)_0%,var(--primary)_18%,var(--background)_40%),radial-gradient(ellipse_at_70%_80%,var(--violet),transparent_55%)]",
			},
			violet: {
				fallback:
					"bg-[radial-gradient(circle_at_50%_45%,var(--foreground)_0%,var(--violet)_18%,var(--background)_40%),radial-gradient(ellipse_at_70%_80%,var(--chart-5),transparent_55%)]",
			},
			mono: {
				fallback:
					"bg-[radial-gradient(circle_at_50%_45%,var(--foreground)_0%,var(--muted-foreground)_18%,var(--background)_40%)]",
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

export type PrismOrbTone = NonNullable<VariantProps<typeof prismOrb>["tone"]>;
export type PrismOrbSpeed = NonNullable<VariantProps<typeof prismOrb>["speed"]>;
export type PrismOrbPosition = NonNullable<VariantProps<typeof prismOrb>["position"]>;

/** Shader colours per tone: base, band, highlight. */
export const PRISM_ORB_COLORS: Record<PrismOrbTone, readonly string[]> = {
	chart: ["var(--background)", "var(--chart-1)", "var(--foreground)"],
	accent: ["var(--background)", "var(--primary)", "var(--foreground)"],
	violet: ["var(--background)", "var(--violet)", "var(--foreground)"],
	mono: ["var(--background)", "var(--muted-foreground)", "var(--foreground)"],
};

/** Time multiplier per speed. */
export const PRISM_ORB_SPEED: Record<PrismOrbSpeed, number> = {
	slow: 0.5,
	normal: 1,
	fast: 2,
};
