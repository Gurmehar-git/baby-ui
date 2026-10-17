import { tv, type VariantProps } from "tailwind-variants";

export const circuitBoard = tv({
	slots: {
		root: "relative w-full",
		svg: "block h-auto w-full overflow-visible",
		grid: "fill-muted-foreground/30",
		trace: "circuit-board-trace fill-none stroke-border [stroke-dasharray:100]",
		pulse: "circuit-board-pulse fill-none [stroke-dasharray:8_92]",
		pulseBack:
			"circuit-board-pulse circuit-board-pulse-back fill-none [stroke-dasharray:8_92]",
	},
	variants: {
		tone: {
			primary: { pulse: "stroke-primary", pulseBack: "stroke-primary" },
			chart: { pulse: "stroke-chart-2", pulseBack: "stroke-chart-4" },
			foreground: { pulse: "stroke-foreground", pulseBack: "stroke-foreground" },
		},
		speed: {
			slow: { root: "[--circuit-board-speed:3.6s]" },
			normal: { root: "[--circuit-board-speed:2.2s]" },
			fast: { root: "[--circuit-board-speed:1.2s]" },
		},
	},
	defaultVariants: { tone: "primary", speed: "normal" },
});

export const circuitNode = tv({
	slots: {
		node: "circuit-board-node origin-center [transform-box:fill-box]",
		box: "stroke-2",
		label: "fill-muted-foreground font-medium text-xs",
	},
	variants: {
		status: {
			idle: { box: "fill-muted-foreground/10 stroke-muted-foreground" },
			active: { box: "fill-primary/15 stroke-primary" },
			busy: { box: "circuit-board-busy fill-warning/20 stroke-warning" },
			error: { box: "fill-destructive/15 stroke-destructive" },
		},
	},
	defaultVariants: { status: "idle" },
});

export type CircuitBoardTone = NonNullable<VariantProps<typeof circuitBoard>["tone"]>;
export type CircuitBoardSpeed = NonNullable<VariantProps<typeof circuitBoard>["speed"]>;
export type CircuitNodeStatus = NonNullable<VariantProps<typeof circuitNode>["status"]>;
