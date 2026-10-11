import { tv, type VariantProps } from "tailwind-variants";

export const webglLiquid = tv({
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
			ocean: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_40%_85%,var(--primary),transparent_45%),radial-gradient(ellipse_at_30%_95%,var(--chart-1),transparent_70%)]",
			},
			ember: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_40%_85%,var(--chart-4),transparent_45%),radial-gradient(ellipse_at_30%_95%,var(--chart-2),transparent_70%)]",
			},
			mono: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_40%_85%,var(--foreground),transparent_45%),radial-gradient(ellipse_at_30%_95%,var(--muted-foreground),transparent_70%)]",
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

export type WebglLiquidTone = NonNullable<VariantProps<typeof webglLiquid>["tone"]>;
export type WebglLiquidSpeed = NonNullable<VariantProps<typeof webglLiquid>["speed"]>;
export type WebglLiquidPosition = NonNullable<
	VariantProps<typeof webglLiquid>["position"]
>;

/** Deep, mid and highlight colours per tone. */
export const WEBGL_LIQUID_COLORS: Record<WebglLiquidTone, readonly string[]> = {
	ocean: ["var(--background)", "var(--chart-1)", "var(--primary)"],
	ember: ["var(--background)", "var(--chart-2)", "var(--chart-4)"],
	mono: [
		"var(--background)",
		"color-mix(in oklch, var(--foreground) 45%, var(--background))",
		"var(--foreground)",
	],
};

/** Time multiplier per speed. */
export const WEBGL_LIQUID_SPEED: Record<WebglLiquidSpeed, number> = {
	slow: 0.5,
	normal: 1,
	fast: 2,
};
