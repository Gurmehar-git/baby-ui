import { tv, type VariantProps } from "tailwind-variants";

export const liquidChrome = tv({
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
			chrome: {
				fallback:
					"bg-[image:linear-gradient(160deg,var(--background)_10%,color-mix(in_oklch,var(--foreground)_55%,var(--background))_45%,var(--background)_60%,color-mix(in_oklch,var(--foreground)_80%,var(--background))_85%)]",
			},
			chart: {
				fallback:
					"bg-[image:linear-gradient(160deg,var(--background)_10%,color-mix(in_oklch,var(--chart-1)_60%,var(--background))_45%,var(--background)_60%,color-mix(in_oklch,var(--chart-1)_50%,var(--foreground))_85%)]",
			},
			accent: {
				fallback:
					"bg-[image:linear-gradient(160deg,var(--background)_10%,color-mix(in_oklch,var(--primary)_60%,var(--background))_45%,var(--background)_60%,color-mix(in_oklch,var(--primary)_50%,var(--foreground))_85%)]",
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
		tone: "chrome",
		speed: "normal",
		position: "absolute",
		webgl: false,
	},
});

export type LiquidChromeTone = NonNullable<VariantProps<typeof liquidChrome>["tone"]>;
export type LiquidChromeSpeed = NonNullable<VariantProps<typeof liquidChrome>["speed"]>;
export type LiquidChromePosition = NonNullable<
	VariantProps<typeof liquidChrome>["position"]
>;

/** Shadow, base, silver and specular colours per tone. */
export const LIQUID_CHROME_COLORS: Record<LiquidChromeTone, readonly string[]> = {
	chrome: [
		"var(--background)",
		"color-mix(in oklch, var(--foreground) 10%, var(--background))",
		"color-mix(in oklch, var(--foreground) 82%, var(--chart-1))",
		"var(--foreground)",
	],
	chart: [
		"var(--background)",
		"color-mix(in oklch, var(--chart-1) 30%, var(--background))",
		"color-mix(in oklch, var(--chart-1) 45%, var(--foreground))",
		"var(--foreground)",
	],
	accent: [
		"var(--background)",
		"color-mix(in oklch, var(--primary) 25%, var(--background))",
		"color-mix(in oklch, var(--primary) 50%, var(--foreground))",
		"var(--foreground)",
	],
};

/** Time multiplier per speed. */
export const LIQUID_CHROME_SPEED: Record<LiquidChromeSpeed, number> = {
	slow: 0.5,
	normal: 1,
	fast: 2,
};
