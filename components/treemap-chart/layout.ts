import { CHART_DURATION, CHART_EASE, tween } from "../chart/motion";

export type TreemapNode = {
	/** Stable identity, unique in the tree; a tile that survives a data change morphs. */
	id: string;
	label: string;
	/** Leaf size; a branch's size is the sum of its children. */
	value?: number;
	/** Optional second measure for shading, such as growth. */
	color?: number;
	children?: TreemapNode[];
};

export type Rect = { x: number; y: number; w: number; h: number };
export type FlatNode = {
	id: string;
	label: string;
	value: number;
	color: number | null;
	depth: number;
	parent: string | null;
	children: string[];
	path: string[];
};
type Drawn = Rect & { o: number };

const GAP = 2;
const PAD = 3;
const HEADER = 22;
export const SHADE_STEPS = 5;
const clamp = (value: number, low: number, high: number) =>
	Math.min(high, Math.max(low, value));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const inset = (r: Rect, top: number, side: number): Rect => ({
	x: r.x + side,
	y: r.y + top,
	w: Math.max(0, r.w - side * 2),
	h: Math.max(0, r.h - top - side),
});

/** Every node by id with summed values and value-weighted colour means. */
export function flattenTree(root: TreemapNode) {
	const flat = new Map<string, FlatNode>();
	const visit = (
		node: TreemapNode,
		depth: number,
		parent: string | null,
		path: string[],
	) => {
		const kids = node.children ?? [];
		let value = 0;
		let weighted = 0;
		let colored = 0;
		const own = depth === 0 ? [node.label] : [...path, node.label];
		if (kids.length) {
			for (const kid of kids) {
				const r = visit(kid, depth + 1, node.id, depth === 0 ? [] : own);
				value += r.value;
				weighted += r.weighted;
				colored += r.colored;
			}
		} else {
			value = Math.max(0, node.value ?? 0);
			if (node.color !== undefined && Number.isFinite(node.color)) {
				weighted = node.color * value;
				colored = value;
			}
		}
		flat.set(node.id, {
			id: node.id,
			label: node.label,
			value,
			color: colored ? weighted / colored : null,
			depth,
			parent,
			children: kids.map((kid) => kid.id),
			path: own,
		});
		return { value, weighted, colored };
	};
	visit(root, 0, null, []);
	return flat;
}

/** Squarified rows along the short side, each closed when another tile would worsen the aspect ratio. */
function squarify(
	items: { id: string; value: number }[],
	rect: Rect,
	out: Map<string, Rect>,
) {
	const list = items.filter((item) => item.value > 0).sort((a, b) => b.value - a.value);
	const total = list.reduce((sum, item) => sum + item.value, 0);
	if (!total || rect.w <= 0 || rect.h <= 0) {
		for (const item of items) out.set(item.id, { x: rect.x, y: rect.y, w: 0, h: 0 });
		return;
	}
	const scale = (rect.w * rect.h) / total;
	let { x, y, w, h } = rect;
	let i = 0;
	const worst = (row: number[], side: number) => {
		const sum = row.reduce((a, b) => a + b, 0);
		return Math.max(
			(side * side * Math.max(...row)) / (sum * sum),
			(sum * sum) / (side * side * Math.min(...row)),
		);
	};
	const area = (index: number) => (list[index]?.value ?? 0) * scale;
	while (i < list.length) {
		const side = Math.min(w, h);
		const row = [area(i)];
		let j = i + 1;
		while (j < list.length && worst([...row, area(j)], side) <= worst(row, side))
			row.push(area(j++));
		const sum = row.reduce((a, b) => a + b, 0);
		if (w >= h) {
			const cw = sum / h;
			let cy = y;
			for (let k = i; k < j; k++) {
				const th = area(k) / cw;
				out.set(list[k]?.id ?? "", { x, y: cy, w: cw, h: th });
				cy += th;
			}
			x += cw;
			w -= cw;
		} else {
			const rh = sum / w;
			let cx = x;
			for (let k = i; k < j; k++) {
				const tw = area(k) / rh;
				out.set(list[k]?.id ?? "", { x: cx, y, w: tw, h: rh });
				cx += tw;
			}
			y += rh;
			h -= rh;
		}
		i = j;
	}
	for (const item of items)
		if (!out.has(item.id)) out.set(item.id, { x: rect.x, y: rect.y, w: 0, h: 0 });
}

