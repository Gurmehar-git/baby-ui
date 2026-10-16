<script lang="ts">
import { extent, max } from "d3-array";
import { scaleLinear, scaleTime } from "d3-scale";
import { curveMonotoneX, area as d3Area, line as d3Line } from "d3-shape";
import { useChart } from "../../chart/svelte/context";
import {
	type Datum,
	DEFAULT_MARGIN,
	nearestIndex,
	seriesColor,
	toDate,
} from "../../chart/svelte/core";
import { cn } from "../../lib/svelte/cn";
import {
	type BrushMode,
	clampRange,
	HANDLE_HEIGHT,
	HANDLE_HIT,
	HANDLE_WIDTH,
	type IndexRange,
	keyRange,
	moveRange,
	resizeRange,
	sameRange,
} from "./geometry";
import { type ChartBrushVariant, chartBrush } from "./variants";

let {
	data,
	dataKeys,
	xKey = "date",
	range = $bindable(),
	onRangeChange,
	variant = "area",
	height = 64,
	margin,
	label = "Visible range",
	rangeText,
	class: className,
}: {
	/** The full series; pass the same rows as the chart it drives. */
	data: Datum[];
	/** Series drawn in the overview strip. */
	dataKeys: string[];
	xKey?: string;
	/** Bind it to the chart's `xDomain`. */
	range?: [Date, Date];
	onRangeChange?: (range: [Date, Date]) => void;
	variant?: ChartBrushVariant;
	height?: number;
	/** Keep equal to the chart's left and right margins so the strip lines up. */
	margin?: { left?: number; right?: number };
	/** Accessible name of the range slider. */
	label?: string;
	/** Spoken value of the slider; defaults to "start to end" with locale dates. */
	rangeText?: (start: Date, end: Date) => string;
	class?: string;
} = $props();

const chart = useChart();
let root = $state<HTMLDivElement | null>(null);
let width = $state(0);
const left = $derived(margin?.left ?? DEFAULT_MARGIN.left);
const right = $derived(margin?.right ?? DEFAULT_MARGIN.right);
const inner = $derived(Math.max(0, width - left - right));
const count = $derived(data.length);

$effect(() => {
	const node = root;
	if (!node) return;
	const measure = () => {
		width = Math.floor(node.clientWidth);
	};
	measure();
	const observer = new ResizeObserver(measure);
	observer.observe(node);
	return () => observer.disconnect();
});

const indices = $derived<IndexRange>(
	range
		? clampRange(
				[
					nearestIndex(data, xKey, range[0].getTime()),
					nearestIndex(data, xKey, range[1].getTime()),
				],
				count,
			)
		: [0, Math.max(0, count - 1)],
);
function commit(next: IndexRange) {
	if (sameRange(next, indices)) return;
	const a = data[next[0]];
	const b = data[next[1]];
	if (!(a && b)) return;
	const dates: [Date, Date] = [toDate(a[xKey]), toDate(b[xKey])];
	range = dates;
	onRangeChange?.(dates);
}

const xScale = $derived.by(() => {
	const [min = 0, maxTime = min] = extent(data, (d) => toDate(d[xKey]).getTime());
	return scaleTime().domain([min, maxTime]).range([0, inner]);
});
const keys = $derived(dataKeys.filter((key) => !chart.hidden.has(key)));
const yScale = $derived.by(() => {
	const top = max(data, (d) =>
		max(keys, (k) => (typeof d[k] === "number" ? (d[k] as number) : 0)),
	);
	return scaleLinear()
		.domain([0, top || 1])
		.range([height - 6, 6]);
});
const xAt = (i: number) => {
	const d = data[i];
	return d ? xScale(toDate(d[xKey])) : 0;
};
const x0 = $derived(xAt(indices[0]));
const x1 = $derived(xAt(indices[1]));

