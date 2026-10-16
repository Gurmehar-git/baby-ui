export interface FunnelStage {
	label: string;
	value: number;
	/** Printed instead of the formatted value, e.g. "12k". */
	displayValue?: string;
	/** Overrides the stage colour. */
	color?: string;
}

export interface FunnelRing {
	d: string;
	opacity: number;
	/** Cross-axis scale the ring springs to while its stage is active. */
	hoverScale: number;
	spring: { stiffness: number; damping: number };
}

/** Stages 120ms apart, labels 250ms after their stage, 350ms fade. */
export const STAGE_STAGGER = 120;
export const LABEL_DELAY = 250;
export const LABEL_FADE = 350;

/** Ring i of n: inner rings shrink by up to 35% and gain opacity from 0.18 to 0.83. */
export function ringStyle(ring: number, layers: number) {
	return {
		scale: 1 - (ring / layers) * 0.35,
		opacity: 0.18 + (ring / Math.max(1, layers - 1)) * 0.65,
		hoverScale: 1 + (ring / Math.max(1, layers - 1)) * 0.12,
		spring: { stiffness: 300 - ring * 60, damping: 24 - ring * 3 },
	};
}

/** One stage's band, from its own width to the next stage's; `along` is the flow axis. */
export function segmentPath(
	normStart: number,
	normEnd: number,
	along: number,
	across: number,
	scale: number,
	straight: boolean,
	vertical: boolean,
): string {
	const mid = across / 2;
	const w0 = normStart * across * 0.44 * scale;
	const w1 = normEnd * across * 0.44 * scale;
	const p = (a: number, c: number) => (vertical ? `${c} ${a}` : `${a} ${c}`);
	if (straight) {
		return `M ${p(0, mid - w0)} L ${p(along, mid - w1)} L ${p(along, mid + w1)} L ${p(0, mid + w0)} Z`;
	}
	const k = along * 0.55;
	return `M ${p(0, mid - w0)} C ${p(k, mid - w0)}, ${p(along - k, mid - w1)}, ${p(along, mid - w1)} L ${p(along, mid + w1)} C ${p(along - k, mid + w1)}, ${p(k, mid + w0)}, ${p(0, mid + w0)} Z`;
}

export interface FunnelCell {
	index: number;
	stage: FunnelStage;
	/** Offset of the cell along the flow axis. */
	offset: number;
	/** Cell size along the flow axis. */
	size: number;
	/** Share of the first stage, 0 to 1. */
	ratio: number;
	/** Share of the previous stage, 0 to 1; 1 for the first. */
	step: number;
	rings: FunnelRing[];
}

export function funnelCells(
	stages: FunnelStage[],
	along: number,
	across: number,
	gap: number,
	layers: number,
	straight: boolean,
	vertical: boolean,
): FunnelCell[] {
	const first = stages[0]?.value ?? 0;
	const n = stages.length;
	const size = n > 0 ? (along - gap * (n - 1)) / n : 0;
	const norm = (v: number) => (first > 0 ? Math.max(0, v) / first : 0);
	return stages.map((stage, index) => {
		const next = stages[Math.min(index + 1, n - 1)] ?? stage;
		const prev = stages[index - 1];
		return {
			index,
			stage,
			offset: index * (size + gap),
			size,
			ratio: norm(stage.value),
			step: prev && prev.value > 0 ? stage.value / prev.value : 1,
			rings: Array.from({ length: layers }, (_, ring) => {
				const style = ringStyle(ring, layers);
				return {
					d: segmentPath(
						norm(stage.value),
						norm(next.value),
						size,
						across,
						style.scale,
						straight,
						vertical,
					),
					opacity: style.opacity,
					hoverScale: style.hoverScale,
					spring: style.spring,
				};
			}),
		};
	});
}

/** Ordinal ramp from scale step 5 to step 2, mixed so every stage differs; step 1 is too light to read. */
export function stageColor(index: number, count: number, stage: FunnelStage): string {
	if (stage.color) return stage.color;
	const weight = count <= 1 ? 100 : Math.round((1 - index / (count - 1)) * 100);
	return `color-mix(in oklch, var(--chart-scale-5) ${weight}%, var(--chart-scale-2))`;
}