/** Rects of every descendant when `focus` fills the view; each branch holds its children under a header. */
export function layoutFrom(flat: Map<string, FlatNode>, focus: string, view: Rect) {
	const out = new Map<string, Rect>();
	const nest = (id: string, rect: Rect, top: boolean) => {
		const node = flat.get(id);
		if (!node?.children.length) return;
		const room = top ? rect : inset(rect, rect.h > 48 && rect.w > 64 ? HEADER : PAD, PAD);
		const placed = new Map<string, Rect>();
		squarify(
			node.children.map((child) => ({ id: child, value: flat.get(child)?.value ?? 0 })),
			room,
			placed,
		);
		for (const [child, r] of placed) {
			const gapped = {
				x: r.x + GAP / 2,
				y: r.y + GAP / 2,
				w: Math.max(0, r.w - GAP),
				h: Math.max(0, r.h - GAP),
			};
			out.set(child, gapped);
			nest(child, gapped, false);
		}
	};
	nest(focus, view, true);
	return out;
}

const carry = (r: Rect, from: Rect, to: Rect): Rect => {
	const sx = to.w / (from.w || 1);
	const sy = to.h / (from.h || 1);
	return {
		x: to.x + (r.x - from.x) * sx,
		y: to.y + (r.y - from.y) * sy,
		w: r.w * sx,
		h: r.h * sy,
	};
};

export function isUnder(flat: Map<string, FlatNode>, id: string, ancestor: string) {
	for (let at = flat.get(id); at; at = at.parent ? flat.get(at.parent) : undefined)
		if (at.id === ancestor) return true;
	return false;
}

/** The top-level tile under `center` that holds `id`. */
export function topOf(flat: Map<string, FlatNode>, id: string | null, center: string) {
	let at = id ? flat.get(id) : undefined;
	while (at?.parent && at.parent !== center) at = flat.get(at.parent);
	return at?.parent === center ? at : undefined;
}

/** The nearest top tile in an arrow key's direction. */
export function nearestTile(
	rects: Map<string, Rect>,
	ids: string[],
	from: string,
	dx: number,
	dy: number,
) {
	const o = rects.get(from);
	if (!o) return null;
	const ox = o.x + o.w / 2;
	const oy = o.y + o.h / 2;
	let best: string | null = null;
	let score = Number.POSITIVE_INFINITY;
	for (const id of ids) {
		const r = rects.get(id);
		if (id === from || !r) continue;
		const vx = r.x + r.w / 2 - ox;
		const vy = r.y + r.h / 2 - oy;
		const along = vx * dx + vy * dy;
		if (along <= 1) continue;
		const s = along + Math.abs(vx * dy - vy * dx) * 1.5;
		if (s < score) {
			score = s;
			best = id;
		}
	}
	return best;
}

/**
 * Owns tile geometry: each tile keeps its on-screen rect and glides to the next layout; a zoom
 * carries tiles from the tile that grows to fill the view, or back into it.
 */
