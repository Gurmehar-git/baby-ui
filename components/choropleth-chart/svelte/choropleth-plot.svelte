<script lang="ts">
import ChartTooltipContent from "../../chart/svelte/chart-tooltip-content.svelte";
import ChartTooltipPanel from "../../chart/svelte/chart-tooltip-panel.svelte";
import { setActivePoint } from "../../chart/svelte/context";
import type { ActivePoint, Datum } from "../../chart/svelte/core";
import { CHART_DURATION, prefersReducedMotion, tween } from "../../chart/svelte/motion";
import type { ChoroplethLabels } from "./choropleth-chart.svelte";
import {
	clampZoom,
	DIM_TRANSITION,
	type GeoCollection,
	IDENTITY_ZOOM,
	KEY_ZOOM_STEP,
	layoutMap,
	type MapFeature,
	WHEEL_STEP,
	ZOOM_TRANSITION,
	type ZoomState,
	zoomAt,
	zoomTransform,
} from "./geometry";
import { type ChoroplethProjection, choroplethChart } from "./variants";

let {
	frame,
	data,
	values,
	keyProp,
	labelProp,
	projection,
	graticule,
	dimOpacity,
	zoomable,
	zoomMin,
	zoomMax,
	zoom,
	setZoom,
	labels,
	animate,
	activeKey,
	entries,
	activeIndex,
	instant,
	setActive,
	measure,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	data: GeoCollection;
	values: Record<string, number>;
	keyProp: string;
	labelProp: string;
	projection: ChoroplethProjection;
	graticule: boolean;
	dimOpacity: number;
	zoomable: boolean;
	zoomMin: number;
	zoomMax: number;
	zoom: ZoomState;
	setZoom: (zoom: ZoomState) => void;
	labels: ChoroplethLabels;
	animate: boolean;
	activeKey: string | null;
	entries: { key: string; label: string; value: number }[];
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
	measure: (width: number, height: number) => void;
} = $props();

const styles = $derived(choroplethChart({ projection, zoomable }));
const layout = $derived(
	layoutMap({
		data,
		values,
		keyProp,
		labelProp,
		projection,
		width: frame.width,
		height: frame.height,
	}),
);
let svg = $state<SVGSVGElement | null>(null);
let layer = $state<SVGGElement | null>(null);
let dragging = $state(false);

$effect(() => measure(frame.width, frame.height));

$effect.pre(() => {
	const node = layer;
	void data;
	if (!node) return;
	if (!animate) {
		node.style.opacity = "1";
		return;
	}
	node.style.opacity = "0";
	const playback = tween({
		duration: CHART_DURATION.enter,
		onUpdate: (p) => {
			node.style.opacity = String(p);
		},
	});
	return () => playback.stop();
});

$effect(() => {
	const node = svg;
	if (!node || !zoomable) return;
	const min = zoomMin;
	const max = zoomMax;
	const onWheel = (event: WheelEvent) => {
		event.preventDefault();
		const bounds = node.getBoundingClientRect();
		const factor = event.deltaY > 0 ? 1 / WHEEL_STEP : WHEEL_STEP;
		setZoom(
			zoomAt(
				zoom,
				factor,
				event.clientX - bounds.left,
				event.clientY - bounds.top,
				min,
				max,
			),
		);
	};
	node.addEventListener("wheel", onWheel, { passive: false });
	return () => node.removeEventListener("wheel", onWheel);
});

const pointers = new Map<number, { x: number; y: number }>();
let gesture: { zoom: ZoomState; x: number; y: number; distance: number } | null = null;
function startGesture() {
	const [a, b] = [...pointers.values()];
	if (!a) {
		gesture = null;
		return;
	}
	gesture = {
		zoom,
		x: b ? (a.x + b.x) / 2 : a.x,
		y: b ? (a.y + b.y) / 2 : a.y,
		distance: b ? Math.hypot(a.x - b.x, a.y - b.y) : 0,
	};
}
function local(event: PointerEvent & { currentTarget: SVGSVGElement }) {
	const bounds = event.currentTarget.getBoundingClientRect();
	return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
}
function onpointerdown(event: PointerEvent & { currentTarget: SVGSVGElement }) {
	if (!zoomable) return;
	event.currentTarget.setPointerCapture(event.pointerId);
	pointers.set(event.pointerId, local(event));
	startGesture();
}
function onpointermove(event: PointerEvent & { currentTarget: SVGSVGElement }) {
	const start = gesture;
	if (!zoomable || !start || !pointers.has(event.pointerId)) return;
	pointers.set(event.pointerId, local(event));
	const [a, b] = [...pointers.values()];
	if (!a) return;
	const x = b ? (a.x + b.x) / 2 : a.x;
	const y = b ? (a.y + b.y) / 2 : a.y;
	if (!dragging && Math.hypot(x - start.x, y - start.y) > 3) dragging = true;
	let next: ZoomState = {
		...start.zoom,
		x: start.zoom.x + x - start.x,
		y: start.zoom.y + y - start.y,
	};
	if (b && start.distance > 0) {
		const factor = Math.hypot(a.x - b.x, a.y - b.y) / start.distance;
		next = zoomAt(next, factor, x, y, zoomMin, zoomMax);
	}
	setZoom(clampZoom(next, zoomMin, zoomMax));
}
function onpointerup(event: PointerEvent) {
	pointers.delete(event.pointerId);
	startGesture();
	if (pointers.size === 0) dragging = false;
}

