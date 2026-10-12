import { tv, type VariantProps } from "tailwind-variants";

export const scatterPoint = tv({
	slots: {
		point:
			"transition-[opacity,filter] duration-(--duration-fast) ease-[cubic-bezier(0.42,0,0.58,1)]",
		mark: "fill-(--point) stroke-background [transform-box:fill-box] [transform-origin:center] data-active:scale-[1.35]",
	},
	variants: {
		size: {
			sm: { mark: "[stroke-width:1]" },
			default: { mark: "[stroke-width:1.5]" },
			lg: { mark: "[stroke-width:2]" },
		},
		shape: {
			circle: {},
			square: { mark: "[stroke-linejoin:miter]" },
			diamond: { mark: "[stroke-linejoin:round]" },
			triangle: { mark: "[stroke-linejoin:round]" },
		},
		dimmed: {
			true: { point: "opacity-50 blur-[2px]" },
			false: {},
		},
	},
	defaultVariants: { size: "default", shape: "circle", dimmed: false },
});

export type ScatterSize = NonNullable<VariantProps<typeof scatterPoint>["size"]>;
export type ScatterShape = NonNullable<VariantProps<typeof scatterPoint>["shape"]>;

/** Marker radius in pixels per size. */
export const SCATTER_RADIUS: Record<ScatterSize, number> = { sm: 3, default: 4.5, lg: 6 };

/** Series take shapes in registration order, so a series keeps its shape when others hide. */
export const SCATTER_SHAPES: ScatterShape[] = ["circle", "square", "diamond", "triangle"];