let drag: { mode: BrushMode; origin: number; start: IndexRange } | null = null;
function indexAt(event: PointerEvent & { currentTarget: SVGSVGElement }) {
	const bounds = event.currentTarget.getBoundingClientRect();
	const time = xScale.invert(event.clientX - bounds.left - left).getTime();
	return nearestIndex(data, xKey, time);
}
function onpointerdown(event: PointerEvent & { currentTarget: SVGSVGElement }) {
	if (count < 2) return;
	const target = event.target as Element;
	const mode = (target.getAttribute("data-brush") as BrushMode | null) ?? "new";
	const index = indexAt(event);
	event.currentTarget.setPointerCapture(event.pointerId);
	drag = { mode, origin: index, start: indices };
	root?.focus({ preventScroll: true });
	if (mode === "new") commit(clampRange([index, index + 1], count));
}
function onpointermove(event: PointerEvent & { currentTarget: SVGSVGElement }) {
	const state = drag;
	if (!state) return;
	const index = indexAt(event);
	if (state.mode === "move") commit(moveRange(state.start, index - state.origin, count));
	else if (state.mode === "start" || state.mode === "end")
		commit(resizeRange(state.start, state.mode, index, count));
	else commit(clampRange([state.origin, index], count));
}
function onpointerup() {
	drag = null;
}
function onkeydown(event: KeyboardEvent) {
	const next = keyRange(event.key, event.shiftKey, indices, count);
	if (!next) return;
	event.preventDefault();
	commit(next);
}

const pathFor = (key: string) =>
	d3Line<Datum>()
		.x((d) => xScale(toDate(d[xKey])))
		.y((d) => yScale(typeof d[key] === "number" ? (d[key] as number) : 0))
		.curve(curveMonotoneX)(data) ?? "";
const areaFor = (key: string) =>
	d3Area<Datum>()
		.x((d) => xScale(toDate(d[xKey])))
		.y0(height - 6)
		.y1((d) => yScale(typeof d[key] === "number" ? (d[key] as number) : 0))
		.curve(curveMonotoneX)(data) ?? "";
const colorOf = (key: string) =>
	chart.config[key] ? seriesColor(key) : "var(--chart-1)";
const styles = $derived(chartBrush({ variant }));
const valueText = $derived.by(() => {
	const first = data[indices[0]];
	const last = data[indices[1]];
	if (!(first && last)) return "";
	const describe =
		rangeText ??
		((start: Date, end: Date) =>
			`${chart.format.tick(start)} to ${chart.format.tick(end)}`);
	return describe(toDate(first[xKey]), toDate(last[xKey]));
});
</script>

<div
	bind:this={root}
	data-slot="chart-brush"
	role="slider"
	tabindex="0"
	aria-label={label}
	aria-valuemin={0}
	aria-valuemax={Math.max(0, count - 1)}
	aria-valuenow={indices[0]}
	aria-valuetext={valueText}
	{onkeydown}
	class={cn(styles.root(), className)}
	style:height="{height}px"
>
	{#if width > 0}
		<svg
			aria-hidden="true"
			{width}
			{height}
			class={styles.svg()}
			{onpointerdown}
			{onpointermove}
			{onpointerup}
			onpointercancel={onpointerup}
		>
			<g transform="translate({left},0)">
				<rect width={inner} {height} rx={6} class={styles.track()} />
				{#each keys as key (key)}
					<g>
						<path d={areaFor(key)} class={styles.area()} fill={colorOf(key)} fill-opacity={0.14} />
						<path d={pathFor(key)} class={styles.preview()} stroke={colorOf(key)} />
					</g>
				{/each}
				<rect x={0} width={Math.max(0, x0)} {height} class={styles.shade()} />
				<rect x={x1} width={Math.max(0, inner - x1)} {height} class={styles.shade()} />
				<rect
					data-brush="move"
					data-slot="chart-brush-selection"
					x={x0}
					width={Math.max(0, x1 - x0)}
					{height}
					rx={4}
					class={styles.selection()}
				/>
				{#each [{ edge: "start", x: x0 }, { edge: "end", x: x1 }] as handle (handle.edge)}
					<g>
						<rect
							x={handle.x - HANDLE_WIDTH / 2}
							y={(height - HANDLE_HEIGHT) / 2}
							width={HANDLE_WIDTH}
							height={HANDLE_HEIGHT}
							rx={2}
							class={cn(styles.handle(), "pointer-events-none")}
						/>
						<rect
							data-brush={handle.edge}
							data-slot="chart-brush-handle"
							x={handle.x - HANDLE_HIT / 2}
							width={HANDLE_HIT}
							{height}
							class={styles.hit()}
						/>
					</g>
				{/each}
			</g>
		</svg>
	{/if}
</div>
