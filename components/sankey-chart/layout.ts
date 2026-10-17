import { sankey, sankeyCenter } from "d3-sankey";

export interface SankeyNodeInput {
	name: string;
	/** Overrides the positional `--chart-N` colour. */
	color?: string;
}

export interface SankeyLinkInput {
	/** Index into `nodes`. */
	source: number;
	target: number;
	value: number;
}

export interface SankeyData {
	nodes: SankeyNodeInput[];
	links: SankeyLinkInput[];
}

export type SankeyFlow = "horizontal" | "vertical";

export interface LaidNode {
	index: number;
	name: string;
	color: string;
	value: number;
	x0: number;
	x1: number;
	y0: number;
	y1: number;
	/** Label sits before the node (left or above) when it is in the first half of the flow. */
	leading: boolean;
}

export interface LaidLink {
	index: number;
	source: number;
	target: number;
	value: number;
	width: number;
	path: string;
	mid: { x: number; y: number };
	/** Gradient axis endpoints, along the flow. */
	from: { x: number; y: number };
	to: { x: number; y: number };
	/** Share of the source node's outflow. */
	share: number;
}

export const nodeColor = (node: SankeyNodeInput, index: number) =>
	node.color ?? `var(--chart-${(index % 5) + 1})`;

type Point = { x: number; y: number };

function curve(from: Point, to: Point, flow: SankeyFlow): string {
	if (flow === "horizontal") {
		const mid = (from.x + to.x) / 2;
		return `M${from.x},${from.y}C${mid},${from.y} ${mid},${to.y} ${to.x},${to.y}`;
	}
	const mid = (from.y + to.y) / 2;
	return `M${from.x},${from.y}C${from.x},${mid} ${to.x},${mid} ${to.x},${to.y}`;
}

/** d3-sankey always lays out left to right; vertical flow lays out on a swapped extent and transposes. */
export function layoutSankey(
	data: SankeyData,
	options: {
		width: number;
		height: number;
		nodeWidth: number;
		nodePadding: number;
		flow: SankeyFlow;
	},
): { nodes: LaidNode[]; links: LaidLink[] } {
	const { width, height, nodeWidth, nodePadding, flow } = options;
	if (width <= 0 || height <= 0 || data.nodes.length === 0)
		return { nodes: [], links: [] };
	const along = flow === "horizontal" ? width : height;
	const across = flow === "horizontal" ? height : width;
	type N = { name: string; index?: number };
	type L = { source: number; target: number; value: number };
	const graph = sankey<N, L>()
		.nodeWidth(nodeWidth)
		.nodePadding(nodePadding)
		.nodeAlign(sankeyCenter)
		.extent([
			[0, 0],
			[along, across],
		])({
		nodes: data.nodes.map((n) => ({ name: n.name })),
		links: data.links
			.filter((l) => l.value > 0 && data.nodes[l.source] && data.nodes[l.target])
			.map((l) => ({ source: l.source, target: l.target, value: l.value })),
	});
	const place = (a0: number, a1: number, c0: number, c1: number) =>
		flow === "horizontal"
			? { x0: a0, x1: a1, y0: c0, y1: c1 }
			: { x0: c0, x1: c1, y0: a0, y1: a1 };
	const nodes: LaidNode[] = graph.nodes.map((n, index) => ({
		index,
		name: n.name,
		color: nodeColor(data.nodes[index] ?? { name: n.name }, index),
		value: n.value ?? 0,
		...place(n.x0 ?? 0, n.x1 ?? 0, n.y0 ?? 0, n.y1 ?? 0),
		leading: ((n.x0 ?? 0) + (n.x1 ?? 0)) / 2 < along / 2,
	}));
	const links: LaidLink[] = graph.links.map((l, index) => {
		const s = l.source as { index?: number; x1?: number; value?: number };
		const t = l.target as { index?: number; x0?: number };
		const toPoint = (a: number, c: number): Point =>
			flow === "horizontal" ? { x: a, y: c } : { x: c, y: a };
		const from = toPoint(s.x1 ?? 0, l.y0 ?? 0);
		const to = toPoint(t.x0 ?? 0, l.y1 ?? 0);
		return {
			index,
			source: s.index ?? 0,
			target: t.index ?? 0,
			value: l.value,
			width: Math.max(1, l.width ?? 1),
			path: curve(from, to, flow),
			mid: { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 },
			from,
			to,
			share: s.value ? l.value / s.value : 0,
		};
	});
	return { nodes, links };
}

/** Matches `CHART_DURATION.enter`; local so the layout imports without the kernel. */
const ENTER = 1100;

