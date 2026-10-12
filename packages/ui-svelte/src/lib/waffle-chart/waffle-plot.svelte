<script lang="ts">
import ChartTooltipContent from "../chart/chart-tooltip-content.svelte";
import ChartTooltipPanel from "../chart/chart-tooltip-panel.svelte";
import { setActivePoint, useChart } from "../chart/context";
import type { ActivePoint, Datum } from "../chart/core";
import {
	rowShape,
	slotAt,
	slotPosition,
	type WaffleCell,
	type WaffleRow,
	waffleBox,
} from "./geometry";
import { type WaffleVariant, waffleChart } from "./variants";

let {
	frame,
	rows,
	counts,
	cells,
	gridRows,
	columns,
	variant,
	animate,
	share,
	activeIndex,
	instant,
	setActive,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	rows: WaffleRow[];
	counts: number[];
	cells: WaffleCell[];
	gridRows: number;
	columns: number;
	variant: WaffleVariant;
	animate: boolean;
	share: (value: number) => string;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
} = $props();

const chart = useChart();
// svelte-ignore state_referenced_locally
let shown = $state(!animate);
let hoverSlot = $state<number | null>(null);
$effect(() => {
	if (!animate) {
		shown = true;
		return;
	}
	const id = requestAnimationFrame(() => (shown = true));
	return () => cancelAnimationFrame(id);
});
const box = $derived(waffleBox(frame.width, frame.height, gridRows, columns));
const count = $derived(gridRows * columns);
const indexOf = $derived(new Map(rows.map((row, index) => [row.key, index])));
const focusKey = $derived(
	activeIndex !== null ? rows[activeIndex]?.key : chart.highlighted,
);
const s = $derived(waffleChart({ variant }));
const anchorSlot = $derived.by(() => {
	if (activeIndex === null) return null;
	const key = rows[activeIndex]?.key;
	if (hoverSlot !== null && cells.find((cell) => cell.slot === hoverSlot)?.key === key)
		return hoverSlot;
	return counts.slice(0, activeIndex).reduce((sum, value) => sum + value, 0);
});
const cursor = $derived(
	hoverSlot !== null && box.size > 0 ? slotPosition(hoverSlot, gridRows, box.size) : null,
);
const activePoint = $derived.by<ActivePoint | null>(() => {
	const row = activeIndex !== null ? rows[activeIndex] : undefined;
	if (!row || anchorSlot === null || activeIndex === null) return null;
	const anchor = slotPosition(anchorSlot, gridRows, box.size);
	return {
		index: activeIndex,
		datum: { ...row, index: activeIndex },
		x: box.left + anchor.x + box.size / 2,
		y: { value: box.top + anchor.y },
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
			key: String(datum.key ?? ""),
			label: share(Number(datum.value)),
			color: String(datum.color ?? ""),
			value: Number(datum.value),
		},
	],
});

function onpointermove(event: PointerEvent & { currentTarget: SVGSVGElement }) {
	const rect = event.currentTarget.getBoundingClientRect();
	const slot = slotAt(
		event.clientX - rect.left - box.left,
		event.clientY - rect.top - box.top,
		gridRows,
		columns,
		box.size,
	);
	const key = cells.find((cell) => cell.slot === slot)?.key;
	hoverSlot = key ? slot : null;
	setActive(key ? (indexOf.get(key) ?? null) : null, false);
}
</script>

<svg
	aria-hidden="true"
	width={frame.width}
	height={frame.height}
	class="absolute inset-0 block touch-pan-y overflow-visible"
	{onpointermove}
	onpointerleave={() => {
		hoverSlot = null;
		if (activeIndex !== null) setActive(null, false);
	}}
>
	<g transform="translate({box.left} {box.top})">
		{#if box.size > 0}
			{#each cells as cell (cell.id)}
				{@const pos = slotPosition(cell.slot, gridRows, box.size)}
				{@const index = cell.key !== null ? (indexOf.get(cell.key) ?? -1) : -1}
				{@const shape = rowShape(Math.max(0, index), variant)}
				{@const color = rows[index]?.color ?? "transparent"}
				<rect
					width={box.size}
					height={box.size}
					rx={shape === "round" ? box.size / 2 : box.size * 0.22}
					data-empty={cell.key === null}
					data-slot="waffle-cell"
					class={s.cell()}
					style:--waffle-delay={animate ? `${(cell.slot / count) * 0.32}s` : "0s"}
					style:transform="translate({pos.x}px, {pos.y}px) scale({shown ? 1 : 0.4})"
					style:opacity={cell.key === null || !shown ? 0 : focusKey != null && cell.key !== focusKey ? 0.26 : 1}
					style:fill={shape === "framed" ? `color-mix(in oklab, ${color} 30%, transparent)` : color}
					style:stroke={shape === "framed" ? color : "none"}
					style:stroke-width={shape === "framed" ? 2 : 0}
				/>
			{/each}
		{/if}
		{#if cursor}
			<rect
				x={cursor.x - 2}
				y={cursor.y - 2}
				width={box.size + 4}
				height={box.size + 4}
				rx={box.size * 0.3}
				class={s.cursor()}
			/>
		{/if}
	</g>
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
