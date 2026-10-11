import { tv, type VariantProps } from "tailwind-variants";

export const auroraFlow = tv({
	slots: {
		root: "inset-0 isolate overflow-hidden bg-background",
		fallback:
			"pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)]",
		canvas:
			"pointer-events-none absolute inset-0 block size-full transition-opacity duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)]",
		content: "relative z-10 size-full",
	},
	variants: {
		/** Veil drifts layered light along `direction`; silk lays three ribbons with a pearl sheen. */
		variant: {
			veil: {},
			silk: { fallback: "opacity-50" },
		},
		tone: {
			chart: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_18%_28%,var(--chart-1),transparent_52%),radial-gradient(ellipse_at_78%_40%,var(--chart-3),transparent_48%)]",
			},
			accent: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_18%_28%,var(--primary),transparent_52%),radial-gradient(ellipse_at_78%_40%,var(--violet),transparent_48%)]",
			},
			ember: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_18%_28%,var(--chart-2),transparent_52%),radial-gradient(ellipse_at_78%_40%,var(--chart-4),transparent_48%)]",
			},
			violet: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_18%_28%,var(--violet),transparent_52%),radial-gradient(ellipse_at_78%_40%,var(--chart-5),transparent_48%)]",
			},
			pearl: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_18%_28%,var(--chart-4),transparent_52%),radial-gradient(ellipse_at_78%_40%,var(--primary),transparent_48%)]",
			},
			mono: {
				fallback:
					"bg-[image:radial-gradient(ellipse_at_18%_28%,var(--muted-foreground),transparent_52%),radial-gradient(ellipse_at_78%_40%,var(--border-strong),transparent_48%)]",
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
		variant: "veil",
		tone: "chart",
		speed: "normal",
		position: "absolute",
		webgl: false,
	},
});

export type AuroraFlowVariant = NonNullable<VariantProps<typeof auroraFlow>["variant"]>;
export type AuroraFlowTone = NonNullable<VariantProps<typeof auroraFlow>["tone"]>;
export type AuroraFlowSpeed = NonNullable<VariantProps<typeof auroraFlow>["speed"]>;
export type AuroraFlowPosition = NonNullable<VariantProps<typeof auroraFlow>["position"]>;

/** Each tone's two hues; mono has no hue and gets its own tonal palettes below. */
const TONE_HUES: Record<Exclude<AuroraFlowTone, "mono">, readonly [string, string]> = {
	chart: ["var(--chart-1)", "var(--chart-3)"],
	accent: ["var(--primary)", "var(--violet)"],
	ember: ["var(--chart-2)", "var(--chart-4)"],
	violet: ["var(--violet)", "var(--chart-5)"],
	pearl: ["var(--chart-4)", "var(--primary)"],
};

/** Shader colours for a tone: veil takes five deepest first, silk base, mid, sheen and accent. */
export function auroraColors(variant: AuroraFlowVariant, tone: AuroraFlowTone): string[] {
	if (tone === "mono")
		return variant === "silk"
			? [
					"var(--background)",
					"color-mix(in oklch, var(--foreground) 4%, var(--background))",
					"color-mix(in oklch, var(--foreground) 11%, var(--background))",
					"color-mix(in oklch, var(--primary) 14%, var(--background))",
				]
			: [
					"var(--background)",
					"color-mix(in oklch, var(--foreground) 12%, var(--background))",
					"color-mix(in oklch, var(--foreground) 40%, var(--background))",
					"var(--muted-foreground)",
					"var(--foreground)",
				];
	const [a, b] = TONE_HUES[tone];
	return variant === "silk"
		? [
				"var(--background)",
				"color-mix(in oklch, var(--foreground) 6%, var(--background))",
				`color-mix(in oklch, ${a} 35%, var(--foreground))`,
				b,
			]
		: [
				"var(--background)",
				`color-mix(in oklch, ${a} 35%, var(--background))`,
				a,
				b,
				"var(--foreground)",
			];
}

/** Time multiplier per speed. */
export const AURORA_FLOW_SPEED: Record<AuroraFlowSpeed, number> = {
	slow: 0.5,
	normal: 1,
	fast: 2,
};

/** Film grain when `grain` is unset: the silk sheen reads better with more of it. */
export const AURORA_FLOW_GRAIN: Record<AuroraFlowVariant, number> = {
	veil: 0.22,
	silk: 0.85,
};
