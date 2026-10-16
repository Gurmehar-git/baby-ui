<script lang="ts" module>
export interface ChoroplethLabels {
	value: string;
	noData: string;
	zoomIn: string;
	zoomOut: string;
	resetZoom: string;
	region: string;
}
</script>

<script lang="ts">
import ChartFrame from "../../chart/svelte/chart-frame.svelte";
import { useChart } from "../../chart/svelte/context";
import ChoroplethLegend from "./choropleth-legend.svelte";
import ChoroplethPlot from "./choropleth-plot.svelte";
import {
	featureKey,
	featureLabel,
	type GeoCollection,
	IDENTITY_ZOOM,
	KEY_PAN_STEP,
	KEY_ZOOM_STEP,
	type ZoomState,
	zoomAt,
} from "./geometry";
import type { ChoroplethProjection } from "./variants";

let {
	data,
	values,
	keyProp = "name",
	labelProp = "name",
	projection = "equalEarth",
	graticule = true,
	legend = true,
	dimOpacity = 0.4,
	zoomable = false,
	zoomMin = 1,
	zoomMax = 8,
	zoom = $bindable(IDENTITY_ZOOM),
	onZoomChange,
	labels: labelsProp,
	animate = true,
	activeIndex = $bindable(null),
	onActiveIndexChange,
	roleDescription = "map",
	class: className,
}: {
	/** GeoJSON features to draw; bring your own boundaries. */
	data: GeoCollection;
	/** Value per feature, keyed by `keyProp` (falls back to the feature id). */
	values: Record<string, number>;
	keyProp?: string;
	labelProp?: string;
	projection?: ChoroplethProjection;
	graticule?: boolean;
	legend?: boolean;
	/** Opacity of the other features while one is active. */
	dimOpacity?: number;
	/** Wheel, drag and pinch zoom plus +, -, 0 and shift+arrow keys. */
	zoomable?: boolean;
	zoomMin?: number;
	zoomMax?: number;
	zoom?: ZoomState;
	onZoomChange?: (zoom: ZoomState) => void;
	labels?: Partial<ChoroplethLabels>;
	animate?: boolean;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	roleDescription?: string;
	class?: string;
} = $props();

const chart = useChart();
const labels = $derived<ChoroplethLabels>({
	value: "Value",
	noData: "No data",
	zoomIn: "Zoom in",
	zoomOut: "Zoom out",
	resetZoom: "Reset zoom",
	region: "Region",
	...labelsProp,
});
const entries = $derived.by(() => {
	const out: { key: string; label: string; value: number }[] = [];
	for (const feature of data.features) {
		const key = featureKey(feature, keyProp);
		const value = values[key];
		if (typeof value === "number" && Number.isFinite(value))
			out.push({ key, label: featureLabel(feature, labelProp, key), value });
	}
	return out.sort((a, b) => a.label.localeCompare(b.label));
});
let instant = $state(false);
let plotSize = { width: 0, height: 0 };

function setActive(index: number | null, fromKeyboard: boolean) {
	instant = fromKeyboard;
	activeIndex = index;
	onActiveIndexChange?.(index);
}
function setZoom(next: ZoomState) {
	zoom = next;
	onZoomChange?.(next);
}

const active = $derived(activeIndex !== null ? entries[activeIndex] : undefined);
const highest = $derived(
	entries.reduce<(typeof entries)[number] | undefined>(
		(best, e) => (!best || e.value > best.value ? e : best),
		undefined,
	),
);
const lowest = $derived(
	entries.reduce<(typeof entries)[number] | undefined>(
		(best, e) => (!best || e.value < best.value ? e : best),
		undefined,
	),
);
const summary = $derived(
	chart.description ??
		(highest && lowest
			? `${entries.length} regions with data. Highest: ${highest.label}, ${chart.format.number(highest.value)}. Lowest: ${lowest.label}, ${chart.format.number(lowest.value)}.`
			: labels.noData),
);
const table = $derived({
	columns: [labels.region, labels.value],
	rows: entries.map((e) => ({ header: e.label, cells: [chart.format.number(e.value)] })),
});

function onkeydowncapture(event: KeyboardEvent) {
	if (!zoomable) return;
	const cx = plotSize.width / 2;
	const cy = plotSize.height / 2;
	let next: ZoomState | null = null;
	if (event.key === "+" || event.key === "=")
		next = zoomAt(zoom, KEY_ZOOM_STEP, cx, cy, zoomMin, zoomMax);
	else if (event.key === "-" || event.key === "_")
		next = zoomAt(zoom, 1 / KEY_ZOOM_STEP, cx, cy, zoomMin, zoomMax);
	else if (event.key === "0") next = IDENTITY_ZOOM;
	else if (event.shiftKey && event.key.startsWith("Arrow")) {
		const dx = event.key === "ArrowLeft" ? 1 : event.key === "ArrowRight" ? -1 : 0;
		const dy = event.key === "ArrowUp" ? 1 : event.key === "ArrowDown" ? -1 : 0;
		next = { ...zoom, x: zoom.x + dx * KEY_PAN_STEP, y: zoom.y + dy * KEY_PAN_STEP };
	}
	if (!next) return;
	event.preventDefault();
	event.stopPropagation();
	setZoom(next);
}
</script>

<div class="contents" role="presentation" {onkeydowncapture}>
	<ChartFrame
		{roleDescription}
		{summary}
		{table}
		count={entries.length}
		{activeIndex}
		onActiveChange={setActive}
		interactive={entries.length > 0}
		announcement={active && instant ? `${active.label}: ${chart.format.number(active.value)}` : ""}
		class={className}
	>
		{#snippet children(frame)}
			<ChoroplethPlot
				{frame}
				{data}
				{values}
				{keyProp}
				{labelProp}
				{projection}
				{graticule}
				{dimOpacity}
				{zoomable}
				{zoomMin}
				{zoomMax}
				{zoom}
				{setZoom}
				{labels}
				{animate}
				activeKey={active?.key ?? null}
				{entries}
				{activeIndex}
				{instant}
				{setActive}
				measure={(width, height) => (plotSize = { width, height })}
			/>
		{/snippet}
	</ChartFrame>
	{#if legend}
		<ChoroplethLegend {values} noData={labels.noData} />
	{/if}
</div>
