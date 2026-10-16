import { tv, type VariantProps } from "tailwind-variants";

export const lightCaustics = tv({
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
			ocean: {
				fallback:
					"bg-[radial-gradient(ellipse_at_50%_35%,var(--primary),transparent_60%),radial-gradient(ellipse_at_20%_80%,var(--info),transparent_55%)]_opacity-30",
			},
			lagoon: {
				fallback:
					"bg-[radial-gradient(ellipse_at_50%_35%,var(--primary),transparent_60%),radial-gradient(ellipse_at_20%_80%,var(--chart-3),transparent_55%)]_opacity-30",
			},
			ember: {
				fallback:
					"bg-[radial-gradient(ellipse_at_50%_35%,var(--chart-4),transparent_60%),radial-gradient(ellipse_at_20%_80%,var(--chart-2),transparent_55%)]_opacity-30",
			},
			mono: {
				fallback:
					"bg-[radial-gradient(ellipse_at_50%_35%,color-mix(in_oklch,_var(--foreground)_60%,_var(--background)),transparent_60%),radial-gradient(ellipse_at_20%_80%,var(--muted-foreground),transparent_55%)]_opacity-30",
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
	defaultVariants: { tone: "ocean", speed: "normal", position: "absolute", webgl: false },
});

export type LightCausticsTone = NonNullable<VariantProps<typeof lightCaustics>["tone"]>;
export type LightCausticsSpeed = NonNullable<VariantProps<typeof lightCaustics>["speed"]>;
export type LightCausticsPosition = NonNullable<
	VariantProps<typeof lightCaustics>["position"]
>;

/** Shader colours per tone: base, then the three tone colours. */
export const LIGHT_CAUSTICS_COLORS: Record<LightCausticsTone, readonly string[]> = {
	ocean: [
		"var(--background)",
		"var(--info)",
		"var(--primary)",
		"color-mix(in oklch, var(--foreground) 55%, var(--primary))",
	],
	lagoon: [
		"var(--background)",
		"var(--chart-3)",
		"var(--primary)",
		"color-mix(in oklch, var(--foreground) 55%, var(--chart-3))",
	],
	ember: [
		"var(--background)",
		"var(--chart-2)",
		"var(--chart-4)",
		"color-mix(in oklch, var(--foreground) 55%, var(--chart-4))",
	],
	mono: [
		"var(--background)",
		"var(--muted-foreground)",
		"color-mix(in oklch, var(--foreground) 60%, var(--background))",
		"var(--foreground)",
	],
};

/** Time multiplier per speed. */
export const LIGHT_CAUSTICS_SPEED: Record<LightCausticsSpeed, number> = {
	slow: 0.5,
	normal: 1,
	fast: 2,
};
