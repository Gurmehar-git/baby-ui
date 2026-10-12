import { tv, type VariantProps } from "tailwind-variants";

// Lines draw in with stroke-dashoffset and dots pop with a transform transition; data changes tween geometry.
export const slopeChart = tv({
	slots: {
		column: "absolute top-0 -translate-x-1/2 font-medium text-muted-foreground text-xs",
		axis: "stroke-border",
		line: [
			"fill-none stroke-(--slope-color) stroke-2 transition-[stroke-dashoffset,opacity] [stroke-dasharray:1] [stroke-linecap:round]",
			"delay-(--slope-delay) duration-700 ease-(--ease-ui-in-out) [stroke-dashoffset:1] data-[drawn=true]:[stroke-dashoffset:0] motion-reduce:transition-none",
		],
		leader: "fill-none stroke-(--slope-color) stroke-1 opacity-40",
		dot: "[transform-box:fill-box] origin-center scale-0 fill-(--slope-color) stroke-2 stroke-background transition-[scale] delay-(--slope-delay) duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) data-[drawn=true]:scale-100 motion-reduce:transition-none",
		item: "transition-opacity duration-(--duration-fast) data-[dim=true]:opacity-25",
		label: [
			"absolute top-0 flex items-baseline gap-1.5 whitespace-nowrap text-xs leading-4 opacity-0 transition-[opacity,top] -translate-y-1/2",
			"delay-(--slope-delay) duration-(--duration-base) data-[drawn=true]:opacity-100 data-[dim=true]:opacity-25 motion-reduce:transition-none",
		],
		name: "truncate text-muted-foreground",
		value: "font-medium text-foreground tabular-nums",
		rank: "inline-flex items-center gap-0.5 text-[11px] tabular-nums data-[move=down]:text-destructive data-[move=level]:text-muted-foreground data-[move=up]:text-success-strong [&_svg]:size-2",
	},
	variants: {
		variant: {
			default: {},
			minimal: { leader: "hidden", rank: "hidden" },
		},
	},
	defaultVariants: { variant: "default" },
});

export type SlopeVariant = NonNullable<VariantProps<typeof slopeChart>["variant"]>;
