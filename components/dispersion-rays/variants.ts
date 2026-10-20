import { tv, type VariantProps } from "tailwind-variants";

export const dispersionRays = tv({
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
					"bg-[conic-gradient(from_120deg_at_15%_-10%,transparent_0deg,var(--chart-1)_30deg,var(--chart-4)_45deg,transparent_70deg),radial-gradient(ellipse_at_15%_0%,var(--background),var(--background))]",
			},
			accent: {
				fallback:
					"bg-[conic-gradient(from_120deg_at_15%_-10%,transparent_0deg,var(--primary)_30deg,var(--violet)_45deg,transparent_70deg),radial-gradient(ellipse_at_15%_0%,var(--background),var(--background))]",
			},
			violet: {
				fallback:
					"bg-[conic-gradient(from_120deg_at_15%_-10%,transparent_0deg,var(--violet)_30deg,var(--chart-5)_45deg,transparent_70deg),radial-gradient(ellipse_at_15%_0%,var(--background),var(--background))]",
			},
			mono: {
				fallback:
					"bg-[conic-gradient(from_120deg_at_15%_-10%,transparent_0deg,var(--muted-foreground)_35deg,transparent_70deg),radial-gradient(ellipse_at_15%_0%,var(--background),var(--background))]",
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

export type DispersionRaysTone = NonNullable<VariantProps<typeof dispersionRays>["tone"]>;
export type DispersionRaysSpeed = NonNullable<
	VariantProps<typeof dispersionRays>["speed"]
>;
export type DispersionRaysPosition = NonNullable<
	VariantProps<typeof dispersionRays>["position"]
>;

/** Shader colours per tone: base, ray, highlight. */
export const DISPERSION_RAYS_COLORS: Record<DispersionRaysTone, readonly string[]> = {
	chart: ["var(--background)", "var(--chart-1)", "var(--foreground)"],
	accent: ["var(--background)", "var(--primary)", "var(--foreground)"],
	violet: ["var(--background)", "var(--violet)", "var(--foreground)"],
	mono: ["var(--background)", "var(--muted-foreground)", "var(--foreground)"],
};

/** Time multiplier per speed. */
export const DISPERSION_RAYS_SPEED: Record<DispersionRaysSpeed, number> = {
	slow: 0.5,
	normal: 1,
	fast: 2,
};