export function createTreemapStage(tileOf: (id: string) => HTMLElement | undefined) {
	const drawn = new Map<string, Drawn>();
	const levels = new Map<string, number>();
	let last: { id: string; layout: Map<string, Rect> } | null = null;
	let playback: { stop: () => void } | null = null;
	const paint = (ids: Iterable<string>) => {
		for (const id of ids) {
			const el = tileOf(id);
			const d = drawn.get(id);
			if (!el) continue;
			if (!d || d.o < 0.01 || d.w < 0.5 || d.h < 0.5) {
				el.style.visibility = "hidden";
				el.style.pointerEvents = "none";
				continue;
			}
			el.style.visibility = "visible";
			el.style.transform = `translate3d(${d.x.toFixed(2)}px, ${d.y.toFixed(2)}px, 0)`;
			el.style.width = `${d.w.toFixed(2)}px`;
			el.style.height = `${d.h.toFixed(2)}px`;
			el.style.opacity = d.o.toFixed(3);
			el.style.pointerEvents = d.o > 0.6 ? "auto" : "none";
			el.dataset.level = String(levels.get(id) ?? 0);
			el.dataset.room = d.w > 64 && d.h > 38 ? (d.h > 54 ? "full" : "name") : "none";
		}
	};
	return {
		/** Glides every tile to the layout for `center`; `view` is the plot rect. */
		show(
			flat: Map<string, FlatNode>,
			center: string,
			target: Map<string, Rect>,
			view: Rect,
		) {
			playback?.stop();
			const centerDepth = flat.get(center)?.depth ?? 0;
			const nodes = [...flat.values()].filter((node) => node.depth > 0);
			const visible = new Set(
				nodes
					.filter((node) => {
						const level = node.depth - centerDepth;
						return level >= 1 && level <= 2 && isUnder(flat, node.id, center);
					})
					.map((node) => node.id),
			);
			const before = new Map(drawn);
			const wasVisible = new Set(
				[...before].filter(([, d]) => d.o > 0.5).map(([id]) => id),
			);
			let toOld: ((r: Rect) => Rect) | null = null;
			let toNew: ((r: Rect) => Rect) | null = null;
			if (last && last.id !== center && before.size) {
				const previous = last;
				const inOld = previous.layout.get(center);
				const inNew = target.get(previous.id);
				if (isUnder(flat, center, previous.id) && inOld) {
					toOld = (r) => carry(r, view, inOld);
					toNew = (r) => carry(r, inOld, view);
				} else if (isUnder(flat, previous.id, center) && inNew) {
					toOld = (r) => carry(r, inNew, view);
					toNew = (r) => carry(r, view, inNew);
				}
			}
			const from = new Map<string, Drawn>();
			const to = new Map<string, Drawn>();
			const first = !before.size;
			for (const node of nodes) {
				const goal = target.get(node.id);
				const now = before.get(node.id);
				if (visible.has(node.id) && goal) {
					to.set(node.id, { ...goal, o: 1 });
					if (wasVisible.has(node.id) && now) from.set(node.id, now);
					else if (first)
						from.set(node.id, {
							x: goal.x + goal.w / 2,
							y: goal.y + goal.h / 2,
							w: 0,
							h: 0,
							o: 0,
						});
					else from.set(node.id, { ...(toOld ? toOld(goal) : goal), o: 0 });
					levels.set(node.id, node.depth - centerDepth);
				} else if (wasVisible.has(node.id) && now) {
					from.set(node.id, now);
					to.set(node.id, { ...(toNew ? toNew(now) : now), o: 0 });
				}
			}
			for (const node of nodes)
				if (!from.has(node.id)) drawn.set(node.id, { x: 0, y: 0, w: 0, h: 0, o: 0 });
			last = { id: center, layout: target };
			const ids = nodes.map((node) => node.id);
			const area = view.w * view.h || 1;
			playback = tween({
				duration: first ? CHART_DURATION.enter : CHART_DURATION.update * 1.3,
				ease: CHART_EASE,
				onUpdate: (t) => {
					for (const [id, a] of from) {
						const b = to.get(id);
						if (!b) continue;
						// The first reveal grows tiles in a quick wave from the largest.
						const local = first
							? clamp((t - Math.min(0.3, (1 - (b.w * b.h) / area) * 0.3)) / 0.7, 0, 1)
							: t;
						drawn.set(id, {
							x: mix(a.x, b.x, local),
							y: mix(a.y, b.y, local),
							w: mix(a.w, b.w, local),
							h: mix(a.h, b.h, local),
							o: mix(a.o, b.o, local),
						});
					}
					paint(ids);
				},
				onComplete: () => {
					for (const [id, d] of to) drawn.set(id, d);
					paint(ids);
				},
			});
		},
		repaint(ids: Iterable<string>) {
			paint(ids);
		},
		destroy() {
			playback?.stop();
		},
	};
}

/** Neutral shade steps from light to dark, so a higher measure reads deeper without a new hue. */
export function shadeFor(value: number | null, domain: [number, number] | null) {
	if (!domain || value === null) return 34;
	const [lo, hi] = domain;
	const t = clamp((value - lo) / (hi - lo || 1), 0, 1);
	return Math.round(14 + (Math.round(t * (SHADE_STEPS - 1)) / (SHADE_STEPS - 1)) * 44);
}

/** Top-level branches take the chart palette in order; past five they stay neutral. */
export const branchHue = (index: number) =>
	index < 0
		? "var(--chart-1)"
		: index < 5
			? `var(--chart-${index + 1})`
			: "var(--foreground)";
