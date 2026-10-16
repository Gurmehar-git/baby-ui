<script lang="ts">
import ChartTooltipContent from "../../chart/svelte/chart-tooltip-content.svelte";
import ChartTooltipPanel from "../../chart/svelte/chart-tooltip-panel.svelte";
import { setActivePoint, useChart } from "../../chart/svelte/context";
import type { ActivePoint, Datum, TooltipRow } from "../../chart/svelte/core";
import { CHART_DURATION, tween } from "../../chart/svelte/motion";
import {
	axisPicks,
	blendLayers,
	layerAt,
	type StreamLayers,
	streamExtent,
	streamPath,
	widestStretch,
} from "./stream";
import { type StreamgraphVariant, streamgraphChart } from "./variants";

let {
	frame,
	data,
	xKey,
	layers,
	label,
	at,
	variant,
	directLabels,
	animate,
	activeIndex,
	instant,
	setActive,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	data: Datum[];
	xKey: string;
	layers: StreamLayers;
	label: (key: string) => string;
	at: (index: number, key: string) => number;
	variant: StreamgraphVariant;
	directLabels: boolean;
	animate: boolean;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
} = $props();

const AXIS = 22;
const PAD = 8;
const chart = useChart();
const uid = $props.id();
const clipId = `stream-${uid}`;
// svelte-ignore state_referenced_locally
let reveal = $state(animate ? 0 : 1);
let shown = $state<StreamLayers | null>(null);
let hoverKey = $state<string | null>(null);
let previous: StreamLayers | null = null;
$effect(() => {
	if (!animate) {
		reveal = 1;
		return;
	}
	const playback = tween({
		duration: CHART_DURATION.enter,
		onUpdate: (t) => {
			reveal = t;
		},
	});
	return () => playback.stop();
});
$effect(() => {
	const to = layers;
	const from = previous;
	previous = to;
	if (!from) {
		shown = to;
		return;
	}
	const playback = tween({
		duration: CHART_DURATION.update,
		onUpdate: (t) => {
			shown = blendLayers(from, to, t);
		},
	});
	return () => playback.stop();
});
const view = $derived(shown ?? layers);
const extent = $derived(streamExtent(view));
const plotHeight = $derived(Math.max(1, frame.height - AXIS - PAD * 2));
const step = $derived(data.length > 1 ? frame.width / (data.length - 1) : 0);
const sx = (index: number) => index * step;
const sy = (v: number) =>
	PAD + (1 - (v - extent[0]) / (extent[1] - extent[0])) * plotHeight;
const focus = $derived(hoverKey ?? chart.highlighted);
const s = $derived(streamgraphChart({ variant }));
const activePoint = $derived.by<ActivePoint | null>(() => {
	const datum = activeIndex !== null ? data[activeIndex] : undefined;
	if (!datum || activeIndex === null) return null;
	return {
		index: activeIndex,
		datum: { ...datum, index: activeIndex },
		x: sx(activeIndex),
		y: { value: PAD + plotHeight / 2 },
	};
});
setActivePoint({
	get active() {
		return activePoint;
	},
	get instant() {
		return instant;
	},
	title: (datum: Datum) => String(datum[xKey] ?? ""),
	rows: (datum: Datum): TooltipRow[] => {
		const index = Number(datum.index);
		return [...layers]
			.reverse()
			.filter(
				(layer) => (layer.points[index]?.[1] ?? 0) - (layer.points[index]?.[0] ?? 0) > 0,
			)
			.map((layer) => ({
				key: layer.key,
				label: label(layer.key),
				color: `var(--color-${layer.key})`,
				value: at(index, layer.key),
			}));
	},
});
</script>

<svg
	aria-hidden="true"
	width={frame.width}
	height={frame.height}
	class="absolute inset-0 block touch-pan-y overflow-visible"
	onpointermove={(event) => {
		if ((event.pointerType !== "mouse" && !event.buttons) || !step) return;
		const box = event.currentTarget.getBoundingClientRect();
		const index = Math.min(data.length - 1, Math.max(0, Math.round((event.clientX - box.left) / step)));
		const valueAt = extent[0] + (1 - (event.clientY - box.top - PAD) / plotHeight) * (extent[1] - extent[0]);
		hoverKey = layerAt(view, index, valueAt);
		setActive(index, false);
	}}
	onpointerleave={() => {
		hoverKey = null;
		if (activeIndex !== null) setActive(null, false);
	}}
>
	<defs>
		<clipPath id={clipId}><rect x={0} y={0} width={frame.width * reveal} height={frame.height} /></clipPath>
	</defs>
	<g clip-path="url(#{clipId})">
		{#each view as layer (layer.key)}
			<path
				data-slot="streamgraph-layer"
				data-dim={focus != null && focus !== layer.key}
				d={streamPath(layer.points, sx, sy)}
				class={s.layer()}
				style:--stream-color="var(--color-{layer.key})"
			/>
		{/each}
		{#if directLabels && step}
			{#each view as layer (layer.key)}
				{@const widest = widestStretch(layer.points)}
				{#if (widest.thickness / (extent[1] - extent[0])) * plotHeight >= 18}
					<text
						x={Math.min(Math.max(sx(widest.index), 32), frame.width - 32)}
						y={sy(widest.middle)}
						text-anchor="middle"
						dominant-baseline="central"
						class={s.label()}
						style:--stream-color="var(--color-{layer.key})">{label(layer.key)}</text
					>
				{/if}
			{/each}
		{/if}
	</g>
	{#if activeIndex !== null}
		<line x1={sx(activeIndex)} x2={sx(activeIndex)} y1={PAD} y2={PAD + plotHeight} class={s.cursor()} />
	{/if}
	{#each axisPicks(data.length, frame.width) as index (index)}
		<text
			x={sx(index)}
			y={frame.height - 6}
			text-anchor={index === 0 ? "start" : index === data.length - 1 ? "end" : "middle"}
			class={s.tick()}>{String(data[index]?.[xKey] ?? "")}</text
		>
	{/each}
</svg>
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
