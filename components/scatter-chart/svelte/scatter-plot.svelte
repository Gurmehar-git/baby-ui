<script lang="ts">
import { extent } from "d3-array";
import { scaleLinear, scaleTime } from "d3-scale";
import { type Snippet, untrack } from "svelte";
import {
	setActivePoint,
	setPlot,
	type TickScale,
	useChart,
} from "../../chart/svelte/context";
import {
	type ActivePoint,
	type ChartPhase,
	type Datum,
	DEFAULT_MARGIN,
	type Domain,
	type Margin,
	type SeriesConfig,
	type TooltipRow,
	toDate,
} from "../../chart/svelte/core";
import {
	CHART_DURATION,
	CHART_EASE,
	prefersReducedMotion,
	tween,
} from "../../chart/svelte/motion";
import { setScatterRoot } from "./context";
import { nearestPoint, POINT_BLUR, POINT_CONCEAL, POINT_ENTER } from "./geometry";
import type { ScatterShape } from "./variants";

let {
	frame,
	data,
	xKey,
	margin: marginProp,
	domain,
	series,
	register,
	phase,
	animate,
	advance,
	activeIndex,
	activeKey,
	instant,
	interactive,
	onHit,
	shapeFor,
	title,
	rows,
	children,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	data: Datum[];
	xKey: string;
	margin?: Partial<Margin>;
	domain: Domain;
	series: SeriesConfig[];
	register: (series: SeriesConfig) => () => void;
	phase: ChartPhase;
	animate: boolean;
	advance: (event: "done") => void;
	activeIndex: number | null;
	activeKey: string | null;
	instant: boolean;
	interactive: boolean;
	onHit: (index: number | null, key: string | null) => void;
	shapeFor: (key: string) => ScatterShape;
	title: (datum: Datum) => string;
	rows: (datum: Datum) => TooltipRow[];
	children?: Snippet;
} = $props();

const chart = useChart();
const uid = $props.id();
const clipId = `${uid}-scatter`;
const margin = $derived<Margin>({ ...DEFAULT_MARGIN, ...marginProp });
const innerWidth = $derived(Math.max(0, frame.width - margin.left - margin.right));
const innerHeight = $derived(Math.max(0, frame.height - margin.top - margin.bottom));

const xScale = $derived.by(() => {
	const [min = 0, max = min] = extent(data, (d) => toDate(d[xKey]).getTime());
	return scaleTime().domain([min, max]).range([0, innerWidth]);
});
const yScale = $derived(scaleLinear().domain(domain).range([innerHeight, 0]));
const x = $derived((d: Datum) => xScale(toDate(d[xKey])));
const labels = $derived(data.map((d) => chart.format.tick(toDate(d[xKey]))));

const enters = new Map<string, { el: SVGGElement; delay: number }>();
function registerEnter(id: string, el: SVGGElement, delay: number) {
	enters.set(id, { el, delay });
	return () => {
		if (enters.get(id)?.el === el) enters.delete(id);
	};
}

$effect(() => {
	const current = phase;
	const hasSize = innerWidth > 0;
	if ((current !== "revealing" && current !== "concealing") || !hasSize) return;
	return untrack(() => {
		const points = [...enters.values()];
		const reduced = !animate || prefersReducedMotion();
		const paint = (el: SVGGElement, p: number) => {
			el.style.opacity = String(p);
			el.style.filter = p >= 1 ? "" : `blur(${(1 - p) * POINT_BLUR}px)`;
		};
		if (current === "concealing") {
			const playback = tween({
				duration: reduced ? 0 : POINT_CONCEAL,
				onUpdate: (p) => {
					for (const point of points) paint(point.el, 1 - p);
				},
				onComplete: () => advance("done"),
			});
			return () => playback.stop();
		}
		if (reduced) {
			for (const point of points) paint(point.el, 1);
			advance("done");
			return;
		}
		const total = CHART_DURATION.enter + POINT_ENTER;
		let live = points;
		const clock = tween({
			duration: total,
			ease: (t) => t,
			onUpdate: (p) => {
				// Points attach during the same flush, so the first frame picks up late arrivals.
				if (live.length === 0) live = [...enters.values()];
				const elapsed = p * total;
				for (const point of live) {
					const local = Math.min(1, Math.max(0, (elapsed - point.delay) / POINT_ENTER));
					paint(point.el, CHART_EASE(local));
				}
			},
			onComplete: () => {
				for (const point of live) point.el.style.opacity = "";
				advance("done");
			},
		});
		return () => clock.stop();
	});
});

let pending: number | null = null;
function onpointermove(event: PointerEvent & { currentTarget: SVGSVGElement }) {
	if (!interactive) return;
	const bounds = event.currentTarget.getBoundingClientRect();
	const px = event.clientX - bounds.left - margin.left;
	const py = event.clientY - bounds.top - margin.top;
	if (pending !== null) cancelAnimationFrame(pending);
	pending = requestAnimationFrame(() => {
		pending = null;
		const hit = nearestPoint(
			data,
			series.map((s) => s.key),
			px,
			py,
			x,
			(v) => yScale(v),
		);
		if (hit) onHit(hit.index, hit.key);
	});
}
function onpointerleave() {
	if (pending !== null) cancelAnimationFrame(pending);
	pending = null;
	if (activeIndex !== null) onHit(null, null);
}

const active = $derived.by<ActivePoint | null>(() => {
	if (activeIndex === null || !interactive) return null;
	const datum = data[activeIndex];
	if (!datum) return null;
	const y: Record<string, number> = {};
	for (const s of series) {
		if (activeKey !== null && s.key !== activeKey) continue;
		const value = datum[s.key];
		if (typeof value === "number") y[s.key] = yScale(value);
	}
	return { index: activeIndex, datum, x: x(datum), y };
});

setPlot({
	get width() {
		return frame.width;
	},
	get height() {
		return frame.height;
	},
	get innerWidth() {
		return innerWidth;
	},
	get innerHeight() {
		return innerHeight;
	},
	get margin() {
		return margin;
	},
	get rowScale() {
		return yScale as unknown as TickScale;
	},
	get columnScale() {
		return xScale as unknown as TickScale;
	},
	get phase() {
		return phase;
	},
	get animate() {
		return animate;
	},
	clipId,
	get plotEl() {
		return frame.el;
	},
	get data() {
		return data;
	},
	get xKey() {
		return xKey;
	},
	get xScale() {
		return xScale;
	},
	get yScale() {
		return yScale;
	},
	get x() {
		return x;
	},
	get labels() {
		return labels;
	},
	get series() {
		return series;
	},
	register: (s: SeriesConfig) => register(s),
});
setActivePoint({
	get active() {
		return active;
	},
	get instant() {
		return instant;
	},
	get title() {
		return title;
	},
	get rows() {
		return rows;
	},
});
setScatterRoot({
	get activeKey() {
		return activeKey;
	},
	shapeFor: (key) => shapeFor(key),
	registerEnter,
});
</script>

<svg
	aria-hidden="true"
	width={frame.width}
	height={frame.height}
	class="absolute inset-0 block overflow-visible"
	style:cursor={interactive ? "crosshair" : undefined}
	{onpointermove}
	{onpointerleave}
>
	<defs>
		<clipPath id={clipId}>
			<rect x={-12} y={-12} width={innerWidth + 24} height={innerHeight + 24} />
		</clipPath>
	</defs>
	<g transform="translate({margin.left},{margin.top})">
		<rect width={innerWidth} height={innerHeight} fill="transparent" />
		{@render children?.()}
	</g>
</svg>
