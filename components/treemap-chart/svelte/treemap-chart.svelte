<script lang="ts">
import { untrack } from "svelte";
import Breadcrumb from "../../breadcrumb/svelte/breadcrumb.svelte";
import BreadcrumbItem from "../../breadcrumb/svelte/breadcrumb-item.svelte";
import BreadcrumbList from "../../breadcrumb/svelte/breadcrumb-list.svelte";
import BreadcrumbPage from "../../breadcrumb/svelte/breadcrumb-page.svelte";
import BreadcrumbSeparator from "../../breadcrumb/svelte/breadcrumb-separator.svelte";
import { breadcrumb } from "../../breadcrumb/variants";
import ChartFrame from "../../chart/svelte/chart-frame.svelte";
import { useChart } from "../../chart/svelte/context";
import { cn } from "../../lib/cn";
import {
	type FlatNode,
	flattenTree,
	nearestTile,
	type Rect,
	SHADE_STEPS,
	type TreemapNode,
	topOf,
} from "../layout";
import { type TreemapVariant, treemapChart } from "../variants";
import TreemapPlot from "./treemap-plot.svelte";

let {
	data,
	colorLabel,
	formatColor,
	colorDomain,
	focus = $bindable(),
	onFocusChange,
	variant = "default",
	tableHeaders = ["Path", "Value", "Share of parent"],
	roleDescription = "treemap",
	class: className,
}: {
	/** The root; its label names the whole in the first breadcrumb. */
	data: TreemapNode;
	/** Names the shading measure, such as "Growth"; tiles deepen with it. Leave out for one depth. */
	colorLabel?: string;
	formatColor?: (value: number) => string;
	/** Range of the colour measure; defaults to the leaves' range. */
	colorDomain?: [number, number];
	/** Id of the node that fills the view. Bindable. */
	focus?: string;
	onFocusChange?: (id: string) => void;
	variant?: TreemapVariant;
	/** Screen-reader table headers: path, value, share of parent. */
	tableHeaders?: [string, string, string];
	roleDescription?: string;
	class?: string;
} = $props();

const DIRS: Record<string, [number, number]> = {
	ArrowRight: [1, 0],
	ArrowLeft: [-1, 0],
	ArrowDown: [0, 1],
	ArrowUp: [0, -1],
};
const chart = useChart();
const flat = $derived(flattenTree(data));
const root = $derived(flat.get(data.id));
const nodes = $derived([...flat.values()].filter((node) => node.depth > 0));
let ownFocus = $state(untrack(() => data.id));
const wanted = $derived(flat.get(focus ?? ownFocus));
const center = $derived(wanted?.children.length ? wanted : root);
let active = $state<string | null>(null);
let instant = $state(false);
let rects = new Map<string, Rect>();
function zoomTo(id: string) {
	if (focus === undefined) ownFocus = id;
	else focus = id;
	onFocusChange?.(id);
}
const leaves = $derived(
	nodes.filter((node) => !node.children.length && node.color !== null),
);
const domain = $derived.by<[number, number] | null>(() => {
	if (colorLabel === undefined || !leaves.length) return null;
	return (
		colorDomain ?? [
			Math.min(...leaves.map((node) => node.color ?? 0)),
			Math.max(...leaves.map((node) => node.color ?? 0)),
		]
	);
});
const colour = (value: number) =>
	formatColor ? formatColor(value) : chart.format.number(value);
const parentOf = (node: FlatNode) =>
	node.parent ? (flat.get(node.parent) ?? node) : node;
const share = (node: FlatNode) => {
	const parent = parentOf(node);
	return chart.format.percent(parent.value ? node.value / parent.value : 0);
};
const tops = $derived(
	center
		? center.children
				.map((id) => flat.get(id))
				.filter((node): node is FlatNode => !!node && node.value > 0)
		: [],
);
const activeNode = $derived(active ? flat.get(active) : undefined);
const describe = (node: FlatNode) =>
	`${node.path.join(", ")}, ${chart.format.number(node.value)}, ${share(node)} of ${parentOf(node).label}${domain && node.color !== null ? `, ${colorLabel} ${colour(node.color)}` : ""}`;
