import { tv, type VariantProps } from "tailwind-variants";

export const iridescentFold = tv({
	slots: {
		root: "inset-0 isolate overflow-hidden bg-background",
		fallback:
			"pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)]",
		canvas:
			"pointer-events-none absolute inset-0 block size-full transition-opacity duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)]",
		content: "relative z-10 size-full",
	},
	variants: {
		/** Foil crumples into sharp creases with rainbow glints; silk drapes in long sheened folds. */
		variant: {
			foil: {},
			silk: {},
		},
		tone: {
			holo: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_28%_35%,#f7c6e8,transparent_55%),radial-gradient(ellipse_at_70%_60%,#a9d8ff,transparent_55%),radial-gradient(ellipse_at_50%_90%,#c9b8ff,transparent_60%)]",
			},
			pearl: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_28%_35%,#f6ead8,transparent_55%),radial-gradient(ellipse_at_70%_60%,#f4c9d6,transparent_55%),radial-gradient(ellipse_at_50%_90%,#cfe9e4,transparent_60%)]",
			},
			opal: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_28%_35%,#f7d58b,transparent_55%),radial-gradient(ellipse_at_70%_60%,#f2a7c9,transparent_55%),radial-gradient(ellipse_at_50%_90%,#a9c4f5,transparent_60%)]",
			},
			lavender: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_28%_35%,#c9a7f5,transparent_55%),radial-gradient(ellipse_at_70%_60%,#e6a8e8,transparent_55%),radial-gradient(ellipse_at_50%_90%,#9fb8f2,transparent_60%)]",
			},
			spectrum: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_30%_40%,var(--chart-1),transparent_55%),radial-gradient(ellipse_at_72%_62%,var(--violet),transparent_50%)]",
			},
			cool: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_30%_40%,var(--info),transparent_55%),radial-gradient(ellipse_at_72%_62%,var(--violet),transparent_50%)]",
			},
			warm: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_30%_40%,var(--chart-4),transparent_55%),radial-gradient(ellipse_at_72%_62%,var(--chart-2),transparent_50%)]",
			},
			mono: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_30%_40%,color-mix(in_oklch,var(--foreground)_35%,var(--background)),transparent_55%),radial-gradient(ellipse_at_72%_62%,color-mix(in_oklch,var(--foreground)_60%,var(--background)),transparent_50%)]",
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
		variant: "foil",
		tone: "holo",
		speed: "normal",
		position: "absolute",
		webgl: false,
	},
});

export type IridescentFoldVariant = NonNullable<
	VariantProps<typeof iridescentFold>["variant"]
>;
export type IridescentFoldTone = NonNullable<VariantProps<typeof iridescentFold>["tone"]>;
export type IridescentFoldSpeed = NonNullable<
	VariantProps<typeof iridescentFold>["speed"]
>;
export type IridescentFoldPosition = NonNullable<
	VariantProps<typeof iridescentFold>["position"]
>;

/** Shader colours per tone: the shadow base, then the three film colours. */
export const IRIDESCENT_FOLD_COLORS: Record<IridescentFoldTone, readonly string[]> = {
	// Sampled from foil and satin references, so these four are literal pastels, not tokens.
	holo: ["var(--background)", "#f7c6e8", "#c9b8ff", "#a9d8ff"],
	pearl: ["var(--background)", "#f6ead8", "#f4c9d6", "#cfe9e4"],
	opal: ["var(--background)", "#f7d58b", "#f2a7c9", "#a9c4f5"],
	lavender: ["var(--background)", "#c9a7f5", "#e6a8e8", "#9fb8f2"],
	spectrum: ["var(--background)", "var(--chart-1)", "var(--violet)", "var(--chart-3)"],
	cool: ["var(--background)", "var(--info)", "var(--violet)", "var(--primary)"],
	warm: ["var(--background)", "var(--chart-4)", "var(--chart-2)", "var(--chart-5)"],
	mono: [
		"var(--background)",
		"color-mix(in oklch, var(--foreground) 35%, var(--background))",
		"color-mix(in oklch, var(--foreground) 60%, var(--background))",
		"var(--muted-foreground)",
	],
};

/** Time multiplier per speed. */
export const IRIDESCENT_FOLD_SPEED: Record<IridescentFoldSpeed, number> = {
	slow: 0.5,
	normal: 1,
	fast: 2,
};
