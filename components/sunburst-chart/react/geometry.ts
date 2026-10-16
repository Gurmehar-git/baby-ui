export interface SunburstNode {
	name: string;
	value?: number;
	/** Overrides the category colour for this node and nothing else. */
	color?: string;
	children?: SunburstNode[];
}

export interface ArcDatum {
	id: string;
	name: string;
	depth: number;
	value: number;
	/** Index of the top-level branch this arc belongs to; drives its colour. */
	categoryIndex: number;
	/** Name of the top-level branch, matched against `config` keys. */
	category: string;
	hasChildren: boolean;
	trail: string[];
	parentId: string | null;
	a0: number;
	a1: number;
	color?: string;
}

export interface Focus {
	id: string;
	name: string;
	depth: number;
	value: number;
	parentId: string | null;
	categoryIndex: number;
	a0: number;
	a1: number;
}

export interface ArcGeometry {
	a0: number;
	a1: number;
	innerR: number;
	outerR: number;
}

export interface SunburstLayout {
	arcs: ArcDatum[];
	focusById: Map<string, Focus>;
	maxDepth: number;
	rootId: string;
	total: number;
}

const TOP = -Math.PI / 2;
const TWO_PI = 2 * Math.PI;
export const ID_SEP = " / ";
/** Drill hub: 65% of one ring, 8% smaller per level past the first drill. */
const HUB_SCALE = 0.65;
const HUB_DEPTH_SHRINK = 0.08;
/** Hover grow budget: 28% of a ring for the whole path, 10% per segment. */
const GROW_RING_BUDGET = 0.28;
const GROW_SEGMENT_CAP = 0.1;
/** Deeper rings step down 15% in opacity, never below 45%. */
const OPACITY_STEP = 0.15;
const OPACITY_FLOOR = 0.45;

/** Enter and zoom curve, as cubic-bezier control points. */
export const SUNBURST_CURVE = [0.22, 1, 0.36, 1] as const;
export const ZOOM_MS = 750;
export const GROW_MS = 420;
export const FADE_MS = 350;
export const DEFAULT_HOVER_POP = 8;

export function sumValues(node: SunburstNode): number {
	if (node.children?.length) {
		return node.children.reduce((sum, child) => sum + sumValues(child), 0);
	}
	return Math.max(0, node.value ?? 0);
}

/** Top-level branches named in `hidden` drop out before layout, so the rest fill the circle. */
export function buildLayout(
	data: SunburstNode,
	hidden?: ReadonlySet<string>,
): SunburstLayout {
	const rootId = data.name;
	const arcs: ArcDatum[] = [];
	const focusById = new Map<string, Focus>();
	let maxDepth = 0;
	const root: SunburstNode = {
		...data,
		children: data.children?.filter((child) => !hidden?.has(child.name)),
	};

	const visit = (
		node: SunburstNode,
		id: string,
		depth: number,
		a0: number,
		a1: number,
		parentId: string | null,
		categoryIndex: number,
		category: string,
		trail: string[],
	) => {
		const value = sumValues(node);
		const hasChildren = Boolean(node.children?.length);
		if (depth > 0) {
			arcs.push({
				id,
				name: node.name,
				depth,
				value,
				categoryIndex,
				category,
				hasChildren,
				trail: [...trail, node.name],
				parentId,
				a0: TOP + a0 * TWO_PI,
				a1: TOP + a1 * TWO_PI,
				color: node.color,
			});
		}
		focusById.set(id, {
			id,
			name: node.name,
			depth,
			value,
			parentId,
			categoryIndex,
			a0: TOP + a0 * TWO_PI,
			a1: TOP + a1 * TWO_PI,
		});
		maxDepth = Math.max(maxDepth, depth);
		if (!node.children?.length) return;
		const span = a1 - a0;
		let cursor = a0;
		node.children.forEach((child, index) => {
			const childSpan = value > 0 ? (sumValues(child) / value) * span : 0;
			visit(
				child,
				`${id}${ID_SEP}${child.name}`,
				depth + 1,
				cursor,
				cursor + childSpan,
				id,
				depth === 0 ? index : categoryIndex,
				depth === 0 ? child.name : category,
				depth === 0 ? [] : [...trail, node.name],
			);
			cursor += childSpan;
		});
	};

	visit(root, rootId, 0, 0, 1, null, 0, "", []);
	return { arcs, focusById, maxDepth, rootId, total: sumValues(root) };
}

