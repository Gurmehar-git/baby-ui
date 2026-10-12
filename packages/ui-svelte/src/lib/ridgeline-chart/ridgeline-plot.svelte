<script lang="ts">
import ChartTooltipContent from "../chart/chart-tooltip-content.svelte";
import ChartTooltipPanel from "../chart/chart-tooltip-panel.svelte";
import { setActivePoint, useChart } from "../chart/context";
import type { ActivePoint, Datum, TooltipRow } from "../chart/core";
import { CHART_DURATION, tween } from "../chart/motion";
import {
	blendModel,
	medianTint,
	type RidgeModel,
	ridgeHeight,
	ridgePath,
} from "./density";
import { type RidgelineVariant, ridgelineChart } from "./variants";

let {
	frame,
	model,
	overlap,
	value,
	variant,
	animate,
	activeIndex,
	instant,
	setActive,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	model: RidgeModel;
	overlap: number;
	value: (v: number) => string;
	variant: RidgelineVariant;
	animate: boolean;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
} = $props();

const AXIS = 24;
const GUTTER = 88;
const chart = useChart();
// svelte-ignore state_referenced_locally
let drawn = $state(!animate);
let shown = $state<RidgeModel | null>(null);
let previous: RidgeModel | null = null;
let cursor = $state<number | null>(null);
$effect(() => {
	if (!animate) {
		drawn = true;
		return;
	}
	const id = requestAnimationFrame(() => (drawn = true));
	return () => cancelAnimationFrame(id);
});
$effect(() => {
	const to = model;
	const from = previous;
	previous = to;
	if (!from) {
		shown = to;
		return;
	}
	const playback = tween({
		duration: CHART_DURATION.update * 1.4,
		onUpdate: (t) => {
			shown = blendModel(from, to, t);
		},
	});
	return () => playback.stop();
});
const view = $derived(shown ?? model);
const rows = $derived(Math.max(1, model.shapes.length));
const rowHeight = $derived(
	Math.max(8, (frame.height - 14 - AXIS) / (rows + overlap - 1)),
);
const top = $derived((overlap - 1) * rowHeight + 14);
const lift = $derived(rowHeight * overlap);
const plotWidth = $derived(Math.max(40, frame.width - GUTTER - 4));
const sx = (v: number) => GUTTER + ((v - view.lo) / (view.hi - view.lo || 1)) * plotWidth;
const baseOf = (row: number) => top + (row + 1) * rowHeight;
const s = $derived(ridgelineChart({ variant }));
const activeShape = $derived(activeIndex !== null ? view.shapes[activeIndex] : undefined);
const activePoint = $derived.by<ActivePoint | null>(() => {
	if (!activeShape || activeIndex === null) return null;
	return {
		index: activeIndex,
		datum: { id: activeShape.id, label: activeShape.label },
		x: cursor ?? sx(activeShape.stats.median),
		y: { value: baseOf(activeShape.row) - lift * 0.6 },
	};
});
setActivePoint({
	get active() {
		return activePoint;
	},
	get instant() {
		return instant;
	},
	title: (datum: Datum) => String(datum.label ?? ""),
	rows: (): TooltipRow[] =>
		activeShape
			? [
					{
						key: "median",
						label: `Median ${value(activeShape.stats.median)}`,
						color: "transparent",
						value: null,
					},
					{
						key: "iqr",
						label: `Middle half ${value(activeShape.stats.q1)} to ${value(activeShape.stats.q3)}`,
						color: "transparent",
						value: null,
					},
					{
						key: "n",
						label: `${activeShape.stats.n} values`,
						color: "transparent",
						value: null,
					},
				]
			: [],
});
</script>

<svg
	aria-hidden="true"
	width={frame.width}
	height={frame.height}
	class="absolute inset-0 block touch-pan-y overflow-visible"
	onpointermove={(event) => {
		if (event.pointerType !== "mouse" && !event.buttons) return;
		const box = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - box.left;
		const row = Math.min(rows - 1, Math.max(0, Math.floor((event.clientY - box.top - top) / rowHeight)));
		cursor = x >= GUTTER ? x : null;
		setActive(row, false);
	}}
	onpointerleave={() => {
		cursor = null;
		if (activeIndex !== null) setActive(null, false);
	}}
>
	{#each view.ticks as tick (tick)}
		<line x1={sx(tick)} x2={sx(tick)} y1={top - lift + rowHeight} y2={frame.height - AXIS} class={s.grid()} />
		<text x={sx(tick)} y={frame.height - 6} text-anchor="middle" class={s.tick()}>{value(tick)}</text>
	{/each}
	{#each view.shapes as shape, index (shape.id)}
		{@const base = baseOf(shape.row)}
		{@const on = activeIndex === index}
		<g
			data-slot="ridgeline-ridge"
			data-drawn={drawn}
			data-active={on}
			data-dim={activeIndex !== null && !on}
			class={s.ridge()}
			style:--ridge-color={variant === "series" && chart.config[shape.id] ? `var(--color-${shape.id})` : "var(--chart-1)"}
			style:--ridge-tint={medianTint(shape.stats.median, view.shapes)}
			style:transition-delay={animate ? `${index * 60}ms` : undefined}
		>
			<path d={ridgePath(shape, sx, base, lift, true)} class={s.fill()} />
			{#if on}
				<path d={ridgePath(shape, sx, base, lift, true, shape.stats.q1, shape.stats.q3)} class={s.band()} />
			{/if}
			<path d={ridgePath(shape, sx, base, lift, false)} class={s.line()} />
			<line
				x1={sx(shape.stats.median)}
				x2={sx(shape.stats.median)}
				y1={base}
				y2={base - ridgeHeight(shape, shape.stats.median) * lift}
				class={s.median()}
			/>
			<line x1={GUTTER} x2={GUTTER + plotWidth} y1={base} y2={base} class={s.baseline()} />
		</g>
	{/each}
	{#if cursor !== null && activeShape}
		<line x1={cursor} x2={cursor} y1={top - lift + rowHeight} y2={frame.height - AXIS} class="stroke-foreground/40" />
	{/if}
</svg>
{#each view.shapes as shape (shape.id)}
	<span aria-hidden="true" class={s.label()} style:top="{baseOf(shape.row)}px" style:max-width="{GUTTER - 4}px"
		>{shape.label}</span
	>
{/each}
{#if frame.el}
	<ChartTooltipPanel
		target={frame.el}
		anchor={activePoint ? { x: activePoint.x, y: activePoint.y.value ?? 0 } : null}
		{instant}
		bounds={{ width: frame.width, height: frame.height }}
	>
		<ChartTooltipContent hideIndicator />
	</ChartTooltipPanel>
{/if}
