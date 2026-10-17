<script lang="ts">
import type { Snippet } from "svelte";
import type { ActivePoint, Datum, TooltipRow } from "../../chart/core";
import { setActivePoint } from "../../chart/svelte/context";
import type { RadarMetric, RadarSeries } from "../geometry";
import type { RadarGridShape, RadarVariant } from "../variants";
import { setRadar } from "./context";

let {
	frame,
	data,
	metrics,
	margin,
	levels,
	max,
	grid,
	variant,
	animate,
	activeIndex,
	instant,
	setActive,
	title,
	rows,
	children,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	data: RadarSeries[];
	metrics: RadarMetric[];
	margin: number;
	levels: number;
	max: number;
	grid: RadarGridShape;
	variant: RadarVariant;
	animate: boolean;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
	title: (datum: Datum) => string;
	rows: (datum: Datum) => TooltipRow[];
	children?: Snippet;
} = $props();

const radius = $derived(Math.max(0, Math.min(frame.width, frame.height) / 2 - margin));
const active = $derived.by<ActivePoint | null>(() => {
	const series = activeIndex !== null ? data[activeIndex] : undefined;
	if (!series || activeIndex === null) return null;
	return { index: activeIndex, datum: series.values, x: frame.width / 2, y: {} };
});

setRadar({
	get data() {
		return data;
	},
	get metrics() {
		return metrics;
	},
	get radius() {
		return radius;
	},
	get levels() {
		return levels;
	},
	get max() {
		return max;
	},
	get grid() {
		return grid;
	},
	get variant() {
		return variant;
	},
	get animate() {
		return animate;
	},
	get center() {
		return { x: frame.width / 2, y: frame.height / 2 };
	},
	get frame() {
		return frame;
	},
	setActive: (index, fromKeyboard) => setActive(index, fromKeyboard),
});
setActivePoint({
	get active() {
		return active;
	},
	get instant() {
		return instant;
	},
	get title() {
		return title;
	},
	get rows() {
		return rows;
	},
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
	<g transform="translate({frame.width / 2},{frame.height / 2})">
		{@render children?.()}
	</g>
</svg>
