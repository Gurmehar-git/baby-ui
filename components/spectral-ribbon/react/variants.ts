import { tv, type VariantProps } from "tailwind-variants";

export const spectralRibbon = tv({
	slots: {
		root: "inset-0 isolate overflow-hidden bg-background",
		fallback:
			"pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)]",
		canvas:
			"pointer-events-none absolute inset-0 block size-full transition-opacity duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)]",
		content: "relative z-10 size-full",
	},
	variants: {
		tone: {
			spectrum: {
				fallback:
					"bg-[image:radial-gradient(ellipse_60%_30%_at_35%_55%,var(--chart-4),transparent_70%),radial-gradient(ellipse_50%_35%_at_65%_40%,var(--violet),transparent_70%)]",
			},
			chart: {
				fallback:
					"bg-[image:radial-gradient(ellipse_60%_30%_at_35%_55%,var(--chart-1),transparent_70%),radial-gradient(ellipse_50%_35%_at_65%_40%,var(--chart-5),transparent_70%)]",
			},
			mono: {
				fallback:
					"bg-[image:radial-gradient(ellipse_60%_30%_at_35%_55%,var(--muted-foreground),transparent_70%),radial-gradient(ellipse_50%_35%_at_65%_40%,var(--border-strong),transparent_70%)]",
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
	defaultVariants: {
		tone: "spectrum",
		speed: "normal",
		position: "absolute",
		webgl: false,
	},
});

export type SpectralRibbonTone = NonNullable<VariantProps<typeof spectralRibbon>["tone"]>;
export type SpectralRibbonSpeed = NonNullable<
	VariantProps<typeof spectralRibbon>["speed"]
>;
export type SpectralRibbonPosition = NonNullable<
	VariantProps<typeof spectralRibbon>["position"]
>;

/** Surface, core, then the five fringe colours from the warm belly to the cool rim. */
export const SPECTRAL_RIBBON_COLORS: Record<SpectralRibbonTone, readonly string[]> = {
	spectrum: [
		"var(--background)",
		"var(--foreground)",
		"var(--chart-4)",
		"var(--chart-3)",
		"var(--primary)",
		"var(--chart-1)",
		"var(--violet)",
	],
	chart: [
		"var(--background)",
		"var(--foreground)",
		"var(--chart-1)",
		"var(--chart-2)",
		"var(--chart-3)",
		"var(--chart-4)",
		"var(--chart-5)",
	],
	mono: [
		"var(--background)",
		"var(--foreground)",
		"var(--foreground)",
		"color-mix(in oklch, var(--foreground) 80%, var(--background))",
		"color-mix(in oklch, var(--foreground) 60%, var(--background))",
		"var(--muted-foreground)",
		"color-mix(in oklch, var(--foreground) 35%, var(--background))",
	],
};

/** Time multiplier per speed. */
export const SPECTRAL_RIBBON_SPEED: Record<SpectralRibbonSpeed, number> = {
	slow: 0.5,
	normal: 1,
	fast: 2,
};
