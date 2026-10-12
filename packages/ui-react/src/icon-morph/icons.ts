export type IconMorphName =
	| "menu"
	| "play"
	| "plus"
	| "copy"
	| "theme"
	| "chevron"
	| "bell"
	| "heart";

const NUMERIC = [
	"x",
	"y",
	"rotate",
	"scale",
	"scaleX",
	"opacity",
	"r",
	"cx",
	"cy",
	"draw",
	"fillOpacity",
	"strokeWidth",
] as const;
type Numeric = (typeof NUMERIC)[number];
/** Animatable values; `d` morphs number by number, so both paths need the same commands. */
export type Channels = Partial<Record<Numeric, number>> & { d?: string };
export type SpringName = "morph" | "smooth" | "snappy";

export type MorphNode = {
	tag: "path" | "circle" | "rect" | "g" | "defs" | "mask" | "clipPath";
	/** Static attributes; `{id}` is replaced with the instance's id. */
	attrs?: Record<string, string | number>;
	off?: Channels;
	on?: Channels;
	spring?: SpringName;
	/** Milliseconds the move waits when turning on. */
	delay?: number;
	/** A one-off kick on each turn on that springs back to rest, such as a ring or a pop. */
	pop?: {
		channel: Numeric;
		offset?: number;
		velocity?: number;
		delay?: number;
		spring: { stiffness: number; damping: number };
	};
	/** A one-off tween on each turn on, resting at `to`. */
	burst?: { from: Channels; to: Channels; duration: number; delay?: number };
	/** transform-origin; defaults to the element's own centre. */
	origin?: string;
	children?: MorphNode[];
	/** DFS index, assigned by `iconTree`. */
	i?: number;
};

export type IconTreeOptions = {
	/** Chevron only: degrees it turns when on. */
	turn?: number;
	/** Chevron only: where it points at rest. */
	pointing?: "down" | "right";
};

/** Underdamped enough to ring about three times in 0.9s, like a struck bell. */
const RING = { stiffness: 440, damping: 4.2 };
const POP = { stiffness: 260, damping: 13 };

const PLAY = [
	"M7 4.5 L12 7.42 L12 16.58 L7 19.5 Z",
	"M12 7.42 L19.5 11.8 L19.5 12.2 L12 16.58 Z",
];
const PAUSE = ["M6.5 5 L10 5 L10 19 L6.5 19 Z", "M14 5 L17.5 5 L17.5 19 L14 19 Z"];
const round = (value: number) => Math.round(value * 100) / 100;
const RAYS = Array.from({ length: 8 }, (_, index) => {
	const angle = (index * Math.PI) / 4;
	const c = Math.cos(angle);
	const s = Math.sin(angle);
	return `M${round(12 + c * 7.5)} ${round(12 + s * 7.5)} L${round(12 + c * 10)} ${round(12 + s * 10)}`;
});
const BELL = "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9";
const CLAPPER = "M10.3 21a1.94 1.94 0 0 0 3.4 0";
const HEART =
	"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z";
const SPARKS = Array.from({ length: 7 }, (_, index) => {
	const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 7;
	return { x: Math.cos(angle), y: Math.sin(angle), r: index % 2 ? 1 : 1.4 };
});
const SLASH: MorphNode = {
	tag: "path",
	attrs: { d: "M3 3 L21 21", pathLength: 1 },
	off: { draw: 1, opacity: 1 },
	on: { draw: 0, opacity: 0 },
	spring: "smooth",
};
const SHADOW = { off: { cx: 30, cy: -6, r: 6.5 }, on: { cx: 18, cy: 6, r: 6.5 } };
const DISC = { off: { r: 4.5 }, on: { r: 8.5 } };

