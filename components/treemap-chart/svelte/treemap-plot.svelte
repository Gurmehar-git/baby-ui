<script lang="ts">
import ChartTooltipContent from "../../chart/svelte/chart-tooltip-content.svelte";
import ChartTooltipPanel from "../../chart/svelte/chart-tooltip-panel.svelte";
import { setActivePoint, useChart } from "../../chart/svelte/context";
import type { ActivePoint, Datum, TooltipRow } from "../../chart/svelte/core";
import {
	branchHue,
	createTreemapStage,
	type FlatNode,
	layoutFrom,
	type Rect,
	shadeFor,
	topOf,
} from "./layout";
import { type TreemapVariant, treemapChart } from "./variants";

let {
	frame,
	flat,
	nodes,
	center,
	active,
	instant,
	domain,
	colorLabel,
	colour,
	share,
	variant,
	onLayout,
	setActive,
	onTile,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	flat: Map<string, FlatNode>;
	nodes: FlatNode[];
	center: FlatNode;
	active: string | null;
	instant: boolean;
	domain: [number, number] | null;
	colorLabel?: string;
	colour: (value: number) => string;
	share: (node: FlatNode) => string;
	variant: TreemapVariant;
	onLayout: (rects: Map<string, Rect>) => void;
	setActive: (id: string | null, fromKeyboard: boolean) => void;
	onTile: (node: FlatNode) => void;
} = $props();

const chart = useChart();
const tiles = new Map<string, HTMLDivElement>();
const stage = createTreemapStage((id) => tiles.get(id));
const view = $derived<Rect>({ x: 0, y: 0, w: frame.width, h: frame.height });
const target = $derived(layoutFrom(flat, center.id, view));
let pointer = $state<{ x: number; y: number } | null>(null);
$effect(() => {
	onLayout(target);
	if (view.w > 0) stage.show(flat, center.id, target, view);
});
$effect(() => () => stage.destroy());
const branchOf = $derived.by(() => {
	const map = new Map<string, number>();
	const root = [...flat.values()].find((node) => node.depth === 0);
	root?.children.forEach((id, index) => {
		const walk = (at: string) => {
			map.set(at, index);
			for (const child of flat.get(at)?.children ?? []) walk(child);
		};
		walk(id);
	});
	return map;
});
const s = $derived(treemapChart({ variant }));
const focusTop = $derived(topOf(flat, active, center.id));
const activePoint = $derived.by<ActivePoint | null>(() => {
	const node = active ? flat.get(active) : undefined;
	const rect = node ? target.get(node.id) : undefined;
	if (!node || !rect) return null;
	return {
		index: 0,
		datum: { ...node },
		x: pointer?.x ?? rect.x + rect.w / 2,
		y: { value: pointer?.y ?? rect.y + Math.min(rect.h / 2, 28) },
	};
});
setActivePoint({
	get active() {
		return activePoint;
	},
	get instant() {
		return instant;
	},
	title: (datum: Datum) =>
		(Array.isArray(datum.path) ? datum.path.slice(0, -1).join(" / ") : "") ||
		String(datum.label ?? ""),
	rows: (datum: Datum) => {
		const node = flat.get(String(datum.id));
		if (!node) return [];
		const rows: TooltipRow[] = [
			{
				key: node.id,
				label: `${node.label}, ${share(node)}`,
				color: branchHue(branchOf.get(node.id) ?? -1),
				value: node.value,
			},
		];
		if (domain && node.color !== null)
			rows.push({
				key: `${node.id}-color`,
				label: `${colorLabel} ${colour(node.color)}`,
				color: "transparent",
				value: null,
			});
		return rows;
	},
});

function track(node: HTMLDivElement, id: string) {
	tiles.set(id, node);
	stage.repaint([id]);
	return { destroy: () => tiles.delete(id) };
}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	aria-hidden="true"
	class="absolute inset-0"
	onpointerleave={() => {
		setActive(null, false);
		pointer = null;
	}}
>
	{#each nodes as node (node.id)}
		{@const top = topOf(flat, node.id, center.id)}
		{@const hue = branchHue(branchOf.get(node.id) ?? -1)}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			use:track={node.id}
			data-slot="treemap-tile"
			data-branch={node.children.length > 0}
			data-active={active === node.id}
			data-dim={!!focusTop && !!top && focusTop.id !== top.id}
			class={s.tile()}
			style:--treemap-hue={hue}
			style:--treemap-fill="color-mix(in oklab, {hue} {shadeFor(node.color, domain)}%, var(--color-background))"
			style:z-index={node.depth}
			style:visibility="hidden"
			onpointermove={(event) => {
				event.stopPropagation();
				if (event.pointerType !== "mouse") return;
				const box = event.currentTarget.parentElement?.getBoundingClientRect();
				if (box) pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
				setActive(node.id, false);
			}}
			onclick={(event) => {
				event.stopPropagation();
				onTile(node);
			}}
		>
			<span class={s.label()}>{node.label}</span>
			<span class={s.value()}>{chart.format.number(node.value)}</span>
		</div>
	{/each}
</div>
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
