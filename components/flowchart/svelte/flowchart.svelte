<script lang="ts">
import { untrack } from "svelte";
import Badge from "../../badge/svelte/badge.svelte";
import { cn } from "../../lib/svelte/cn";
import ConditionChip from "./condition-chip.svelte";
import type { FlowchartConditionRow, FlowchartEdge, StepNode } from "./types";
import { type FlowchartBackground, flowchartCanvas } from "./variants";

const PAD_Y = 24;
const ROW_GAP = 64;
const PILL_OFFSET = 30;
const EST_HEIGHT = 92;

function mix(hue: string, pct: number, base = "var(--card)") {
	return `color-mix(in srgb, ${hue} ${pct}%, ${base})`;
}

let {
	steps,
	edges = [],
	background = "dots",
	onConditionChange,
	class: classProp,
}: {
	steps: StepNode[];
	edges?: FlowchartEdge[];
	background?: FlowchartBackground;
	onConditionChange?: (
		nodeId: string,
		rowId: string,
		field: "property" | "value",
		value: string,
	) => void;
	class?: string;
} = $props();

let canvasEl = $state<HTMLDivElement>();
const nodeRefs = new Map<string, HTMLElement>();
let width = $state(0);
let heights = $state<Record<string, number>>({});
let selected = $state<string | null>(null);
let offsets = $state<Record<string, { dx: number; dy: number }>>({});
let drag = $state<{
	id: string;
	startX: number;
	startY: number;
	baseDx: number;
	baseDy: number;
	moved: boolean;
} | null>(null);

function registerNode(el: HTMLElement, id: string) {
	nodeRefs.set(id, el);
	return {
		destroy() {
			nodeRefs.delete(id);
		},
	};
}

$effect(() => {
	steps;
	const canvas = canvasEl;
	if (!canvas) return;

	function measure() {
		if (!canvas) return;
		width = canvas.clientWidth;
		let changed = false;
		const next = untrack(() => ({ ...heights }));
		nodeRefs.forEach((el, id) => {
			const h = el.offsetHeight;
			if (h && Math.abs(h - (next[id] ?? 0)) > 0.5) {
				next[id] = h;
				changed = true;
			}
		});
		if (changed) heights = next;
	}

	measure();
	const observer = new ResizeObserver(measure);
	observer.observe(canvas);
	nodeRefs.forEach((el) => {
		observer.observe(el);
	});
	return () => observer.disconnect();
});

const rows = $derived([...new Set(steps.map((n) => n.row))].sort((a, b) => a - b));
const rowH = $derived(
	rows.map((r) =>
		Math.max(...steps.filter((n) => n.row === r).map((n) => heights[n.id] ?? EST_HEIGHT)),
	),
);
const rowY = $derived.by(() => {
	const next: number[] = [];
	rows.forEach((_, i) => {
		next[i] =
			i === 0 ? PAD_Y : (next[i - 1] ?? 0) + (rowH[i - 1] ?? EST_HEIGHT) + ROW_GAP;
	});
	return next;
});
const canvasH = $derived(
	(rowY[rows.length - 1] ?? 0) + (rowH[rows.length - 1] ?? EST_HEIGHT) + PAD_Y,
);
const cw = $derived(width || 480);

function place(n: StepNode) {
	const w = Math.min(n.w, cw * 0.92);
	const off = offsets[n.id];
	return {
		w,
		cx: n.x * cw + (off?.dx ?? 0),
		top: (rowY[rows.indexOf(n.row)] ?? 0) + (off?.dy ?? 0),
	};
}

function anchors(n: StepNode) {
	const { cx, top } = place(n);
	return {
		top: { x: cx, y: top + (n.kindLabel ? PILL_OFFSET : 0) },
		bottom: { x: cx, y: top + (heights[n.id] ?? EST_HEIGHT) },
	};
}

function bezier(edge: FlowchartEdge) {
	const fromNode = steps.find((n) => n.id === edge.from);
	const toNode = steps.find((n) => n.id === edge.to);
	if (!fromNode || !toNode) return "";
	const from = anchors(fromNode).bottom;
	const to = anchors(toNode).top;
	const k = Math.min(Math.max(Math.abs(to.y - from.y) * 0.55, 24), 84);
	return `M ${from.x} ${from.y} C ${from.x} ${from.y + k}, ${to.x} ${to.y - k}, ${to.x} ${to.y}`;
}

function isLit(edge: FlowchartEdge) {
	return selected === edge.from || selected === edge.to;
}

