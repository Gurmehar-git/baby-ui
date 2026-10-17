<script lang="ts">
import { untrack } from "svelte";
import type { ActivePoint, Datum } from "../../chart/core";
import { CHART_DURATION, CHART_EASE, EASE_OUT, tween } from "../../chart/motion";
import ChartTooltipContent from "../../chart/svelte/chart-tooltip-content.svelte";
import ChartTooltipPanel from "../../chart/svelte/chart-tooltip-panel.svelte";
import { setActivePoint, useChart } from "../../chart/svelte/context";
import { cn } from "../../lib/cn";
import {
	type FunnelCell,
	type FunnelStage,
	funnelCells,
	LABEL_DELAY,
	LABEL_FADE,
	STAGE_STAGGER,
	stageColor,
} from "../geometry";
import {
	FUNNEL_PATTERN_TILE,
	type FunnelEdges,
	type FunnelLabelLayout,
	type FunnelOrientation,
	type FunnelPattern,
	funnelChart,
	funnelEdges,
} from "../variants";
import FunnelRingShape from "./funnel-ring.svelte";

let {
	frame,
	data,
	orientation,
	edges,
	labelLayout,
	pattern,
	layers,
	gap,
	grid,
	showValues,
	showPercentage,
	showLabels,
	animate,
	activeIndex,
	instant,
	setActive,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	data: FunnelStage[];
	orientation: FunnelOrientation;
	edges: FunnelEdges;
	labelLayout: FunnelLabelLayout;
	pattern: FunnelPattern;
	layers: number;
	gap: number;
	grid: boolean;
	showValues: boolean;
	showPercentage: boolean;
	showLabels: boolean;
	animate: boolean;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
} = $props();

const chart = useChart();
const vertical = $derived(orientation === "vertical");
const cells = $derived(
	funnelCells(
		data,
		vertical ? frame.height : frame.width,
		vertical ? frame.width : frame.height,
		gap,
		Math.max(1, layers),
		edges === "straight",
		vertical,
	),
);
const styles = $derived(funnelChart({ orientation, labelLayout, pattern }));
const uid = $props.id();
const ringClass = $derived(cn(styles.ring(), funnelEdges({ edges })));
const n = $derived(data.length);
const signature = $derived(data.map((s) => `${s.label}:${s.value}`).join("|"));
// svelte-ignore state_referenced_locally
let elapsed = $state(animate ? 0 : Number.POSITIVE_INFINITY);
$effect.pre(() => {
	signature;
	const on = animate;
	return untrack(() => {
		if (!on) {
			elapsed = Number.POSITIVE_INFINITY;
			return;
		}
		const total = (n - 1) * STAGE_STAGGER + LABEL_DELAY + CHART_DURATION.enter;
		elapsed = 0;
		const playback = tween({
			duration: total,
			ease: (t) => t,
			onUpdate: (p) => {
				elapsed = p * total;
			},
		});
		return () => playback.stop();
	});
});

const first = $derived(data[0]?.value ?? 0);
function cellRect(cell: FunnelCell) {
	return vertical
		? { x: 0, y: cell.offset, width: frame.width, height: cell.size }
		: { x: cell.offset, y: 0, width: cell.size, height: frame.height };
}
const stageProgress = (index: number) =>
	CHART_EASE(
		Math.min(1, Math.max(0, (elapsed - index * STAGE_STAGGER) / CHART_DURATION.enter)),
	);
const labelOpacity = (index: number) =>
	EASE_OUT(
		Math.min(
			1,
			Math.max(0, (elapsed - index * STAGE_STAGGER - LABEL_DELAY) / LABEL_FADE),
		),
	);
const dim = (index: number) => (activeIndex !== null && activeIndex !== index ? 0.4 : 1);

