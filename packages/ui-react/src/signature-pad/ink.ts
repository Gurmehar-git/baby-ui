/** A sampled point in pad units; `p` is pen pressure 0..1, or -1 when the device reports none. */
export interface InkPoint {
	x: number;
	y: number;
	p: number;
	t: number;
}

export type InkWidth = "fine" | "medium" | "bold";
export type InkTone = "default" | "primary";

export interface InkStroke {
	id: string;
	points: InkPoint[];
	tone: InkTone;
	width: InkWidth;
}

export const PAD_WIDTH = 600;
export const PAD_HEIGHT = 260;

export const INK_SIZES: Record<InkWidth, number> = { fine: 3.4, medium: 5.6, bold: 8.4 };

type Vec = [number, number];
const ZERO: Vec = [0, 0];
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]];
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1]];
const mul = (a: Vec, n: number): Vec => [a[0] * n, a[1] * n];
const lerp = (a: Vec, b: Vec, t: number): Vec => [
	a[0] + (b[0] - a[0]) * t,
	a[1] + (b[1] - a[1]) * t,
];
const dist = (a: Vec, b: Vec) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const norm = (a: Vec): Vec => {
	const l = Math.hypot(a[0], a[1]);
	return l ? [a[0] / l, a[1] / l] : ZERO;
};
const perp = (a: Vec): Vec => [a[1], -a[0]];
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1];
const rotAround = (p: Vec, c: Vec, r: number): Vec => {
	const s = Math.sin(r);
	const co = Math.cos(r);
	const px = p[0] - c[0];
	const py = p[1] - c[1];
	return [px * co - py * s + c[0], px * s + py * co + c[1]];
};
const easeOut = (t: number) => t * (2 - t);

interface OutlineOptions {
	size: number;
	thinning?: number;
	streamline?: number;
	simulatePressure?: boolean;
	taperStart?: number;
	taperEnd?: number;
	/** False while the stroke is still drawing, so its end does not taper yet. */
	last?: boolean;
}

type Sample = { at: Vec; pressure: number; length: number; vector: Vec };

/**
 * The outline polygon of a variable-width stroke: points ease toward the pointer, width follows
 * pressure (or speed without a pen), the ends taper, and sharp turns get round joins.
 */
function strokeOutline(input: InkPoint[], options: OutlineOptions): Vec[] {
	const {
		size,
		thinning = 0.62,
		streamline = 0.42,
		simulatePressure = true,
		taperStart = 0,
		taperEnd = 0,
		last = true,
	} = options;
	const head = input[0];
	if (!head) return [];
	const usePen = !simulatePressure && input.some((point) => point.p > 0);
	let prev: Vec = [head.x, head.y];
	let length = 0;
	const start: Sample = {
		at: prev,
		pressure: usePen ? head.p : 0.5,
		length: 0,
		vector: [1, 0],
	};
	const pts: Sample[] = [start];
	input.forEach((sample, i) => {
		if (i === 0) return;
		const raw: Vec = [sample.x, sample.y];
		const at = i === input.length - 1 && last ? raw : lerp(prev, raw, 1 - streamline);
		const d = dist(at, prev);
		if (d < 0.4) return;
		length += d;
		pts.push({
			at,
			pressure: usePen ? sample.p : 0.5,
			length,
			vector: norm(sub(prev, at)),
		});
		prev = at;
	});
	const second = pts[1];
	if (second) start.vector = second.vector;
	const total = length;

	if (pts.length === 1) {
		const r = Math.max(0.6, size * (0.5 - thinning * (0.5 - start.pressure)) * 0.9);
		return Array.from({ length: 18 }, (_, i) =>
			add(
				start.at,
				mul([Math.cos((i / 18) * Math.PI * 2), Math.sin((i / 18) * Math.PI * 2)], r),
			),
		);
	}

	const left: Vec[] = [];
	const right: Vec[] = [];
	let pressure = start.pressure;
	let prevVector = start.vector;
	pts.forEach((point, i) => {
		if (usePen) pressure = point.pressure;
		else {
			// A long step between samples reads as a fast stroke, which thins the line.
			const before = pts[i - 1];
			const speed = Math.min(1, (before ? dist(point.at, before.at) : 0) / size);
			pressure = Math.min(
				1,
				pressure + (Math.min(1, 1 - speed) - pressure) * speed * 0.3,
			);
		}
		let radius = Math.max(0.25, size * (0.5 - thinning * (0.5 - pressure)));
		const ts = taperStart ? easeOut(Math.min(1, point.length / taperStart)) : 1;
		const te =
			taperEnd && last ? easeOut(Math.min(1, (total - point.length) / taperEnd)) : 1;
		radius = Math.max(0.12 * size, radius * Math.min(ts, te));
		const next = pts[i + 1]?.vector ?? point.vector;
		const offset = mul(perp(lerp(next, point.vector, 0.5)), radius);
		if (i > 0 && i < pts.length - 1 && dot(point.vector, next) < -0.2) {
			const corner = mul(perp(prevVector), radius);
			for (let t = 0; t <= 1; t += 1 / 12) {
				left.push(rotAround(sub(point.at, corner), point.at, Math.PI * t));
				right.push(rotAround(add(point.at, corner), point.at, -Math.PI * t));
			}
		} else {
			left.push(sub(point.at, offset));
			right.push(add(point.at, offset));
		}
		prevVector = point.vector;
	});

	const cap = (center: Vec, from: Vec, to: Vec, away: Vec) => {
		const out: Vec[] = [];
		const r = dist(center, from);
		const begin = Math.atan2(from[1] - center[1], from[0] - center[0]);
		const mid = begin + Math.PI / 2;
		const sign = dot([Math.cos(mid), Math.sin(mid)], away) >= 0 ? 1 : -1;
		for (let k = 1; k < 12; k++) {
			const a = begin + (sign * Math.PI * k) / 12;
			out.push([center[0] + Math.cos(a) * r, center[1] + Math.sin(a) * r]);
		}
		out.push(to);
		return out;
	};
	const end = pts[pts.length - 1] ?? start;
	const endCap = cap(
		end.at,
		left.at(-1) ?? end.at,
		right.at(-1) ?? end.at,
		mul(end.vector, -1),
	);
	const startCap = cap(start.at, right[0] ?? start.at, left[0] ?? start.at, start.vector);
	return [...left, ...endCap, ...right.reverse(), ...startCap];
}

