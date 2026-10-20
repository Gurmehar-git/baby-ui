import { tv, type VariantProps } from "tailwind-variants";

export const inkBloom = tv({
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
					"bg-[radial-gradient(ellipse_at_30%_40%,var(--chart-1),transparent_55%),radial-gradient(ellipse_at_70%_65%,var(--chart-4),transparent_50%)]",
			},
			accent: {
				fallback:
					"bg-[radial-gradient(ellipse_at_30%_40%,var(--primary),transparent_55%),radial-gradient(ellipse_at_70%_65%,var(--violet),transparent_50%)]",
			},
			violet: {
				fallback:
					"bg-[radial-gradient(ellipse_at_30%_40%,var(--violet),transparent_55%),radial-gradient(ellipse_at_70%_65%,var(--chart-5),transparent_50%)]",
			},
			mono: {
				fallback:
					"bg-[radial-gradient(ellipse_at_30%_40%,var(--muted-foreground),transparent_55%),radial-gradient(ellipse_at_70%_65%,var(--foreground),transparent_50%)]",
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

export type InkBloomTone = NonNullable<VariantProps<typeof inkBloom>["tone"]>;
export type InkBloomSpeed = NonNullable<VariantProps<typeof inkBloom>["speed"]>;
export type InkBloomPosition = NonNullable<VariantProps<typeof inkBloom>["position"]>;

/** Shader colours per tone: water, first ink, second ink, highlight. */
export const INK_BLOOM_COLORS: Record<InkBloomTone, readonly string[]> = {
	chart: ["var(--background)", "var(--chart-1)", "var(--chart-4)", "var(--foreground)"],
	accent: ["var(--background)", "var(--primary)", "var(--violet)", "var(--foreground)"],
	violet: ["var(--background)", "var(--violet)", "var(--chart-5)", "var(--foreground)"],
	mono: [
		"var(--background)",
		"var(--muted-foreground)",
		"var(--foreground)",
		"var(--foreground)",
	],
};

/** Time multiplier per speed. */
export const INK_BLOOM_SPEED: Record<InkBloomSpeed, number> = {
	slow: 0.5,
	normal: 1,
	fast: 2,
};
