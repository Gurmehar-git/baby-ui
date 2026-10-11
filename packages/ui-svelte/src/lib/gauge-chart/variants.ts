import { tv, type VariantProps } from "tailwind-variants";

export const gaugeChart = tv({
	slots: {
		root: "relative w-full min-w-0",
		track: "fill-foreground/[0.08]",
		active: "",
		value: "font-semibold text-foreground tabular-nums",
		label: "text-muted-foreground text-xs",
		center:
			"pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1",
		header: "mb-2 flex items-baseline justify-between gap-3",
		ring: "absolute inset-0 -rotate-[225deg]",
		ringTrack: "fill-none stroke-foreground/[0.08]",
		ringActive:
			"fill-none transition-[stroke-dashoffset] duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
	},
	variants: {
		/** Arc and linear are notched tracks; ring is a compact three-quarter dial for tight spots. */
		layout: {
			arc: { root: "mx-auto aspect-[21/16] max-w-[560px]" },
			linear: { root: "flex flex-col" },
			ring: { root: "grid aspect-square w-24 place-items-center", center: "gap-0" },
		},
		tone: {
			primary: { active: "fill-chart-1", ringActive: "stroke-chart-1" },
			highlight: { active: "fill-chart-4", ringActive: "stroke-chart-4" },
			negative: { active: "fill-chart-negative", ringActive: "stroke-chart-negative" },
			scale: { active: "" },
		},
	},
	defaultVariants: { layout: "arc", tone: "primary" },
});

export type GaugeChartLayout = NonNullable<VariantProps<typeof gaugeChart>["layout"]>;
export type GaugeChartTone = NonNullable<VariantProps<typeof gaugeChart>["tone"]>;
