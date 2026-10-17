import { tv, type VariantProps } from "tailwind-variants";

/** A glow and a curved shadow edge breathe inside a rotated scene; grain tiles over both. */
export const grainGradient = tv({
	slots: {
		root: "inset-0 isolate overflow-hidden bg-background",
		scene: "pointer-events-none absolute -inset-1/2 rotate-[var(--grain-gradient-angle)]",
		glow: "absolute inset-0 grain-gradient-glow",
		shadow: "absolute inset-0 grain-gradient-shadow",
		grain: "pointer-events-none absolute inset-0 mix-blend-overlay",
		content: "relative z-10 size-full",
	},
	variants: {
		tone: {
			spectrum: {
				glow: "bg-[image:radial-gradient(circle_at_40%_42%,var(--chart-5),transparent_28%)]",
				shadow:
					"bg-[image:radial-gradient(ellipse_38%_60%_at_78%_55%,color-mix(in_oklab,var(--chart-1)_45%,var(--foreground))_45%,transparent_100%)]",
			},
			cool: {
				glow: "bg-[image:radial-gradient(circle_at_40%_42%,var(--chart-3),transparent_28%)]",
				shadow:
					"bg-[image:radial-gradient(ellipse_38%_60%_at_78%_55%,color-mix(in_oklab,var(--chart-1)_45%,var(--foreground))_45%,transparent_100%)]",
			},
			warm: {
				glow: "bg-[image:radial-gradient(circle_at_40%_42%,var(--chart-4),transparent_28%)]",
				shadow:
					"bg-[image:radial-gradient(ellipse_38%_60%_at_78%_55%,color-mix(in_oklab,var(--chart-2)_45%,var(--foreground))_45%,transparent_100%)]",
			},
			mono: {
				glow: "bg-[image:radial-gradient(circle_at_40%_42%,var(--muted-foreground),transparent_28%)]",
				shadow:
					"bg-[image:radial-gradient(ellipse_38%_60%_at_78%_55%,var(--foreground)_45%,transparent_100%)]",
			},
		},
		position: {
			absolute: { root: "absolute" },
			fixed: { root: "fixed" },
		},
	},
	defaultVariants: { tone: "spectrum", position: "absolute" },
});

export type GrainGradientTone = NonNullable<VariantProps<typeof grainGradient>["tone"]>;
export type GrainGradientPosition = NonNullable<
	VariantProps<typeof grainGradient>["position"]
>;

const TILE = 160;

/** A seamless greyscale feTurbulence tile as a CSS url(); larger `size` means coarser grain. */
export function grainTexture(size: number): string {
	const frequency = (0.9 / Math.min(4, Math.max(0.5, size))).toFixed(3);
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg>`;
	return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
