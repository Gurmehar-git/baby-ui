import { tv, type VariantProps } from "tailwind-variants";

// Ridges draw upward from their baselines on first paint; the active ridge lifts above its neighbours.
export const ridgelineChart = tv({
	slots: {
		ridge: [
			"origin-bottom transition-[opacity,translate,scale] duration-(--duration-collapse) ease-(--ease-out-quart) [transform-box:fill-box]",
			"scale-y-0 data-[drawn=true]:scale-y-100 data-[dim=true]:opacity-35 data-[active=true]:-translate-y-1.5 motion-reduce:transition-none",
		],
		fill: "fill-[color-mix(in_oklab,var(--ridge-color)_calc(var(--ridge-tint)*1%),var(--color-background))] stroke-none",
		line: "fill-none stroke-(--ridge-color) stroke-[1.5] [stroke-linejoin:round]",
		band: "fill-(--ridge-color) opacity-25",
		median: "stroke-foreground/70 stroke-[1.5]",
		baseline: "stroke-border",
		label:
			"absolute left-0 -translate-y-full truncate pr-2 text-muted-foreground text-xs leading-4",
		tick: "fill-muted-foreground text-[11px] tabular-nums",
		grid: "stroke-border [stroke-dasharray:2_4]",
	},
	variants: {
		variant: {
			tint: {},
			series: {
				fill: "fill-[color-mix(in_oklab,var(--ridge-color)_35%,var(--color-background))]",
			},
		},
	},
	defaultVariants: { variant: "tint" },
});

export type RidgelineVariant = NonNullable<
	VariantProps<typeof ridgelineChart>["variant"]
>;
