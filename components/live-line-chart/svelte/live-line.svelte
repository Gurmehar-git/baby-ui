<svelte:options namespace="svg" />

<script lang="ts">
import { curveLinear, curveMonotoneX, curveStepAfter, area as d3Area } from "d3-shape";
import { untrack } from "svelte";
import { useChart, usePlot } from "../../chart/svelte/context";
import { type Datum, linePath, seriesColor, seriesPoints } from "../../chart/svelte/core";
import { type Playback, prefersReducedMotion, tween } from "../../chart/svelte/motion";
import { cn } from "../../lib/svelte/cn";
import { useLive } from "./context";
import { detectMomentum } from "./live";
import { type LiveLineCurve, type LiveLineTint, liveLine } from "./variants";

let {
	dataKey,
	stroke,
	strokeWidth = 2,
	curve = "monotone",
	tint = "dot",
	fill = true,
	pulse = true,
	dotSize = 4,
	badge = true,
	guide = true,
	formatValue,
	class: className,
}: {
	dataKey: string;
	/** Defaults to the series colour from the chart config, `var(--color-<dataKey>)`. */
	stroke?: string;
	strokeWidth?: number;
	curve?: LiveLineCurve;
	/** Momentum colours the tip only (`dot`) or the whole line (`line`). */
	tint?: LiveLineTint;
	/** Gradient fill under the line. */
	fill?: boolean;
	/** Expanding ring on the live tip while the chart scrolls. */
	pulse?: boolean;
	dotSize?: number;
	/** Value pill beside the tip, with a momentum arrow. */
	badge?: boolean;
	/** Dashed rule across the plot at the live value. */
	guide?: boolean;
	formatValue?: (value: number) => string;
	class?: string;
} = $props();

const CURVES = { monotone: curveMonotoneX, linear: curveLinear, step: curveStepAfter };
const PULSE_MS = 1500;
const ARROWS = { up: "M0 5 4 0 8 5Z", down: "M0 0 4 5 8 0Z", flat: "M0 2h8v1.5H0Z" };

const plot = usePlot();
const live = useLive();
const chart = useChart();
const uid = $props.id();
const color = $derived(stroke ?? seriesColor(dataKey));

$effect(() => {
	const next = { key: dataKey, color };
	return untrack(() => plot.register(next));
});

const points = $derived(
	seriesPoints(plot.data, dataKey, plot.x, (v) => plot.yScale(v), plot.xKey),
);
const values = $derived(
	plot.data.map((d) => d[dataKey]).filter((v): v is number => typeof v === "number"),
);
const momentum = $derived(detectMomentum(values));
const tip = $derived(
	plot.data.length >= 2 ? (plot.data.at(-2) as Datum) : plot.data.at(-1),
);
const tipValue = $derived(live.frame.displayValue);
const tipX = $derived(tip ? plot.x(tip) : plot.innerWidth);
const tipY = $derived(plot.yScale(tipValue));
const styles = $derived(liveLine({ curve, momentum, tint }));
const factory = $derived(CURVES[curve]);
const areaPath = $derived(
	fill && points.length > 1
		? (d3Area<{ x: number; y: number }>()
				.x((p) => p.x)
				.y0(plot.innerHeight)
				.y1((p) => p.y)
				.curve(factory)(points) ?? "")
		: "",
);

let ring = $state<SVGCircleElement | null>(null);
const pulsing = $derived(pulse && live.running && !live.paused);
$effect(() => {
	const size = dotSize;
	const node = ring;
	if (!pulsing || !node || prefersReducedMotion()) return;
	let playback: Playback | null = null;
	const cycle = () => {
		playback = tween({
			duration: PULSE_MS,
			ease: (t) => t,
			onUpdate: (p) => {
				node.setAttribute("r", String(size + size * 2.5 * p));
				node.setAttribute("opacity", String(0.5 * (1 - p)));
			},
			onComplete: cycle,
		});
	};
	cycle();
	return () => {
		playback?.stop();
		node.setAttribute("opacity", "0");
	};
});

const label = $derived(
	formatValue
		? formatValue(tipValue)
		: chart.format.number(Math.round(tipValue * 100) / 100),
);
const badgeWidth = $derived(label.length * 6.6 + 30);
const fadeEnd = $derived(
	plot.innerWidth > 0 ? Math.min(100, (tipX / plot.innerWidth) * 100) : 100,
);
const isHidden = $derived(chart.hidden.has(dataKey));
const dimmed = $derived(chart.highlighted !== null && chart.highlighted !== dataKey);
</script>

<g
	data-slot="chart-live-line"
	data-series={dataKey}
	data-momentum={momentum}
	class={cn(styles.series(), className)}
	style:--series={color}
	style:opacity={isHidden ? 0 : dimmed ? 0.3 : 1}
>
	<defs>
		<linearGradient id="{uid}-stroke" x1="0" x2="0" y1="0" y2="1">
			<stop offset="0%" stop-color="currentColor" stop-opacity={1} />
			<stop offset="100%" stop-color="currentColor" stop-opacity={0.6} />
		</linearGradient>
		<linearGradient id="{uid}-area" x1="0" x2="0" y1="0" y2="1">
			<stop offset="0%" stop-color="currentColor" stop-opacity={0.1} />
			<stop offset="100%" stop-color="currentColor" stop-opacity={0} />
		</linearGradient>
		<linearGradient id="{uid}-fade" x1="0" x2="1" y1="0" y2="0">
			<stop offset="0%" stop-color="white" stop-opacity={0} />
			<stop offset="4%" stop-color="white" stop-opacity={1} />
			<stop offset="{fadeEnd}%" stop-color="white" stop-opacity={1} />
			<stop offset="100%" stop-color="white" stop-opacity={fadeEnd >= 99.9 ? 1 : 0} />
		</linearGradient>
		<mask id="{uid}-mask">
			<rect
				x={0}
				y={-20}
				width={plot.innerWidth}
				height={plot.innerHeight + 40}
				fill="url(#{uid}-fade)"
			/>
		</mask>
	</defs>
	<g mask="url(#{uid}-mask)">
		{#if areaPath}
			<path d={areaPath} fill="url(#{uid}-area)" />
		{/if}
		<path
			d={linePath(points, factory)}
			class={styles.line()}
			stroke="url(#{uid}-stroke)"
			stroke-width={strokeWidth}
		/>
	</g>
	{#if guide}
		<line
			class={styles.guide()}
			stroke="currentColor"
			stroke-opacity={0.25}
			x1={0}
			x2={plot.innerWidth}
			y1={tipY}
			y2={tipY}
		/>
	{/if}
	<g data-slot="chart-live-tip" class={styles.tip()} style:opacity={live.scrubbing ? 0.25 : 1}>
		<circle bind:this={ring} class={styles.ring()} cx={tipX} cy={tipY} r={dotSize} opacity={0} />
		<circle cx={tipX} cy={tipY} r={dotSize + 2} fill="currentColor" opacity={0.1} />
		<circle class={styles.dot()} cx={tipX} cy={tipY} r={dotSize} />
		{#if badge}
			<g data-slot="chart-live-badge" transform="translate({tipX + 12},{tipY})">
				<rect class={styles.badge()} x={0} y={-12} width={badgeWidth} height={24} rx={6} />
				<path class={styles.arrow()} d={ARROWS[momentum]} transform="translate(8,-3)" />
				<text class={styles.badgeText()} x={22} y={4}>{label}</text>
			</g>
		{/if}
	</g>
</g>
