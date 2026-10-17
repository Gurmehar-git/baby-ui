<script lang="ts">
import { untrack } from "svelte";
import type { ActivePoint, Datum, Margin } from "../../chart/core";
import {
	CHART_DURATION,
	CHART_EASE_CSS,
	prefersReducedMotion,
	tween,
} from "../../chart/motion";
import ChartTooltipContent from "../../chart/svelte/chart-tooltip-content.svelte";
import ChartTooltipPanel from "../../chart/svelte/chart-tooltip-panel.svelte";
import { setActivePoint, useChart } from "../../chart/svelte/context";
import {
	type LaidLink,
	type LaidNode,
	LINK_OPACITY,
	labelPlacement,
	layoutSankey,
	NODE_FADED,
	SANKEY_TIMING,
	type SankeyData,
	type SankeyText,
	visibleLabels,
} from "../layout";
import { type SankeyLinkColor, type SankeyOrientation, sankeyChart } from "../variants";

let {
	frame,
	data,
	orientation,
	linkColor,
	nodeWidth,
	nodePadding,
	labels,
	margin,
	text,
	animate,
	activeIndex,
	instant,
	setActive,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	data: SankeyData;
	orientation: SankeyOrientation;
	linkColor: SankeyLinkColor;
	nodeWidth: number;
	nodePadding: number;
	labels: boolean;
	margin: Margin;
	text: SankeyText;
	animate: boolean;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
} = $props();

const chart = useChart();
const gid = $props.id();
const styles = $derived(sankeyChart({ orientation, linkColor }));
const innerWidth = $derived(Math.max(0, frame.width - margin.left - margin.right));
const innerHeight = $derived(Math.max(0, frame.height - margin.top - margin.bottom));
const layout = $derived(
	layoutSankey(data, {
		width: innerWidth,
		height: innerHeight,
		nodeWidth,
		nodePadding,
		flow: orientation,
	}),
);
const nodes = $derived(layout.nodes);
const links = $derived(layout.links);
const shownLabels = $derived(
	visibleLabels(nodes, orientation, (n) => [n.name, chart.format.number(n.value)], {
		x0: -margin.left,
		x1: innerWidth + margin.right,
		y0: -margin.top,
		y1: innerHeight + margin.bottom,
	}),
);
let hoveredNode = $state<number | null>(null);

// Data or flow changes replay the draw; resizes only relayout.
const signature = $derived(
	`${orientation}|${data.nodes.map((n) => n.name).join(",")}|${data.links
		.map((l) => `${l.source}>${l.target}:${l.value}`)
		.join(",")}`,
);
let paths: (SVGPathElement | null)[] = $state([]);
let lengths = $state<number[]>([]);
// svelte-ignore state_referenced_locally
let entered = $state(!animate);
// svelte-ignore state_referenced_locally
let settled = $state(!animate);
let epoch = $state(0);
$effect.pre(() => {
	signature;
	untrack(() => {
		epoch += 1;
	});
});
$effect(() => {
	epoch;
	return untrack(() => {
		if (!animate || prefersReducedMotion() || links.length === 0) {
			entered = true;
			settled = true;
			return;
		}
		lengths = paths.map((p) => p?.getTotalLength() ?? 0);
		entered = false;
		settled = false;
		let raf = requestAnimationFrame(() => {
			raf = requestAnimationFrame(() => {
				entered = true;
			});
		});
		const clock = tween({
			duration: SANKEY_TIMING.total(nodes.length, links.length),
			ease: (t) => t,
			onUpdate: () => {},
			onComplete: () => {
				settled = true;
			},
		});
		return () => {
			cancelAnimationFrame(raf);
			clock.stop();
		};
	});
});

const activeLink = $derived(activeIndex !== null ? links[activeIndex] : undefined);
const anyLit = $derived(activeLink !== undefined || hoveredNode !== null);
const linkLit = (l: LaidLink) =>
	activeIndex === l.index || hoveredNode === l.source || hoveredNode === l.target;
const nodeLit = (n: LaidNode) =>
	hoveredNode === n.index ||
	(activeLink !== undefined &&
		(activeLink.source === n.index || activeLink.target === n.index)) ||
	(hoveredNode !== null &&
		links.some(
			(l) =>
				(l.source === hoveredNode && l.target === n.index) ||
				(l.target === hoveredNode && l.source === n.index),
		));

const hoveredNodeData = $derived(hoveredNode !== null ? nodes[hoveredNode] : undefined);
const activePoint = $derived.by<ActivePoint | null>(() => {
	if (activeLink)
		return {
			index: activeLink.index,
			datum: { kind: "link", ...activeLink },
			x: margin.left + activeLink.mid.x,
			y: { value: margin.top + activeLink.mid.y },
		};
	if (hoveredNodeData)
		return {
			index: hoveredNodeData.index,
			datum: { kind: "node", ...hoveredNodeData },
			x: margin.left + (hoveredNodeData.x0 + hoveredNodeData.x1) / 2,
			y: { value: margin.top + (hoveredNodeData.y0 + hoveredNodeData.y1) / 2 },
		};
	return null;
});
const name = (index: number) => data.nodes[index]?.name ?? "";
setActivePoint({
	get active() {
		return activePoint;
	},
	get instant() {
		return instant;
	},
	title: (datum: Datum) =>
		datum.kind === "link"
			? `${name(Number(datum.source))} → ${name(Number(datum.target))}`
			: String(datum.name ?? ""),
	rows: (datum: Datum) =>
		datum.kind === "link"
			? [
					{
						key: "flow",
						label: text.flow,
						color: nodes[Number(datum.source)]?.color ?? "currentColor",
						value: Number(datum.value),
					},
					{
						key: "share",
						label: `${text.share}: ${chart.format.percent(Number(datum.share))}`,
						color: nodes[Number(datum.target)]?.color ?? "currentColor",
						value: null,
					},
				]
			: [
					{
						key: "total",
						label: text.total,
						color: String(datum.color),
						value: Number(datum.value),
					},
				],
});

