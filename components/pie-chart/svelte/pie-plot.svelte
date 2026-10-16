<script lang="ts">
import ChartTooltipContent from "../../chart/svelte/chart-tooltip-content.svelte";
import ChartTooltipPanel from "../../chart/svelte/chart-tooltip-panel.svelte";
import { setActivePoint, useChart } from "../../chart/svelte/context";
import type { ActivePoint, Datum } from "../../chart/svelte/core";
import { CHART_DURATION, tween } from "../../chart/svelte/motion";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import { bisector, LABEL_MIN_SPAN, type PieSlice, sliceDelay } from "./geometry";
import PieSliceShape from "./pie-slice.svelte";
import { PIE_INNER_RATIO, type PieHover, type PieVariant, pieChart } from "./variants";

let {
	frame,
	slices,
	total,
	share,
	variant,
	hover,
	hoverOffset,
	cornerRadius,
	labels,
	centerLabel,
	animate,
	activeIndex,
	instant,
	setActive,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	slices: PieSlice[];
	total: number;
	share: (value: number) => string;
	variant: PieVariant;
	hover: PieHover;
	hoverOffset: number;
	cornerRadius: number;
	labels: boolean;
	centerLabel: string;
	animate: boolean;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
} = $props();

const chart = useChart();
const styles = $derived(pieChart({ variant, hover }));
const size = $derived(Math.min(frame.width, frame.height));
const outer = $derived(Math.max(0, size / 2 - hoverOffset));
const inner = $derived(outer * PIE_INNER_RATIO[variant]);
const cx = $derived(frame.width / 2);
const cy = $derived(frame.height / 2);

// Any change to what is drawn replays the sweep, the same as on mount.
const signature = $derived(slices.map((s) => `${s.key}:${s.value}`).join("|"));
// svelte-ignore state_referenced_locally
let settled = $state(!animate);
$effect.pre(() => {
	signature;
	const count = slices.length;
	if (!animate || count === 0) {
		settled = true;
		return;
	}
	settled = false;
	const playback = tween({
		duration: CHART_DURATION.enter,
		delay: sliceDelay(count - 1),
		ease: (t) => t,
		onUpdate: () => {},
		onComplete: () => {
			settled = true;
		},
	});
	return () => playback.stop();
});

const activeSlice = $derived(activeIndex !== null ? slices[activeIndex] : undefined);
const counterFormat = $derived((v: number) => chart.format.number(Math.round(v)));
const activePoint = $derived.by<ActivePoint | null>(() => {
	if (!activeSlice || activeIndex === null) return null;
	const mid = bisector(activeSlice.startAngle, activeSlice.endAngle, (inner + outer) / 2);
	return {
		index: activeIndex,
		datum: { key: activeSlice.key, label: activeSlice.label, value: activeSlice.value },
		x: cx + mid.x,
		y: { value: cy + mid.y },
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
			key: String(datum.key),
			label: share(Number(datum.value)),
			color: slices.find((s) => s.key === datum.key)?.color ?? "currentColor",
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
	<g transform="translate({cx},{cy})">
		{#each slices as slice, index (slice.key)}
			<PieSliceShape
				{slice}
				{index}
				{inner}
				{outer}
				{cornerRadius}
				{hover}
				{hoverOffset}
				active={activeIndex === index}
				faded={activeIndex !== null && activeIndex !== index}
				{instant}
				{signature}
				{animate}
				class={styles.slice()}
				onenter={() => setActive(index, false)}
				onleave={() => setActive(null, false)}
			/>
		{/each}
		{#if labels}
			{#each slices as slice (slice.key)}
				{#if slice.endAngle - slice.startAngle >= LABEL_MIN_SPAN}
					{@const at = bisector(
						slice.startAngle,
						slice.endAngle,
						inner > 0 ? (inner + outer) / 2 : outer * 0.65,
					)}
					<text
						x={at.x}
						y={at.y}
						text-anchor="middle"
						dominant-baseline="middle"
						class={styles.label()}
						style:opacity={settled ? 1 : 0}
					>
						{share(slice.value)}
					</text>
				{/if}
			{/each}
		{/if}
	</g>
</svg>
{#if variant === "donut" && inner > 24}
	<div
		data-slot="pie-center"
		class={styles.center()}
		style:left="{cx - inner}px"
		style:top="{cy - inner}px"
		style:width="{inner * 2}px"
		style:height="{inner * 2}px"
	>
		<RollingDigits
			variant="count"
			value={activeSlice ? activeSlice.value : total}
			format={counterFormat}
			durationMs={600}
			startOnView={false}
			class="font-bold text-foreground"
			size="sm"
		/>
		<span class={styles.caption()}>{activeSlice ? activeSlice.label : centerLabel}</span>
	</div>
{/if}
{#if frame.el}
	<ChartTooltipPanel
		target={frame.el}
		anchor={activePoint ? { x: activePoint.x, y: activePoint.y.value ?? cy } : null}
		{instant}
		bounds={{ width: frame.width, height: frame.height }}
	>
		<ChartTooltipContent />
	</ChartTooltipPanel>
{/if}
