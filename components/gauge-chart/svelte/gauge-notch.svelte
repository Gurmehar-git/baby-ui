<svelte:options namespace="svg" />

<script lang="ts">
import { prefersReducedMotion, Spring } from "../../chart/svelte/motion";
import { NOTCH_SPRING, type Notch } from "./geometry";

let {
	notch,
	on,
	delay,
	animate,
	class: className,
	fill,
}: {
	notch: Notch;
	on: boolean;
	delay: number;
	animate: boolean;
	class?: string;
	fill?: string;
} = $props();

let node = $state<SVGPathElement | null>(null);
const spring = new Spring(0, NOTCH_SPRING, (p) => {
	if (!node) return;
	node.style.transform = `scale(${0.9 + 0.1 * p})`;
	node.style.opacity = String(Math.min(1, Math.max(0, p)));
});

$effect(() => {
	const target = on ? 1 : 0;
	if (!node) return;
	if (!animate || prefersReducedMotion()) {
		spring.jump(target);
		return;
	}
	const timer = setTimeout(() => spring.set(target), delay * 1000);
	return () => clearTimeout(timer);
});
$effect(() => () => spring.stop());
</script>

<path
	bind:this={node}
	d={notch.path}
	class={className}
	{fill}
	style:transform-origin="{notch.origin.x}px {notch.origin.y}px"
	style:opacity="0"
/>
