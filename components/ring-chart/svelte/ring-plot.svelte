<script lang="ts">
import type { ActivePoint, Datum } from "../../chart/core";
import ChartTooltipContent from "../../chart/svelte/chart-tooltip-content.svelte";
import ChartTooltipPanel from "../../chart/svelte/chart-tooltip-panel.svelte";
import { setActivePoint, useChart } from "../../chart/svelte/context";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import { RING_END, RING_START, type RingRow, ringLayout } from "../geometry";
import { type RingCap, ringChart } from "../variants";
import Ring from "./ring.svelte";

let {
	frame,
	rows,
	progress,
	cap,
	track,
	strokeWidth,
	gap,
	baseInnerRadius,
	centerLabel,
	animate,
	activeIndex,
	instant,
	setActive,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	rows: RingRow[];
	progress: (row: RingRow) => string;
	cap: RingCap;
	track: boolean;
	strokeWidth: number;
	gap: number;
	baseInnerRadius: number;
	centerLabel: string;
	animate: boolean;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
} = $props();

const chart = useChart();
const styles = $derived(ringChart({ cap, track }));
const size = $derived(Math.min(frame.width, frame.height));
const layout = $derived(ringLayout(rows.length, size, strokeWidth, gap, baseInnerRadius));
const cx = $derived(frame.width / 2);
const cy = $derived(frame.height / 2);
const signature = $derived(rows.map((r) => `${r.key}:${r.value}:${r.max}`).join("|"));
const total = $derived(rows.reduce((sum, r) => sum + r.value, 0));
const activeRow = $derived(activeIndex !== null ? rows[activeIndex] : undefined);
const counterFormat = $derived((v: number) => chart.format.number(Math.round(v)));

const activePoint = $derived.by<ActivePoint | null>(() => {
	const ring = activeIndex !== null ? layout.rings[activeIndex] : undefined;
	if (!activeRow || !ring || activeIndex === null) return null;
	const end =
		RING_START + (RING_END - RING_START) * Math.min(1, activeRow.value / activeRow.max);
	const angle = (RING_START + end) / 2;
	const r = (ring.inner + ring.outer) / 2;
	return {
		index: activeIndex,
		datum: { key: activeRow.key, label: activeRow.label, value: activeRow.value },
		x: cx + Math.sin(angle) * r,
		y: { value: cy - Math.cos(angle) * r },
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
	rows: (datum: Datum) => {
		const row = rows.find((r) => r.key === datum.key);
		return row
			? [{ key: row.key, label: progress(row), color: row.color, value: row.value }]
			: [];
	},
});
const centerRadius = $derived((layout.rings[0]?.inner ?? 0) - 8 * layout.scale);
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
		{#each rows as row, index (row.key)}
			{@const ring = layout.rings[index]}
			{#if ring}
				<Ring
					{row}
					{index}
					{ring}
					round={cap === "round"}
					active={activeIndex === index}
					pushed={activeIndex !== null && activeIndex < index}
					faded={activeIndex !== null && activeIndex !== index}
					{instant}
					{signature}
					{animate}
					class={styles.ring()}
					trackClass={styles.track()}
					onenter={() => setActive(index, false)}
				/>
			{/if}
		{/each}
	</g>
</svg>
{#if centerRadius > 20}
	<div
		data-slot="ring-center"
		class={styles.center()}
		style:left="{cx - centerRadius}px"
		style:top="{cy - centerRadius}px"
		style:width="{centerRadius * 2}px"
		style:height="{centerRadius * 2}px"
	>
		<RollingDigits
			variant="count"
			value={activeRow ? activeRow.value : total}
			format={counterFormat}
			durationMs={600}
			startOnView={false}
			class="font-bold text-foreground"
			size="sm"
		/>
		<span class={styles.caption()}>{activeRow ? activeRow.label : centerLabel}</span>
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
