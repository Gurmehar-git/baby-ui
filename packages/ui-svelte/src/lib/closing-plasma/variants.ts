import { tv, type VariantProps } from "tailwind-variants";

export const closingPlasma = tv({
	slots: {
		root: "inset-0 isolate overflow-hidden bg-background",
		fallback:
			"pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)]",
		canvas:
			"pointer-events-none absolute inset-0 block size-full transition-opacity duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)]",
		content: "relative z-10 size-full",
	},
	variants: {
		tone: {
			chart: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_30%_40%,var(--chart-1),transparent_60%),radial-gradient(ellipse_at_75%_70%,var(--chart-scale-2),transparent_55%)]",
			},
			accent: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_30%_40%,var(--primary),transparent_60%),radial-gradient(ellipse_at_75%_70%,var(--info),transparent_55%)]",
			},
			violet: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_30%_40%,var(--violet),transparent_60%),radial-gradient(ellipse_at_75%_70%,var(--chart-5),transparent_55%)]",
			},
			mono: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_30%_40%,var(--muted-foreground),transparent_60%),radial-gradient(ellipse_at_75%_70%,var(--border-strong),transparent_55%)]",
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

export type ClosingPlasmaTone = NonNullable<VariantProps<typeof closingPlasma>["tone"]>;
export type ClosingPlasmaSpeed = NonNullable<VariantProps<typeof closingPlasma>["speed"]>;
export type ClosingPlasmaPosition = NonNullable<
	VariantProps<typeof closingPlasma>["position"]
>;

/** Surface, body and ridge colours per tone. */
export const CLOSING_PLASMA_COLORS: Record<ClosingPlasmaTone, readonly string[]> = {
	chart: [
		"var(--background)",
		"color-mix(in oklch, var(--chart-1) 18%, var(--background))",
		"color-mix(in oklch, var(--chart-1) 45%, var(--background))",
	],
	accent: [
		"var(--background)",
		"color-mix(in oklch, var(--primary) 18%, var(--background))",
		"color-mix(in oklch, var(--primary) 45%, var(--background))",
	],
	violet: [
		"var(--background)",
		"color-mix(in oklch, var(--violet) 18%, var(--background))",
		"color-mix(in oklch, var(--violet) 45%, var(--background))",
	],
	mono: [
		"var(--background)",
		"color-mix(in oklch, var(--foreground) 10%, var(--background))",
		"color-mix(in oklch, var(--foreground) 30%, var(--background))",
	],
};

/** Time multiplier per speed. */
export const CLOSING_PLASMA_SPEED: Record<ClosingPlasmaSpeed, number> = {
	slow: 0.5,
	normal: 1,
	fast: 2,
};