const enterTransition = (delay: number, props: string[]) =>
	props
		.map((p) => `${p} ${CHART_DURATION.enter}ms ${CHART_EASE_CSS} ${delay}ms`)
		.join(", ");
const fade = "opacity 180ms cubic-bezier(0, 0, 0.58, 1)";
const linkStroke = (l: LaidLink) =>
	linkColor === "gradient"
		? `url(#${gid}-link-${l.index})`
		: (nodes[linkColor === "source" ? l.source : l.target]?.color ?? "currentColor");
</script>

<svg
	aria-hidden="true"
	width={frame.width}
	height={frame.height}
	class="absolute inset-0 block overflow-visible"
	onpointerleave={() => {
		hoveredNode = null;
		if (activeIndex !== null) setActive(null, false);
	}}
>
	{#if linkColor === "gradient"}
		<defs>
			{#each links as l (l.index)}
				<linearGradient
					id="{gid}-link-{l.index}"
					gradientUnits="userSpaceOnUse"
					x1={l.from.x}
					y1={l.from.y}
					x2={l.to.x}
					y2={l.to.y}
				>
					<stop offset="0%" stop-color={nodes[l.source]?.color} />
					<stop offset="100%" stop-color={nodes[l.target]?.color} />
				</linearGradient>
			{/each}
		</defs>
	{/if}
	<g transform="translate({margin.left},{margin.top})">
		<g data-slot="sankey-links">
			{#each links as l, i (`${epoch}-${l.source}-${l.target}-${i}`)}
				{@const length = lengths[i] ?? 0}
				{@const drawing = !settled && length > 0}
				<path
					bind:this={paths[i]}
					data-slot="sankey-link"
					data-active={activeIndex === l.index ? "" : undefined}
					d={l.path}
					stroke={linkStroke(l)}
					stroke-width={l.width}
					class={styles.link()}
					style:opacity={anyLit
						? linkLit(l)
							? LINK_OPACITY.highlight
							: LINK_OPACITY.faded
						: LINK_OPACITY.rest}
					style:stroke-dasharray={drawing ? `${length} ${length}` : undefined}
					style:stroke-dashoffset={drawing ? (entered ? 0 : length) : undefined}
					style:transition={!entered
						? "none"
						: settled
							? fade
							: `${enterTransition(SANKEY_TIMING.link(i, links.length), ["stroke-dashoffset"])}, ${fade}`}
					role="presentation"
					onpointerenter={() => {
						hoveredNode = null;
						setActive(l.index, false);
					}}
				/>
			{/each}
		</g>
		<g data-slot="sankey-nodes">
			{#each nodes as n, i (`${epoch}-${n.name}-${i}`)}
				{@const faded = anyLit && !nodeLit(n)}
				<g
					data-slot="sankey-node"
					role="presentation"
					onpointerenter={() => {
						if (activeIndex !== null) setActive(null, false);
						hoveredNode = n.index;
					}}
					onpointerleave={() => (hoveredNode = null)}
				>
					<rect
						x={n.x0}
						y={n.y0}
						width={Math.max(1, n.x1 - n.x0)}
						height={Math.max(1, n.y1 - n.y0)}
						rx={4}
						fill={n.color}
						class={styles.node()}
						style:opacity={entered ? (faded ? NODE_FADED : 1) : 0}
						style:transform={entered ? "scaleY(1)" : "scaleY(0.9)"}
						style:transition={!entered
							? "none"
							: settled
								? fade
								: enterTransition(SANKEY_TIMING.node(i, nodes.length), ["opacity", "transform"])}
					/>
					{#if labels}
						{#each [0, 1] as const as line (line)}
							{#if shownLabels.get(n.index)?.[line]}
							{@const at = labelPlacement(n, orientation, line)}
							{@const target = line === 0 ? 1 : 0.6}
							{@const delay =
								line === 0
									? SANKEY_TIMING.name(i, nodes.length)
									: SANKEY_TIMING.value(i, nodes.length)}
							<text
								x={at.x}
								y={at.y}
								dy="0.35em"
								text-anchor={at.anchor}
								class={line === 0 ? styles.name() : styles.value()}
								style:opacity={entered ? (faded ? NODE_FADED * target : target) : 0}
								style:transform={entered
									? "translate(0px, 0px)"
									: `translate(${at.dx}px, ${at.dy}px)`}
								style:transition={!entered
									? "none"
									: settled
										? fade
										: enterTransition(delay, ["opacity", "transform"])}
							>
								{line === 0 ? n.name : chart.format.number(n.value)}
							</text>
							{/if}
						{/each}
					{/if}
				</g>
			{/each}
		</g>
	</g>
</svg>
{#if frame.el}
	<ChartTooltipPanel
		target={frame.el}
		anchor={activePoint ? { x: activePoint.x, y: activePoint.y.value ?? 0 } : null}
		{instant}
		bounds={frame}
	>
		<ChartTooltipContent />
	</ChartTooltipPanel>
{/if}