/** Hub radius and ring width for a focus depth; `hub` keeps a hole even at the root. */
export function ringOptions(
	focusDepth: number,
	maxDepth: number,
	radius: number,
	hub: boolean,
) {
	const oneLevel = radius / Math.max(1, maxDepth);
	if (focusDepth === 0 && !hub) return { centerR: 0, ringWidth: oneLevel };
	const pastFirst = Math.max(0, focusDepth - 1);
	const centerR = oneLevel * Math.max(0.45, HUB_SCALE - pastFirst * HUB_DEPTH_SHRINK);
	const visible = Math.max(1, maxDepth - focusDepth);
	return { centerR, ringWidth: (radius - centerR) / visible };
}

export const isDescendant = (arc: { id: string }, ancestorId: string) =>
	arc.id === ancestorId || arc.id.startsWith(`${ancestorId}${ID_SEP}`);

/** On the path from the focus to the hovered arc, inclusive. */
export const isOnPath = (arc: { id: string }, hoveredId: string) =>
	arc.id === hoveredId || hoveredId.startsWith(`${arc.id}${ID_SEP}`);

export function geometryFor(
	arc: ArcDatum,
	focus: Focus,
	maxDepth: number,
	radius: number,
	hub: boolean,
): ArcGeometry | null {
	if (arc.depth <= focus.depth || !isDescendant(arc, focus.id)) return null;
	const { centerR, ringWidth } = ringOptions(focus.depth, maxDepth, radius, hub);
	const relative = arc.depth - focus.depth;
	const span = focus.a1 - focus.a0;
	const map = (angle: number) =>
		span <= 1e-9 ? TOP : TOP + ((angle - focus.a0) / span) * TWO_PI;
	return {
		a0: map(arc.a0),
		a1: map(arc.a1),
		innerR: centerR + (relative - 1) * ringWidth,
		outerR: centerR + relative * ringWidth,
	};
}

function lerpAngle(from: number, to: number, t: number): number {
	let delta = to - from;
	while (delta > Math.PI) delta -= TWO_PI;
	while (delta < -Math.PI) delta += TWO_PI;
	return from + delta * t;
}

/** Lerps around each arc's mid-angle along the shorter way round, so zooms never unwind. */
export function lerpGeometry(
	from: ArcGeometry,
	to: ArcGeometry,
	progress: number,
): ArcGeometry {
	const t = Math.min(1, Math.max(0, progress));
	const mid = lerpAngle((from.a0 + from.a1) / 2, (to.a0 + to.a1) / 2, t);
	const fromHalf = (from.a1 - from.a0) / 2;
	const half = fromHalf + ((to.a1 - to.a0) / 2 - fromHalf) * t;
	return {
		a0: mid - half,
		a1: mid + half,
		innerR: from.innerR + (to.innerR - from.innerR) * t,
		outerR: from.outerR + (to.outerR - from.outerR) * t,
	};
}

function pointGeometry(source: ArcGeometry): ArcGeometry {
	const mid = (source.a0 + source.a1) / 2;
	const pin = Math.max(
		0,
		Math.min(((source.innerR + source.outerR) / 2) * 0.12, source.innerR),
	);
	return { a0: mid, a1: mid, innerR: pin, outerR: pin };
}

/** Zoom morph: shared arcs lerp; arcs entering or leaving the view collapse to a point. */
export function transitionGeometry(
	arc: ArcDatum,
	fromFocus: Focus,
	toFocus: Focus,
	maxDepth: number,
	radius: number,
	hub: boolean,
	progress: number,
): ArcGeometry | null {
	const from = geometryFor(arc, fromFocus, maxDepth, radius, hub);
	const to = geometryFor(arc, toFocus, maxDepth, radius, hub);
	if (from && to) return lerpGeometry(from, to, progress);
	if (from) return lerpGeometry(from, pointGeometry(from), progress);
	if (to) return lerpGeometry(pointGeometry(to), to, progress);
	return null;
}

