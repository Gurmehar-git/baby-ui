<script lang="ts">
import type { ComponentProps } from "svelte";
import TimeSeriesChart from "../../chart/svelte/time-series-chart.svelte";
import { setBarLayout } from "./context";

let {
	activeIndex = $bindable(null),
	barSize,
	maxBarSize,
	barGap = 4,
	stacked = false,
	roleDescription = "composed chart",
	...rest
}: Omit<ComponentProps<typeof TimeSeriesChart>, "roleDescription"> & {
	/** Fixed bar width in px. */
	barSize?: number;
	maxBarSize?: number;
	/** Gap between grouped bars in px. */
	barGap?: number;
	/** Stack SeriesBar segments in render order; lines and areas stay unstacked. */
	stacked?: boolean;
	/** Announced after the chart's name, e.g. "composed chart". */
	roleDescription?: string;
} = $props();

let keys = $state<string[]>([]);
setBarLayout({
	get keys() {
		return keys;
	},
	register(key: string) {
		if (!keys.includes(key)) keys = [...keys, key];
		return () => {
			keys = keys.filter((k) => k !== key);
		};
	},
	get size() {
		return barSize;
	},
	get maxSize() {
		return maxBarSize;
	},
	get gap() {
		return barGap;
	},
	get stacked() {
		return stacked;
	},
});
</script>

<TimeSeriesChart bind:activeIndex {roleDescription} {...rest} />
