import { tv, type VariantProps } from "tailwind-variants";

export const chromaticWave = tv({
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
			spectrum: {
				fallback:
					"bg-[repeating-linear-gradient(170deg,transparent_0_14px,var(--chart-1)_14px_15px),radial-gradient(ellipse_at_60%_40%,var(--violet),transparent_60%)]_opacity-25",
			},
			cool: {
				fallback:
					"bg-[repeating-linear-gradient(170deg,transparent_0_14px,var(--info)_14px_15px),radial-gradient(ellipse_at_60%_40%,var(--primary),transparent_60%)]_opacity-25",
			},
			warm: {
				fallback:
					"bg-[repeating-linear-gradient(170deg,transparent_0_14px,var(--chart-4)_14px_15px),radial-gradient(ellipse_at_60%_40%,var(--chart-2),transparent_60%)]_opacity-25",
			},
			mono: {
				fallback:
					"bg-[repeating-linear-gradient(170deg,transparent_0_14px,var(--muted-foreground)_14px_15px),radial-gradient(ellipse_at_60%_40%,color-mix(in_oklch,_var(--foreground)_70%,_var(--background)),transparent_60%)]_opacity-25",
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

export type ChromaticWaveTone = NonNullable<VariantProps<typeof chromaticWave>["tone"]>;
export type ChromaticWaveSpeed = NonNullable<VariantProps<typeof chromaticWave>["speed"]>;
export type ChromaticWavePosition = NonNullable<
	VariantProps<typeof chromaticWave>["position"]
>;

/** Shader colours per tone: base, then the three tone colours. */
export const CHROMATIC_WAVE_COLORS: Record<ChromaticWaveTone, readonly string[]> = {
	spectrum: ["var(--background)", "var(--chart-1)", "var(--violet)", "var(--chart-4)"],
	cool: ["var(--background)", "var(--info)", "var(--primary)", "var(--violet)"],
	warm: ["var(--background)", "var(--chart-4)", "var(--chart-2)", "var(--chart-5)"],
	mono: [
		"var(--background)",
		"var(--muted-foreground)",
		"color-mix(in oklch, var(--foreground) 70%, var(--background))",
		"var(--foreground)",
	],
};

/** Time multiplier per speed. */
export const CHROMATIC_WAVE_SPEED: Record<ChromaticWaveSpeed, number> = {
	slow: 0.5,
	normal: 1,
	fast: 2,
};
