<svelte:options namespace="svg" />

<script lang="ts">
import { untrack } from "svelte";
import { stackBase, stackMax } from "../../area-chart/geometry";
import { type ChartPhase, type Datum, seriesColor, toDate } from "../../chart/core";
import { CHART_DURATION, CHART_EASE, type Playback, tween } from "../../chart/motion";
import { useActivePoint, useChart, usePlot } from "../../chart/svelte/context";
import { useExtentRegistry } from "../../chart/svelte/time-series-chart.svelte";
import { cn } from "../../lib/cn";
import {
	localProgress,
	seriesBarDelay,
	seriesBarOffset,
	seriesBarWidth,
} from "../geometry";
import { type SeriesBarVariant, seriesBar } from "../variants";
import { useBarLayout } from "./context";

let {
	dataKey,
	color: colorProp,
	variant = "solid",
	radius = 3,
	class: className,
}: {
	dataKey: string;
	/** Defaults to the series colour from the chart config, `var(--color-<dataKey>)`. */
	color?: string;
	variant?: SeriesBarVariant;
	/** Corner radius of the bar's top in px. */
	radius?: number;
	class?: string;
} = $props();

type Segment = { base: number; top: number };
type Kind = "enter" | "update" | "exit";

const plot = usePlot();
const chart = useChart();
const pointer = useActivePoint();
const layout = useBarLayout();
const registerExtent = useExtentRegistry();
const uid = $props.id();
const color = $derived(colorProp ?? seriesColor(dataKey));
const total = CHART_DURATION.enter * 1.4;

$effect(() => {
	const next = { key: dataKey, color };
	return untrack(() => plot.register(next));
});
$effect(() => {
	const key = dataKey;
	return untrack(() => layout.register(key));
});

const visible = $derived(layout.keys.filter((k) => !chart.hidden.has(k)));
const index = $derived(Math.max(0, visible.indexOf(dataKey)));
const below = $derived(layout.stacked ? visible.slice(0, index) : []);
const stackTop = $derived(
	layout.stacked && !chart.hidden.has(dataKey) ? stackMax(plot.data, dataKey, below) : 0,
);
$effect(() => {
	const value = stackTop;
	if (!value) return;
	return untrack(() => registerExtent(`${uid}-stack`, { y: [0, value] }));
});

const width = $derived(
	seriesBarWidth({
		innerWidth: plot.innerWidth,
		count: plot.data.length,
		groups: layout.stacked ? 1 : Math.max(1, visible.length),
		size: layout.size,
		maxSize: layout.maxSize,
		gap: layout.gap,
	}),
);
const offset = $derived(
	seriesBarOffset({
		index,
		groups: visible.length,
		width,
		gap: layout.gap,
		stacked: layout.stacked,
	}),
);

const keyOf = (datum: Datum, i: number) =>
	String(toDate(datum[plot.xKey]).getTime() || i);
const order = $derived(plot.data.map(keyOf));
const targets = $derived.by(() => {
	const map = new Map<string, Segment>();
	plot.data.forEach((datum, i) => {
		const value = datum[dataKey];
		if (typeof value !== "number" || chart.hidden.has(dataKey)) return;
		const base = stackBase(datum, below);
		map.set(keyOf(datum, i), { base, top: base + value });
	});
	return map;
});
const signature = $derived(
	[...targets].map(([k, s]) => `${k}:${s.base}:${s.top}`).join(","),
);

// Bars grow from the baseline staggered, retween on data changes and mirror on conceal.
let clock = $state(1);
let kind = $state<Kind>("enter");
let from = new Map<string, Segment>();
let shown = new Map<string, Segment>();
let prevPhase: ChartPhase | null = null;
// svelte-ignore state_referenced_locally
let prevSignature = signature;
let playback: Playback | null = null;
$effect(() => () => playback?.stop());
// A phase change without a new motion must not cancel the growth still running.
$effect.pre(() => {
	const phase = plot.phase;
	const next = signature;
	untrack(() => {
		const phaseChanged = prevPhase !== phase;
		const dataChanged = prevSignature !== next;
		prevPhase = phase;
		prevSignature = next;
		let nextKind: Kind | null = null;
		if (phaseChanged && phase === "revealing") nextKind = "enter";
		else if (phaseChanged && phase === "concealing") nextKind = "exit";
		else if (dataChanged && phase === "ready") nextKind = "update";
		if (!nextKind) return;
		from = nextKind === "enter" ? new Map() : shown;
		kind = nextKind;
		playback?.stop();
		if (!plot.animate) {
			clock = 1;
			return;
		}
		clock = 0;
		playback = tween({
			duration: nextKind === "update" ? CHART_DURATION.update : total,
			ease: (t) => t,
			onUpdate: (p) => {
				clock = p;
			},
		});
	});
});

const segments = $derived.by(() => {
	const map = new Map<string, Segment>();
	if (plot.phase === "loading" || plot.phase === "gridTweenLoading") return map;
	const count = order.length;
	order.forEach((key, i) => {
		const target = targets.get(key);
		if (!target) return;
		const start = from.get(key) ?? { base: target.base, top: target.base };
		const end = kind === "exit" ? { base: start.base, top: start.base } : target;
		const p =
			kind === "update"
				? CHART_EASE(clock)
				: localProgress(
						clock * total,
						seriesBarDelay(i, count, CHART_DURATION.enter),
						CHART_DURATION.enter,
						CHART_EASE,
					);
		map.set(key, {
			base: start.base + (end.base - start.base) * p,
			top: start.top + (end.top - start.top) * p,
		});
	});
	return map;
});
$effect.pre(() => {
	shown = segments;
});

const dimmedByLegend = $derived(
	chart.highlighted !== null && chart.highlighted !== dataKey,
);
const barClass = $derived(cn(seriesBar({ variant }), className));
</script>

<g data-slot="chart-series-bar" data-series={dataKey} data-variant={variant}>
	{#each plot.data as datum, i (order[i])}
		{@const segment = segments.get(order[i] ?? "")}
		{#if segment}
			{@const y0 = plot.yScale(segment.base)}
			{@const y1 = plot.yScale(segment.top)}
			{@const height = Math.abs(y0 - y1)}
			<rect
				data-index={i}
				x={plot.x(datum) + offset}
				y={Math.min(y0, y1)}
				{width}
				{height}
				rx={Math.min(radius, width / 2, height / 2)}
				fill={color}
				stroke={variant === "outline" ? color : undefined}
				class={barClass}
				style:opacity={(pointer.active !== null && pointer.active.index !== i) || dimmedByLegend
					? 0.3
					: 1}
			/>
		{/if}
	{/each}
</g>