const activeCell = $derived(activeIndex !== null ? cells[activeIndex] : undefined);
const activePoint = $derived.by<ActivePoint | null>(() => {
	if (!activeCell || activeIndex === null) return null;
	const r = cellRect(activeCell);
	return {
		index: activeIndex,
		datum: { ...activeCell.stage, index: activeIndex },
		x: r.x + r.width / 2,
		y: { value: vertical ? r.y + r.height / 2 : frame.height * 0.2 },
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
	rows: (datum: Datum) => [
		{
			key: String(datum.label ?? ""),
			label: chart.format.percent(first > 0 ? Number(datum.value) / first : 0),
			color: stageColor(Number(datum.index), n, datum as unknown as FunnelStage),
			value: Number(datum.value),
		},
	],
});
</script>

<svg
	aria-hidden="true"
	width={frame.width}
	height={frame.height}
	class="absolute inset-0 block overflow-visible"
	onpointerleave={() => {
		if (activeIndex !== null) setActive(null, false);
	}}
>
	{#if grid}
		{#each cells as cell (cell.index)}
			{#if cell.index % 2 === 0}
				{@const r = cellRect(cell)}
				<rect x={r.x} y={r.y} width={r.width} height={r.height} class={styles.band()} />
			{/if}
		{/each}
	{/if}
	{#each cells as cell (cell.stage.label)}
		{@const r = cellRect(cell)}
		{@const p = stageProgress(cell.index)}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<g
			data-slot="funnel-stage"
			data-active={activeIndex === cell.index ? "" : undefined}
			class={styles.cell()}
			style:opacity={dim(cell.index)}
			onpointerenter={() => setActive(cell.index, false)}
		>
			<rect x={r.x} y={r.y} width={r.width} height={r.height} fill="transparent" />
			<g
				transform="translate({r.x} {r.y})"
				style:opacity={p}
				style:transform={p < 1
					? `translate(${r.x}px, ${r.y}px) scale(${0.9 + 0.1 * p})`
					: undefined}
				style:transform-origin={vertical ? `${frame.width / 2}px 0` : `0 ${frame.height / 2}px`}
			>
				{#if pattern !== "none"}
					<defs>
						<pattern
							id="{uid}-pattern-{cell.index}"
							width={8}
							height={8}
							patternUnits="userSpaceOnUse"
						>
							<rect width={8} height={8} fill={stageColor(cell.index, n, cell.stage)} />
							<path d={FUNNEL_PATTERN_TILE[pattern]} class={styles.mark()} />
						</pattern>
					</defs>
				{/if}
				{#each cell.rings as ring, i (i)}
					<FunnelRingShape
						{ring}
						color={pattern !== "none" && i === cell.rings.length - 1
							? `url(#${uid}-pattern-${cell.index})`
							: stageColor(cell.index, n, cell.stage)}
						active={activeIndex === cell.index}
						{instant}
						{vertical}
						class={ringClass}
					/>
				{/each}
			</g>
		</g>
	{/each}
	{#if grid}
		{#each cells.slice(1) as cell (cell.index)}
			{@const at = cell.offset - gap / 2}
			{#if vertical}
				<line x1={0} x2={frame.width} y1={at} y2={at} class={styles.rule()} />
			{:else}
				<line x1={at} x2={at} y1={0} y2={frame.height} class={styles.rule()} />
			{/if}
		{/each}
	{/if}
</svg>
{#each cells as cell (cell.stage.label)}
	{@const r = cellRect(cell)}
	<div
		data-slot="funnel-label"
		class={styles.labels()}
		style:left="{r.x}px"
		style:top="{r.y}px"
		style:width="{r.width}px"
		style:height="{r.height}px"
		style:opacity={labelOpacity(cell.index) * dim(cell.index)}
	>
		{#if showValues}
			<span class={styles.value()}>
				{cell.stage.displayValue ?? chart.format.number(cell.stage.value)}
			</span>
		{/if}
		{#if showPercentage}
			<span class={styles.percent()}>{chart.format.percent(cell.ratio)}</span>
		{/if}
		{#if showLabels}
			<span class={styles.name()} title={cell.stage.label}>{cell.stage.label}</span>
		{/if}
	</div>
{/each}
{#if frame.el}
	<ChartTooltipPanel
		target={frame.el}
		anchor={activePoint ? { x: activePoint.x, y: activePoint.y.value ?? 0 } : null}
		{instant}
		bounds={{ width: frame.width, height: frame.height }}
	>
		<ChartTooltipContent />
	</ChartTooltipPanel>
{/if}
