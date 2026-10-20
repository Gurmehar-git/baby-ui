<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { mountShader } from "../../lib/shader";
import { canvasEngine } from "../../lib/svelte/canvas-engine.svelte";
import { createInkBloom, type InkBloomOptions } from "../ink";
import {
	INK_BLOOM_COLORS,
	INK_BLOOM_SPEED,
	type InkBloomPosition,
	type InkBloomSpeed,
	type InkBloomTone,
	inkBloom,
} from "../variants";

let {
	tone = "chart",
	speed = "normal",
	position = "absolute",
	intensity = 1,
	grain = 0,
	class: classProp,
	children,
}: {
	tone?: InkBloomTone;
	speed?: InkBloomSpeed;
	position?: InkBloomPosition;
	/** Colour strength, 0 (flat base) to 1. */
	intensity?: number;
	/** Film grain, 0 to 1. */
	grain?: number;
	class?: string;
	children?: Snippet;
} = $props();

function mountInkBloom(
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: InkBloomOptions,
	onReady: (webgl: boolean) => void,
) {
	const engine = createInkBloom(initial);
	const shader = mountShader(root, canvas, engine.scene, onReady);
	return {
		update: (next: InkBloomOptions) => shader.refresh(engine.set(next)),
		destroy: shader.destroy,
	};
}

let root: HTMLDivElement | undefined = $state();
let canvas: HTMLCanvasElement | undefined = $state();
const gl = canvasEngine(
	mountInkBloom,
	() => ({ root, canvas }),
	() => options,
);
const s = $derived(inkBloom({ tone, speed, position, webgl: gl.webgl }));
const options: InkBloomOptions = $derived({
	colors: INK_BLOOM_COLORS[tone],
	speed: INK_BLOOM_SPEED[speed],
	intensity,
	grain,
});
</script>

<div bind:this={root} data-slot="ink-bloom" class={cn(s.root(), classProp)}>
	<div aria-hidden="true" class={s.fallback()}></div>
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