/** Enter schedule, in ms. */
export const SANKEY_TIMING = {
	link: (i: number, n: number) => 0.2 * ENTER + (i / Math.max(n, 1)) * 0.8 * ENTER * 0.4,
	node: (i: number, n: number) => (i / Math.max(n, 1)) * 0.6 * ENTER * 0.4,
	name: (i: number, n: number) => SANKEY_TIMING.node(i, n) + 0.6 * ENTER * 0.6 * 0.3,
	value: (i: number, n: number) => SANKEY_TIMING.name(i, n) + 60,
	total: (nodes: number, links: number) =>
		Math.max(
			links ? SANKEY_TIMING.link(links - 1, links) : 0,
			nodes ? SANKEY_TIMING.value(nodes - 1, nodes) : 0,
		) + ENTER,
};

/** Link stroke opacity at rest, highlighted and faded: 0.5, min(1, 0.5 * 1.3), 0.1. */
export const LINK_OPACITY = { rest: 0.5, highlight: 0.65, faded: 0.1 } as const;
export const NODE_FADED = 0.4;
export const LABEL_OFFSET = 12;
export const VALUE_GAP = 16;

export interface LabelPlacement {
	x: number;
	y: number;
	anchor: "start" | "middle" | "end";
	/** Where the label starts its slide from, relative to its resting spot. */
	dx: number;
	dy: number;
}

/** Name and value label spots; they slide in from inside the node. */
export function labelPlacement(
	node: LaidNode,
	flow: SankeyFlow,
	line: 0 | 1,
): LabelPlacement {
	if (flow === "horizontal") {
		const x = node.leading ? node.x0 - LABEL_OFFSET : node.x1 + LABEL_OFFSET;
		const y = (node.y0 + node.y1) / 2 + line * VALUE_GAP;
		const start = node.leading ? node.x0 + 8 : node.x1 - 8;
		return { x, y, anchor: node.leading ? "end" : "start", dx: start - x, dy: 0 };
	}
	const x = (node.x0 + node.x1) / 2;
	const y = node.leading
		? node.y0 - LABEL_OFFSET - (1 - line) * VALUE_GAP
		: node.y1 + LABEL_OFFSET + 4 + line * VALUE_GAP;
	const start = node.leading ? node.y0 + 8 : node.y1 - 8;
	return { x, y, anchor: "middle", dx: 0, dy: start - y };
}

/** Approximate glyph advance and line box for the 11-12px node labels. */
const LABEL_CHAR = 7.4;
const LABEL_LINE = 13;

/**
 * Which label lines fit without colliding: biggest nodes claim space first, and a line whose
 * box would hit an accepted label (or leave the plot) is dropped. Returns [name, value] per node.
 */
export function visibleLabels(
	nodes: LaidNode[],
	flow: SankeyFlow,
	texts: (node: LaidNode) => [string, string],
	/** Drawable area in plot coordinates, margins included. */
	bounds: { x0: number; x1: number; y0: number; y1: number },
): Map<number, [boolean, boolean]> {
	const placed: { x0: number; x1: number; y0: number; y1: number }[] = [];
	const out = new Map<number, [boolean, boolean]>();
	const order = [...nodes].sort((a, b) => b.value - a.value);
	for (const node of order) {
		const shown: [boolean, boolean] = [false, false];
		for (const line of [0, 1] as const) {
			if (line === 1 && !shown[0]) break;
			const at = labelPlacement(node, flow, line);
			const w = texts(node)[line].length * LABEL_CHAR;
			const x0 =
				at.anchor === "end" ? at.x - w : at.anchor === "middle" ? at.x - w / 2 : at.x;
			const box = {
				x0,
				x1: x0 + w,
				y0: at.y - LABEL_LINE / 2,
				y1: at.y + LABEL_LINE / 2,
			};
			const outside =
				box.x0 < bounds.x0 ||
				box.x1 > bounds.x1 ||
				box.y0 < bounds.y0 ||
				box.y1 > bounds.y1;
			const hit = placed.some(
				(p) => box.x0 < p.x1 && box.x1 > p.x0 && box.y0 < p.y1 && box.y1 > p.y0,
			);
			if (outside || hit) break;
			placed.push(box);
			shown[line] = true;
		}
		out.set(node.index, shown);
	}
	return out;
}

/** Overridable copy: tooltip rows and the screen-reader table. */
export interface SankeyText {
	total: string;
	flow: string;
	share: string;
	/** Table headers: source, target, value, share. */
	headers: [string, string, string, string];
}

export const SANKEY_TEXT: SankeyText = {
	total: "Total",
	flow: "Flow",
	share: "Share of source",
	headers: ["Source", "Target", "Value", "Share"],
};

export const SANKEY_MARGIN = {
	horizontal: { top: 12, right: 120, bottom: 12, left: 120 },
	vertical: { top: 44, right: 12, bottom: 44, left: 12 },
} as const;