const activeFeature = $derived(
	activeKey ? layout.features.find((f) => f.key === activeKey) : undefined,
);
const indexOf = $derived(new Map(entries.map((e, i) => [e.key, i])));
function onEnter(feature: MapFeature) {
	if (dragging) return;
	setActive(indexOf.get(feature.key) ?? null, false);
}

const anchor = $derived(
	activeFeature
		? {
				x: activeFeature.centroid[0] * zoom.k + zoom.x,
				y: activeFeature.centroid[1] * zoom.k + zoom.y,
			}
		: null,
);
const activePoint = $derived.by<ActivePoint | null>(() =>
	activeFeature && activeIndex !== null && anchor
		? {
				index: activeIndex,
				datum: {
					key: activeFeature.key,
					label: activeFeature.label,
					value: activeFeature.value,
					fill: activeFeature.fill,
				},
				x: anchor.x,
				y: { value: anchor.y },
			}
		: null,
);
setActivePoint({
	get active() {
		return activePoint;
	},
	get instant() {
		return instant;
	},
	title: (datum: Datum) => String(datum.label ?? ""),
	get rows() {
		return (datum: Datum) => [
			{
				key: String(datum.key),
				label: labels.value,
				color: String(datum.fill ?? "currentColor"),
				value: typeof datum.value === "number" ? datum.value : null,
			},
		];
	},
});
</script>

<svg
	bind:this={svg}
	aria-hidden="true"
	width={frame.width}
	height={frame.height}
	class={styles.svg()}
	{onpointerdown}
	{onpointermove}
	{onpointerup}
	onpointercancel={onpointerup}
	onpointerleave={() => {
		if (!dragging && activeIndex !== null) setActive(null, false);
	}}
>
	<g
		data-slot="choropleth-layer"
		style:transform={zoomTransform(zoom)}
		style:transform-origin="0 0"
		style:transition={dragging || prefersReducedMotion() ? "none" : ZOOM_TRANSITION}
	>
		<g bind:this={layer}>
			{#if graticule}
				<path data-slot="choropleth-graticule" d={layout.graticule} class={styles.graticule()} />
			{/if}
			{#each layout.features as feature (`${feature.index}-${feature.key}`)}
				<path
					data-slot="choropleth-feature"
					data-key={feature.key}
					d={feature.path}
					fill={feature.fill}
					class={styles.feature()}
					style:opacity={activeFeature && activeFeature !== feature ? dimOpacity : 1}
					style:transition={DIM_TRANSITION}
					role="presentation"
					onpointerenter={() => onEnter(feature)}
				/>
			{/each}
			{#if activeFeature}
				<path
					d={activeFeature.path}
					fill="none"
					class="pointer-events-none stroke-foreground [stroke-width:1] [vector-effect:non-scaling-stroke]"
				/>
			{/if}
		</g>
	</g>
</svg>
{#if zoomable}
	<div class={styles.controls()}>
		<button
			type="button"
			aria-label={labels.zoomIn}
			class={styles.control()}
			disabled={zoom.k >= zoomMax}
			onclick={() =>
				setZoom(zoomAt(zoom, KEY_ZOOM_STEP, frame.width / 2, frame.height / 2, zoomMin, zoomMax))}
		>
			<svg aria-hidden="true" viewBox="0 0 16 16" class="size-3.5">
				<path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" stroke-width={1.5} stroke-linecap="round" />
			</svg>
		</button>
		<button
			type="button"
			aria-label={labels.zoomOut}
			class={styles.control()}
			disabled={zoom.k <= zoomMin}
			onclick={() =>
				setZoom(
					zoomAt(zoom, 1 / KEY_ZOOM_STEP, frame.width / 2, frame.height / 2, zoomMin, zoomMax),
				)}
		>
			<svg aria-hidden="true" viewBox="0 0 16 16" class="size-3.5">
				<path d="M3 8h10" fill="none" stroke="currentColor" stroke-width={1.5} stroke-linecap="round" />
			</svg>
		</button>
		<button
			type="button"
			aria-label={labels.resetZoom}
			class={styles.control()}
			onclick={() => setZoom(IDENTITY_ZOOM)}
		>
			<svg aria-hidden="true" viewBox="0 0 16 16" class="size-3.5">
				<path
					d="M3 8a5 5 0 1 0 1.5-3.5M3 3v2.5h2.5"
					fill="none"
					stroke="currentColor"
					stroke-width={1.5}
					stroke-linecap="round"
				/>
			</svg>
		</button>
	</div>
{/if}
{#if frame.el}
	<ChartTooltipPanel target={frame.el} {anchor} {instant} bounds={frame}>
		<ChartTooltipContent />
	</ChartTooltipPanel>
{/if}
