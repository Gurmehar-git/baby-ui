<svelte:options namespace="svg" />

<script lang="ts">
import { untrack } from "svelte";
import { useChart, usePlot } from "../../chart/svelte/context";
import { edgeOpacity, niceInterval, tickValues } from "../live";
import { type LiveAxisPosition, liveAxis } from "../variants";
import LiveYTick from "./live-y-tick.svelte";

let {
	minGap = 36,
	position = "left",
	formatValue,
	allowDecimals = true,
	class: className,
}: {
	/** Minimum pixel gap between labels. */
	minGap?: number;
	position?: LiveAxisPosition;
	formatValue?: (value: number) => string;
	allowDecimals?: boolean;
	class?: string;
} = $props();

const TICK_EXIT_MS = 450;
const plot = usePlot();
const chart = useChart();
const styles = $derived(liveAxis({ position }));
const fmt = $derived(formatValue ?? ((v: number) => chart.format.number(v)));
let previousInterval = 0;
const ticks = $derived.by(() => {
	const [min = 0, max = 0] = plot.yScale.domain();
	const interval = niceInterval(max - min, plot.innerHeight, minGap, previousInterval);
	previousInterval = interval;
	return tickValues(min, max, interval)
		.filter((v) => allowDecimals || Number.isInteger(v))
		.map((value) => ({ key: value.toPrecision(10), value, y: plot.yScale(value) }))
		.filter((t) => t.y >= -10 && t.y <= plot.innerHeight + 10);
});
const signature = $derived(ticks.map((t) => t.key).join("|"));
const presentKeys = $derived(new Set(signature ? signature.split("|") : []));

let known = new Map<string, number>();
let leaving = $state<{ key: string; value: number }[]>([]);
const timers: number[] = [];
$effect(() => {
	void signature;
	untrack(() => {
		const current = new Set(ticks.map((t) => t.key));
		const gone = [...known]
			.filter(([key]) => !current.has(key))
			.map(([key, value]) => ({ key, value }));
		known = new Map(ticks.map((t) => [t.key, t.value]));
		leaving = [...leaving.filter((t) => !current.has(t.key)), ...gone];
		if (gone.length) {
			const keys = new Set(gone.map((t) => t.key));
			timers.push(
				window.setTimeout(() => {
					leaving = leaving.filter((t) => !keys.has(t.key));
				}, TICK_EXIT_MS),
			);
		}
	});
});
$effect(() => () => {
	for (const id of timers) clearTimeout(id);
});
const tx = $derived(position === "left" ? -8 : plot.innerWidth + 8);
</script>

<g data-slot="chart-live-y-axis" class={className}>
	{#each ticks as t (t.key)}
		<LiveYTick
			y={t.y}
			alpha={edgeOpacity(t.y, plot.innerHeight)}
			present
			x={tx}
			label={fmt(t.value)}
			class={styles.tick()}
		/>
	{/each}
	{#each leaving.filter((t) => !presentKeys.has(t.key)) as t (t.key)}
		<LiveYTick
			y={plot.yScale(t.value)}
			alpha={0}
			present={false}
			x={tx}
			label={fmt(t.value)}
			class={styles.tick()}
		/>
	{/each}
</g>
