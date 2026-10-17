<svelte:options namespace="svg" />

<script lang="ts">
import { untrack } from "svelte";
import { EASE_OUT, prefersReducedMotion, Spring, tween } from "../../chart/motion";
import { useActivePoint, useChart, usePlot } from "../../chart/svelte/context";
import {
	CANDLE_CONCEAL,
	CANDLE_FADE,
	CANDLE_SPRING,
	candleColor,
	candleGeometry,
	candleStagger,
} from "../geometry";
import { CANDLE_BODY, type CandlestickSize, candlestick } from "../variants";
import { useCandleRoot } from "./context";

let {
	size = "regular",
	upKey = "up",
	downKey = "down",
	dimOpacity = 0.4,
	class: className,
}: {
	size?: CandlestickSize;
	/** Config keys for rising and falling candles; match the chart's `upKey` and `downKey`. */
	upKey?: string;
	downKey?: string;
	/** Opacity of candles other than the active one. */
	dimOpacity?: number;
	class?: string;
} = $props();

const plot = usePlot();
const root = useCandleRoot();
const chart = useChart();
const pointer = useActivePoint();
const slot = $derived(plot.innerWidth / Math.max(1, plot.data.length));
const bodyWidth = $derived(Math.max(1, slot * CANDLE_BODY[size]));
const geometry = $derived(candleGeometry(plot.data, plot.x, (v) => plot.yScale(v)));
const visible = $derived(
	plot.phase === "ready" || plot.phase === "revealing" || plot.phase === "concealing",
);

let enterEls: (SVGGElement | null)[] = $state([]);
let wickEls: (SVGPathElement | null)[] = $state([]);
let bodyEls: (SVGRectElement | null)[] = $state([]);

const scaleAbout = (cy: number, s: number) =>
	`translate(0 ${cy}) scale(1 ${s}) translate(0 ${-cy})`;

$effect(() => {
	const phase = plot.phase;
	const hasSize = plot.innerWidth > 0;
	if ((phase !== "revealing" && phase !== "concealing") || !hasSize) return;
	return untrack(() => {
		const candles = geometry;
		const reduced = !plot.animate || prefersReducedMotion();
		if (phase === "concealing") {
			const playback = tween({
				duration: reduced ? 0 : CANDLE_CONCEAL,
				onUpdate: (p) => {
					for (const g of enterEls) if (g) g.style.opacity = String(1 - p);
				},
				onComplete: () => root.advance("done"),
			});
			return () => playback.stop();
		}
		const count = candles.length;
		if (count === 0 || reduced) {
			root.advance("done");
			return;
		}
		const stagger = candleStagger(count);
		const total = (count - 1) * stagger + CANDLE_FADE;
		const started: boolean[] = [];
		let settled = 0;
		let clockDone = false;
		const finish = () => {
			if (!clockDone || settled < count) return;
			candles.forEach((_, i) => {
				wickEls[i]?.removeAttribute("transform");
				bodyEls[i]?.removeAttribute("transform");
				const g = enterEls[i];
				if (g) g.style.opacity = "";
			});
			root.advance("done");
		};
		const springs = candles.map((candle, i) => {
			const wickMid = (candle.wickTop + candle.wickBottom) / 2;
			const bodyMid = candle.bodyTop + candle.bodyHeight / 2;
			let done = false;
			return new Spring(0, CANDLE_SPRING, (s) => {
				wickEls[i]?.setAttribute("transform", scaleAbout(wickMid, s));
				bodyEls[i]?.setAttribute("transform", scaleAbout(bodyMid, s));
				if (s === 1 && !done) {
					done = true;
					settled++;
					finish();
				}
			});
		});
		candles.forEach((candle, i) => {
			const g = enterEls[i];
			if (g) g.style.opacity = "0";
			const wickMid = (candle.wickTop + candle.wickBottom) / 2;
			const bodyMid = candle.bodyTop + candle.bodyHeight / 2;
			wickEls[i]?.setAttribute("transform", scaleAbout(wickMid, 0));
			bodyEls[i]?.setAttribute("transform", scaleAbout(bodyMid, 0));
		});
		const clock = tween({
			duration: total,
			ease: (t) => t,
			onUpdate: (p) => {
				const elapsed = p * total;
				for (let i = 0; i < count; i++) {
					const local = elapsed - i * stagger;
					if (local < 0) continue;
					if (!started[i]) {
						started[i] = true;
						springs[i]?.set(1);
					}
					const g = enterEls[i];
					if (g) g.style.opacity = String(EASE_OUT(Math.min(1, local / CANDLE_FADE)));
				}
			},
			onComplete: () => {
				clockDone = true;
				finish();
			},
		});
		return () => {
			clock.stop();
			for (const spring of springs) spring.stop();
		};
	});
});
</script>

<g data-slot="chart-candlestick" clip-path="url(#{plot.clipId})" class={className}>
	{#each geometry as candle, i (candle.index)}
		{@const key = candle.up ? upKey : downKey}
		{@const styles = candlestick({ size, direction: candle.up ? "up" : "down" })}
		{@const dimmed =
			chart.hidden.has(key) ||
			(pointer.active !== null && pointer.active.index !== candle.index) ||
			(chart.highlighted !== null && chart.highlighted !== key)}
		<g
			data-direction={candle.up ? "up" : "down"}
			data-active={pointer.active?.index === candle.index ? "" : undefined}
			class={styles.candle()}
			style:--candle={candleColor(key, candle.up)}
			style:opacity={chart.hidden.has(key) ? 0 : dimmed ? dimOpacity : 1}
		>
			<g bind:this={enterEls[i]} style:opacity={visible ? 1 : 0}>
				<path
					bind:this={wickEls[i]}
					class={styles.wick()}
					d="M{candle.x},{candle.wickTop}V{candle.bodyTop}M{candle.x},{candle.bodyTop +
						candle.bodyHeight}V{candle.wickBottom}"
				/>
				<rect
					bind:this={bodyEls[i]}
					class={styles.body()}
					x={candle.x - bodyWidth / 2}
					y={candle.bodyTop}
					width={bodyWidth}
					height={candle.bodyHeight}
					rx={1}
				/>
			</g>
		</g>
	{/each}
</g>