function build(
	name: IconMorphName,
	{ turn = 180, pointing = "down" }: IconTreeOptions,
): MorphNode[] {
	switch (name) {
		case "menu":
			return [
				{
					tag: "path",
					attrs: { d: "M4 6h16" },
					off: { y: 0, rotate: 0 },
					on: { y: 6, rotate: 45 },
				},
				{
					tag: "path",
					attrs: { d: "M4 12h16" },
					off: { opacity: 1, scaleX: 1 },
					on: { opacity: 0, scaleX: 0.2 },
					spring: "snappy",
				},
				{
					tag: "path",
					attrs: { d: "M4 18h16" },
					off: { y: 0, rotate: 0 },
					on: { y: -6, rotate: -45 },
				},
			];
		case "play":
			return PLAY.map((d, index) => ({
				tag: "path",
				attrs: { fill: "currentColor", "stroke-width": 1.5 },
				off: { d },
				on: { d: PAUSE[index] },
			}));
		case "plus":
			return [
				{ tag: "path", off: { d: "M12 5 L12 19" }, on: { d: "M20 6.5 L9.5 17" } },
				{ tag: "path", off: { d: "M5 12 L19 12" }, on: { d: "M4.5 12 L9.5 17" } },
			];
		case "copy":
			return [
				{
					tag: "path",
					attrs: { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" },
					off: { x: 0, y: 0, opacity: 1 },
					on: { x: 4, y: 4, opacity: 0 },
					spring: "smooth",
				},
				{
					tag: "rect",
					attrs: { x: 8, y: 8, width: 14, height: 14, rx: 2 },
					off: { scale: 1, opacity: 1 },
					on: { scale: 0.7, opacity: 0 },
					spring: "smooth",
				},
				{
					tag: "path",
					attrs: { d: "M5 12.5 L9.5 17 L19 7.5", pathLength: 1 },
					off: { draw: 0, opacity: 0 },
					on: { draw: 1, opacity: 1 },
					spring: "smooth",
					delay: 60,
				},
			];
		case "theme":
			// The crescent is an outline: the disc's edge outside the shadow, and the shadow's edge inside the disc.
			return [
				{
					tag: "defs",
					children: [
						{
							tag: "mask",
							attrs: {
								id: "{id}-bite",
								maskUnits: "userSpaceOnUse",
								x: -8,
								y: -8,
								width: 40,
								height: 40,
							},
							children: [
								{
									tag: "rect",
									attrs: {
										x: -8,
										y: -8,
										width: 40,
										height: 40,
										fill: "white",
										stroke: "none",
									},
								},
								{ tag: "circle", attrs: { fill: "black", stroke: "none" }, ...SHADOW },
							],
						},
						{
							tag: "clipPath",
							attrs: { id: "{id}-disc" },
							children: [{ tag: "circle", attrs: { cx: 12, cy: 12 }, ...DISC }],
						},
					],
				},
				{ tag: "circle", attrs: { cx: 12, cy: 12, mask: "url(#{id}-bite)" }, ...DISC },
				{ tag: "circle", attrs: { "clip-path": "url(#{id}-disc)" }, ...SHADOW },
				{
					tag: "g",
					off: { rotate: 0, scale: 1, opacity: 1 },
					on: { rotate: 90, scale: 0.4, opacity: 0 },
					origin: "12px 12px",
					children: RAYS.map((d) => ({ tag: "path", attrs: { d } })),
				},
			];
		case "chevron":
			return [
				{
					tag: "path",
					attrs: { d: pointing === "down" ? "M6 9 L12 15 L18 9" : "M9 6 L15 12 L9 18" },
					off: { rotate: 0 },
					on: { rotate: turn },
					origin: "12px 12px",
				},
			];
		case "bell":
			// Turning on rings the bell from its top, the clapper lagging; turning off strikes it through.
			return [
				{
					tag: "defs",
					children: [
						{
							tag: "mask",
							attrs: {
								id: "{id}-cut",
								maskUnits: "userSpaceOnUse",
								x: -4,
								y: -4,
								width: 32,
								height: 32,
							},
							children: [
								{
									tag: "rect",
									attrs: {
										x: -4,
										y: -4,
										width: 32,
										height: 32,
										fill: "white",
										stroke: "none",
									},
								},
								{
									...SLASH,
									attrs: { ...SLASH.attrs, stroke: "black", "stroke-width": 5 },
								},
							],
						},
					],
				},
				{
					tag: "g",
					attrs: { mask: "url(#{id}-cut)" },
					children: [
						{
							tag: "path",
							attrs: { d: BELL },
							origin: "12px 2px",
							pop: { channel: "rotate", velocity: 336, spring: RING },
						},
						{
							tag: "path",
							attrs: { d: CLAPPER },
							pop: { channel: "x", velocity: -46, delay: 40, spring: RING },
						},
					],
				},
				SLASH,
			];
		case "heart":
			return [
				{
					tag: "g",
					attrs: { stroke: "none" },
					children: [
						{
							tag: "circle",
							attrs: { cx: 12, cy: 12, fill: "none", stroke: "currentColor" },
							burst: {
								from: { r: 4, strokeWidth: 3, opacity: 0.5 },
								to: { r: 13, strokeWidth: 0, opacity: 0 },
								duration: 500,
							},
						},
						...SPARKS.map(
							(spark): MorphNode => ({
								tag: "circle",
								attrs: { cx: 12, cy: 12, r: spark.r, fill: "currentColor" },
								burst: {
									from: { x: spark.x * 7, y: spark.y * 7, opacity: 1, scale: 1 },
									to: { x: spark.x * 14, y: spark.y * 14, opacity: 0, scale: 0.3 },
									duration: 550,
									delay: 50,
								},
							}),
						),
					],
				},
				{
					tag: "g",
					origin: "12px 12px",
					pop: { channel: "scale", offset: -0.28, spring: POP },
					children: [
						{
							tag: "path",
							attrs: { d: HEART, fill: "currentColor" },
							off: { fillOpacity: 0 },
							on: { fillOpacity: 1 },
							spring: "smooth",
						},
					],
				},
			];
	}
}

/** The icon's nodes, each numbered in render order so the engine can find its element. */
export function iconTree(
	name: IconMorphName,
	options: IconTreeOptions = {},
): MorphNode[] {
	let next = 0;
	const number = (nodes: MorphNode[]): MorphNode[] =>
		nodes.map((node) => ({
			...node,
			i: next++,
			children: node.children && number(node.children),
		}));
	return number(build(name, options));
}

export function flatten(nodes: MorphNode[]): MorphNode[] {
	return nodes.flatMap((node) => [node, ...flatten(node.children ?? [])]);
}

const NUMBER = /-?\d*\.?\d+(?:e-?\d+)?/g;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function mixPath(from: string, to: string, t: number): string {
	if (t <= 0) return from;
	if (t >= 1 && t < 1.0001) return to;
	const target = to.match(NUMBER) ?? [];
	let index = 0;
	return from.replace(NUMBER, (value) =>
		round(lerp(Number(value), Number(target[index++] ?? value), t)).toString(),
	);
}

/** Values at progress `t` (0 off, 1 on; springs overshoot past both), plus a kick on one channel. */
export function mix(
	from: Channels,
	to: Channels,
	t: number,
	kick?: { channel: Numeric; value: number },
): Channels {
	const out: Channels = {};
	if (from.d && to.d) out.d = mixPath(from.d, to.d, t);
	for (const key of NUMERIC) {
		const a = from[key] ?? to[key];
		if (a !== undefined) out[key] = lerp(a, to[key] ?? a, t);
	}
	if (kick)
		out[kick.channel] =
			(out[kick.channel] ?? (kick.channel === "scale" ? 1 : 0)) + kick.value;
	return out;
}

/** Attributes and inline styles that show `values` on a node. */
export function paint(
	node: MorphNode,
	values: Channels,
): { attrs: Record<string, string>; style: Record<string, string> } {
	const attrs: Record<string, string> = {};
	const style: Record<string, string> = {};
	if (values.d !== undefined) attrs.d = values.d;
	for (const key of ["r", "cx", "cy"] as const) {
		const value = values[key];
		if (value !== undefined)
			attrs[key] = round(Math.max(key === "r" ? 0 : -Infinity, value)).toString();
	}
	if (values.strokeWidth !== undefined)
		attrs["stroke-width"] = round(Math.max(0, values.strokeWidth)).toString();
	if (values.opacity !== undefined) style.opacity = clamp01(values.opacity).toFixed(3);
	if (values.fillOpacity !== undefined)
		style["fill-opacity"] = clamp01(values.fillOpacity).toFixed(3);
	if (values.draw !== undefined) {
		style["stroke-dasharray"] = "1";
		style["stroke-dashoffset"] = (1 - clamp01(values.draw)).toFixed(4);
	}
	const { x, y, rotate, scale, scaleX } = values;
	if ([x, y, rotate, scale, scaleX].some((value) => value !== undefined)) {
		const s = Math.max(0, scale ?? 1);
		style.transform = `translate(${round(x ?? 0)}px, ${round(y ?? 0)}px) rotate(${round(rotate ?? 0)}deg) scale(${(s * Math.max(0, scaleX ?? 1)).toFixed(3)}, ${s.toFixed(3)})`;
		style["transform-box"] = node.origin ? "view-box" : "fill-box";
		style["transform-origin"] = node.origin ?? "center";
	}
	return { attrs, style };
}

/** The resting look of a node, for the server and the first paint. */
export function rest(node: MorphNode, on: boolean): Channels {
	if (node.burst) return node.burst.to;
	return mix(node.off ?? {}, node.on ?? {}, on ? 1 : 0);
}

/** `{id}` placeholders in static attributes, filled with the instance's id. */
export function staticAttrs(
	node: MorphNode,
	id: string,
): Record<string, string | number> {
	const out: Record<string, string | number> = {};
	for (const [key, value] of Object.entries(node.attrs ?? {}))
		out[key] = typeof value === "string" ? value.replaceAll("{id}", id) : value;
	return out;
}
