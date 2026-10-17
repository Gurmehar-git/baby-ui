<svelte:options namespace="svg" />

<script lang="ts">
import { Spring, type SpringConfig } from "../../chart/motion";

let {
	y,
	alpha,
	present,
	x,
	label,
	class: className,
}: {
	y: number;
	alpha: number;
	present: boolean;
	x: number;
	label: string;
	class: string;
} = $props();

/** The y-tick spring, for both position and the enter/exit fade. */
const TICK_SPRING: SpringConfig = { stiffness: 180, damping: 24 };

let node = $state<SVGGElement | null>(null);
let py = 0;
const write = () => node?.setAttribute("transform", `translate(${x},${py})`);
const ys = new Spring(0, TICK_SPRING, (v) => {
	py = v;
	write();
});
const os = new Spring(0, TICK_SPRING, (v) => {
	node?.setAttribute("opacity", String(Math.max(0, Math.min(1, v))));
});
let mounted = false;
$effect(() => {
	const target = y;
	const opacity = present ? alpha : 0;
	void x;
	if (!node) return;
	if (!mounted) {
		ys.jump(target);
		os.jump(0);
		mounted = true;
	} else ys.set(target);
	os.set(opacity);
	write();
});
$effect(() => () => {
	ys.stop();
	os.stop();
});
</script>

<g bind:this={node} opacity={0}>
	<text class={className} dominant-baseline="middle">{label}</text>
</g>
