import { tv, type VariantProps } from "tailwind-variants";

const MOTION =
	"transition-[clip-path,transform,opacity,filter,border-radius] duration-[calc(var(--ht-duration)*var(--ht-scale,1)*var(--ht-dur-scale))] delay-(--ht-delay) ease-(--ease-ui-out) motion-reduce:transition-none [clip-path:var(--ht-clip)] [transform:var(--ht-transform)] [filter:var(--ht-filter)] opacity-(--ht-opacity) [border-radius:var(--ht-radius)] [transform-origin:var(--ht-origin)]";

export const hoverTransition = tv({
	slots: {
		root: "relative isolate block min-h-64 overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		stage:
			"relative size-full transform-3d transition-transform duration-(--duration-drawer) ease-(--ease-ui-out) [transform:perspective(1000px)_rotateX(var(--ht-tilt-x,0deg))_rotateY(var(--ht-tilt-y,0deg))_scale(var(--ht-lift,1))] data-[active=true]:duration-(--duration-dropdown) data-[active=true]:[--ht-lift:1.012] motion-reduce:transform-none motion-reduce:transition-none",
		base: ["relative size-full", MOTION],
		layer: [
			"pointer-events-none absolute inset-0 data-[exposed=true]:pointer-events-auto",
			MOTION,
		],
		inner: ["size-full", MOTION],
	},
	variants: {
		effect: {
			wipe: {},
			ripple: { root: "[--ht-scale:1.25]" },
			parallax: {},
			curtain: {},
			diagonal: { root: "[--ht-scale:1.25]" },
			morph: {},
			strips: {},
			slide: {},
		},
		direction: {
			top: { root: "[--ht-at:50%_0%]" },
			right: { root: "[--ht-at:100%_50%]" },
			bottom: { root: "[--ht-at:50%_100%]" },
			left: { root: "[--ht-at:0%_50%]" },
			"top-left": { root: "[--ht-at:0%_0%]" },
			"top-right": { root: "[--ht-at:100%_0%]" },
			"bottom-right": { root: "[--ht-at:100%_100%]" },
			"bottom-left": { root: "[--ht-at:0%_100%]" },
			center: { root: "[--ht-at:50%_50%]" },
		},
	},
	defaultVariants: { effect: "wipe", direction: "right" },
});

export type HoverTransitionEffect = NonNullable<
	VariantProps<typeof hoverTransition>["effect"]
>;
export type HoverTransitionDirection = NonNullable<
	VariantProps<typeof hoverTransition>["direction"]
>;