export function hubRadius(
	focus: Focus,
	prevFocus: Focus,
	maxDepth: number,
	radius: number,
	hub: boolean,
	zoomT: number,
): number {
	const now = ringOptions(focus.depth, maxDepth, radius, hub).centerR;
	const before = ringOptions(prevFocus.depth, maxDepth, radius, hub).centerR;
	return now * zoomT + before * (1 - zoomT);
}

/** Normalised clockwise position from 12 o'clock, 0 to 1. */
export function clockwiseFraction(angle: number): number {
	let normalised = angle - TOP;
	if (normalised < 0) normalised += TWO_PI;
	return normalised / TWO_PI;
}

/** Enter stagger in ms: 120 per ring plus 80 per clockwise position. */
export function enterDelays(arcs: ArcDatum[], staggerScale = 1) {
	const scale = Math.max(0.25, staggerScale);
	const byDepth = new Map<number, ArcDatum[]>();
	for (const arc of arcs)
		byDepth.set(arc.depth, [...(byDepth.get(arc.depth) ?? []), arc]);
	const delays = new Map<string, number>();
	let maxDelay = 0;
	for (const [depth, ring] of byDepth) {
		const sorted = [...ring].sort(
			(a, b) => clockwiseFraction(a.a0) - clockwiseFraction(b.a0),
		);
		sorted.forEach((arc, index) => {
			const delay = ((depth - 1) * 0.12 + index * 0.08) * scale * 1000;
			delays.set(arc.id, delay);
			maxDelay = Math.max(maxDelay, delay);
		});
	}
	return { delays, maxDelay };
}

export function relativeOpacity(relativeDepth: number): number {
	if (relativeDepth <= 1) return 1;
	return Math.max(OPACITY_FLOOR, 1 - (relativeDepth - 1) * OPACITY_STEP);
}

function growPerSegment(hoverPop: number, ringWidth: number, pathLength: number): number {
	return Math.min(
		hoverPop,
		ringWidth * GROW_SEGMENT_CAP,
		(ringWidth * GROW_RING_BUDGET) / Math.max(1, pathLength),
	);
}

/** Thickest a hovered segment may get: one first-drill ring plus its grow. */
export function maxHoverThickness(
	maxDepth: number,
	radius: number,
	hoverPop: number,
	hub: boolean,
) {
	const { ringWidth } = ringOptions(1, maxDepth, radius, hub);
	return ringWidth + growPerSegment(hoverPop, ringWidth, 1);
}

/** Grow per arc on the path from the focus to the hovered arc. */
export function hoverGrowTargets(
	arcs: ArcDatum[],
	hovered: ArcDatum,
	focus: Focus,
	maxDepth: number,
	radius: number,
	hoverPop: number,
	hub: boolean,
): Map<string, number> {
	const targets = new Map<string, number>();
	const { ringWidth } = ringOptions(focus.depth, maxDepth, radius, hub);
	const grow = growPerSegment(
		hoverPop,
		ringWidth,
		Math.max(1, hovered.depth - focus.depth),
	);
	const cap = maxHoverThickness(maxDepth, radius, hoverPop, hub);
	for (const arc of arcs) {
		if (!isOnPath(arc, hovered.id) || arc.depth <= focus.depth) continue;
		const base = geometryFor(arc, focus, maxDepth, radius, hub);
		const thickness = base ? base.outerR - base.innerR : cap;
		targets.set(arc.id, thickness >= cap ? 0 : Math.min(grow, cap - thickness));
	}
	return targets;
}

/** Room kept around the circle so the deepest hover grow stays inside the plot. */
export function growPadding(maxDepth: number, size: number, hoverPop: number): number {
	const ringWidth = size / 2 / Math.max(1, maxDepth);
	const path = Math.max(1, maxDepth - 1);
	const grow = growPerSegment(hoverPop, ringWidth, path);
	return Math.ceil(grow * path + grow);
}

