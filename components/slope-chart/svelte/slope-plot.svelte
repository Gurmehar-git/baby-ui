<script lang="ts">
import { untrack } from "svelte";
import type { ActivePoint, Datum } from "../../chart/core";
import { CHART_DURATION, tween } from "../../chart/motion";
import ChartTooltipContent from "../../chart/svelte/chart-tooltip-content.svelte";
import ChartTooltipPanel from "../../chart/svelte/chart-tooltip-panel.svelte";
import { setActivePoint, useChart } from "../../chart/svelte/context";
import {
	blendLayout,
	nearestSlope,
	rankText,
	SLOPE_HEAD,
	type SlopeItem,
	type SlopeLayout,
	type SlopeRow,
	slopeLayout,
} from "../geometry";
import { type SlopeVariant, slopeChart } from "../variants";

let {
	frame,
	items,
	byEnd,
	startLabel,
	endLabel,
	highlightKey,
	variant,
	animate,
	change,
	activeIndex,
	instant,
	setActive,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	items: SlopeItem[];
	byEnd: SlopeItem[];
	startLabel: string;
	endLabel: string;
	highlightKey: string | null;
	variant: SlopeVariant;
	animate: boolean;
	change: (item: SlopeItem) => string;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
} = $props();

const chart = useChart();
const target = $derived(
	slopeLayout(items, frame.width, frame.height, variant !== "minimal"),
);
const signature = $derived(
	items.map((item) => `${item.key}:${item.start}:${item.end}`).join("|"),
);
// svelte-ignore state_referenced_locally
let drawn = $state(!animate);
let shown = $state<SlopeLayout | null>(null);
let previous: SlopeLayout | null = null;
let seen = untrack(() => signature);
$effect(() => {
	if (!animate) {
		drawn = true;
		return;
	}
	const id = requestAnimationFrame(() => (drawn = true));
	return () => cancelAnimationFrame(id);
});
$effect(() => {
	const to = target;
	const morph = seen !== signature;
	seen = signature;
	const from = previous;
	previous = to;
	// Only new data morphs; a resize or first paint jumps.
	if (!morph || !from || from.x0 !== to.x0 || from.height !== to.height) {
		shown = to;
		return;
	}
	const playback = tween({
		duration: CHART_DURATION.update,
		onUpdate: (t) => {
			shown = blendLayout(from, to, t);
		},
	});
	return () => playback.stop();
});
const layout = $derived(
	shown && shown.x1 === target.x1 && shown.height === target.height ? shown : target,
);
const activeKey = $derived(activeIndex !== null ? byEnd[activeIndex]?.key : undefined);
const activeRow = $derived(layout.rows.find((row) => row.key === activeKey));
const s = $derived(slopeChart({ variant }));
const colorOf = (row: SlopeRow) =>
	highlightKey
		? row.key === highlightKey
			? `var(--color-${row.key}, var(--chart-1))`
			: "var(--color-muted-foreground)"
		: chart.config[row.key]
			? `var(--color-${row.key})`
			: "var(--chart-1)";
const activePoint = $derived.by<ActivePoint | null>(() => {
	if (!activeRow || activeIndex === null) return null;
	return {
		index: activeIndex,
		datum: { ...activeRow },
		x: (layout.x0 + layout.x1) / 2,
		y: { value: (activeRow.y0 + activeRow.y1) / 2 },
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
		{ key: "start", label: startLabel, color: "transparent", value: Number(datum.start) },
		{ key: "end", label: endLabel, color: "transparent", value: Number(datum.end) },
		{
			key: "change",
			label: activeRow ? `${change(activeRow)}, ${rankText(activeRow)}` : "",
			color: "transparent",
			value: null,
		},
	],
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
		const row = nearestSlope(layout, event.clientX - box.left, event.clientY - box.top);
		const index = row ? byEnd.findIndex((item) => item.key === row.key) : -1;
		setActive(index < 0 ? null : index, false);
	}}
	onpointerleave={() => {
		if (activeIndex !== null) setActive(null, false);
	}}
>
	<line x1={layout.x0} x2={layout.x0} y1={SLOPE_HEAD} y2={frame.height} class={s.axis()} />
	<line x1={layout.x1} x2={layout.x1} y1={SLOPE_HEAD} y2={frame.height} class={s.axis()} />
	{#each layout.rows as row, i (row.key)}
		<g
			data-dim={activeKey !== undefined && activeKey !== row.key}
			class={s.item()}
			style:--slope-color={colorOf(row)}
			style:--slope-delay="{i * 50}ms"
		>
			<path d="M{layout.x0 - 6},{row.l0}L{layout.x0 - 1},{row.y0}" class={s.leader()} />
			<path d="M{layout.x1 + 6},{row.l1}L{layout.x1 + 1},{row.y1}" class={s.leader()} />
			<path
				d="M{layout.x0},{row.y0}L{layout.x1},{row.y1}"
				pathLength="1"
				data-drawn={drawn}
				class={s.line()}
				style:stroke-width={activeKey === row.key ? 3 : undefined}
			/>
			<circle cx={layout.x0} cy={row.y0} r={4} data-drawn={drawn} class={s.dot()} />
			<circle
				cx={layout.x1}
				cy={row.y1}
				r={4}
				data-drawn={drawn}
				class={s.dot()}
				style:--slope-delay="{700 + i * 50}ms"
			/>
		</g>
	{/each}
</svg>
<span aria-hidden="true" class={s.column()} style:left="{layout.x0}px">{startLabel}</span>
<span aria-hidden="true" class={s.column()} style:left="{layout.x1}px">{endLabel}</span>
{#each layout.rows as row, i (row.key)}
	{@const dim = activeKey !== undefined && activeKey !== row.key}
	{@const move = row.rank0 - row.rank1}
	<div aria-hidden="true">
		<span
			data-drawn={drawn}
			data-dim={dim}
			class={s.label()}
			style:top="{row.l0}px"
			style:right="{frame.width - layout.x0 + 10}px"
			style:max-width="{layout.x0 - 10}px"
			style:--slope-delay="{i * 50}ms"
		>
			<span class={s.name()}>{row.label}</span>
			<span class={s.value()}>{chart.format.number(row.start)}</span>
		</span>
		<span
			data-drawn={drawn}
			data-dim={dim}
			class={s.label()}
			style:top="{row.l1}px"
			style:left="{layout.x1 + 10}px"
			style:--slope-delay="{700 + i * 50}ms"
		>
			<span class={s.value()}>{chart.format.number(row.end)}</span>
			<span data-move={move > 0 ? "up" : move < 0 ? "down" : "level"} class={s.rank()}>
				{#if move !== 0}
					<svg
						viewBox="0 0 8 8"
						fill="none"
						stroke="currentColor"
						stroke-width="1.3"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
						><path d={move > 0 ? "M4 7V1M1.5 3.5 4 1l2.5 2.5" : "M4 1v6M1.5 4.5 4 7l2.5-2.5"} /></svg
					>
				{/if}
				{move === 0 ? "=" : Math.abs(move)}
			</span>
		</span>
	</div>
{/each}
{#if frame.el}
	<ChartTooltipPanel
		target={frame.el}
		anchor={activePoint ? { x: activePoint.x, y: activePoint.y.value ?? 0 } : null}
		{instant}
		bounds={{ width: frame.width, height: frame.height }}
	>
		<ChartTooltipContent indicator="line" hideIndicator />
	</ChartTooltipPanel>
{/if}
