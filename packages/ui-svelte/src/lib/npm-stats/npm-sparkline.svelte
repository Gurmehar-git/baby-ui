<script lang="ts">
import { cn } from "../lib/cn";

let { values, class: classProp }: { values: number[]; class?: string } = $props();

const W = 100;
const H = 24;
const PAD = 2;

const points = $derived.by(() => {
	const max = Math.max(...values);
	const min = Math.min(...values);
	const span = max - min || 1;
	const step = values.length > 1 ? W / (values.length - 1) : 0;
	return values
		.map(
			(v, i) =>
				`${(i * step).toFixed(2)},${(PAD + (1 - (v - min) / span) * (H - PAD * 2)).toFixed(2)}`,
		)
		.join(" ");
});
</script>

<!-- Shape only, scaled min to max: the number it summarises sits beside it. -->
<svg
	data-slot="npm-sparkline"
	viewBox="0 0 {W} {H}"
	preserveAspectRatio="none"
	aria-hidden="true"
	focusable="false"
	class={cn("spark-reveal overflow-visible", classProp)}
>
	<polyline
		{points}
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		vector-effect="non-scaling-stroke"
	/>
</svg>
