<script lang="ts">
import { untrack } from "svelte";
import ChartTooltipContent from "../../chart/svelte/chart-tooltip-content.svelte";
import ChartTooltipPanel from "../../chart/svelte/chart-tooltip-panel.svelte";
import { setActivePoint, useChart } from "../../chart/svelte/context";
import type { ActivePoint, Datum } from "../../chart/svelte/core";
import { prefersReducedMotion, tween } from "../../chart/svelte/motion";
import {
	enterDelay,
	HEATMAP_MARGIN,
	HEATMAP_TIMING,
	type HeatmapCell,
	type HeatmapPhase,
	LEVEL_PATTERN,
} from "./calendar";
import PatternDefs from "./pattern-defs.svelte";
import { runShimmer } from "./shimmer";
import { type HeatmapShape, heatmapChart, levelFill, SHAPE_RADIUS } from "./variants";

let {
	frame,
	cells,
	weeks,
	months,
	weekdays,
	shape,
	patterns,
	gap,
	locale,
	phase,
	onPhaseDone,
	animate,
	activeIndex,
	instant,
	setActive,
	title,
	rowFor,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	cells: HeatmapCell[];
	weeks: number;
	months: { col: number; date: Date }[];
	weekdays: Date[];
	shape: HeatmapShape;
	patterns: boolean;
	gap: number;
	locale?: string;
	phase: HeatmapPhase;
	onPhaseDone: () => void;
	animate: boolean;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
	title: (cell: HeatmapCell) => string;
	rowFor: (cell: HeatmapCell) => { label: string; value: number | null };
} = $props();

const chart = useChart();
const uid = $props.id();
const styles = $derived(heatmapChart({ shape }));
const innerWidth = $derived(
	Math.max(0, frame.width - HEATMAP_MARGIN.left - HEATMAP_MARGIN.right),
);
const innerHeight = $derived(
	Math.max(0, frame.height - HEATMAP_MARGIN.top - HEATMAP_MARGIN.bottom),
);
const size = $derived(
	weeks === 0
		? 0
		: Math.max(
				2,
				Math.min(
					(innerWidth - (weeks - 1) * gap) / Math.max(weeks, 1),
					(innerHeight - 6 * gap) / 7,
				),
			),
);
const offsetX = $derived(
	HEATMAP_MARGIN.left +
		Math.max(0, (innerWidth - (weeks * size + (weeks - 1) * gap)) / 2),
);
const at = (cell: HeatmapCell) => ({
	x: offsetX + cell.col * (size + gap),
	y: HEATMAP_MARGIN.top + cell.row * (size + gap),
});
const radius = $derived(size * SHAPE_RADIUS[shape]);
const monthFormat = $derived(new Intl.DateTimeFormat(locale, { month: "short" }));
const weekdayFormat = $derived(new Intl.DateTimeFormat(locale, { weekday: "short" }));

// Two frames at the hidden start so the CSS transitions have a first value to leave.
let epoch = $state(0);
// svelte-ignore state_referenced_locally
let entered = $state(phase !== "revealing");
$effect.pre(() => {
	const current = phase;
	return untrack(() => {
		if (current !== "revealing" && current !== "concealing") return;
		const reveal = current === "revealing";
		const skip = !animate || prefersReducedMotion();
		if (reveal) {
			epoch += 1;
			entered = skip;
		}
		let raf = 0;
		if (reveal && !skip)
			raf = requestAnimationFrame(() => {
				raf = requestAnimationFrame(() => {
					entered = true;
				});
			});
		const clock = tween({
			duration: skip ? 0 : reveal ? HEATMAP_TIMING.enter : HEATMAP_TIMING.conceal,
			ease: (t) => t,
			onUpdate: () => {},
			onComplete: () => onPhaseDone(),
		});
		return () => {
			cancelAnimationFrame(raf);
			clock.stop();
		};
	});
});

let overlays: (SVGRectElement | null)[] = $state([]);
$effect(() => {
	if (phase !== "loading") return;
	const count = cells.length;
	return untrack(() =>
		runShimmer(count, (i, opacity) =>
			overlays[i]?.setAttribute("opacity", String(opacity)),
		),
	);
});

// Left and right step a week; the frame already steps a day on up and down.
$effect(() => {
	const el = frame.el;
	if (!el) return;
	const onKey = (event: KeyboardEvent) => {
		if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
		if (phase !== "ready" || cells.length === 0) return;
		event.preventDefault();
		event.stopPropagation();
		const step = event.key === "ArrowRight" ? 7 : -7;
		const next =
			activeIndex === null
				? step > 0
					? 0
					: cells.length - 1
				: Math.min(cells.length - 1, Math.max(0, activeIndex + step));
		setActive(next, true);
	};
	el.addEventListener("keydown", onKey, true);
	return () => el.removeEventListener("keydown", onKey, true);
});

