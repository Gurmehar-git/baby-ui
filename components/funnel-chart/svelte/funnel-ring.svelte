<svelte:options namespace="svg" />

<script lang="ts">
import { Spring } from "../../chart/svelte/motion";
import type { FunnelRing } from "./geometry";

let {
	ring,
	color,
	active,
	instant,
	vertical,
	class: className,
}: {
	ring: FunnelRing;
	color: string;
	active: boolean;
	instant: boolean;
	vertical: boolean;
	class: string;
} = $props();

let path = $state<SVGPathElement | null>(null);
// svelte-ignore state_referenced_locally
const spring = new Spring(1, ring.spring, (v) => {
	if (path) path.style.transform = vertical ? `scaleX(${v})` : `scaleY(${v})`;
});

$effect(() => {
	spring.configure(ring.spring);
	const to = active ? ring.hoverScale : 1;
	if (instant) spring.jump(to);
	else spring.set(to);
});
$effect(() => () => spring.stop());
</script>

<path bind:this={path} d={ring.d} fill={color} opacity={ring.opacity} class={className} />