function onPointerDown(node: StepNode, event: PointerEvent) {
	if ((event.target as Element).closest("[data-ui]")) return;
	const off = offsets[node.id];
	drag = {
		id: node.id,
		startX: event.clientX,
		startY: event.clientY,
		baseDx: off?.dx ?? 0,
		baseDy: off?.dy ?? 0,
		moved: false,
	};
	(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
}

function onPointerMove(node: StepNode, event: PointerEvent) {
	const d = drag;
	if (!d || d.id !== node.id) return;
	const dx = d.baseDx + event.clientX - d.startX;
	const dy = d.baseDy + event.clientY - d.startY;
	if (!d.moved && Math.hypot(dx - d.baseDx, dy - d.baseDy) < 3) return;
	d.moved = true;

	const { w } = place(node);
	const h = heights[node.id] ?? EST_HEIGHT;
	const baseCx = node.x * cw;
	const baseTop = rowY[rows.indexOf(node.row)] ?? 0;
	const cx = Math.min(Math.max(baseCx + dx, w / 2 + 8), cw - w / 2 - 8);
	const top = Math.min(Math.max(baseTop + dy, 8), canvasH - h - 8);
	offsets = { ...offsets, [node.id]: { dx: cx - baseCx, dy: top - baseTop } };
}

function onPointerUp(node: StepNode) {
	const d = drag;
	if (d?.id === node.id) {
		if (d.moved) {
			setTimeout(() => (drag = null), 0);
		} else {
			drag = null;
			if (!node.conditions) selected = selected === node.id ? null : node.id;
		}
	}
}

function updateCondition(
	nodeId: string,
	row: FlowchartConditionRow,
	field: "property" | "value",
	value: string,
) {
	onConditionChange?.(nodeId, row.id, field, value);
}
</script>

{#snippet conditionRows(node: StepNode)}
	<div class="flex flex-col gap-1.5 px-3 py-2.5">
		{#each node.conditions ?? [] as row (row.id)}
			<div class="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1.5">
				<span class="w-8 shrink-0 text-xs text-muted-foreground">{row.connector}</span>
				<Badge variant="secondary" size="sm">{row.source}</Badge>
				<ConditionChip
					value={row.property}
					options={row.propertyOptions}
					width="w-36"
					onChange={(v) => updateCondition(node.id, row, "property", v)}
				/>
				<span class="text-xs text-muted-foreground">{row.comparator ?? "is"}</span>
				<ConditionChip
					value={row.value}
					options={row.valueOptions}
					width="w-56"
					dot={row.dot}
					onChange={(v) => updateCondition(node.id, row, "value", v)}
				/>
			</div>
		{/each}
	</div>
{/snippet}

{#snippet stepBody(node: StepNode)}
	<div class="flex items-center gap-2.5 p-2.5">
		<span
			class="flex size-9 shrink-0 items-center justify-center rounded-lg"
			style="background: {mix(node.hue, 12)}; color: {node.hue}; box-shadow: 0 0 0 1px {mix(node.hue, 20)};"
		>
			{#if node.icon}
				{@render node.icon()}
			{:else}
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="currentColor" />
				</svg>
			{/if}
		</span>
		<span class="min-w-0 text-left">
			<span class="block truncate font-semibold text-sm text-foreground leading-tight">{node.title}</span>
			<span class="mt-0.5 block text-xs text-muted-foreground leading-snug">{node.caption}</span>
		</span>
	</div>
{/snippet}

<div
	bind:this={canvasEl}
	data-slot="flowchart"
	class={cn(flowchartCanvas({ background }), classProp)}
	style="height: {canvasH}px;"
>
	<svg width={cw} height={canvasH} aria-hidden="true" class="pointer-events-none absolute inset-0">
		{#each edges as edge (`${edge.from}-${edge.to}`)}
			<path
				d={bezier(edge)}
				fill="none"
				stroke={isLit(edge) ? "var(--primary)" : "var(--border)"}
				stroke-width="1.25"
				class="transition-[stroke] duration-(--duration-fast)"
			/>
		{/each}
	</svg>

	{#each steps as node (node.id)}
		{@const { w, cx, top } = place(node)}
		{@const active = selected === node.id}
		<!-- svelte-ignore a11y_no_static_element_interactions -- draggable node wrapper; the inner button/inputs carry real semantics -->
		<div
			use:registerNode={node.id}
			onpointerdown={(event) => onPointerDown(node, event)}
			onpointermove={(event) => onPointerMove(node, event)}
			onpointerup={() => onPointerUp(node)}
			class="absolute flex touch-none -translate-x-1/2 flex-col items-start gap-1.5"
			style="left: {cx}px; top: {top}px; width: {w}px; z-index: {drag?.id === node.id ? 2 : 1};"
		>
			{#if node.kindLabel}
				<span
					class="inline-flex h-6 items-center rounded-md px-2 font-medium text-xs"
					style="background: {mix(node.hue, 14, 'var(--background)')}; color: {mix(node.hue, 80, 'var(--foreground)')};"
				>
					{node.kindLabel}
				</span>
			{/if}
			{#if node.conditions}
				<div class="w-full rounded-2xl bg-card shadow-sm transition-shadow duration-(--duration-fast) hover:shadow-md">
					{@render conditionRows(node)}
				</div>
			{:else}
				<button
					type="button"
					onkeydown={(event) => {
						if (event.key === "Enter" || event.key === " ") {
							event.preventDefault();
							selected = active ? null : node.id;
						}
					}}
					aria-pressed={active}
					class={cn(
						"w-full cursor-pointer rounded-2xl bg-card text-left outline-none transition-shadow duration-(--duration-fast) focus-visible:shadow-[0_0_0_1.5px_var(--primary)]",
						active ? "shadow-[0_0_0_1.5px_var(--primary),0_2px_10px_rgba(0,0,0,0.045)]" : "shadow-sm hover:shadow-md",
					)}
				>
					{@render stepBody(node)}
				</button>
			{/if}
		</div>
	{/each}
</div>
