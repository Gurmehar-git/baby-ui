<script lang="ts">
import { extent } from "d3-array";
import { scaleLinear, scaleTime } from "d3-scale";
import type { Snippet } from "svelte";
import {
	type ActivePoint,
	type ChartPhase,
	type Datum,
	DEFAULT_MARGIN,
	type Domain,
	hoverThrottle,
	type Margin,
	nearestIndex,
	type TooltipRow,
	toDate,
} from "../../chart/core";
import {
	setActivePoint,
	setPlot,
	type TickScale,
	useChart,
} from "../../chart/svelte/context";
import { readOhlc } from "../geometry";
import { setCandleRoot } from "./context";

let {
	frame,
	data,
	xKey,
	margin: marginProp,
	domain,
	phase,
	animate,
	advance,
	activeIndex,
	instant,
	interactive,
	setActive,
	title,
	rows,
	children,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	data: Datum[];
	xKey: string;
	margin?: Partial<Margin>;
	domain: Domain;
	phase: ChartPhase;
	animate: boolean;
	advance: (event: "done") => void;
	activeIndex: number | null;
	instant: boolean;
	interactive: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
	title: (datum: Datum) => string;
	rows: (datum: Datum) => TooltipRow[];
	children?: Snippet;
} = $props();

const chart = useChart();
const uid = $props.id();
const clipId = `${uid}-candles`;
const margin = $derived<Margin>({ ...DEFAULT_MARGIN, ...marginProp });
const innerWidth = $derived(Math.max(0, frame.width - margin.left - margin.right));
const innerHeight = $derived(Math.max(0, frame.height - margin.top - margin.bottom));
const slot = $derived(innerWidth / Math.max(1, data.length));

const xScale = $derived.by(() => {
	const [min = 0, max = min] = extent(data, (d) => toDate(d[xKey]).getTime());
	return scaleTime()
		.domain([min, max])
		.range([slot / 2, innerWidth - slot / 2]);
});
const yScale = $derived(scaleLinear().domain(domain).range([innerHeight, 0]));
const x = $derived((d: Datum) => xScale(toDate(d[xKey])));
const labels = $derived(data.map((d) => chart.format.tick(toDate(d[xKey]))));

const hover = hoverThrottle();
function onpointermove(event: PointerEvent & { currentTarget: SVGSVGElement }) {
	if (!interactive) return;
	const bounds = event.currentTarget.getBoundingClientRect();
	const time = xScale.invert(event.clientX - bounds.left - margin.left).getTime();
	const index = nearestIndex(data, xKey, time);
	hover.move(index, (next) => {
		if (next !== activeIndex) setActive(next, false);
	});
}
function onpointerleave() {
	hover.cancel();
	if (activeIndex !== null) setActive(null, false);
}

const active = $derived.by<ActivePoint | null>(() => {
	if (activeIndex === null || !interactive) return null;
	const datum = data[activeIndex];
	const ohlc = datum ? readOhlc(datum) : null;
	if (!datum || !ohlc) return null;
	return { index: activeIndex, datum, x: x(datum), y: { close: yScale(ohlc.close) } };
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
	series: [],
	register: () => () => {},
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
setCandleRoot({ advance: (event) => advance(event) });
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
			<rect x={-8} y={-8} width={innerWidth + 16} height={innerHeight + 16} />
		</clipPath>
	</defs>
	<g transform="translate({margin.left},{margin.top})">
		<rect width={innerWidth} height={innerHeight} fill="transparent" />
		{@render children?.()}
	</g>
</svg>