const round = (value: number) => Math.round(value * 100) / 100;

function outlinePath(points: Vec[]) {
	const first = points[0];
	if (!first || points.length < 3) return "";
	let d = `M${round(first[0])} ${round(first[1])} Q`;
	points.forEach(([x0, y0], i) => {
		const [x1, y1] = points[(i + 1) % points.length] ?? first;
		d += `${round(x0)} ${round(y0)} ${round((x0 + x1) / 2)} ${round((y0 + y1) / 2)} `;
	});
	return `${d}Z`;
}

/** The SVG path of a stroke; pass `last: false` while it is still being drawn. */
export function strokePath(stroke: Pick<InkStroke, "width" | "points">, last = true) {
	const size = INK_SIZES[stroke.width];
	const pen = stroke.points.some((point) => point.p > 0);
	return outlinePath(
		strokeOutline(stroke.points, {
			size,
			simulatePressure: !pen,
			taperStart: size * 1.5,
			taperEnd: pen ? 0 : size * 5,
			last,
		}),
	);
}

function inkBounds(strokes: InkStroke[]) {
	let minX = Number.POSITIVE_INFINITY;
	let minY = Number.POSITIVE_INFINITY;
	let maxX = Number.NEGATIVE_INFINITY;
	let maxY = Number.NEGATIVE_INFINITY;
	for (const stroke of strokes) {
		for (const point of stroke.points) {
			minX = Math.min(minX, point.x);
			minY = Math.min(minY, point.y);
			maxX = Math.max(maxX, point.x);
			maxY = Math.max(maxY, point.y);
		}
	}
	const pad = 16;
	return {
		x: Math.floor(minX - pad),
		y: Math.floor(minY - pad),
		width: Math.ceil(maxX - minX + pad * 2),
		height: Math.ceil(maxY - minY + pad * 2),
	};
}

/** A standalone SVG cropped to the ink; `colors` maps each tone to a concrete colour. */
export function signatureToSvg(strokes: InkStroke[], colors: Record<InkTone, string>) {
	if (!strokes.length) return "";
	const box = inkBounds(strokes);
	const paths = strokes
		.map((stroke) => `<path d="${strokePath(stroke)}" fill="${colors[stroke.tone]}"/>`)
		.join("");
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.x} ${box.y} ${box.width} ${box.height}" width="${box.width}" height="${box.height}">${paths}</svg>`;
}

/** A transparent PNG cropped to the ink, at `scale` times pad resolution. */
export function signatureToPng(
	strokes: InkStroke[],
	colors: Record<InkTone, string>,
	scale = 3,
): Promise<Blob> {
	return new Promise((resolve, reject) => {
		if (!strokes.length) return reject(new Error("Nothing to export"));
		const box = inkBounds(strokes);
		const canvas = document.createElement("canvas");
		canvas.width = box.width * scale;
		canvas.height = box.height * scale;
		const ctx = canvas.getContext("2d");
		if (!ctx) return reject(new Error("Canvas is unavailable"));
		ctx.scale(scale, scale);
		ctx.translate(-box.x, -box.y);
		for (const stroke of strokes) {
			ctx.fillStyle = colors[stroke.tone];
			ctx.fill(new Path2D(strokePath(stroke)));
		}
		canvas.toBlob(
			(blob) => (blob ? resolve(blob) : reject(new Error("Export failed"))),
			"image/png",
		);
	});
}

/** A pointer event as an ink point in pad units; mice report no real pressure. */
export function inkPoint(event: PointerEvent, pad: Element, startedAt: number): InkPoint {
	const box = pad.getBoundingClientRect();
	return {
		x: ((event.clientX - box.left) / box.width) * PAD_WIDTH,
		y: ((event.clientY - box.top) / box.height) * PAD_HEIGHT,
		p: event.pointerType === "pen" ? event.pressure : -1,
		t: event.timeStamp - startedAt,
	};
}

/** The undo/redo key a keydown means, if any. */
export function historyKey(event: KeyboardEvent): "undo" | "redo" | "clear" | null {
	const mod = event.metaKey || event.ctrlKey;
	const key = event.key.toLowerCase();
	if (mod && key === "z") return event.shiftKey ? "redo" : "undo";
	if (mod && key === "y") return "redo";
	if (!mod && (key === "delete" || key === "backspace")) return "clear";
	return null;
}

/** Concrete colours for each tone, read from the pad's theme for export. */
export function toneColors(pad: Element): Record<InkTone, string> {
	const style = getComputedStyle(pad);
	return {
		default: style.getPropertyValue("--foreground").trim() || "#111",
		primary: style.getPropertyValue("--primary").trim() || "#2563eb",
	};
}

export function downloadBlob(blob: Blob, name: string) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = name;
	link.click();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}