const trail = $derived.by(() => {
	const out: FlatNode[] = [];
	for (let at = center; at; at = at.parent ? flat.get(at.parent) : undefined)
		out.unshift(at);
	return out;
});
const s = $derived(treemapChart({ variant }));
const crumbLink = breadcrumb().link();

function onKey(key: string) {
	if (!center) return false;
	const current = topOf(flat, active, center.id);
	const dir = DIRS[key];
	if (dir) {
		const next = current
			? nearestTile(
					rects,
					tops.map((node) => node.id),
					current.id,
					dir[0],
					dir[1],
				)
			: tops[0]?.id;
		if (next) {
			instant = true;
			active = next;
		}
		return true;
	}
	if ((key === "Enter" || key === " ") && current?.children.length) {
		zoomTo(current.id);
		active = current.children[0] ?? null;
		return true;
	}
	if ((key === "Escape" || key === "Backspace") && center.parent) {
		const from = center.id;
		zoomTo(center.parent);
		active = from;
		return true;
	}
	return false;
}
</script>

{#if root && center}
	<div class={s.bar()}>
		<Breadcrumb aria-label="{root.label} path">
			<BreadcrumbList>
				{#each trail as node, index (node.id)}
					<BreadcrumbItem>
						{#if index > 0}<BreadcrumbSeparator />{/if}
						{#if index < trail.length - 1}
							<button
								type="button"
								class={cn(crumbLink, s.crumb())}
								onclick={() => {
									zoomTo(node.id);
									active = null;
								}}>{node.label}</button
							>
						{:else}
							<BreadcrumbPage class={s.crumb()}>{node.label}</BreadcrumbPage>
						{/if}
					</BreadcrumbItem>
				{/each}
			</BreadcrumbList>
		</Breadcrumb>
		<span class={s.total()}>{chart.format.number(center.value)}</span>
	</div>
	<ChartFrame
		{roleDescription}
		summary={chart.description ??
			`${center.label}, ${chart.format.number(center.value)}, in ${tops.length} parts. Enter zooms in, Escape zooms out.`}
		table={{
			columns: tableHeaders,
			rows: nodes.map((node) => ({ header: node.path.join(" / "), cells: [chart.format.number(node.value), share(node)] })),
		}}
		count={tops.length}
		activeIndex={activeNode ? tops.findIndex((node) => node.id === topOf(flat, activeNode.id, center.id)?.id) : null}
		onActiveChange={(index, fromKeyboard) => {
			instant = fromKeyboard;
			active = index === null ? null : (tops[index]?.id ?? null);
		}}
		interactive={tops.length > 0}
		announcement={instant && activeNode ? describe(activeNode) : ""}
		onKey={(event) => onKey(event.key)}
		class={className}
	>
		{#snippet children(frame)}
			<TreemapPlot
				{frame}
				{flat}
				{nodes}
				{center}
				{active}
				{instant}
				{domain}
				{colorLabel}
				{colour}
				{share}
				{variant}
				onLayout={(next) => (rects = next)}
				setActive={(id, fromKeyboard) => {
					instant = fromKeyboard;
					active = id;
				}}
				onTile={(node) => {
					const top = topOf(flat, node.id, center.id);
					if (top?.children.length) zoomTo(top.id);
					else active = node.id;
				}}
			/>
		{/snippet}
	</ChartFrame>
	{#if domain}
		<div aria-hidden="true" class={s.scale()}>
			<span>{colorLabel}</span>
			<span class="tabular-nums">{colour(domain[0])}</span>
			<span class={s.steps()}>
				{#each Array.from({ length: SHADE_STEPS }, (_, step) => step) as step (step)}
					<span
						class={s.step()}
						style:--treemap-fill="color-mix(in oklab, var(--color-foreground) {Math.round(14 + (step / (SHADE_STEPS - 1)) * 44)}%, var(--color-background))"
					></span>
				{/each}
			</span>
			<span class="tabular-nums">{colour(domain[1])}</span>
		</div>
	{/if}
{/if}