const highlightedLevel = $derived(
	chart.highlighted?.startsWith("heatmap-level-")
		? Number(chart.highlighted.slice("heatmap-level-".length))
		: null,
);
const activeCell = $derived(activeIndex !== null ? cells[activeIndex] : undefined);
const dimming = $derived(activeCell !== undefined || highlightedLevel !== null);
const lit = (cell: HeatmapCell) =>
	activeCell
		? cell.index === activeCell.index
		: highlightedLevel === null || cell.level === highlightedLevel;

const activePoint = $derived.by<ActivePoint | null>(() => {
	if (!activeCell) return null;
	const p = at(activeCell);
	return {
		index: activeCell.index,
		datum: { index: activeCell.index },
		x: p.x + size / 2,
		y: { value: p.y + size / 2 },
	};
});
setActivePoint({
	get active() {
		return activePoint;
	},
	get instant() {
		return instant;
	},
	title: (datum: Datum) => {
		const cell = cells[Number(datum.index)];
		return cell ? title(cell) : "";
	},
	rows: (datum: Datum) => {
		const cell = cells[Number(datum.index)];
		if (!cell) return [];
		return [{ key: "value", color: levelFill(cell.level), ...rowFor(cell) }];
	},
});

const concealing = $derived(phase === "concealing");
const loading = $derived(phase === "loading");
const revealing = $derived(phase === "revealing");
function cellTransition(cell: HeatmapCell) {
	if (revealing && !entered) return "none";
	if (revealing)
		return `opacity ${HEATMAP_TIMING.enter}ms ${HEATMAP_TIMING.enterEase} ${enterDelay(cell.col, cell.row, epoch)}ms`;
	if (concealing)
		return `opacity ${HEATMAP_TIMING.conceal}ms ${HEATMAP_TIMING.enterEase}`;
	return `opacity ${HEATMAP_TIMING.hover}ms ${HEATMAP_TIMING.hoverEase}`;
}
</script>

<svg
	aria-hidden="true"
	width={frame.width}
	height={frame.height}
	class="absolute inset-0 block overflow-visible"
	onpointerleave={() => activeIndex !== null && setActive(null, false)}
>
	{#if patterns}
		<PatternDefs {uid} {size} />
	{/if}
	<g data-slot="heatmap-axis">
		{#each months as m (m.date.getTime())}
			<text x={offsetX + m.col * (size + gap)} y={HEATMAP_MARGIN.top - 7} class={styles.axis()}>
				{monthFormat.format(m.date)}
			</text>
		{/each}
		{#each weekdays as date, row (row)}
			{#if row % 2 === 1}
				<text
					x={offsetX - 6}
					y={HEATMAP_MARGIN.top + row * (size + gap) + size / 2}
					dy="0.35em"
					text-anchor="end"
					class={styles.axis()}
				>
					{weekdayFormat.format(date)}
				</text>
			{/if}
		{/each}
	</g>
	<g data-slot="heatmap-cells">
		{#each cells as cell (cell.index)}
			{@const p = at(cell)}
			{@const shown = !loading && !concealing && (!revealing || entered)}
			{@const pattern = LEVEL_PATTERN[cell.level]}
			<g
				data-slot="heatmap-cell"
				data-level={cell.level}
				role="presentation"
				style:opacity={shown ? (dimming && !lit(cell) ? HEATMAP_TIMING.faded : 1) : 0}
				style:transition={cellTransition(cell)}
				onpointerenter={() => setActive(cell.index, false)}
			>
				<rect
					x={p.x}
					y={p.y}
					width={size}
					height={size}
					rx={radius}
					fill={levelFill(cell.level)}
					class={styles.cell()}
				/>
				{#if patterns && pattern !== "none" && pattern !== "solid"}
					<rect
						x={p.x}
						y={p.y}
						width={size}
						height={size}
						rx={radius}
						fill="url(#{uid}-{pattern})"
						pointer-events="none"
					/>
				{/if}
			</g>
		{/each}
	</g>
	{#if loading}
		<g data-slot="heatmap-loading">
			{#each cells as cell, i (cell.index)}
				{@const p = at(cell)}
				<rect
					bind:this={overlays[i]}
					x={p.x}
					y={p.y}
					width={size}
					height={size}
					rx={radius}
					opacity={0}
					class={styles.overlay()}
				/>
			{/each}
		</g>
	{/if}
	{#if activeCell}
		{@const p = at(activeCell)}
		<rect
			data-slot="heatmap-active"
			x={p.x - 1.5}
			y={p.y - 1.5}
			width={size + 3}
			height={size + 3}
			rx={radius + 1.5}
			stroke-width={1.5}
			class={styles.active()}
		/>
	{/if}
</svg>
{#if frame.el}
	<ChartTooltipPanel
		target={frame.el}
		anchor={activePoint ? { x: activePoint.x, y: activePoint.y.value ?? 0 } : null}
		{instant}
		bounds={frame}
	>
		<ChartTooltipContent />
	</ChartTooltipPanel>
{/if}
