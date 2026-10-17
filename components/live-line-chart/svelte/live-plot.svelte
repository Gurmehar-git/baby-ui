<script lang="ts">
import { scaleLinear, scaleTime } from "d3-scale";
import { type Snippet, untrack } from "svelte";
import type {
	ActivePoint,
	Datum,
	Margin,
	SeriesConfig,
	TooltipRow,
} from "../../chart/core";
import { prefersReducedMotion } from "../../chart/motion";
import { setActivePoint, setPlot, type TickScale } from "../../chart/svelte/context";
import {
	interpolateAt,
	type LiveFrame,
	type LivePoint,
	liveRecords,
	nearestPointIndex,
	nextFrame,
	settled,
	smoothingFactor,
	targetRange,
} from "../live";
import { setLive } from "./context";

let {
	frame: box,
	data,
	value,
	dataKey,
	windowMs,
	numXTicks,
	nowOffsetUnits,
	exaggerate,
	lerpSpeed,
	paused,
	margin: marginProp,
	series,
	register,
	activeIndex,
	instant,
	setActive,
	formatTime,
	seriesLabel,
	children,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	data: LivePoint[];
	value: number;
	dataKey: string;
	windowMs: number;
	numXTicks: number;
	nowOffsetUnits: number;
	exaggerate: boolean;
	lerpSpeed: number;
	paused: boolean;
	margin?: Partial<Margin>;
	series: SeriesConfig[];
	register: (series: SeriesConfig) => () => void;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
	formatTime: (ms: number) => string;
	seriesLabel: (key: string) => string;
	children?: Snippet;
} = $props();

/** Commits the animation loop at most every 32ms (about 30fps). */
const COMMIT_MS = 32;
const DEFAULT_LIVE_MARGIN: Margin = { top: 24, right: 72, bottom: 32, left: 48 };

const uid = $props.id();
const clipId = `${uid}-live`;
const margin = $derived<Margin>({ ...DEFAULT_LIVE_MARGIN, ...marginProp });
const innerWidth = $derived(Math.max(0, box.width - margin.left - margin.right));
const innerHeight = $derived(Math.max(0, box.height - margin.top - margin.bottom));
const queueMs = $derived(windowMs / Math.max(1, numXTicks - 1));
const leadingMs = $derived(nowOffsetUnits * queueMs);
const target = $derived(targetRange(data, value, exaggerate));

// svelte-ignore state_referenced_locally
let anim: LiveFrame = {
	now: Date.now(),
	yMin: target.yMin,
	yMax: target.yMax,
	displayValue: value,
};
let frame = $state<LiveFrame>(anim);
let running = $state(true);
// Carries the clock across restarts on new data, so slow frames lose no easing time.
let lastTick: number | null = null;
let intersecting = $state(true);
let tabVisible = $state(
	typeof document === "undefined" || document.visibilityState !== "hidden",
);

$effect(() => {
	const el = box.el;
	if (!el || typeof IntersectionObserver === "undefined") return;
	const observer = new IntersectionObserver(([entry]) => {
		intersecting = entry?.isIntersecting ?? true;
	});
	observer.observe(el);
	return () => observer.disconnect();
});
$effect(() => {
	const onChange = () => {
		tabVisible = document.visibilityState !== "hidden";
	};
	document.addEventListener("visibilitychange", onChange);
	return () => document.removeEventListener("visibilitychange", onChange);
});

$effect(() => {
	const onScreen = intersecting && tabVisible;
	const isPaused = paused;
	const speed = lerpSpeed;
	void target;
	void value;
	if (!onScreen) {
		lastTick = null;
		running = false;
		return;
	}
	const reduced = prefersReducedMotion();
	let raf = 0;
	let lastCommit = 0;
	running = true;
	const tick = (time: number) => {
		const t = untrack(() => target);
		const v = untrack(() => value);
		const factor = reduced ? 1 : smoothingFactor(time - (lastTick ?? time), speed);
		lastTick = time;
		const next = nextFrame(anim, t, v, factor, isPaused ? anim.now : Date.now());
		anim = next;
		const idle = isPaused && settled(next, t, v);
		if (idle || time - lastCommit >= COMMIT_MS) {
			lastCommit = time;
			frame = next;
		}
		if (idle) {
			lastTick = null;
			running = false;
			return;
		}
		raf = requestAnimationFrame(tick);
	};
	raf = requestAnimationFrame(tick);
	return () => cancelAnimationFrame(raf);
});