/** Ancestors' grow pushes an arc outward; its own grow thickens its outer edge. */
export function applyHoverGrow(
	base: ArcGeometry,
	arcId: string,
	grow: (id: string) => number,
	cap: number,
): ArcGeometry {
	const parts = arcId.split(ID_SEP);
	let push = 0;
	for (let i = 1; i < parts.length; i++) push += grow(parts.slice(0, i).join(ID_SEP));
	const own = grow(arcId);
	if (push <= 0 && own <= 0) return base;
	if (base.outerR - base.innerR >= cap) {
		return push > 0
			? { ...base, innerR: base.innerR + push, outerR: base.outerR + push }
			: base;
	}
	const innerR = base.innerR + push;
	return { ...base, innerR, outerR: Math.min(base.outerR + push + own, innerR + cap) };
}

/** Clockwise sweep from the leading edge; `progress` 0 to 1. */
export function arcPath(geometry: ArcGeometry, progress = 1): string {
	const p = Math.min(1, Math.max(0, progress));
	const { a0, innerR, outerR } = geometry;
	const a1 = a0 + (geometry.a1 - a0) * p;
	if (outerR - innerR < 0.5 || a1 - a0 < 0.001) return "";
	const large = a1 - a0 > Math.PI ? 1 : 0;
	const ox0 = Math.sin(a0) * outerR;
	const oy0 = -Math.cos(a0) * outerR;
	const ox1 = Math.sin(a1) * outerR;
	const oy1 = -Math.cos(a1) * outerR;
	if (innerR < 1) {
		return `M 0 0 L ${ox0} ${oy0} A ${outerR} ${outerR} 0 ${large} 1 ${ox1} ${oy1} Z`;
	}
	const ix1 = Math.sin(a1) * innerR;
	const iy1 = -Math.cos(a1) * innerR;
	const ix0 = Math.sin(a0) * innerR;
	const iy0 = -Math.cos(a0) * innerR;
	return `M ${ox0} ${oy0} A ${outerR} ${outerR} 0 ${large} 1 ${ox1} ${oy1} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${large} 0 ${ix0} ${iy0} Z`;
}

export function centroid(geometry: ArcGeometry) {
	const mid = (geometry.a0 + geometry.a1) / 2;
	const r = (geometry.innerR + geometry.outerR) / 2;
	return { x: Math.sin(mid) * r, y: -Math.cos(mid) * r, angle: mid, radius: r };
}

/** Labels read along the arc but never upside down. */
export function labelRotation(angle: number): number {
	let deg = (angle * 180) / Math.PI - 90;
	if (deg > 90) deg -= 180;
	if (deg < -90) deg += 180;
	return deg;
}

/** Labels run along the radius: the text must fit the ring's depth, its line the arc's length.
 * 18px of arc holds an 11px label and its outline with room, so neighbours never touch. */
export const labelFits = (g: ArcGeometry, text: string) =>
	(g.a1 - g.a0) * ((g.innerR + g.outerR) / 2) >= 18 &&
	g.outerR - g.innerR - 6 >= text.length * 6.6;

/** Arcs the keyboard walks under a focus: depth-first, the order they were laid out. */
export const visibleArcs = (arcs: ArcDatum[], focus: Focus) =>
	arcs.filter((arc) => arc.depth > focus.depth && isDescendant(arc, focus.id));

/** Breadcrumb from the root down to the focus. */
export function focusTrail(focus: Focus, focusById: Map<string, Focus>): Focus[] {
	const crumbs: Focus[] = [];
	let current: Focus | undefined = focus;
	while (current) {
		crumbs.unshift(current);
		current = current.parentId ? focusById.get(current.parentId) : undefined;
	}
	return crumbs;
}

export function arcColor(arc: ArcDatum, configured: ReadonlySet<string>): string {
	if (arc.color) return arc.color;
	if (configured.has(arc.category)) return `var(--color-${arc.category})`;
	return `var(--chart-${(arc.categoryIndex % 5) + 1})`;
}

export const localProgress = (elapsed: number, delay: number, duration: number) =>
	duration <= 0 ? 1 : Math.min(1, Math.max(0, (elapsed - delay) / duration));