const end = $derived(frame.now + leadingMs);
const xScale = $derived(
	scaleTime()
		.domain([end - windowMs, end])
		.range([0, innerWidth]),
);
const yScale = $derived(
	scaleLinear().domain([frame.yMin, frame.yMax]).nice().range([innerHeight, 0]),
);
const records = $derived(liveRecords(data, frame, end - windowMs, queueMs, dataKey));
const x = $derived((d: Datum) =>
	xScale(d.date instanceof Date ? d.date : new Date(d.date as number)),
);
const labels = $derived(records.map((d) => formatTime((d.date as Date).getTime())));

let cursorX = $state<number | null>(null);
let pending: { x: number; raf: number } | null = null;
function onpointermove(event: PointerEvent & { currentTarget: SVGSVGElement }) {
	const bounds = event.currentTarget.getBoundingClientRect();
	const px = event.clientX - bounds.left - margin.left;
	const next = px >= 0 && px <= innerWidth ? px : -1;
	if (pending) {
		pending.x = next;
		return;
	}
	const raf = requestAnimationFrame(() => {
		const latest = pending?.x ?? -1;
		pending = null;
		cursorX = latest < 0 ? null : latest;
	});
	pending = { x: next, raf };
}
function onpointerleave() {
	if (pending) cancelAnimationFrame(pending.raf);
	pending = null;
	cursorX = null;
	if (activeIndex !== null) setActive(null, false);
}

const scrubTime = $derived(
	cursorX === null ? null : xScale.invert(cursorX).getTime() / 1000,
);
const scrubIndex = $derived(
	scrubTime === null ? null : nearestPointIndex(data, scrubTime),
);
$effect(() => {
	const index = scrubIndex;
	untrack(() => {
		if (index !== null && index !== activeIndex) setActive(index, false);
	});
});

const active = $derived.by<ActivePoint | null>(() => {
	if (scrubTime !== null && cursorX !== null) {
		const points = [
			...data,
			{ time: frame.now / 1000, value: frame.displayValue },
			{ time: (frame.now + queueMs) / 1000, value: frame.displayValue },
		];
		const v = interpolateAt(points, scrubTime);
		if (v === null) return null;
		return {
			index: scrubIndex ?? 0,
			datum: { date: new Date(scrubTime * 1000), [dataKey]: v },
			x: cursorX,
			y: { [dataKey]: yScale(v) },
		};
	}
	if (activeIndex === null) return null;
	const point = data[activeIndex];
	if (!point) return null;
	const datum = { date: new Date(point.time * 1000), [dataKey]: point.value };
	return {
		index: activeIndex,
		datum,
		x: x(datum),
		y: { [dataKey]: yScale(point.value) },
	};
});

const title = (datum: Datum) => formatTime((datum.date as Date).getTime());
const rows = (datum: Datum): TooltipRow[] =>
	series.map((s) => {
		const v = datum[s.key];
		return {
			key: s.key,
			label: seriesLabel(s.key),
			color: s.color,
			value: typeof v === "number" ? v : null,
		};
	});

setPlot({
	get width() {
		return box.width;
	},
	get height() {
		return box.height;
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
	phase: "ready",
	animate: true,
	clipId,
	get plotEl() {
		return box.el;
	},
	get data() {
		return records;
	},
	xKey: "date",
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
	title,
	rows,
});
setLive({
	get frame() {
		return frame;
	},
	get running() {
		return running;
	},
	get paused() {
		return paused;
	},
	get queueMs() {
		return queueMs;
	},
	get formatTime() {
		return formatTime;
	},
	get scrubbing() {
		return active !== null;
	},
});
</script>

<svg
	aria-hidden="true"
	width={box.width}
	height={box.height}
	data-running={running ? "" : undefined}
	class="absolute inset-0 block overflow-visible"
	style:cursor="crosshair"
	{onpointermove}
	{onpointerleave}
>
	<defs>
		<clipPath id={clipId}>
			<rect x={-8} y={-8} width={innerWidth + 16} height={innerHeight + 16} />
		</clipPath>
	</defs>
	<g transform="translate({margin.left},{margin.top})">
		<rect width={innerWidth} height={innerHeight} fill="transparent" />
		{@render children?.()}
	</g>
</svg>
